import { countries, getEmojiFlag, languages, type TCountryCode, type TLanguageCode } from "countries-list";

export const COUNTRY_CODES = (Object.keys(countries) as TCountryCode[]).filter(
  (code) => !countries[code].userAssigned,
);

export function countryName(code: string) {
  return countries[code as TCountryCode]?.name ?? code;
}

export function countryLanguages(code: TCountryCode) {
  return countries[code].languages;
}

export function countryFlag(code: TCountryCode) {
  return getEmojiFlag(code);
}

export function languageName(code: string) {
  return languages[code as TLanguageCode]?.name ?? code;
}

export function languageTagName(tag: string) {
  const [language, region] = tag.split("-");
  return region ? `${languageName(language)} (${countryName(region)})` : languageName(language);
}
