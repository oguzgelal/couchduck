import {
  appendToResponse,
  end_date,
  episode_id,
  episode_number,
  include_image_language,
  include_video_language,
  language,
  page,
  season_id,
  season_number,
  series_id,
  start_date,
  timezone,
  TV_EPISODE_SUB_RESOURCES,
  tv_episode_group_id,
  TV_SEASON_SUB_RESOURCES,
  TV_SUB_RESOURCES,
} from "../schemas/tmdb.schema.js";
import { tmdbPrompts, tmdbTool } from "./tmdb-tool.js";

const SERIES = "a TV series";
const SEASON = "a TV season";
const EPISODE = "a TV episode";

const SERIES_PATH = "/tv/{series_id}";
const SEASON_PATH = `${SERIES_PATH}/season/{season_number}`;
const EPISODE_PATH = `${SEASON_PATH}/episode/{episode_number}`;

const seasonParams = { series_id, season_number };
const episodeParams = { series_id, season_number, episode_number };

export const tmdbTvSeriesTools = [
  tmdbTool({
    name: "tv_airing_today",
    path: "/tv/airing_today",
    description: "Get the TV series with an episode airing today.",
    params: { language, page, timezone },
  }),
  tmdbTool({
    name: "tv_on_the_air",
    path: "/tv/on_the_air",
    description: "Get the TV series with an episode airing in the next 7 days.",
    params: { language, page, timezone },
  }),
  tmdbTool({
    name: "tv_popular",
    path: "/tv/popular",
    description: "Get the most popular TV series right now.",
    params: { language, page },
  }),
  tmdbTool({
    name: "tv_top_rated",
    path: "/tv/top_rated",
    description: "Get the highest rated TV series of all time.",
    params: { language, page },
  }),
  tmdbTool({
    name: "tv_details",
    path: SERIES_PATH,
    lazy: false,
    description: `${tmdbPrompts.details(SERIES)} The result lists its seasons and the last and next episode to air.`,
    params: { series_id, language, append_to_response: appendToResponse(TV_SUB_RESOURCES) },
  }),
  tmdbTool({
    name: "tv_aggregate_credits",
    path: `${SERIES_PATH}/aggregate_credits`,
    description: tmdbPrompts.aggregateCredits(SERIES),
    params: { series_id, language },
  }),
  tmdbTool({
    name: "tv_alternative_titles",
    path: `${SERIES_PATH}/alternative_titles`,
    description: tmdbPrompts.alternativeTitles(SERIES),
    params: { series_id },
  }),
  tmdbTool({
    name: "tv_changes",
    path: `${SERIES_PATH}/changes`,
    description: tmdbPrompts.changes(SERIES),
    params: { series_id, start_date, end_date, page },
  }),
  tmdbTool({
    name: "tv_content_ratings",
    path: `${SERIES_PATH}/content_ratings`,
    description: "Get the age ratings of a TV series in every country.",
    params: { series_id },
  }),
  tmdbTool({
    name: "tv_credits",
    path: `${SERIES_PATH}/credits`,
    description: `${tmdbPrompts.credits(SERIES)} Covers only the latest season; use tmdb_tv_aggregate_credits for every season.`,
    params: { series_id, language },
  }),
  tmdbTool({
    name: "tv_episode_groups",
    path: `${SERIES_PATH}/episode_groups`,
    description:
      "Get the alternative episode orderings of a TV series, such as story arcs, DVD order or production order.",
    params: { series_id },
  }),
  tmdbTool({
    name: "tv_external_ids",
    path: `${SERIES_PATH}/external_ids`,
    description: tmdbPrompts.externalIds(SERIES),
    params: { series_id },
  }),
  tmdbTool({
    name: "tv_images",
    path: `${SERIES_PATH}/images`,
    description: tmdbPrompts.images(SERIES),
    params: { series_id, language, include_image_language },
  }),
  tmdbTool({
    name: "tv_keywords",
    path: `${SERIES_PATH}/keywords`,
    description: tmdbPrompts.keywords(SERIES),
    params: { series_id },
  }),
  tmdbTool({ name: "tv_latest", path: "/tv/latest", description: tmdbPrompts.latest("TV series") }),
  tmdbTool({
    name: "tv_lists",
    path: `${SERIES_PATH}/lists`,
    description: tmdbPrompts.lists(SERIES),
    params: { series_id, language, page },
  }),
  tmdbTool({
    name: "tv_recommendations",
    path: `${SERIES_PATH}/recommendations`,
    description: tmdbPrompts.recommendations(SERIES),
    params: { series_id, language, page },
  }),
  tmdbTool({
    name: "tv_reviews",
    path: `${SERIES_PATH}/reviews`,
    description: tmdbPrompts.reviews(SERIES),
    params: { series_id, language, page },
  }),
  tmdbTool({
    name: "tv_screened_theatrically",
    path: `${SERIES_PATH}/screened_theatrically`,
    description: "Get the seasons and episodes of a TV series that were shown in theaters.",
    params: { series_id },
  }),
  tmdbTool({
    name: "tv_similar",
    path: `${SERIES_PATH}/similar`,
    description: tmdbPrompts.similar(SERIES),
    params: { series_id, language, page },
  }),
  tmdbTool({
    name: "tv_translations",
    path: `${SERIES_PATH}/translations`,
    description: tmdbPrompts.translations(SERIES),
    params: { series_id },
  }),
  tmdbTool({
    name: "tv_videos",
    path: `${SERIES_PATH}/videos`,
    description: tmdbPrompts.videos(SERIES),
    params: { series_id, language, include_video_language },
  }),
  tmdbTool({
    name: "tv_watch_providers",
    path: `${SERIES_PATH}/watch/providers`,
    description: tmdbPrompts.watchProviders(SERIES),
    params: { series_id },
  }),
];

export const tmdbTvSeasonTools = [
  tmdbTool({
    name: "tv_season_details",
    path: SEASON_PATH,
    description: `${tmdbPrompts.details(SEASON)} The result lists its episodes.`,
    params: { ...seasonParams, language, append_to_response: appendToResponse(TV_SEASON_SUB_RESOURCES) },
  }),
  tmdbTool({
    name: "tv_season_aggregate_credits",
    path: `${SEASON_PATH}/aggregate_credits`,
    description: tmdbPrompts.aggregateCredits(SEASON),
    params: { ...seasonParams, language },
  }),
  tmdbTool({
    name: "tv_season_changes",
    path: "/tv/season/{season_id}/changes",
    description: tmdbPrompts.changes(SEASON),
    params: { season_id, start_date, end_date, page },
  }),
  tmdbTool({
    name: "tv_season_credits",
    path: `${SEASON_PATH}/credits`,
    description: tmdbPrompts.credits(SEASON),
    params: { ...seasonParams, language },
  }),
  tmdbTool({
    name: "tv_season_external_ids",
    path: `${SEASON_PATH}/external_ids`,
    description: tmdbPrompts.externalIds(SEASON),
    params: seasonParams,
  }),
  tmdbTool({
    name: "tv_season_images",
    path: `${SEASON_PATH}/images`,
    description: tmdbPrompts.images(SEASON),
    params: { ...seasonParams, language, include_image_language },
  }),
  tmdbTool({
    name: "tv_season_translations",
    path: `${SEASON_PATH}/translations`,
    description: tmdbPrompts.translations(SEASON),
    params: seasonParams,
  }),
  tmdbTool({
    name: "tv_season_videos",
    path: `${SEASON_PATH}/videos`,
    description: tmdbPrompts.videos(SEASON),
    params: { ...seasonParams, language, include_video_language },
  }),
  tmdbTool({
    name: "tv_season_watch_providers",
    path: `${SEASON_PATH}/watch/providers`,
    description: tmdbPrompts.watchProviders(SEASON),
    params: { ...seasonParams, language },
  }),
];

export const tmdbTvEpisodeTools = [
  tmdbTool({
    name: "tv_episode_details",
    path: EPISODE_PATH,
    description: tmdbPrompts.details(EPISODE),
    params: { ...episodeParams, language, append_to_response: appendToResponse(TV_EPISODE_SUB_RESOURCES) },
  }),
  tmdbTool({
    name: "tv_episode_changes",
    path: "/tv/episode/{episode_id}/changes",
    description: tmdbPrompts.changes(EPISODE),
    params: { episode_id },
  }),
  tmdbTool({
    name: "tv_episode_credits",
    path: `${EPISODE_PATH}/credits`,
    description: `${tmdbPrompts.credits(EPISODE)} Includes guest stars.`,
    params: { ...episodeParams, language },
  }),
  tmdbTool({
    name: "tv_episode_external_ids",
    path: `${EPISODE_PATH}/external_ids`,
    description: tmdbPrompts.externalIds(EPISODE),
    params: episodeParams,
  }),
  tmdbTool({
    name: "tv_episode_images",
    path: `${EPISODE_PATH}/images`,
    description: tmdbPrompts.images(EPISODE),
    params: { ...episodeParams, language, include_image_language },
  }),
  tmdbTool({
    name: "tv_episode_translations",
    path: `${EPISODE_PATH}/translations`,
    description: tmdbPrompts.translations(EPISODE),
    params: episodeParams,
  }),
  tmdbTool({
    name: "tv_episode_videos",
    path: `${EPISODE_PATH}/videos`,
    description: tmdbPrompts.videos(EPISODE),
    params: { ...episodeParams, language, include_video_language },
  }),
  tmdbTool({
    name: "tv_episode_group_details",
    path: "/tv/episode_group/{tv_episode_group_id}",
    description: "Get an episode group of a TV series with its groups and the episodes in each, in that ordering.",
    params: { tv_episode_group_id },
  }),
];
