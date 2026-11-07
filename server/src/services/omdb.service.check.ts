import assert from "node:assert/strict";
import { omdbService } from "./omdb.service.js";

assert.equal(
  omdbService.url({ imdb_id: "tt0944947", season: 1, episode: 2, plot: undefined }, "KEY"),
  "https://www.omdbapi.com/?apikey=KEY&i=tt0944947&Season=1&Episode=2",
);

assert.equal(
  omdbService.url({ query: "heat", type: "movie", year: 1995, page: 2 }, "KEY"),
  "https://www.omdbapi.com/?apikey=KEY&s=heat&type=movie&y=1995&page=2",
);

console.log("omdb.service ok");
