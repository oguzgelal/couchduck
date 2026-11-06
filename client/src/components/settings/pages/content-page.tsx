import { useSettings } from "../../../hooks/use-settings";
import { PillPicker } from "../../pill-picker/pill-picker";
import { SettingsPickerSection } from "../settings-picker-section";
import { DISLIKES, FORMATS, GENRES } from "../settings-options";
import type { SettingsPageProps } from "./index";

export function ContentPage({ subpage, returnFocusTo, onOpenSubpage, onCloseSubpage }: SettingsPageProps) {
  const { settings, update } = useSettings();

  return (
    <SettingsPickerSection
      title="Content preferences"
      description="What you love, and what you’d rather skip."
      subpage={subpage}
      returnFocusTo={returnFocusTo}
      onOpenSubpage={onOpenSubpage}
      onCloseSubpage={onCloseSubpage}
      rows={[
        {
          id: "formats",
          title: "Formats",
          description: "What you like to watch",
          value: settings && (settings.formats?.join(", ") || "Anything"),
          multiple: true,
          picker: (focus) => (
            <PillPicker
              {...focus}
              options={FORMATS}
              selected={settings?.formats ?? []}
              onChange={(formats) => update({ formats })}
            />
          ),
        },
        {
          id: "genres",
          title: "Favorite genres",
          description: "Picks lean towards these",
          value: settings && (settings.genres?.join(", ") || "Anything"),
          multiple: true,
          picker: (focus) => (
            <PillPicker
              {...focus}
              options={GENRES}
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
          value: settings && (settings.dislikes?.join(", ") || "Nothing"),
          multiple: true,
          picker: (focus) => (
            <PillPicker
              {...focus}
              options={DISLIKES}
              selected={settings?.dislikes ?? []}
              onChange={(dislikes) => update({ dislikes })}
              addLabel="Add"
            />
          ),
        },
      ]}
    />
  );
}
