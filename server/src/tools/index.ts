import { askUserQuestionTool } from "./ask-user-question.tool.js";
import { currentTimeTool } from "./current-time.tool.js";
import { showMediasTool, showMediaTool, showPersonsTool, showPersonTool } from "./display.tool.js";
import { omdbTools } from "./omdb.tool.js";
import { thinkTool } from "./think.tool.js";
import { tmdbCatalogTools } from "./tmdb-catalog.tool.js";
import { tmdbMovieTools } from "./tmdb-movie.tool.js";
import { tmdbPersonTools } from "./tmdb-person.tool.js";
import { tmdbSearchTools } from "./tmdb-search.tool.js";
import { tmdbTvEpisodeTools, tmdbTvSeasonTools, tmdbTvSeriesTools } from "./tmdb-tv.tool.js";
import { updateSettingsTool } from "./update-settings.tool.js";
import { upsertMemoryTool } from "./upsert-memory.tool.js";
import { weatherTool } from "./weather.tool.js";
import { webSearchTool } from "./web-search.tool.js";

export const chatTools = [
  thinkTool,
  askUserQuestionTool,
  currentTimeTool,
  weatherTool,
  webSearchTool,
  upsertMemoryTool,
  updateSettingsTool,
  showMediaTool,
  showMediasTool,
  showPersonTool,
  showPersonsTool,
  ...tmdbSearchTools,
  ...tmdbMovieTools,
  ...tmdbTvSeriesTools,
  ...tmdbTvSeasonTools,
  ...tmdbTvEpisodeTools,
  ...tmdbPersonTools,
  ...tmdbCatalogTools,
  ...omdbTools,
];
