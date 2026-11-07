import { z } from "zod";

const tmdbId = (of: string) => z.number().int().positive().meta({ description: `TMDB ID of the ${of}` });

const countryCode = (use: string) =>
  z.string().length(2).optional().meta({ description: `ISO 3166-1 country code, e.g. US, ${use}` });

const languageList = (of: string) =>
  z.array(z.string()).optional().meta({
    description: `ISO 639-1 languages of the ${of} to include, e.g. ["en", "null"]; "null" matches ${of} without a language`,
  });

const isoDate = (description: string) => z.iso.date().optional().meta({ description: `${description}, YYYY-MM-DD` });

const anyOrAll = (of: string) =>
  z.string().optional().meta({
    description: `${of}; join with , to require all of them or | to match any, e.g. 28,12 or 28|12`,
  });

const excluded = (of: string) => z.string().optional().meta({ description: `Comma-separated ${of} to exclude` });

const range = <T extends z.ZodNumber | z.ZodISODate>(schema: T, of: string) => ({
  gte: schema.optional().meta({ description: `Minimum ${of}` }),
  lte: schema.optional().meta({ description: `Maximum ${of}` }),
});

export const movie_id = tmdbId("movie");
export const series_id = tmdbId("TV series");
export const season_number = z.number().int().min(0).meta({ description: "Season number within the series; 0 is specials" });
export const episode_number = z.number().int().min(1).meta({ description: "Episode number within the season" });
export const season_id = tmdbId("TV season, not its season number");
export const episode_id = tmdbId("TV episode, not its episode number");
export const person_id = tmdbId("person");
export const collection_id = tmdbId("collection");
export const company_id = tmdbId("company");
export const network_id = tmdbId("TV network");
export const keyword_id = tmdbId("keyword");
export const list_id = tmdbId("user-made list");
export const credit_id = z.string().meta({ description: "credit_id of a cast or crew entry" });
export const review_id = z.string().meta({ description: "TMDB ID of the review" });
export const tv_episode_group_id = z.string().meta({ description: "TMDB ID of the episode group" });

export const query = z.string().min(1).meta({ description: "Text to search for" });
export const page = z.number().int().min(1).max(500).optional().meta({
  description: "Results page, 20 results each; defaults to 1",
});
export const language = z.string().optional().meta({
  description: "Language of the returned text as ISO 639-1, optionally with an ISO 3166-1 region, e.g. en-US or pt-BR; defaults to en-US",
});
export const region = countryCode("to show release dates and results for that country");
export const watch_region = countryCode("whose streaming availability to use");
export const country = countryCode("to keep only that country's results");
export const include_adult = z.boolean().optional().meta({ description: "Include adult content; defaults to false" });
export const include_image_language = languageList("images");
export const include_video_language = languageList("videos");
export const start_date = isoDate("Start of the change window; the window spans at most 14 days and defaults to the last 24 hours");
export const end_date = isoDate("End of the change window");
export const time_window = z.enum(["day", "week"]).meta({ description: "Trending over the last day or week" });
export const timezone = z.string().optional().meta({
  description: "IANA time zone deciding which day counts as today, e.g. America/New_York",
});
export const external_id = z.string().meta({ description: "The ID on the other site, e.g. tt0137523" });
export const external_source = z
  .enum(["imdb_id", "facebook_id", "instagram_id", "tvdb_id", "tiktok_id", "twitter_id", "wikidata_id", "youtube_id"])
  .meta({ description: "Site the ID comes from" });

export const appendToResponse = (subResources: readonly [string, ...string[]]) =>
  z.array(z.enum(subResources)).max(20).optional().meta({
    description: "Extra data to include in the same response under keys of the same name, saving separate calls",
  });

export const MOVIE_SUB_RESOURCES = [
  "alternative_titles",
  "changes",
  "credits",
  "external_ids",
  "images",
  "keywords",
  "lists",
  "recommendations",
  "release_dates",
  "reviews",
  "similar",
  "translations",
  "videos",
  "watch/providers",
] as const;

export const TV_SUB_RESOURCES = [
  "aggregate_credits",
  "alternative_titles",
  "changes",
  "content_ratings",
  "credits",
  "episode_groups",
  "external_ids",
  "images",
  "keywords",
  "lists",
  "recommendations",
  "reviews",
  "screened_theatrically",
  "similar",
  "translations",
  "videos",
  "watch/providers",
] as const;

export const TV_SEASON_SUB_RESOURCES = [
  "aggregate_credits",
  "changes",
  "credits",
  "external_ids",
  "images",
  "translations",
  "videos",
  "watch/providers",
] as const;

export const TV_EPISODE_SUB_RESOURCES = ["changes", "credits", "external_ids", "images", "translations", "videos"] as const;

export const PERSON_SUB_RESOURCES = [
  "changes",
  "combined_credits",
  "external_ids",
  "images",
  "movie_credits",
  "tagged_images",
  "translations",
  "tv_credits",
] as const;

const voteAverage = range(z.number().min(0).max(10), "average rating, 0 to 10");
const voteCount = range(z.number().int().min(0), "number of ratings");
const runtime = range(z.number().int().min(0), "runtime in minutes");

export const discoverFilters = {
  page,
  language,
  include_adult,
  vote_average_gte: voteAverage.gte,
  vote_average_lte: voteAverage.lte,
  vote_count_gte: voteCount.gte,
  vote_count_lte: voteCount.lte,
  with_runtime_gte: runtime.gte,
  with_runtime_lte: runtime.lte,
  with_genres: anyOrAll("Genre IDs"),
  without_genres: excluded("genre IDs"),
  with_keywords: anyOrAll("Keyword IDs"),
  without_keywords: excluded("keyword IDs"),
  with_companies: anyOrAll("Production company IDs"),
  without_companies: excluded("production company IDs"),
  with_origin_country: z.string().optional().meta({ description: "ISO 3166-1 country code of origin, e.g. KR" }),
  with_original_language: z.string().optional().meta({ description: "ISO 639-1 original language, e.g. ja" }),
  watch_region,
  with_watch_providers: anyOrAll("Streaming provider IDs, needs watch_region"),
  without_watch_providers: excluded("streaming provider IDs"),
  with_watch_monetization_types: anyOrAll(
    "How it is offered, needs watch_region: flatrate (subscription), free, ads, rent, buy",
  ),
};

const releaseDate = range(z.iso.date(), "release date in any country, YYYY-MM-DD");
const primaryReleaseDate = range(z.iso.date(), "first release date, YYYY-MM-DD");

export const discoverMovieFilters = {
  ...discoverFilters,
  sort_by: z
    .enum([
      "popularity.desc",
      "popularity.asc",
      "vote_average.desc",
      "vote_average.asc",
      "vote_count.desc",
      "vote_count.asc",
      "primary_release_date.desc",
      "primary_release_date.asc",
      "revenue.desc",
      "revenue.asc",
      "title.asc",
      "title.desc",
      "original_title.asc",
      "original_title.desc",
    ])
    .optional()
    .meta({ description: "Defaults to popularity.desc" }),
  region,
  include_video: z.boolean().optional().meta({ description: "Include video-only releases; defaults to false" }),
  year: z.number().int().optional().meta({ description: "Released in this year in any country" }),
  primary_release_year: z.number().int().optional().meta({ description: "First released in this year" }),
  primary_release_date_gte: primaryReleaseDate.gte,
  primary_release_date_lte: primaryReleaseDate.lte,
  release_date_gte: releaseDate.gte,
  release_date_lte: releaseDate.lte,
  with_release_type: anyOrAll(
    "Release types: 1 premiere, 2 limited theatrical, 3 theatrical, 4 digital, 5 physical, 6 TV; combine with region",
  ),
  certification_country: countryCode("whose age certifications the certification filters use"),
  certification: z.string().optional().meta({ description: "Exact age certification, e.g. PG-13; needs certification_country" }),
  certification_gte: z.string().optional().meta({ description: "Minimum age certification; needs certification_country" }),
  certification_lte: z.string().optional().meta({ description: "Maximum age certification; needs certification_country" }),
  with_cast: anyOrAll("Person IDs who act in it"),
  with_crew: anyOrAll("Person IDs who worked on it as crew"),
  with_people: anyOrAll("Person IDs who act in it or worked on it"),
};

const airDate = range(z.iso.date(), "episode air date, YYYY-MM-DD");
const firstAirDate = range(z.iso.date(), "first air date, YYYY-MM-DD");

export const discoverTvFilters = {
  ...discoverFilters,
  sort_by: z
    .enum([
      "popularity.desc",
      "popularity.asc",
      "vote_average.desc",
      "vote_average.asc",
      "vote_count.desc",
      "vote_count.asc",
      "first_air_date.desc",
      "first_air_date.asc",
      "name.asc",
      "name.desc",
      "original_name.asc",
      "original_name.desc",
    ])
    .optional()
    .meta({ description: "Defaults to popularity.desc" }),
  timezone,
  air_date_gte: airDate.gte,
  air_date_lte: airDate.lte,
  first_air_date_year: z.number().int().optional().meta({ description: "First aired in this year" }),
  first_air_date_gte: firstAirDate.gte,
  first_air_date_lte: firstAirDate.lte,
  include_null_first_air_dates: z.boolean().optional().meta({
    description: "Include series without a first air date; defaults to false",
  }),
  screened_theatrically: z.boolean().optional().meta({ description: "Only series with episodes shown in theaters" }),
  with_networks: z.number().int().optional().meta({ description: "TV network ID" }),
  with_status: anyOrAll(
    "Series status: 0 returning series, 1 planned, 2 in production, 3 ended, 4 canceled, 5 pilot",
  ),
  with_type: anyOrAll(
    "Series type: 0 documentary, 1 news, 2 miniseries, 3 reality, 4 scripted, 5 talk show, 6 video",
  ),
};
