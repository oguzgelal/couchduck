import { z } from "zod";
import { ServiceError } from "./service-error.js";

const SEARCH_URL = "https://api.parallel.ai/v1/search";
const MAX_EXCERPT_CHARS_TOTAL = 12_000;

const searchResponseSchema = z.object({
  results: z.array(
    z.object({
      url: z.string(),
      title: z.string().nullish(),
      publish_date: z.string().nullish(),
      excerpts: z.array(z.string()).nullish(),
    }),
  ),
});

export type WebSearchRequest = {
  objective?: string;
  search_queries: string[];
  mode?: "turbo" | "fast" | "basic" | "advanced";
  max_results?: number;
  location?: string;
  after_date?: string;
  include_domains?: string[];
  exclude_domains?: string[];
};

class WebSearchService {
  async search(request: WebSearchRequest, signal?: AbortSignal) {
    const apiKey = process.env.PARALLEL_API_KEY;
    if (!apiKey) throw new ServiceError("PARALLEL_API_KEY is not set");
    const response = await fetch(SEARCH_URL, {
      method: "POST",
      headers: { "x-api-key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify(this.body(request)),
      signal,
    });
    if (!response.ok) {
      throw new ServiceError(`Web search responded with ${response.status}: ${await response.text()}`);
    }
    return searchResponseSchema.parse(await response.json());
  }

  private body({ objective, search_queries, mode, max_results, location, after_date, include_domains, exclude_domains }: WebSearchRequest) {
    const hasSourcePolicy = Boolean(after_date || include_domains?.length || exclude_domains?.length);
    return {
      objective,
      search_queries,
      mode,
      max_chars_total: MAX_EXCERPT_CHARS_TOTAL,
      advanced_settings: {
        max_results,
        location,
        source_policy: hasSourcePolicy ? { after_date, include_domains, exclude_domains } : undefined,
      },
    };
  }
}

export const webSearchService = new WebSearchService();
