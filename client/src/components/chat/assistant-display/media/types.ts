import type { Person } from "../person/types";
import type { Ratings } from "./ratings-row";

export type Media = {
  title: string;
  type?: "movie" | "tv";
  tmdbId?: number;
  image?: string;
  backdrop?: string;
  year?: number;
  length?: string;
  genres?: string[];
  ratings?: Ratings;
  overview?: string;
  reason?: string;
  watchOn?: string[];
  trailer?: string;
  cast?: Person[];
};

export type MediaList = {
  heading?: string;
  items: Media[];
};
