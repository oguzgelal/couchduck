import { Animated, Pressable, StyleSheet, Text, type PressableProps } from "react-native";
import type { LucideIcon } from "lucide-react-native";
import { useFocusScale } from "../../hooks/use-focus-scale";
import { colors, radius, shadows, space, typography } from "../../theme";

type ChipProps = Pick<PressableProps, "nextFocusDown" | "nextFocusLeft" | "nextFocusRight"> & {
  label: string;
  icon?: LucideIcon;
  selected?: boolean;
  hasTVPreferredFocus?: boolean;
  onPress?: () => void;
};

export function Chip({ label, icon: Icon, selected, onPress, hasTVPreferredFocus, ...focusTargets }: ChipProps) {
  const { focused, scaleStyle, focusHandlers } = useFocusScale();
  const labelColor = focused ? colors.onDuck : selected ? colors.duck : colors.inkMuted;

  return (
    <Pressable
      onPress={onPress}
      hasTVPreferredFocus={hasTVPreferredFocus}
      accessibilityState={selected === undefined ? undefined : { selected }}
      {...focusTargets}
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
