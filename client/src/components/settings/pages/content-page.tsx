import { SettingsChoiceRow } from "../settings-choice-row";
import { SettingsSection } from "../settings-section";
import type { SettingsPageProps } from "./index";

export function ContentPage({ onOpenChoice, returnFocusTo }: SettingsPageProps) {
  return (
    <SettingsSection title="Content preferences" description="What you love, and what you’d rather skip.">
      {(["formats", "genres", "dislikes"] as const).map((field) => (
        <SettingsChoiceRow
          key={field}
          field={field}
          hasTVPreferredFocus={field === returnFocusTo}
          onOpen={onOpenChoice}
        />
      ))}
    </SettingsSection>
  );
}
