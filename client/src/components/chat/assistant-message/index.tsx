import { parsePartialJSON, type UIMessage } from "@tanstack/ai-react";
import { StyleSheet, View } from "react-native";
import { space } from "../../../theme";
import { QuestionPart, type QuestionAnswer } from "./question-part";
import { TextPart } from "./text-part";
import { ThinkPart } from "./think-part";
import { ToolPart } from "./tool-part";

type AssistantMessageProps = {
  message: UIMessage;
  canAnswer: boolean;
  onAnswer: (toolCallId: string, answer: QuestionAnswer) => void;
};

export function AssistantMessage({ message, canAnswer, onAnswer }: AssistantMessageProps) {
  return (
    <View style={styles.message}>
      {message.parts.map((part, index) => {
        if (part.type === "text") return <TextPart key={index} text={part.content} />;
        if (part.type !== "tool-call") return null;
        if (part.name === "think") {
          const isThinking = part.state === "awaiting-input" || part.state === "input-streaming";
          return (
            <ThinkPart key={part.id} thought={parsePartialJSON(part.arguments)?.thought ?? ""} isThinking={isThinking} />
          );
        }
        if (part.name === "ask_user_question" && (part.state === "input-complete" || part.state === "complete")) {
          return (
            <QuestionPart
              key={part.id}
              question={part.input ?? parsePartialJSON(part.arguments)}
              answer={part.output}
              canAnswer={canAnswer}
              onAnswer={(answer) => onAnswer(part.id, answer)}
            />
          );
        }
        if (part.name === "ask_user_question") return null;
        return <ToolPart key={part.id} part={part} isResponding={!canAnswer} />;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  message: {
    gap: space[3],
  },
});
