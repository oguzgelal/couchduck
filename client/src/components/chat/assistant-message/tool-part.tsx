import type { UIMessage } from "@tanstack/ai-react";
import { StyleSheet, View } from "react-native";
import { parseStreamingArgs } from "../../../lib/streaming-args";
import { space } from "../../../theme";
import { AssistantDisplay, isDisplayTool } from "../assistant-display";
import { ToolStatus } from "./tool-status";
import { WeatherPart } from "./weather-part";

type ToolCallPart = Extract<UIMessage["parts"][number], { type: "tool-call" }>;

type ToolPartProps = {
  part: ToolCallPart;
  isResponding: boolean;
};

function statusState(part: ToolCallPart, isResponding: boolean) {
  if (part.state === "error") return "failed";
  if (part.state === "complete" || !isResponding) return "done";
  return "running";
}

export function ToolPart({ part, isResponding }: ToolPartProps) {
  const input = (part.input as Record<string, any> | undefined) ?? parseStreamingArgs(part.arguments);
  const state = statusState(part, isResponding);
  const isDisplay = isDisplayTool(part.name);
  const showStatus = typeof input?.status === "string" && !(isDisplay && state === "done");

  return (
    <View style={styles.container}>
      {showStatus && <ToolStatus text={input.status} state={state} />}
      {part.name === "get_weather" && part.state === "complete" && <WeatherPart weather={part.output} />}
      {isDisplay && <AssistantDisplay name={part.name} input={input} isStreaming={state === "running"} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: space[3],
  },
});
