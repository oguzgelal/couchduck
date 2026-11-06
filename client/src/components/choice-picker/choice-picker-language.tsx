import { COUNTRIES, countryFlag } from "../../config/countries";
import { ChoicePicker, type ChoiceItem, type ChoicePickerSelectionProps } from "./choice-picker";

const LANGUAGE_ITEMS: ChoiceItem[] = COUNTRIES.flatMap(({ code, name, languages }) =>
  languages.map((language) => ({
    value: `${language} (${name})`,
    label: language,
    detail: name,
    flag: countryFlag(code),
  })),
).sort((a, b) => a.label.localeCompare(b.label) || a.detail.localeCompare(b.detail));

export function ChoicePickerLanguage(props: ChoicePickerSelectionProps) {
  return <ChoicePicker items={LANGUAGE_ITEMS} {...props} />;
}
