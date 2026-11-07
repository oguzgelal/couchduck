import { z } from "zod";
import {
  discoverMovieFilters,
  discoverTvFilters,
  include_adult,
  language,
  page,
  query,
  region,
  time_window,
} from "../schemas/tmdb.schema.js";
import { tmdbTool } from "./tmdb-tool.js";

const year = (description: string) => z.number().int().min(1000).max(9999).optional().meta({ description });

const ID_LOOKUPS =
  "Look up IDs first: genres with tmdb_genre_movie_list or tmdb_genre_tv_list, people with tmdb_search_person, keywords with tmdb_search_keyword, companies with tmdb_search_company and streaming providers with tmdb_watch_providers_movie or tmdb_watch_providers_tv.";

const trending = (what: string, path: string, name: string, lazy = true) =>
  tmdbTool({
    name,
    path,
    lazy,
    description: `Get the ${what} trending on TMDB today or this week.`,
    params: { time_window, language },
  });

export const tmdbSearchTools = [
  tmdbTool({
    name: "search_multi",
    path: "/search/multi",
    lazy: false,
    description:
      "Search movies, TV series and people at once by name. Each result has a media_type of movie, tv or person.",
    params: { query, include_adult, language, page },
  }),
  tmdbTool({
    name: "search_movie",
    path: "/search/movie",
    lazy: false,
    description: "Search movies by their original, translated and alternative titles.",
    params: {
      query,
      include_adult,
      language,
      page,
      region,
      year: year("Released in this year in any country"),
      primary_release_year: year("First released in this year"),
    },
  }),
  tmdbTool({
    name: "search_tv",
    path: "/search/tv",
    lazy: false,
    description: "Search TV series by their original, translated and also-known-as names.",
    params: {
      query,
      include_adult,
      language,
      page,
      year: year("Aired an episode in this year"),
      first_air_date_year: year("First aired in this year"),
    },
  }),
  tmdbTool({
    name: "search_person",
    path: "/search/person",
    lazy: false,
    description: "Search people such as actors and directors by name or also-known-as names.",
    params: { query, include_adult, language, page },
  }),
  tmdbTool({
    name: "search_collection",
    path: "/search/collection",
    description: "Search movie collections such as franchises and series of films by name.",
    params: { query, include_adult, language, page, region },
  }),
  tmdbTool({
    name: "search_company",
    path: "/search/company",
    description: "Search production companies by name, to get IDs for discover filters.",
    params: { query, page },
  }),
  tmdbTool({
    name: "search_keyword",
    path: "/search/keyword",
    description: "Search keywords such as time travel or based on novel by name, to get IDs for discover filters.",
    params: { query, page },
  }),
  tmdbTool({
    name: "discover_movie",
    path: "/discover/movie",
    lazy: false,
    description: `Find movies by any combination of genre, year, release date, rating, runtime, cast, crew, keywords, company, language, age certification and streaming availability, in a chosen order. ${ID_LOOKUPS}`,
    params: discoverMovieFilters,
  }),
  tmdbTool({
    name: "discover_tv",
    path: "/discover/tv",
    lazy: false,
    description: `Find TV series by any combination of genre, air date, rating, runtime, keywords, network, company, language, status, type and streaming availability, in a chosen order. ${ID_LOOKUPS}`,
    params: discoverTvFilters,
  }),
  trending("movies, TV series and people", "/trending/all/{time_window}", "trending_all", false),
  trending("movies", "/trending/movie/{time_window}", "trending_movies"),
  trending("TV series", "/trending/tv/{time_window}", "trending_tv"),
  trending("people", "/trending/person/{time_window}", "trending_people"),
];
