import { Animated, Pressable, StyleSheet, Text } from "react-native";
import type { LucideIcon } from "lucide-react-native";
import { useFocusScale } from "../../hooks/use-focus-scale";
import { colors, radius, shadows, space, typography } from "../../theme";

type SettingsNavItemProps = {
  label: string;
  icon: LucideIcon;
  selected: boolean;
  hasTVPreferredFocus?: boolean;
  onSelect: () => void;
  onEnter: () => void;
};

export function SettingsNavItem({
  label,
  icon: Icon,
  selected,
  hasTVPreferredFocus,
  onSelect,
  onEnter,
}: SettingsNavItemProps) {
  const { focused, scaleStyle, focusHandlers } = useFocusScale(1.04);
  const color = focused ? colors.onDuck : selected ? colors.ink : colors.inkMuted;

  return (
    <Pressable
      onPress={onEnter}
      hasTVPreferredFocus={hasTVPreferredFocus}
      accessibilityState={{ selected }}
      {...focusHandlers}
      onFocus={() => {
        focusHandlers.onFocus();
        onSelect();
      }}
    >
      <Animated.View style={[styles.item, selected && styles.selected, focused && styles.focused, scaleStyle]}>
        <Icon size={32} color={color} strokeWidth={2.5} />
        <Text style={[typography.label, { color }]}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    height: 80,
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    paddingHorizontal: space[5],
    borderRadius: radius.pill,
  },
  selected: {
    backgroundColor: colors.duckSoft,
  },
  focused: {
    backgroundColor: colors.duck,
    boxShadow: `${shadows.lift}, ${shadows.focusRing}`,
  },
});
