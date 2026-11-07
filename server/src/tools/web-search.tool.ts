import { toolDefinition } from "@tanstack/ai";
import { z } from "zod";
import { webSearchService } from "../services/web-search.service.js";
import { withoutStatus, withStatus } from "./tool-status.js";

export const webSearchTool = toolDefinition({
  name: "web_search",
  description:
    "Search the web for anything: facts, news, reviews, release info, or details TMDB and OMDb don't have. Returns pages with their title, URL, publish date and relevant excerpts.",
  inputSchema: withStatus({
    objective: z.string().optional().meta({
      description: "What you're trying to find out, as one self-contained sentence",
    }),
    search_queries: z.array(z.string().min(1)).min(1).max(5).meta({
      description: "2 or 3 keyword queries of 3 to 6 words each, e.g. Dune Part Three release date",
    }),
    mode: z.enum(["turbo", "fast", "basic", "advanced"]).optional().meta({
      description: "Speed versus quality: turbo is fastest, advanced is best but takes a few seconds; defaults to advanced",
    }),
    max_results: z.number().int().min(1).max(20).optional().meta({ description: "Defaults to 10" }),
    location: z.string().length(2).optional().meta({
      description: "Lowercase ISO 3166-1 country code to localize results, e.g. us",
    }),
    after_date: z.iso.date().optional().meta({ description: "Only pages published on or after this date, YYYY-MM-DD" }),
    include_domains: z.array(z.string()).optional().meta({
      description: "Only search these sites, e.g. rottentomatoes.com or .gov",
    }),
    exclude_domains: z.array(z.string()).optional().meta({ description: "Never return these sites" }),
  }),
  replay: "safe",
}).server((input, context) => webSearchService.search(withoutStatus(input), context?.abortSignal));
