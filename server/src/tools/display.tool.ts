import { toolDefinition } from "@tanstack/ai";
import { z } from "zod";
import { tmdbService } from "../services/tmdb.service.js";
import { withStatus } from "./tool-status.js";

const imageUrl = (of: string) =>
  z.url().optional().meta({ description: `Full URL of ${of}, e.g. https://image.tmdb.org/t/p/w500/<file_path>` });

const heading = z.string().optional().meta({ description: "Short heading above the row, e.g. Cozy mysteries" });

const reason = (of: string) =>
  z.string().optional().meta({ description: `One short sentence on why ${of} fits them` });

const score = (min: number, max: number, description: string) =>
  z.number().min(min).max(max).optional().meta({ description });

const year = z.number().int().optional().meta({ description: "Release year, or first air year for TV" });

const person = {
  name: z.string().min(1),
  avatar: imageUrl("their profile photo"),
  role: z.string().optional().meta({ description: "Character they play or their job, e.g. Tyler Durden or Director" }),
  reason: reason("this person"),
};

const credit = z.object({
  title: z.string().min(1),
  image: imageUrl("the poster"),
  year,
  role: z.string().optional().meta({ description: "Their character or job in it" }),
});

const personProfile = {
  ...person,
  role: z.string().optional().meta({ description: "What they're known as, e.g. Actor or Director and writer" }),
  born: z.string().optional().meta({ description: "Birth date and place, e.g. 17 August 1943 in New York City" }),
  died: z.string().optional().meta({ description: "Death date and place, if they have died" }),
  biography: z.string().optional().meta({ description: "Who they are and their career in two or three sentences" }),
  knownFor: z.array(credit).max(12).optional().meta({
    description: "Their most significant movies and series, best known first, not merely the most recent",
  }),
};

const media = {
  title: z.string().min(1),
  type: z.enum(["movie", "tv"]).optional(),
  tmdbId: z.number().int().optional().meta({
    description: "Its TMDB id. Together with type, its trailer is found automatically, so always set both when you have them",
  }),
  image: imageUrl("the poster"),
  backdrop: imageUrl("a wide backdrop still"),
  year,
  length: z.string().optional().meta({ description: "Runtime or size, e.g. 2h 19m or 3 seasons" }),
  genres: z.array(z.string()).max(3).optional(),
  ratings: z
    .object({
      tmdb: score(0, 10, "TMDB vote average, 0 to 10"),
      imdb: score(0, 10, "IMDb rating, 0 to 10"),
      rottenTomatoes: score(0, 100, "Rotten Tomatoes Tomatometer percent"),
      metacritic: score(0, 100, "Metacritic Metascore, 0 to 100"),
    })
    .optional(),
  overview: z.string().optional().meta({ description: "The premise in one or two sentences, without spoilers" }),
  reason: reason("this title"),
  watchOn: z.array(z.string()).optional().meta({ description: "Streaming services carrying it in their country" }),
  trailer: z
    .string()
    .regex(/^[\w-]{11}$/)
    .optional()
    .meta({
      description:
        "YouTube video ID of its official trailer, only when you already have one, e.g. the v= value of a YouTube link found with web_search. Without it, the trailer is looked up on TMDB from tmdbId",
    }),
  cast: z.array(z.object(person)).max(8).optional().meta({ description: "Main cast, top billed first" }),
};

const RULES =
  "Never invent values or image URLs. Merely mentioning a title or person in passing needs no tool, e.g. she became famous after her role in Heat. Keep your own text short and don't repeat what the screen already shows.";

const USE_WHAT_YOU_HAVE =
  "Only the name or title is required: fill in whatever you already have from TMDB, OMDb or web search, and leave out the rest instead of making extra calls for it.";

const shown = () => ({ shown: true });

type MediaInput = z.infer<z.ZodObject<typeof media>>;

const findTrailers = (items: MediaInput[], signal?: AbortSignal) =>
  Promise.all(
    items.map(async ({ trailer, type, tmdbId }) => {
      if (trailer || !type || !tmdbId) return trailer ?? null;
      return (await tmdbService.trailer(type, tmdbId, signal).catch(() => undefined)) ?? null;
    }),
  );

export const showMediaTool = toolDefinition({
  name: "show_media",
  description: `Show one movie or TV series on screen with its poster, details, ratings and cast. Use it every time you recommend or present a single title. ${USE_WHAT_YOU_HAVE} ${RULES}`,
  inputSchema: withStatus(media),
}).server(async (input, context) => ({ shown: true, trailers: await findTrailers([input], context?.abortSignal) }));

export const showMediasTool = toolDefinition({
  name: "show_medias",
  description: `Show several movies or TV series on screen as a row of posters the person browses with the remote, with details of the one in focus. Use it every time you recommend or present more than one title, instead of listing them in text. Always include each title's overview. ${USE_WHAT_YOU_HAVE} ${RULES}`,
  inputSchema: withStatus({ heading, items: z.array(z.object(media)).min(2).max(20) }),
}).server(async (input, context) => ({ shown: true, trailers: await findTrailers(input.items, context?.abortSignal) }));

export const showPersonTool = toolDefinition({
  name: "show_person",
  description: `Show one person, such as an actor or director, on screen as a full profile: photo, biography and the titles they're known for. Use it every time you recommend or present a single person. Look them up first with tmdb_person_details, appending combined_credits, and fill in as much of the profile as you can. ${RULES}`,
  inputSchema: withStatus(personProfile),
}).server(shown);

export const showPersonsTool = toolDefinition({
  name: "show_persons",
  description: `Show several people, such as a cast or a set of directors, on screen as a row of photos the person browses with the remote. Use it every time you recommend or present more than one person. ${USE_WHAT_YOU_HAVE} ${RULES}`,
  inputSchema: withStatus({ heading, people: z.array(z.object(person)).min(2).max(20) }),
}).server(shown);
