import assert from "node:assert/strict";
import { parseStoredPreferences, SETTING_NAMES } from "../schemas/settings.schema.js";
import { personService } from "./person.service.js";

const empty = personService.describePreferences({});
assert.equal(empty.at(-1), "- (none set, search everything)");

const lines = personService.describePreferences({
  country: "CA",
  dislikes: ["Horror", "Gore"],
  formats: [],
  subtitleLanguages: ["fr-CA", "en"],
});
assert.equal(lines.length, 4);
assert.match(lines[0], /overrides these/);
assert.match(lines[1], /^- Country: Canada\./);
assert.match(lines[2], /^- Avoid: Horror, Gore\./);
assert.match(lines[3], /^- Subtitle languages: French \(Canada\), English\./);

assert.deepEqual(
  parseStoredPreferences({ country: "Japan", languages: ["French (Canada)"], genres: ["Drama"] }),
  { genres: ["Drama"] },
);
assert.deepEqual(parseStoredPreferences(null), {});

assert.ok(SETTING_NAMES.includes("subtitle languages"));
assert.ok(SETTING_NAMES.includes("name"));

console.log("person.service ok");
