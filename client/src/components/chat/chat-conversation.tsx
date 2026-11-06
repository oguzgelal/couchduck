import { useEffect, useEffectEvent, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useChat, type UIMessage } from "@tanstack/ai-react";
import { MessageSquarePlus, RotateCcwClock } from "lucide-react-native";
import { chatConnection } from "../../lib/chat-connection";
import { useTVBack } from "../../hooks/use-tv-back";
import { useConversationStore } from "../../stores/conversation-store";
import { colors, space, typography } from "../../theme";
import { Duck } from "../ui/duck";
import { IconButton } from "../ui/icon-button";
import { ChatComposer } from "./chat-composer";
import { ChatHeader } from "./chat-header";
import { ChatMessages } from "./chat-messages";
import { ChatWelcome } from "./chat-welcome";
import { ComposerHint } from "./composer-hint";
import type { QuestionAnswer } from "./assistant-message/question-part";

const ASK_USER_QUESTION = "ask_user_question";

type ChatConversationProps = {
  savedMessages: UIMessage[];
  onSave: (messages: UIMessage[]) => void;
  onError: () => void;
  onOpenHistory: () => void;
  onSignOut: () => void;
};

export function ChatConversation({
  savedMessages,
  onSave,
  onError,
  onOpenHistory,
  onSignOut,
}: ChatConversationProps) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<ScrollView>(null);
  const composerRef = useRef<View>(null);
  const [isComposerFocused, setIsComposerFocused] = useState(true);
  const startNewConversation = useConversationStore(
    (state) => state.startNewConversation,
  );

  const isFirstLayoutRef = useRef(true);

  const { messages, sendMessage, addToolResult, stop, isLoading, error } =
    useChat({
      connection: chatConnection,
      initialMessages: savedMessages,
      onError,
    });

  const saveTurn = useEffectEvent(() => {
    if (JSON.stringify(messages) === JSON.stringify(savedMessages)) return;
    onSave(messages);
  });

  useEffect(() => {
    if (!isLoading) saveTurn();
  }, [isLoading]);

  const pendingQuestion = messages
    .at(-1)
    ?.parts.find(
      (part) =>
        part.type === "tool-call" &&
        part.name === ASK_USER_QUESTION &&
        part.output === undefined,
    );

  const handleAnswer = (toolCallId: string, answer: QuestionAnswer) => {
    addToolResult({ toolCallId, tool: ASK_USER_QUESTION, output: answer });
    composerRef.current?.requestTVFocus();
  };

  const handleSubmit = () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    if (pendingQuestion?.type === "tool-call") {
      handleAnswer(pendingQuestion.id, { answers: [], reply: text });
      return;
    }
    sendMessage(text);
  };

  const handleContentSizeChange = () => {
    if (!isLoading && !isFirstLayoutRef.current) return;
    scrollRef.current?.scrollToEnd({ animated: !isFirstLayoutRef.current });
    isFirstLayoutRef.current = false;
  };

  const isEmpty = messages.length === 0;
  const isThinking = isLoading && messages.at(-1)?.role === "user";

  useTVBack(() => {
    if (isComposerFocused) startNewConversation();
    else composerRef.current?.requestTVFocus();
  }, !isComposerFocused || !isEmpty);

  const composerBar = (
    <View style={[styles.composerBar, isEmpty && styles.welcomeComposerBar]}>
      <ChatComposer
        ref={composerRef}
        onFocusChange={setIsComposerFocused}
        value={input}
        onChangeText={setInput}
        onSubmit={handleSubmit}
        isResponding={isLoading}
        onStop={stop}
        hasTVPreferredFocus
        style={styles.composer}
      />
      {!isEmpty && (
        <IconButton
          icon={MessageSquarePlus}
          label="New conversation"
          onPress={startNewConversation}
        />
      )}
      <IconButton
        icon={RotateCcwClock}
        label="Conversation history"
        onPress={onOpenHistory}
      />
    </View>
  );

  if (isEmpty) {
    return (
      <View style={styles.container}>
        <ChatHeader onSignOut={onSignOut} />
        <ChatWelcome onSuggestion={sendMessage} composer={composerBar} />
        {!isComposerFocused && <ComposerHint />}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ChatHeader onSignOut={onSignOut} />
      <ScrollView
        ref={scrollRef}
        style={styles.messages}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={handleContentSizeChange}
      >
        <ChatMessages
          messages={messages}
          canAnswer={!isLoading}
          onAnswer={handleAnswer}
        />
        {isThinking && (
          <View style={styles.thinking}>
            <Duck height={30} />
            <Text style={typography.caption}>Thinking…</Text>
          </View>
        )}
        {error && (
          <Text style={[typography.body, styles.error]}>
            Something went wrong: {error.message}
          </Text>
        )}
        {composerBar}
      </ScrollView>
      {!isComposerFocused && <ComposerHint />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: "stretch",
    paddingVertical: space.safeY,
    paddingHorizontal: space.safeX,
    gap: space[5],
  },
  composerBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: space[4],
  },
  welcomeComposerBar: {
    width: 1200,
  },
  composer: {
    flex: 1,
  },
  messages: {
    flex: 1,
    margin: -space[5],
  },
  messagesContent: {
    flexGrow: 1,
    justifyContent: "flex-end",
    gap: space[5],
    padding: space[5],
  },
  thinking: {
    flexDirection: "row",
    alignItems: "center",
    gap: space[2],
  },
  error: {
    color: colors.danger,
  },
});
