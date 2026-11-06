import type { Ref } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { useFocusScale } from "../../hooks/use-focus-scale";
import { colors, radius, shadows, space, typography } from "../../theme";

type ButtonProps = {
  ref?: Ref<View>;
  label: string;
  onPress?: () => void;
  variant?: "primary" | "secondary" | "danger";
  hasTVPreferredFocus?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Button({
  ref,
  label,
  onPress,
  variant = "secondary",
  hasTVPreferredFocus,
  style,
}: ButtonProps) {
  const { focused, scaleStyle, focusHandlers } = useFocusScale();
  const filled = variant === "primary";

  return (
    <Pressable
      ref={ref}
      onPress={onPress}
      hasTVPreferredFocus={hasTVPreferredFocus}
      style={style}
      {...focusHandlers}
    >
      <Animated.View
        style={[
          styles.button,
          filled && styles.filled,
          focused && styles.focused,
          scaleStyle,
        ]}
      >
        <Text
          style={[
            typography.label,
            filled && styles.filledLabel,
            variant === "danger" && styles.dangerLabel,
          ]}
        >
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 80,
    paddingHorizontal: space[7],
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    boxShadow: shadows.rest,
  },
  filled: {
    backgroundColor: colors.duck,
  },
  focused: {
    boxShadow: `${shadows.lift}, ${shadows.focusRing}`,
  },
  filledLabel: {
    color: colors.onDuck,
  },
  dangerLabel: {
    color: colors.danger,
  },
});
