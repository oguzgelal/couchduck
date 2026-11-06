import { Button } from "../../ui/button";
import { SettingsCard } from "../settings-card";
import { SettingsSection } from "../settings-section";

// TODO(oguz): wire plan checkout and OpenRouter key swap once billing and key storage exist.
export function PlanPage() {
  return (
    <SettingsSection title="Plan and key" description="Pay monthly, or bring your own OpenRouter key.">
      <SettingsCard featured title="Couch Duck Plus" description="No key and no OpenRouter bills. Billed monthly.">
        <Button label="Get Plus" variant="primary" />
      </SettingsCard>
      <SettingsCard title="OpenRouter key" description="Use your own key and pay OpenRouter directly">
        <Button label="Update key" />
        <Button label="Remove" />
      </SettingsCard>
    </SettingsSection>
  );
}
