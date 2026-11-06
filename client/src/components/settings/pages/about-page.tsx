import { useSettings } from "../../../hooks/use-settings";
import { SettingsSection } from "../settings-section";
import { SettingsTextRow } from "../settings-text-row";

export function AboutPage() {
  const { settings, update } = useSettings();

  return (
    <SettingsSection title="About you" description="So Couch Duck knows who it’s talking to.">
      <SettingsTextRow
        title="Name"
        description="What Couch Duck calls you"
        value={settings?.name}
        onSubmit={(name) => update({ name })}
      />
    </SettingsSection>
  );
}
