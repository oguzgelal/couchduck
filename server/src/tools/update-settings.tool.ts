import { toolDefinition } from "@tanstack/ai";
import { z } from "zod";
import {
  GENERAL_STATEMENTS_ONLY,
  languageTag,
  regionCode,
  SETTINGS_OPTIONS,
  settingsUpdateSchema,
} from "../schemas/settings.schema.js";
import { personService } from "../services/person.service.js";
import type { ChatContext } from "./chat-context.js";
import { withoutStatus, withStatus } from "./tool-status.js";

const openList = (description: string, known: readonly string[]) =>
  z.array(z.string().trim().min(1).max(64)).max(50).optional().meta({
    description: `${description}. Common values: ${known.join(", ")}. Anything else they mention is fine too.`,
  });

const languageList = (description: string) =>
  z.array(languageTag).max(50).optional().meta({
    description: `${description}, as Unicode language tags: a language subtag, optionally with a region (e.g. fr, fr-CA, pt-BR)`,
  });

export const updateSettingsTool = toolDefinition({
  name: "update_settings",
  description: [
    "Update the settings of the person you're talking to. Call this without asking whenever they mention a change to one of these settings, and use upsert_memory only for things that aren't one of these settings.",
    GENERAL_STATEMENTS_ONLY,
    "Pass only the settings that change. Lists replace the saved list, so include the existing items they keep; their current settings are in your instructions.",
  ].join(" "),
  inputSchema: withStatus(settingsUpdateSchema.shape).extend({
    name: z.string().trim().min(1).max(80).optional().meta({
      description: "What to call them",
    }),
    country: regionCode.nullable().optional().meta({
      description: "Country they live in, as a Unicode region code (e.g. CA, GB, JP), or null to clear it",
    }),
    streamingServices: openList("Streaming services they have", SETTINGS_OPTIONS.streamingServices),
    formats: z.array(z.enum(SETTINGS_OPTIONS.formats)).optional().meta({
      description: "Formats they like to watch",
    }),
    genres: openList("Favorite genres", SETTINGS_OPTIONS.genres),
    dislikes: openList("Things they want to avoid", SETTINGS_OPTIONS.dislikes),
    languages: languageList("Languages they prefer movies and shows originally in"),
    subtitleLanguages: languageList("Languages they prefer subtitles in"),
  }),
}).server<ChatContext>(async (input, { context }) => {
  const settings = withoutStatus(input);
  await personService.updateSettings(context.person.id, settings);
  return {
    saved: settings,
  };
});
