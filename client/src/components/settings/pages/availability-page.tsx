import { SettingsChoiceRow } from "../settings-choice-row";
import { SettingsSection } from "../settings-section";
import type { SettingsPageProps } from "./index";

export function AvailabilityPage({ onOpenChoice, returnFocusTo }: SettingsPageProps) {
  return (
    <SettingsSection title="Availability" description="So picks match what you can actually watch.">
      {(["country", "language", "streamingServices"] as const).map((field) => (
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
