import { COUNTRY_CODES, countryFlag, countryName } from "../../config/countries";
import { ChoicePicker, type ChoiceItem, type ChoicePickerSelectionProps } from "./choice-picker";

const COUNTRY_ITEMS: ChoiceItem[] = COUNTRY_CODES.map((code) => ({
  value: code,
  label: countryName(code),
  flag: countryFlag(code),
})).sort((a, b) => a.label.localeCompare(b.label));

export function ChoicePickerCountry(props: ChoicePickerSelectionProps) {
  return <ChoicePicker items={COUNTRY_ITEMS} {...props} />;
}
