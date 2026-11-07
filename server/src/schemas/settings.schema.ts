import { z } from "zod";

export const SETTINGS_OPTIONS = {
  streamingServices: [
    "Netflix",
    "Prime Video",
    "Disney+",
    "Apple TV+",
    "Max",
    "Hulu",
    "Paramount+",
    "Peacock",
    "YouTube",
    "Crunchyroll",
    "MUBI",
    "Plex",
    "Tubi",
  ],
  formats: ["Movies", "TV shows"],
  genres: [
    "Action",
    "Adventure",
    "Animation",
    "Comedy",
    "Crime",
    "Documentary",
    "Drama",
    "Family",
    "Fantasy",
    "History",
    "Horror",
    "Musical",
    "Mystery",
    "Romance",
    "Sci-fi",
    "Thriller",
    "War",
    "Western",
  ],
  dislikes: [
    "Horror",
    "Jump scares",
    "Gore",
    "Graphic violence",
    "Sexual content",
    "Strong language",
    "Sad endings",
    "Cliffhangers",
    "Subtitles",
    "Black and white",
    "Long runtimes",
    "Reality TV",
    "Musicals",
    "Anime",
  ],
} as const;

const choice = z.string().trim().min(1).max(64);
const choices = z.array(choice).max(50);
// https://www.unicode.org/reports/tr35/#unicode_region_subtag
export const regionCode = z.string().regex(/^[A-Z]{2}$/);
// https://www.unicode.org/reports/tr35/#unicode_language_id
export const languageTag = z.string().regex(/^[a-z]{2,3}(-[A-Z]{2})?$/);
const languageTags = z.array(languageTag).max(50);

export const preferencesSchema = z.object({
  country: regionCode.optional(),
  streamingServices: choices.optional(),
  formats: z.array(z.enum(SETTINGS_OPTIONS.formats)).optional(),
  genres: choices.optional(),
  dislikes: choices.optional(),
  languages: languageTags.optional(),
  subtitleLanguages: languageTags.optional(),
});

export const settingsUpdateSchema = preferencesSchema.extend({
  name: z.string().trim().min(1).max(80).optional(),
  country: regionCode.nullable().optional(),
});

export const SETTING_NAMES = Object.keys(settingsUpdateSchema.shape).map((key) =>
  key.replace(/[A-Z]/g, (letter) => ` ${letter.toLowerCase()}`),
);

export const GENERAL_STATEMENTS_ONLY =
  "Only save general, lasting statements: \"I don't like musicals\" counts, but \"I don't want a musical today\", \"I don't want to watch a musical\" or \"I don't feel like a musical\" are one-off requests, so don't save them.";

export type Preferences = z.infer<typeof preferencesSchema>;
export type SettingsUpdate = z.infer<typeof settingsUpdateSchema>;

export function parseStoredPreferences(stored: unknown): Preferences {
  const result = preferencesSchema.safeParse(stored);
  if (result.success) return result.data;
  if (typeof stored !== "object" || stored === null) return {};
  const invalidKeys = new Set(result.error.issues.map((issue) => issue.path[0]));
  const valid = Object.entries(stored).filter(([key]) => !invalidKeys.has(key));
  return preferencesSchema.parse(Object.fromEntries(valid));
}
