import type { ReactNode } from "react";
import { Animated, Pressable, ScrollView, StyleSheet, Text, View, type ViewStyle } from "react-native";
import { useFocusScale } from "../../../hooks/use-focus-scale";
import { shadows, space, typography } from "../../../theme";

type FocusRowProps = {
  heading?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function FocusRow({ heading, children, footer }: FocusRowProps) {
  return (
    <View style={styles.container}>
      {heading && <Text style={typography.title3}>{heading}</Text>}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.row}
        contentContainerStyle={styles.rowContent}
      >
        {children}
      </ScrollView>
      {footer}
    </View>
  );
}

type FocusItemProps = {
  label: string;
  onFocus: () => void;
  style?: ViewStyle;
  ringStyle?: ViewStyle;
  ring: ReactNode;
  children?: ReactNode;
};

export function FocusItem({ label, onFocus, style, ringStyle, ring, children }: FocusItemProps) {
  const { focused, scaleStyle, focusHandlers } = useFocusScale();

  return (
    <Pressable
      accessibilityLabel={label}
      {...focusHandlers}
      onFocus={() => {
        focusHandlers.onFocus();
        onFocus();
      }}
    >
      <Animated.View style={[style, scaleStyle]}>
        <View style={[ringStyle, focused && styles.focused]}>{ring}</View>
        {children}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: space[4],
  },
  row: {
    margin: -space[5],
  },
  rowContent: {
    gap: space[4],
    padding: space[5],
  },
  focused: {
    boxShadow: `${shadows.lift}, ${shadows.focusRing}`,
  },
});
