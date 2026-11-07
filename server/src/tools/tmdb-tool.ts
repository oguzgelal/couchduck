import { toolDefinition } from "@tanstack/ai";
import { z } from "zod";
import { tmdbService } from "../services/tmdb.service.js";

type TmdbToolConfig = {
  name: string;
  description: string;
  path: string;
  params?: z.ZodRawShape;
  lazy?: boolean;
};

export const tmdbTool = ({ name, description, path, params = {}, lazy = true }: TmdbToolConfig) =>
  toolDefinition({
    name: `tmdb_${name}`,
    description,
    inputSchema: z.object(params),
    lazy,
    replay: "safe",
  }).server((input, context) => tmdbService.get(path, input as Record<string, unknown>, context?.abortSignal));

const IMAGE_URL_HINT =
  "Build image URLs as https://image.tmdb.org/t/p/<size>/<file_path>, with size w92, w185, w300, w500, w780, w1280 or original.";

export const tmdbPrompts = {
  details: (of: string) =>
    `Get the full details of ${of}. Use append_to_response to fetch related data such as credits, videos or watch providers in the same call. ${IMAGE_URL_HINT}`,
  credits: (of: string) => `Get the cast and crew of ${of}, with character names and jobs.`,
  aggregateCredits: (of: string) =>
    `Get everyone who appeared in or worked on ${of} across all its episodes, with every role they played and how many episodes each.`,
  alternativeTitles: (of: string) => `Get the other titles ${of} is known by, per country.`,
  changes: (of: string) => `Get the edits made to the TMDB data of ${of} in a window of up to 14 days.`,
  externalIds: (of: string) =>
    `Get the IDs of ${of} on other sites such as IMDb, TVDB, Wikidata, Facebook, Instagram and X.`,
  images: (of: string) => `Get the posters, backdrops, logos or stills of ${of}. ${IMAGE_URL_HINT}`,
  keywords: (of: string) => `Get the keywords tagged on ${of}, useful as discover filters for finding similar titles.`,
  latest: (of: string) => `Get the ${of} most recently added to TMDB, which changes constantly.`,
  lists: (of: string) => `Get the public user-made lists that include ${of}.`,
  recommendations: (of: string) =>
    `Get titles TMDB recommends to people who liked ${of}, based on what its audience also watched.`,
  reviews: (of: string) => `Get the user reviews of ${of}.`,
  similar: (of: string) => `Get titles similar to ${of}, matched on genres and keywords.`,
  translations: (of: string) => `Get the translations of the title, overview and other text of ${of} into every available language.`,
  videos: (of: string) =>
    `Get the trailers, teasers, clips and featurettes of ${of}, each with its YouTube or Vimeo key.`,
  watchProviders: (of: string) =>
    `Get where ${of} can be streamed, rented or bought, per country. Data comes from JustWatch, which must be credited when shown.`,
};
