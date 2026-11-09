import { ServiceError } from "./service-error.js";

const BASE_URL = "https://api.themoviedb.org/3";

type TmdbVideo = { key: string; site: string; type: string; official?: boolean };

class TmdbService {
  async get(pathTemplate: string, params: Record<string, unknown>, signal?: AbortSignal): Promise<unknown> {
    const token = process.env.TMDB_READ_ACCESS_TOKEN;
    if (!token) throw new ServiceError("TMDB_READ_ACCESS_TOKEN is not set");
    const response = await fetch(this.url(pathTemplate, params), {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      signal,
    });
    const body = await response.json().catch(() => null);
    if (!response.ok) {
      throw new ServiceError(`TMDB responded with ${response.status}: ${body?.status_message ?? response.statusText}`);
    }
    return body;
  }

  async trailer(type: "movie" | "tv", id: number, signal?: AbortSignal): Promise<string | undefined> {
    const body = (await this.get(`/${type}/{id}/videos`, { id }, signal)) as { results?: TmdbVideo[] };
    return this.pickTrailer(body.results ?? []);
  }

  pickTrailer(videos: TmdbVideo[]): string | undefined {
    const youtube = videos.filter((video) => video.site === "YouTube");
    const rank = (video: TmdbVideo) => (video.type === "Trailer" ? 0 : 2) + (video.official ? 0 : 1);
    return youtube
      .filter((video) => video.type === "Trailer" || video.type === "Teaser")
      .sort((a, b) => rank(a) - rank(b))[0]?.key;
  }

  url(pathTemplate: string, params: Record<string, unknown>): string {
    const pathKeys = new Set<string>();
    const path = pathTemplate.replace(/\{(\w+)\}/g, (_, key: string) => {
      pathKeys.add(key);
      return encodeURIComponent(String(params[key]));
    });
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || pathKeys.has(key)) continue;
      // TMDB range filters are named like vote_average.gte; tool schemas can't portably use dots in property names.
      search.set(key.replace(/_(gte|lte)$/, ".$1"), String(value));
    }
    const queryString = search.toString();
    return `${BASE_URL}${path}${queryString ? `?${queryString}` : ""}`;
  }
}

export const tmdbService = new TmdbService();
