import { COUNTRY_CODES, countryFlag, countryLanguages, countryName, languageName } from "../../config/countries";
import { ChoicePicker, type ChoiceItem, type ChoicePickerSelectionProps } from "./choice-picker";

const LANGUAGE_ITEMS: ChoiceItem[] = COUNTRY_CODES.flatMap((code) =>
  countryLanguages(code).map((language) => ({
    value: `${language}-${code}`,
    label: languageName(language),
    detail: countryName(code),
    flag: countryFlag(code),
  })),
).sort((a, b) => a.label.localeCompare(b.label) || a.detail.localeCompare(b.detail));

export function ChoicePickerLanguage(props: ChoicePickerSelectionProps) {
  return <ChoicePicker items={LANGUAGE_ITEMS} {...props} />;
}
