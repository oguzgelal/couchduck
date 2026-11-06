import { Alert, StyleSheet } from "react-native";
import { useClearHistory } from "../../../hooks/use-clear-history";
import { authClient } from "../../../lib/auth-client";
import { space } from "../../../theme";
import { Button } from "../../ui/button";
import { SettingsCard } from "../settings-card";
import { SettingsSection } from "../settings-section";
import type { SettingsPageProps } from "./index";

export function AccountPage({ onSignOut }: SettingsPageProps) {
  const session = authClient.useSession();
  const clearHistory = useClearHistory();
  const email = session.data?.user.email;

  const confirmClearHistory = () =>
    Alert.alert("Clear chat history?", "Every chat on this account will be deleted.", [
      { text: "Cancel", style: "cancel" },
      { text: "Clear history", style: "destructive", onPress: () => clearHistory.mutate() },
    ]);

  const clearLabel = clearHistory.isPending ? "Clearing…" : clearHistory.isSuccess ? "Cleared" : "Clear history";

  return (
    <SettingsSection title="Account" description={email && `Signed in as ${email}`}>
      <SettingsCard title="Chat history" description="Every past chat on this account">
        <Button label={clearLabel} onPress={confirmClearHistory} />
      </SettingsCard>
      <Button label="Sign out" variant="danger" onPress={onSignOut} style={styles.signOut} />
    </SettingsSection>
  );
}

const styles = StyleSheet.create({
  signOut: {
    alignSelf: "flex-start",
    marginTop: space[2],
  },
});
