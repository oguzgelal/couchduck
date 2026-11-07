import {
  appendToResponse,
  country,
  end_date,
  include_image_language,
  language,
  MOVIE_SUB_RESOURCES,
  movie_id,
  page,
  region,
  start_date,
} from "../schemas/tmdb.schema.js";
import { tmdbPrompts, tmdbTool } from "./tmdb-tool.js";

const MOVIE = "a movie";

const movieList = (name: string, path: string, description: string) =>
  tmdbTool({ name, path, description, params: { language, page, region } });

export const tmdbMovieTools = [
  movieList("movie_now_playing", "/movie/now_playing", "Get the movies playing in theaters now."),
  movieList("movie_popular", "/movie/popular", "Get the most popular movies right now."),
  movieList("movie_top_rated", "/movie/top_rated", "Get the highest rated movies of all time."),
  movieList("movie_upcoming", "/movie/upcoming", "Get the movies coming to theaters soon."),
  tmdbTool({
    name: "movie_details",
    path: "/movie/{movie_id}",
    lazy: false,
    description: tmdbPrompts.details(MOVIE),
    params: { movie_id, language, append_to_response: appendToResponse(MOVIE_SUB_RESOURCES) },
  }),
  tmdbTool({
    name: "movie_alternative_titles",
    path: "/movie/{movie_id}/alternative_titles",
    description: tmdbPrompts.alternativeTitles(MOVIE),
    params: { movie_id, country },
  }),
  tmdbTool({
    name: "movie_changes",
    path: "/movie/{movie_id}/changes",
    description: tmdbPrompts.changes(MOVIE),
    params: { movie_id, start_date, end_date, page },
  }),
  tmdbTool({
    name: "movie_credits",
    path: "/movie/{movie_id}/credits",
    description: tmdbPrompts.credits(MOVIE),
    params: { movie_id, language },
  }),
  tmdbTool({
    name: "movie_external_ids",
    path: "/movie/{movie_id}/external_ids",
    description: tmdbPrompts.externalIds(MOVIE),
    params: { movie_id },
  }),
  tmdbTool({
    name: "movie_images",
    path: "/movie/{movie_id}/images",
    description: tmdbPrompts.images(MOVIE),
    params: { movie_id, language, include_image_language },
  }),
  tmdbTool({
    name: "movie_keywords",
    path: "/movie/{movie_id}/keywords",
    description: tmdbPrompts.keywords(MOVIE),
    params: { movie_id },
  }),
  tmdbTool({ name: "movie_latest", path: "/movie/latest", description: tmdbPrompts.latest("movie") }),
  tmdbTool({
    name: "movie_lists",
    path: "/movie/{movie_id}/lists",
    description: tmdbPrompts.lists(MOVIE),
    params: { movie_id, language, page },
  }),
  tmdbTool({
    name: "movie_recommendations",
    path: "/movie/{movie_id}/recommendations",
    description: tmdbPrompts.recommendations(MOVIE),
    params: { movie_id, language, page },
  }),
  tmdbTool({
    name: "movie_release_dates",
    path: "/movie/{movie_id}/release_dates",
    description: "Get the release dates, release types and age certifications of a movie in every country.",
    params: { movie_id },
  }),
  tmdbTool({
    name: "movie_reviews",
    path: "/movie/{movie_id}/reviews",
    description: tmdbPrompts.reviews(MOVIE),
    params: { movie_id, language, page },
  }),
  tmdbTool({
    name: "movie_similar",
    path: "/movie/{movie_id}/similar",
    description: tmdbPrompts.similar(MOVIE),
    params: { movie_id, language, page },
  }),
  tmdbTool({
    name: "movie_translations",
    path: "/movie/{movie_id}/translations",
    description: tmdbPrompts.translations(MOVIE),
    params: { movie_id },
  }),
  tmdbTool({
    name: "movie_videos",
    path: "/movie/{movie_id}/videos",
    description: tmdbPrompts.videos(MOVIE),
    params: { movie_id, language },
  }),
  tmdbTool({
    name: "movie_watch_providers",
    path: "/movie/{movie_id}/watch/providers",
    description: tmdbPrompts.watchProviders(MOVIE),
    params: { movie_id },
  }),
];
