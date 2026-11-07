import { toolDefinition } from "@tanstack/ai";
import { z } from "zod";
import { GENERAL_STATEMENTS_ONLY, SETTING_NAMES } from "../schemas/settings.schema.js";
import { personService } from "../services/person.service.js";
import type { ChatContext } from "./chat-context.js";

export const upsertMemoryTool = toolDefinition({
  name: "upsert_memory",
  description:
    [
      "Remember lasting facts about the person you're talking to: preferences, likes and dislikes, interests, routines, people and pets in their life. Call this without asking whenever you learn one.",
      `Anything update_settings covers (${SETTING_NAMES.join(", ")}) goes to update_settings instead, never here.`,
      GENERAL_STATEMENTS_ONLY,
      "When a fact changes, update it by reusing its existing key. When it no longer holds or they ask you to forget it, pass fact as null.",
    ].join(" "),
  inputSchema: z.object({
    key: z.string().meta({
      description: "Short snake_case identifier, e.g. favorite_actor",
    }),
    fact: z.string().nullable().meta({
      description: "The fact as one short sentence, or null to forget this key",
    }),
  }),
}).server<ChatContext>(async ({ key, fact }, { context }) => {
  if (fact === null) {
    await personService.forget(context.person.id, key);
    return {
      forgotten: key,
    };
  }
  await personService.remember(context.person.id, key, fact);
  return {
    saved: {
      key,
      fact,
    },
  };
});
