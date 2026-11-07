import { ServiceError } from "./service-error.js";

const BASE_URL = "https://www.omdbapi.com/";

const OMDB_PARAM_NAMES: Record<string, string> = {
  imdb_id: "i",
  title: "t",
  query: "s",
  year: "y",
  season: "Season",
  episode: "Episode",
};

class OmdbService {
  async get(params: Record<string, unknown>, signal?: AbortSignal): Promise<unknown> {
    const apiKey = process.env.OMDB_API_KEY;
    if (!apiKey) throw new ServiceError("OMDB_API_KEY is not set");
    const response = await fetch(this.url(params, apiKey), { signal });
    const body = await response.json().catch(() => null);
    if (!response.ok || body?.Response === "False") {
      throw new ServiceError(`OMDb responded with ${response.status}: ${body?.Error ?? response.statusText}`);
    }
    return body;
  }

  url(params: Record<string, unknown>, apiKey: string): string {
    const search = new URLSearchParams({ apikey: apiKey });
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) search.set(OMDB_PARAM_NAMES[key] ?? key, String(value));
    }
    return `${BASE_URL}?${search}`;
  }
}

export const omdbService = new OmdbService();
