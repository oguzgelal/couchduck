import { useState } from "react";
import { ActivityIndicator } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Screen } from "./src/components/screen";
import { authClient } from "./src/lib/auth-client";
import { sessionStore } from "./src/lib/session-store";
import { ChatScreen } from "./src/screens/chat-screen";
import { HistoryScreen } from "./src/screens/history-screen";
import { SettingsScreen } from "./src/screens/settings-screen";
import { SignInScreen } from "./src/screens/sign-in-screen";
import { useConversationStore } from "./src/stores/conversation-store";
import { colors, fontAssets } from "./src/theme";

export default function App() {
  const [queryClient] = useState(() => new QueryClient());
  const session = authClient.useSession();
  const [fontsLoaded] = useFonts(fontAssets);
  const [route, setRoute] = useState<"chat" | "history" | "settings">("chat");
  const startNewConversation = useConversationStore((state) => state.startNewConversation);

  const handleAuthorized = async (token: string) => {
    await sessionStore.setToken(token);
    session.refetch();
  };

  const handleSignOut = async () => {
    await authClient.signOut();
    await sessionStore.clear();
    queryClient.clear();
    startNewConversation();
    setRoute("chat");
    session.refetch();
  };

  if (session.isPending || !fontsLoaded) {
    return (
      <Screen>
        <ActivityIndicator size="large" color={colors.duck} />
      </Screen>
    );
  }

  if (!session.data) {
    return (
      <Screen>
        <SignInScreen onAuthorized={handleAuthorized} />
      </Screen>
    );
  }

  const showChat = () => setRoute("chat");

  return (
    <QueryClientProvider client={queryClient}>
      <Screen>
        {route === "chat" && (
          <ChatScreen onOpenHistory={() => setRoute("history")} onOpenSettings={() => setRoute("settings")} />
        )}
        {route === "history" && <HistoryScreen onClose={showChat} />}
        {route === "settings" && <SettingsScreen onClose={showChat} onSignOut={handleSignOut} />}
      </Screen>
    </QueryClientProvider>
  );
}
