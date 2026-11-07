import { z } from "zod";

const choice = z.string().trim().min(1).max(64);
const choices = z.array(choice).max(50);

export const preferencesSchema = z.object({
  country: choice.optional(),
  streamingServices: choices.optional(),
  formats: choices.optional(),
  genres: choices.optional(),
  dislikes: choices.optional(),
  languages: choices.optional(),
  subtitleLanguages: choices.optional(),
});

export const settingsUpdateSchema = preferencesSchema.extend({
  name: z.string().trim().min(1).max(80).optional(),
});

export type Preferences = z.infer<typeof preferencesSchema>;
export type SettingsUpdate = z.infer<typeof settingsUpdateSchema>;
