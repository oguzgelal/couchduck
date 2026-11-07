import assert from "node:assert/strict";
import { personService } from "./person.service.js";

const empty = personService.describePreferences({});
assert.equal(empty.at(-1), "- (none set, search everything)");

const lines = personService.describePreferences({
  country: "Japan",
  dislikes: ["Horror", "Gore"],
  formats: [],
  subtitleLanguages: ["English (Canada)"],
});
assert.equal(lines.length, 4);
assert.match(lines[0], /overrides these/);
assert.match(lines[1], /^- Country: Japan\./);
assert.match(lines[2], /^- Avoid: Horror, Gore\./);
assert.match(lines[3], /^- Subtitle languages: English \(Canada\)\./);

console.log("describePreferences ok");
