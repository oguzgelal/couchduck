import { useSettings } from "../../../hooks/use-settings";
import { ChoicePickerCountry } from "../../choice-picker/choice-picker-country";
import { PillPicker } from "../../pill-picker/pill-picker";
import { SettingsPickerSection } from "../settings-picker-section";
import { STREAMING_SERVICES } from "../settings-options";
import type { SettingsPageProps } from "./index";

export function AvailabilityPage({
  subpage,
  returnFocusTo,
  onOpenSubpage,
  onCloseSubpage,
}: SettingsPageProps) {
  const { settings, update } = useSettings();

  return (
    <SettingsPickerSection
      title="Availability"
      description="Couch Duck uses these to find movies and shows you can actually watch."
      subpage={subpage}
      returnFocusTo={returnFocusTo}
      onOpenSubpage={onOpenSubpage}
      onCloseSubpage={onCloseSubpage}
      rows={[
        {
          id: "country",
          title: "Country or region",
          description: "Picks lean towards what’s available where you are", // prettier-ignore
          details: "Couch Duck tries to recommend movies and shows available in your region. Catalogs change often, so it’s not guaranteed.", // prettier-ignore
          value: settings && (settings.country ?? "Anywhere"),
          picker: () => (
            <ChoicePickerCountry
              selected={settings?.country ? [settings.country] : []}
              onSelect={(country) => {
                update({ country });
                onCloseSubpage();
              }}
            />
          ),
        },
        {
          id: "streamingServices",
          title: "Streaming services",
          description: "Picks lean towards the services you have",
          details: "Couch Duck tries to recommend movies and shows on your streaming services. Add any that aren’t listed. Leave empty to search every service. Catalogs change often, so it’s not guaranteed.", // prettier-ignore
          value:
            settings &&
            (settings.streamingServices?.join(", ") || "Any service"),
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
