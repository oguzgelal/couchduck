import { parsePartialJSON, type UIMessage } from "@tanstack/ai-react";
import { StyleSheet, View } from "react-native";
import { space } from "../../../theme";
import { MediaPart } from "../assistant-display/media/media-part";
import { MediasPart } from "../assistant-display/media/medias-part";
import { PersonPart } from "../assistant-display/person/person-part";
import { PersonsPart } from "../assistant-display/person/persons-part";
import { QuestionPart, type QuestionAnswer } from "./question-part";
import { TextPart } from "./text-part";
import { ThinkPart } from "./think-part";
import { WeatherPart } from "./weather-part";

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
        if (part.name === "get_weather" && part.state === "complete") {
          return <WeatherPart key={part.id} weather={part.output} />;
        }
        if (part.state !== "complete") return null;
        const input = part.input ?? parsePartialJSON(part.arguments);
        if (part.name === "show_media") return <MediaPart key={part.id} media={input} />;
        if (part.name === "show_medias") return <MediasPart key={part.id} list={input} />;
        if (part.name === "show_person") return <PersonPart key={part.id} person={input} />;
        if (part.name === "show_persons") return <PersonsPart key={part.id} list={input} />;
        return null;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  message: {
    gap: space[3],
  },
});
