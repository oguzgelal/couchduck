import { COUNTRIES, countryFlag } from "../../config/countries";
import { ChoicePicker, type ChoiceItem, type ChoicePickerSelectionProps } from "./choice-picker";

const COUNTRY_ITEMS: ChoiceItem[] = COUNTRIES.map(({ code, name }) => ({
  value: name,
  label: name,
  flag: countryFlag(code),
})).sort((a, b) => a.label.localeCompare(b.label));

export function ChoicePickerCountry(props: ChoicePickerSelectionProps) {
  return <ChoicePicker items={COUNTRY_ITEMS} {...props} />;
}
