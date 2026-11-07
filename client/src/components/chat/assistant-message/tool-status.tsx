import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Check, X } from "lucide-react-native";
import { colors, space, typography } from "../../../theme";

type ToolStatusProps = {
  text: string;
  state: "running" | "done" | "failed";
};

const ICON_SIZE = 26;

export function ToolStatus({ text, state }: ToolStatusProps) {
  return (
    <View style={styles.row}>
      <View style={styles.icon}>
        {state === "running" && <ActivityIndicator size="small" color={colors.duck} />}
        {state === "done" && <Check size={ICON_SIZE} color={colors.inkSubtle} strokeWidth={3} />}
        {state === "failed" && <X size={ICON_SIZE} color={colors.danger} strokeWidth={3} />}
      </View>
      <Text style={[typography.caption, state === "running" && styles.running]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: space[2],
  },
  icon: {
    width: ICON_SIZE,
    alignItems: "center",
  },
  running: {
    color: colors.inkMuted,
  },
});
