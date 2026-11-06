import type { Ref } from "react";
import { Animated, Pressable, StyleSheet, Text, View, type PressableProps } from "react-native";
import type { LucideIcon } from "lucide-react-native";
import { useFocusScale } from "../../hooks/use-focus-scale";
import { colors, radius, shadows, space, typography } from "../../theme";

type ChipProps = Pick<
  PressableProps,
  "nextFocusUp" | "nextFocusDown" | "nextFocusLeft" | "nextFocusRight" | "onLayout"
> & {
  ref?: Ref<View>;
  label: string;
  icon?: LucideIcon;
  selected?: boolean;
  hasTVPreferredFocus?: boolean;
  onPress?: () => void;
};

export function Chip({ ref, label, icon: Icon, selected, onPress, hasTVPreferredFocus, ...pressableProps }: ChipProps) {
  const { focused, scaleStyle, focusHandlers } = useFocusScale();
  const labelColor = focused ? colors.onDuck : selected ? colors.duck : colors.inkMuted;

  return (
    <Pressable
      ref={ref}
      onPress={onPress}
      hasTVPreferredFocus={hasTVPreferredFocus}
      accessibilityState={selected === undefined ? undefined : { selected }}
      {...pressableProps}
      {...focusHandlers}
    >
      <Animated.View
        style={[styles.chip, selected && styles.selected, focused && styles.focused, scaleStyle]}
      >
        {Icon && <Icon size={28} color={labelColor} strokeWidth={2.5} />}
        <Text style={[typography.label, { color: labelColor }]}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    gap: space[3],
    paddingHorizontal: space[5],
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
  },
  selected: {
    backgroundColor: colors.duckSoft,
  },
  focused: {
    backgroundColor: colors.duck,
    boxShadow: `${shadows.lift}, ${shadows.focusRing}`,
  },
});
