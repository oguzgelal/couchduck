import { countries, languages, type TCountryCode, type TLanguageCode } from "countries-list";

export function regionName(code: string) {
  return countries[code as TCountryCode]?.name ?? code;
}

export function languageName(tag: string) {
  const [language, region] = tag.split("-");
  const name = languages[language as TLanguageCode]?.name ?? language;
  return region ? `${name} (${regionName(region)})` : name;
}
