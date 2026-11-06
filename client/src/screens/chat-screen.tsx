import { ActivityIndicator } from "react-native";
import { ChatConversation } from "../components/chat/chat-conversation";
import { ErrorState } from "../components/error-state";
import { useAiUsage } from "../hooks/use-ai-usage";
import { useConversation } from "../hooks/use-conversation";
import { useConversationStore } from "../stores/conversation-store";
import { colors } from "../theme";
import { PaywallScreen } from "./paywall-screen";

type ChatScreenProps = {
  onOpenHistory: () => void;
  onOpenSettings: () => void;
};

export function ChatScreen({ onOpenHistory, onOpenSettings }: ChatScreenProps) {
  const conversationId = useConversationStore((state) => state.conversationId);
  const usage = useAiUsage();
  const conversation = useConversation(conversationId);

  if (usage.isPending || conversation.isPending) {
    return <ActivityIndicator size="large" color={colors.duck} />;
  }

  if (usage.limitReached) {
    return <PaywallScreen />;
  }

  if (!conversation.messages) {
    return (
      <ErrorState
        title="Couldn't load this conversation"
        message="Check your connection and try again."
        onRetry={conversation.retry}
      />
    );
  }

  return (
    <ChatConversation
      key={conversationId}
      savedMessages={conversation.messages}
      onSave={conversation.save}
      onError={usage.refresh}
      onOpenHistory={onOpenHistory}
      onOpenSettings={onOpenSettings}
    />
  );
}
