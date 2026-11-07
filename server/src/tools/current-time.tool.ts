import { toolDefinition } from "@tanstack/ai";
import { z } from "zod";
import { withStatus } from "./tool-status.js";

export const currentTimeTool = toolDefinition({
  name: "get_current_time",
  description:
    "Get the current date and time, optionally in a specific time zone.",
  inputSchema: withStatus({
    timeZone: z.string().optional().meta({
      description: "IANA time zone, e.g. Europe/Amsterdam. Defaults to UTC.",
    }),
  }),
  outputSchema: z.object({
    iso: z.string(),
    local: z.string(),
    timeZone: z.string(),
  }),
}).server(({ timeZone = "UTC" }) => {
  const now = new Date();
  return {
    iso: now.toISOString(),
    local: now.toLocaleString("en-US", {
      timeZone,
      dateStyle: "full",
      timeStyle: "long",
    }),
    timeZone,
  };
});
