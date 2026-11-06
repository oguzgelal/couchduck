import { StyleSheet, TVFocusGuideView } from "react-native";
import { Settings } from "lucide-react-native";
import { Chip } from "../ui/chip";
import { Wordmark } from "../ui/wordmark";

type ChatHeaderProps = {
  composerTag?: number | null;
  onOpenSettings: () => void;
};

export function ChatHeader({ composerTag, onOpenSettings }: ChatHeaderProps) {
  const exitFocusTo = composerTag ?? undefined;

  return (
    <TVFocusGuideView autoFocus style={styles.header}>
      <Wordmark />
      <Chip
        label="Settings"
        icon={Settings}
        onPress={onOpenSettings}
        nextFocusDown={exitFocusTo}
        nextFocusLeft={exitFocusTo}
        nextFocusRight={exitFocusTo}
      />
    </TVFocusGuideView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
