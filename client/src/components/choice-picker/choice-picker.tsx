import { useEffect, useRef, useState, type Ref } from "react";
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Check } from "lucide-react-native";
import { useFocusScale } from "../../hooks/use-focus-scale";
import { KeyAction, useTVRemote } from "../../hooks/use-tv-remote";
import { colors, fonts, radius, shadows, space, typography } from "../../theme";

export type ChoiceItem = {
  value: string;
  label: string;
  detail?: string;
  flag?: string;
};

export type ChoicePickerProps = {
  items: ChoiceItem[];
  selected: string[];
  onSelect: (value: string) => void;
};

export type ChoicePickerSelectionProps = Omit<ChoicePickerProps, "items">;

const ROW_HEIGHT = 88;
const ROW_GAP = space[2];
const FAST_SCROLL_STEP = 3;
const FAST_SCROLL_INTERVAL_MS = 100;

function indexSections(items: ChoiceItem[]) {
  return items.reduce<{ initial: string; start: number }[]>((sections, item, index) => {
    const initial = item.label.charAt(0).toUpperCase();
    if (sections.at(-1)?.initial !== initial) sections.push({ initial, start: index });
    return sections;
  }, []);
}

export function ChoicePicker({ items, selected, onSelect }: ChoicePickerProps) {
  const scrollRef = useRef<ScrollView>(null);
  const rowRefs = useRef<(View | null)[]>([]);
  const focusedIndexRef = useRef<number | null>(null);
  const fastScrollRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const selectedIndex = Math.max(0, items.findIndex((item) => selected.includes(item.value)));

  const focusRow = (index: number) => rowRefs.current[index]?.requestTVFocus();
  const stopFastScroll = () => clearInterval(fastScrollRef.current);

  useEffect(() => stopFastScroll, []);

  useTVRemote((eventType, keyAction) => {
    if (eventType !== "longUp" && eventType !== "longDown") return;
    stopFastScroll();
    if (keyAction !== KeyAction.down || focusedIndexRef.current === null) return;
    const step = eventType === "longDown" ? FAST_SCROLL_STEP : -FAST_SCROLL_STEP;
    fastScrollRef.current = setInterval(() => {
      const current = focusedIndexRef.current;
      if (current === null) return stopFastScroll();
      focusRow(Math.min(Math.max(current + step, 0), items.length - 1));
    }, FAST_SCROLL_INTERVAL_MS);
  });

  return (
    <View style={styles.container}>
      <ScrollView ref={scrollRef} style={styles.list} contentContainerStyle={styles.listContent}>
        {items.map((item, index) => (
          <ChoicePickerRow
            key={item.value}
            ref={(row) => {
              rowRefs.current[index] = row;
            }}
            item={item}
            selected={selected.includes(item.value)}
            hasTVPreferredFocus={index === selectedIndex}
            onFocus={() => {
              focusedIndexRef.current = index;
            }}
            onBlur={() => {
              focusedIndexRef.current = null;
            }}
            onPress={() => onSelect(item.value)}
          />
        ))}
      </ScrollView>
      <View style={styles.index}>
        {indexSections(items).map(({ initial, start }) => (
          <IndexLetter
            key={initial}
            initial={initial}
            onFocus={() => scrollRef.current?.scrollTo({ y: start * (ROW_HEIGHT + ROW_GAP) })}
            onPress={() => focusRow(start)}
          />
        ))}
      </View>
    </View>
  );
}

type ChoicePickerRowProps = {
  ref: Ref<View>;
  item: ChoiceItem;
  selected: boolean;
  hasTVPreferredFocus: boolean;
  onFocus: () => void;
  onBlur: () => void;
  onPress: () => void;
};

function ChoicePickerRow({ ref, item, selected, hasTVPreferredFocus, onFocus, onBlur, onPress }: ChoicePickerRowProps) {
  const { focused, scaleStyle, focusHandlers } = useFocusScale(1.02);

  return (
    <Pressable
      ref={ref}
      onPress={onPress}
      hasTVPreferredFocus={hasTVPreferredFocus}
      accessibilityState={{ selected }}
      {...focusHandlers}
      onFocus={() => {
        focusHandlers.onFocus();
        onFocus();
      }}
      onBlur={() => {
        focusHandlers.onBlur();
        onBlur();
      }}
    >
      <Animated.View style={[styles.row, selected && styles.selectedRow, focused && styles.focusedRow, scaleStyle]}>
        {item.flag && <Text style={styles.flag}>{item.flag}</Text>}
        <View style={styles.rowText}>
          <Text style={typography.headline} numberOfLines={1}>
            {item.label}
          </Text>
          {item.detail && <Text style={typography.caption}>{item.detail}</Text>}
        </View>
        {selected && <Check size={32} color={colors.duck} strokeWidth={3} />}
      </Animated.View>
    </Pressable>
  );
}

type IndexLetterProps = {
  initial: string;
  onFocus: () => void;
  onPress: () => void;
};

function IndexLetter({ initial, onFocus, onPress }: IndexLetterProps) {
  const [focused, setFocused] = useState(false);

  return (
    <Pressable
      onPress={onPress}
      onFocus={() => {
        setFocused(true);
        onFocus();
      }}
      onBlur={() => setFocused(false)}
      accessibilityLabel={`Jump to ${initial}`}
      style={[styles.letter, focused && styles.focusedLetter]}
    >
      <Text style={[styles.letterText, focused && styles.focusedLetterText]}>{initial}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    gap: space[4],
  },
  list: {
    flex: 1,
    margin: -space[4],
  },
  listContent: {
    gap: ROW_GAP,
    padding: space[4],
  },
  row: {
    height: ROW_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    gap: space[4],
    paddingHorizontal: space[5],
    borderRadius: radius.md,
  },
  selectedRow: {
    backgroundColor: colors.duckSoft,
  },
  focusedRow: {
    backgroundColor: colors.surfaceRaised,
    boxShadow: `${shadows.lift}, ${shadows.focusRing}`,
  },
  flag: {
    fontSize: 44,
  },
  rowText: {
    flex: 1,
  },
  index: {
    width: 56,
    justifyContent: "center",
  },
  letter: {
    flex: 1,
    maxHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.pill,
  },
  focusedLetter: {
    backgroundColor: colors.duck,
  },
  letterText: {
    fontFamily: fonts.textBold,
    fontSize: 23,
    color: colors.inkSubtle,
  },
  focusedLetterText: {
    color: colors.onDuck,
  },
});
