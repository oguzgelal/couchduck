import assert from "node:assert/strict";
import { tmdbService } from "./tmdb.service.js";

assert.equal(
  tmdbService.url("/tv/{series_id}/season/{season_number}", { series_id: 1396, season_number: 0, language: undefined }),
  "https://api.themoviedb.org/3/tv/1396/season/0",
);

assert.equal(
  tmdbService.url("/discover/movie", {
    with_genres: "28|12",
    vote_average_gte: 7.5,
    primary_release_date_lte: "2020-01-01",
    include_adult: false,
  }),
  "https://api.themoviedb.org/3/discover/movie?with_genres=28%7C12&vote_average.gte=7.5&primary_release_date.lte=2020-01-01&include_adult=false",
);

assert.equal(
  tmdbService.url("/movie/{movie_id}", { movie_id: 550, append_to_response: ["credits", "watch/providers"] }),
  "https://api.themoviedb.org/3/movie/550?append_to_response=credits%2Cwatch%2Fproviders",
);

assert.equal(
  tmdbService.pickTrailer([
    { key: "teaser", site: "YouTube", type: "Teaser", official: true },
    { key: "fan", site: "YouTube", type: "Trailer", official: false },
    { key: "vimeo", site: "Vimeo", type: "Trailer", official: true },
    { key: "official", site: "YouTube", type: "Trailer", official: true },
    { key: "clip", site: "YouTube", type: "Clip", official: true },
  ]),
  "official",
);

assert.equal(tmdbService.pickTrailer([{ key: "clip", site: "YouTube", type: "Clip" }]), undefined);

console.log("tmdb.service ok");
