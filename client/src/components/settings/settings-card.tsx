import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, radius, space, typography } from "../../theme";

type SettingsCardProps = {
  title: string;
  description?: string;
  featured?: boolean;
  children?: ReactNode;
};

export function SettingsCard({ title, description, featured, children }: SettingsCardProps) {
  return (
    <View style={[styles.card, featured && styles.featured]}>
      <View style={styles.text}>
        <Text style={featured ? typography.title3 : typography.headline}>{title}</Text>
        {description && <Text style={featured ? typography.body : typography.caption}>{description}</Text>}
      </View>
      {children && <View style={styles.actions}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: space[6],
    paddingVertical: space[5],
    paddingHorizontal: space[6],
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  featured: {
    padding: space[6],
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceRaised,
  },
  text: {
    flexShrink: 1,
    gap: space[1],
  },
  actions: {
    flexDirection: "row",
    gap: space[4],
  },
});
