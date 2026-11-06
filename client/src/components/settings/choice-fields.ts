import type { ComponentType } from "react";
import type { Settings } from "../../hooks/use-settings";
import type { ChoicePickerSelectionProps } from "../choice-picker/choice-picker";
import { ChoicePickerCountry } from "../choice-picker/choice-picker-country";
import { ChoicePickerLanguage } from "../choice-picker/choice-picker-language";

export type ChoiceKey = Exclude<keyof Settings, "name">;

type ChoiceField = {
  title: string;
  description: string;
  emptyLabel: string;
} & ({ multiple: true; options: string[]; allowCustom?: boolean } | { multiple: false; Picker: ComponentType<ChoicePickerSelectionProps> });

export const CHOICE_FIELDS: Record<ChoiceKey, ChoiceField> = {
  country: {
    title: "Country or region",
    description: "What’s streaming where you are",
    emptyLabel: "Not set",
    multiple: false,
    Picker: ChoicePickerCountry,
  },
  language: {
    title: "Language",
    description: "How Couch Duck talks to you",
    emptyLabel: "Not set",
    multiple: false,
    Picker: ChoicePickerLanguage,
  },
  streamingServices: {
    title: "Streaming services",
    description: "Picks come from these first",
    emptyLabel: "None",
    multiple: true,
    allowCustom: true,
    options: [
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
  },
  formats: {
    title: "Formats",
    description: "What you like to watch",
    emptyLabel: "Anything",
    multiple: true,
    options: ["Movies", "TV shows"],
  },
  genres: {
    title: "Favorite genres",
    description: "Picks lean towards these",
    emptyLabel: "Anything",
    multiple: true,
    options: [
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
  },
  dislikes: {
    title: "Not for you",
    description: "Couch Duck steers clear of these",
    emptyLabel: "Nothing",
    multiple: true,
    options: [
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
  },
};

export function selectedChoices(settings: Settings | undefined, key: ChoiceKey) {
  return [settings?.[key] ?? []].flat();
}
