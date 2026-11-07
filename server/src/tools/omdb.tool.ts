import { toolDefinition } from "@tanstack/ai";
import { z } from "zod";
import { omdbService } from "../services/omdb.service.js";

const FALLBACK =
  "Use it only as a fallback when the TMDB tools can't find what you need. Results include IMDb, Rotten Tomatoes and Metacritic ratings when available.";

const imdb_id = z.string().regex(/^tt\d+$/).optional().meta({
  description: "IMDb ID, e.g. tt0137523; give this or title",
});
const title = z.string().min(1).optional().meta({ description: "Exact title; give this or imdb_id" });
const type = z.enum(["movie", "series", "episode"]).optional().meta({ description: "Kind of result to return" });
const year = z.number().int().min(1800).max(9999).optional().meta({ description: "Year of release" });
const season = z.number().int().min(1).meta({ description: "Season number" });

const omdbTool = (name: string, description: string, params: z.ZodRawShape) =>
  toolDefinition({
    name: `omdb_${name}`,
    description: `${description} ${FALLBACK}`,
    inputSchema: z.object(params),
    lazy: true,
    replay: "safe",
  }).server((input, context) => omdbService.get(input as Record<string, unknown>, context?.abortSignal));

export const omdbTools = [
  omdbTool("search", "Search OMDb movies, series and episodes by title, 10 results per page.", {
    query: z.string().min(1).meta({ description: "Title to search for" }),
    type,
    year,
    page: z.number().int().min(1).max(100).optional().meta({ description: "Results page; defaults to 1" }),
  }),
  omdbTool("title", "Get the OMDb details of a movie, series or episode by IMDb ID or exact title.", {
    imdb_id,
    title,
    type,
    year,
    plot: z.enum(["short", "full"]).optional().meta({ description: "Plot length; defaults to short" }),
  }),
  omdbTool("season", "Get the OMDb episode list of one season of a series, with each episode's IMDb rating.", {
    imdb_id,
    title,
    season,
  }),
  omdbTool("episode", "Get the OMDb details of one episode of a series by its season and episode number.", {
    imdb_id,
    title,
    season,
    episode: z.number().int().min(1).meta({ description: "Episode number within the season" }),
  }),
];
