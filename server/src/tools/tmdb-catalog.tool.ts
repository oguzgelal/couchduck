import { z } from "zod";
import {
  collection_id,
  company_id,
  credit_id,
  end_date,
  external_id,
  external_source,
  include_adult,
  include_image_language,
  keyword_id,
  language,
  list_id,
  movie_id,
  network_id,
  page,
  review_id,
  start_date,
  watch_region,
} from "../schemas/tmdb.schema.js";
import { tmdbPrompts, tmdbTool } from "./tmdb-tool.js";

const changedIds = (what: string, path: string, name: string) =>
  tmdbTool({
    name,
    path,
    description: `Get the IDs of ${what} whose TMDB data changed in a window of up to 14 days.`,
    params: { start_date, end_date, page },
  });

export const tmdbCatalogTools = [
  tmdbTool({
    name: "genre_movie_list",
    path: "/genre/movie/list",
    description: "Get the movie genres with their IDs.",
    params: { language },
  }),
  tmdbTool({
    name: "genre_tv_list",
    path: "/genre/tv/list",
    description: "Get the TV genres with their IDs.",
    params: { language },
  }),
  tmdbTool({
    name: "certification_movie_list",
    path: "/certification/movie/list",
    description: "Get the movie age certifications of every country, with their meaning and order.",
  }),
  tmdbTool({
    name: "certification_tv_list",
    path: "/certification/tv/list",
    description: "Get the TV age certifications of every country, with their meaning and order.",
  }),
  tmdbTool({
    name: "configuration",
    path: "/configuration",
    description: "Get the image base URLs and available image sizes.",
  }),
  tmdbTool({
    name: "configuration_countries",
    path: "/configuration/countries",
    description: "Get the countries used on TMDB with their ISO 3166-1 codes.",
    params: { language },
  }),
  tmdbTool({
    name: "configuration_jobs",
    path: "/configuration/jobs",
    description: "Get the crew departments and the jobs in each.",
  }),
  tmdbTool({
    name: "configuration_languages",
    path: "/configuration/languages",
    description: "Get the languages used on TMDB with their ISO 639-1 codes.",
  }),
  tmdbTool({
    name: "configuration_primary_translations",
    path: "/configuration/primary_translations",
    description: "Get the language-region codes TMDB officially translates into, e.g. pt-BR.",
  }),
  tmdbTool({
    name: "configuration_timezones",
    path: "/configuration/timezones",
    description: "Get the time zones used in each country.",
  }),
  tmdbTool({
    name: "find_by_external_id",
    path: "/find/{external_id}",
    description:
      "Find the movies, TV series, seasons, episodes and people matching an ID from another site such as IMDb, TVDB or Wikidata.",
    params: { external_id, external_source, language },
  }),
  tmdbTool({
    name: "watch_provider_regions",
    path: "/watch/providers/regions",
    description: "Get the countries that have streaming availability data.",
    params: { language },
  }),
  tmdbTool({
    name: "watch_providers_movie",
    path: "/watch/providers/movie",
    description: "Get the streaming services that carry movies, with their provider IDs.",
    params: { language, watch_region },
  }),
  tmdbTool({
    name: "watch_providers_tv",
    path: "/watch/providers/tv",
    description: "Get the streaming services that carry TV series, with their provider IDs.",
    params: { language, watch_region },
  }),
  tmdbTool({
    name: "collection_details",
    path: "/collection/{collection_id}",
    description: "Get a movie collection, such as a franchise, with every movie in it.",
    params: { collection_id, language },
  }),
  tmdbTool({
    name: "collection_images",
    path: "/collection/{collection_id}/images",
    description: tmdbPrompts.images("a movie collection"),
    params: { collection_id, language, include_image_language },
  }),
  tmdbTool({
    name: "collection_translations",
    path: "/collection/{collection_id}/translations",
    description: tmdbPrompts.translations("a movie collection"),
    params: { collection_id },
  }),
  tmdbTool({
    name: "company_details",
    path: "/company/{company_id}",
    description: "Get a production company with its headquarters, origin country and parent company.",
    params: { company_id },
  }),
  tmdbTool({
    name: "company_alternative_names",
    path: "/company/{company_id}/alternative_names",
    description: "Get the other names a production company is known by.",
    params: { company_id },
  }),
  tmdbTool({
    name: "company_images",
    path: "/company/{company_id}/images",
    description: tmdbPrompts.images("a production company"),
    params: { company_id },
  }),
  tmdbTool({
    name: "network_details",
    path: "/network/{network_id}",
    description: "Get a TV network with its headquarters and origin country.",
    params: { network_id },
  }),
  tmdbTool({
    name: "network_alternative_names",
    path: "/network/{network_id}/alternative_names",
    description: "Get the other names a TV network is known by.",
    params: { network_id },
  }),
  tmdbTool({
    name: "network_images",
    path: "/network/{network_id}/images",
    description: tmdbPrompts.images("a TV network"),
    params: { network_id },
  }),
  tmdbTool({
    name: "keyword_details",
    path: "/keyword/{keyword_id}",
    description: "Get the name of a keyword.",
    params: { keyword_id },
  }),
  tmdbTool({
    name: "keyword_movies",
    path: "/keyword/{keyword_id}/movies",
    description: "Get the movies tagged with a keyword; tmdb_discover_movie with with_keywords filters more flexibly.",
    params: { keyword_id, include_adult, language, page },
  }),
  tmdbTool({
    name: "credit_details",
    path: "/credit/{credit_id}",
    description: "Get a single cast or crew credit with the person, the title and the role.",
    params: { credit_id },
  }),
  tmdbTool({
    name: "review_details",
    path: "/review/{review_id}",
    description: "Get a single review with its full text and author.",
    params: { review_id },
  }),
  tmdbTool({
    name: "list_details",
    path: "/list/{list_id}",
    description: "Get a public user-made list with its items.",
    params: { list_id, language, page },
  }),
  tmdbTool({
    name: "list_item_status",
    path: "/list/{list_id}/item_status",
    description: "Check whether a movie is on a public user-made list.",
    params: { list_id, language, movie_id: movie_id.optional() },
  }),
  changedIds("movies", "/movie/changes", "changes_movie"),
  changedIds("TV series", "/tv/changes", "changes_tv"),
  changedIds("people", "/person/changes", "changes_person"),
];
