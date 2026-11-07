import { languageTagName } from "../../../config/countries";
import { useSettings } from "../../../hooks/use-settings";
import { useSettingsOptions } from "../../../hooks/use-settings-options";
import { ChoicePickerLanguage } from "../../choice-picker/choice-picker-language";
import { PillPicker } from "../../pill-picker/pill-picker";
import { SettingsPickerSection } from "../settings-picker-section";
import type { SettingsPageProps } from "./index";

function toggle(list: string[] = [], value: string) {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];
}

export function ContentPage({
  subpage,
  returnFocusTo,
  onOpenSubpage,
  onCloseSubpage,
}: SettingsPageProps) {
  const { settings, update } = useSettings();
  const options = useSettingsOptions();

  return (
    <SettingsPickerSection
      title="Content preferences"
      description="Couch Duck recommends movies and shows based on these. They’re defaults, so anything you ask for in chat wins: ask for horror tonight and you’ll get horror, even if it’s on your skip list."
      subpage={subpage}
      returnFocusTo={returnFocusTo}
      onOpenSubpage={onOpenSubpage}
      onCloseSubpage={onCloseSubpage}
      rows={[
        {
          id: "formats",
          title: "Formats",
          description: "Movies, TV shows, or both",
          details:
            "Couch Duck leans towards the formats you pick. Leave empty for both.",
          value: settings && (settings.formats?.join(", ") || "Anything"),
          multiple: true,
          picker: (focus) => (
            <PillPicker
              {...focus}
              options={options.formats}
              selected={settings?.formats ?? []}
              onChange={(formats) => update({ formats })}
            />
          ),
        },
        {
          id: "genres",
          title: "Favorite genres",
          description: "Picks lean towards these",
          details:
            "Couch Duck favors these genres when it recommends something. Add any that aren’t listed.",
          value: settings && (settings.genres?.join(", ") || "Anything"),
          multiple: true,
          picker: (focus) => (
            <PillPicker
              {...focus}
              options={options.genres}
              selected={settings?.genres ?? []}
              onChange={(genres) => update({ genres })}
              addLabel="Add"
            />
          ),
        },
        {
          id: "dislikes",
          title: "Not for you",
          description: "Couch Duck steers clear of these",
          details:
            "Couch Duck avoids these unless you ask for them in chat. Add anything else you’d rather skip.",
          value: settings && (settings.dislikes?.join(", ") || "Nothing"),
          multiple: true,
          picker: (focus) => (
            <PillPicker
              {...focus}
              options={options.dislikes}
              selected={settings?.dislikes ?? []}
              onChange={(dislikes) => update({ dislikes })}
              addLabel="Add"
            />
          ),
        },
        {
          id: "languages",
          title: "Preferred languages",
          description: "Picks lean towards content in these languages",
          details:
            "Couch Duck tries to pick movies and shows originally in these languages.",
          value: settings && (settings.languages?.map(languageTagName).join(", ") || "Any language"),
          multiple: true,
          picker: () => (
            <ChoicePickerLanguage
              selected={settings?.languages ?? []}
              onSelect={(language) =>
                update({ languages: toggle(settings?.languages, language) })
              }
            />
          ),
        },
        {
          id: "subtitleLanguages",
          title: "Preferred subtitle languages",
          description: "Picks lean towards subtitles in these languages",
          details:
            "Couch Duck tries to pick movies and shows with subtitles available in these languages. Subtitle availability isn’t guaranteed.",
          value: settings && (settings.subtitleLanguages?.map(languageTagName).join(", ") || "Any"),
          multiple: true,
          picker: () => (
            <ChoicePickerLanguage
              selected={settings?.subtitleLanguages ?? []}
              onSelect={(language) =>
                update({
                  subtitleLanguages: toggle(
                    settings?.subtitleLanguages,
                    language,
                  ),
                })
              }
            />
          ),
        },
      ]}
    />
  );
}
