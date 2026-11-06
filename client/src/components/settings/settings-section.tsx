import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { space, typography } from "../../theme";

type SettingsSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function SettingsSection({ title, description, children }: SettingsSectionProps) {
  return (
    <View style={styles.section}>
      <View style={styles.heading}>
        <Text style={typography.title2}>{title}</Text>
        {description && <Text style={typography.body}>{description}</Text>}
      </View>
      <View style={styles.items}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    flex: 1,
    gap: space[7],
  },
  heading: {
    gap: space[3],
  },
  items: {
    flex: 1,
    gap: space[4],
  },
});
