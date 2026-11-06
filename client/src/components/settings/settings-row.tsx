import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { useFocusScale } from "../../hooks/use-focus-scale";
import { colors, fonts, radius, shadows, space, typography } from "../../theme";

type SettingsRowProps = {
  title: string;
  description: string;
  value?: string;
  hasTVPreferredFocus?: boolean;
  onPress: () => void;
};

export function SettingsRow({ title, description, value, hasTVPreferredFocus, onPress }: SettingsRowProps) {
  const { focused, scaleStyle, focusHandlers } = useFocusScale(1.03);

  return (
    <Pressable onPress={onPress} hasTVPreferredFocus={hasTVPreferredFocus} {...focusHandlers}>
      <Animated.View style={[styles.row, focused && styles.focused, scaleStyle]}>
        <View style={styles.text}>
          <Text style={typography.headline}>{title}</Text>
          <Text style={typography.caption}>{description}</Text>
        </View>
        <View style={styles.trailing}>
          {value && (
            <Text style={styles.value} numberOfLines={1}>
              {value}
            </Text>
          )}
          <ChevronRight size={28} color={colors.inkMuted} strokeWidth={2.5} />
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    height: 112,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: space[6],
    paddingHorizontal: space[6],
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  focused: {
    boxShadow: `${shadows.lift}, ${shadows.focusRing}`,
  },
  text: {
    gap: space[1],
  },
  trailing: {
    flexShrink: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: space[3],
  },
  value: {
    flexShrink: 1,
    fontFamily: fonts.textSemiBold,
    fontSize: 29,
    color: colors.inkMuted,
  },
});
