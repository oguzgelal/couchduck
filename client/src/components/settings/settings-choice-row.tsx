import { useSettings } from "../../hooks/use-settings";
import { CHOICE_FIELDS, selectedChoices, type ChoiceKey } from "./choice-fields";
import { SettingsRow } from "./settings-row";

type SettingsChoiceRowProps = {
  field: ChoiceKey;
  hasTVPreferredFocus?: boolean;
  onOpen: (field: ChoiceKey) => void;
};

export function SettingsChoiceRow({ field, hasTVPreferredFocus, onOpen }: SettingsChoiceRowProps) {
  const { settings } = useSettings();
  const { title, description, emptyLabel } = CHOICE_FIELDS[field];
  const selected = selectedChoices(settings, field);

  return (
    <SettingsRow
      title={title}
      description={description}
      value={settings && (selected.join(", ") || emptyLabel)}
      hasTVPreferredFocus={hasTVPreferredFocus}
      onPress={() => onOpen(field)}
    />
  );
}
