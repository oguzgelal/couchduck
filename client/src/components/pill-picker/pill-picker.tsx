import { useRef, useState, type ComponentProps } from "react";
import { findNodeHandle, ScrollView, StyleSheet, TextInput, View, type LayoutChangeEvent } from "react-native";
import { Check, Plus } from "lucide-react-native";
import { space } from "../../theme";
import { Chip } from "../ui/chip";
import { KeyboardInput } from "../ui/keyboard-input";
import { pillNeighbors, type PillLayout } from "./pill-grid";

const ADD_KEY = "\0add";

type PillPickerProps = {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  addLabel?: string;
  nextFocusDown?: number;
};

export function PillPicker({ options, selected, onChange, addLabel, nextFocusDown }: PillPickerProps) {
  const inputRef = useRef<TextInput>(null);
  const [layouts, setLayouts] = useState<Record<string, PillLayout>>({});
  const [draft, setDraft] = useState("");
  const pills = [...options, ...selected.filter((choice) => !options.includes(choice))];
  const keys = addLabel ? [...pills, ADD_KEY] : pills;
  const neighbors = pillNeighbors(keys.flatMap((key) => layouts[key] ?? []), nextFocusDown);

  const toggle = (option: string) =>
    onChange(selected.includes(option) ? selected.filter((choice) => choice !== option) : [...selected, option]);

  const addTyped = () => {
    const typed = draft.trim();
    setDraft("");
    if (!typed) return;
    const option = pills.find((pill) => pill.toLowerCase() === typed.toLowerCase()) ?? typed;
    if (!selected.includes(option)) onChange([...selected, option]);
  };

  const gridProps = (key: string) => {
    const tag = layouts[key]?.tag;
    return {
      onMeasure: (layout: PillLayout) => setLayouts((current) => ({ ...current, [key]: layout })),
      ...(tag === undefined ? undefined : neighbors.get(tag)),
    };
  };

  return (
    <>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.pills}>
        {pills.map((option) => {
          const isSelected = selected.includes(option);
          return (
            <GridChip
              key={option}
              label={option}
              icon={isSelected ? Check : undefined}
              selected={isSelected}
              hasTVPreferredFocus={option === (selected[0] ?? pills[0])}
              onPress={() => toggle(option)}
              {...gridProps(option)}
            />
          );
        })}
        {addLabel && (
          <GridChip label={addLabel} icon={Plus} onPress={() => inputRef.current?.focus()} {...gridProps(ADD_KEY)} />
        )}
      </ScrollView>
      {addLabel && (
        <KeyboardInput
          ref={inputRef}
          value={draft}
          onChangeText={setDraft}
          onEndEditing={addTyped}
          placeholder={addLabel}
        />
      )}
    </>
  );
}

type GridChipProps = Omit<ComponentProps<typeof Chip>, "ref" | "onLayout"> & {
  onMeasure: (layout: PillLayout) => void;
};

function GridChip({ onMeasure, ...chipProps }: GridChipProps) {
  const chipRef = useRef<View>(null);

  const handleLayout = ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
    const tag = findNodeHandle(chipRef.current);
    if (tag !== null) onMeasure({ x: layout.x, y: layout.y, width: layout.width, tag });
  };

  return <Chip ref={chipRef} onLayout={handleLayout} {...chipProps} />;
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 0,
    margin: -space[4],
  },
  pills: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: space[4],
    padding: space[4],
  },
});
