import { parsePartialJSON, type UIMessage } from "@tanstack/ai-react";
import { StyleSheet, View } from "react-native";
import { space } from "../../../theme";
import { isDisplayTool } from "../assistant-display";
import { QuestionPart, type QuestionAnswer } from "./question-part";
import { TextPart } from "./text-part";
import { ThinkPart } from "./think-part";
import { ToolPart } from "./tool-part";

type Part = UIMessage["parts"][number];

type AssistantMessageProps = {
  message: UIMessage;
  canAnswer: boolean;
  onAnswer: (toolCallId: string, answer: QuestionAnswer) => void;
};

const isQuestionReady = (part: Part) =>
  part.type === "tool-call" &&
  part.name === "ask_user_question" &&
  (part.state === "input-complete" || part.state === "complete");

const isVisible = (part: Part) => {
  if (part.type === "text") return part.content.trim().length > 0;
  if (part.type !== "tool-call") return false;
  return part.name !== "ask_user_question" || isQuestionReady(part);
};

const isStatusLine = (part: Part) =>
  part.type === "tool-call" &&
  part.name !== "think" &&
  part.name !== "ask_user_question" &&
  !isDisplayTool(part.name);

const groupStatusLines = (parts: Part[]) =>
  parts.reduce<Part[][]>((groups, part) => {
    const last = groups.at(-1);
    if (last && isStatusLine(part) && isStatusLine(last[0])) last.push(part);
    else groups.push([part]);
    return groups;
  }, []);

export function AssistantMessage({ message, canAnswer, onAnswer }: AssistantMessageProps) {
  const renderPart = (part: Part, index: number) => {
    if (part.type === "text") return <TextPart key={index} text={part.content} />;
    if (part.type !== "tool-call") return null;
    if (part.name === "think") {
      const isThinking = part.state === "awaiting-input" || part.state === "input-streaming";
      return <ThinkPart key={part.id} thought={parsePartialJSON(part.arguments)?.thought ?? ""} isThinking={isThinking} />;
    }
    if (part.name === "ask_user_question") {
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
    return <ToolPart key={part.id} part={part} isResponding={!canAnswer} />;
  };

  return (
    <View style={styles.message}>
      {groupStatusLines(message.parts.filter(isVisible)).map((group, index) =>
        isStatusLine(group[0]) ? (
          <View key={index} style={styles.statusLines}>
            {group.map(renderPart)}
          </View>
        ) : (
          renderPart(group[0], index)
        ),
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  message: {
    gap: space[3],
  },
  statusLines: {
    gap: space[1],
  },
});
