import { useSettings, type Settings } from "../../../hooks/use-settings";
import { ChoicePickerCountry } from "../../choice-picker/choice-picker-country";
import { ChoicePickerLanguage } from "../../choice-picker/choice-picker-language";
import { PillPicker } from "../../pill-picker/pill-picker";
import { SettingsPickerSection } from "../settings-picker-section";
import { STREAMING_SERVICES } from "../settings-options";
import type { SettingsPageProps } from "./index";

export function AvailabilityPage({ subpage, returnFocusTo, onOpenSubpage, onCloseSubpage }: SettingsPageProps) {
  const { settings, update } = useSettings();

  const selectAndClose = (patch: Partial<Settings>) => {
    update(patch);
    onCloseSubpage();
  };

  return (
    <SettingsPickerSection
      title="Availability"
      description="So picks match what you can actually watch."
      subpage={subpage}
      returnFocusTo={returnFocusTo}
      onOpenSubpage={onOpenSubpage}
      onCloseSubpage={onCloseSubpage}
      rows={[
        {
          id: "country",
          title: "Country or region",
          description: "What’s streaming where you are",
          value: settings && (settings.country ?? "Not set"),
          picker: () => (
            <ChoicePickerCountry selected={settings?.country} onSelect={(country) => selectAndClose({ country })} />
          ),
        },
        {
          id: "language",
          title: "Language",
          description: "How Couch Duck talks to you",
          value: settings && (settings.language ?? "Not set"),
          picker: () => (
            <ChoicePickerLanguage selected={settings?.language} onSelect={(language) => selectAndClose({ language })} />
          ),
        },
        {
          id: "streamingServices",
          title: "Streaming services",
          description: "Picks come from these first",
          value: settings && (settings.streamingServices?.join(", ") || "None"),
          multiple: true,
          picker: (focus) => (
            <PillPicker
              {...focus}
              options={STREAMING_SERVICES}
              selected={settings?.streamingServices ?? []}
              onChange={(streamingServices) => update({ streamingServices })}
              addLabel="Add"
            />
          ),
        },
      ]}
    />
  );
}
