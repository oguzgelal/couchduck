import type { Person } from "../person/types";
import type { Ratings } from "./ratings-row";

export type Media = {
  title: string;
  type?: "movie" | "tv";
  image?: string;
  backdrop?: string;
  year?: number;
  length?: string;
  genres?: string[];
  ratings?: Ratings;
  overview?: string;
  reason?: string;
  watchOn?: string[];
  cast?: Person[];
};

export type MediaList = {
  heading?: string;
  items: Media[];
};
