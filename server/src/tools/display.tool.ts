import { toolDefinition } from "@tanstack/ai";
import { z } from "zod";

const imageUrl = (of: string) =>
  z.url().optional().meta({ description: `Full URL of ${of}, e.g. https://image.tmdb.org/t/p/w500/<file_path>` });

const heading = z.string().optional().meta({ description: "Short heading above the row, e.g. Cozy mysteries" });

const reason = (of: string) =>
  z.string().optional().meta({ description: `One short sentence on why ${of} fits them` });

const score = (min: number, max: number, description: string) =>
  z.number().min(min).max(max).optional().meta({ description });

const person = z.object({
  name: z.string().min(1),
  avatar: imageUrl("their profile photo"),
  role: z.string().optional().meta({ description: "Character they play or their job, e.g. Tyler Durden or Director" }),
  reason: reason("this person"),
});

const media = z.object({
  title: z.string().min(1),
  type: z.enum(["movie", "tv"]).optional(),
  image: imageUrl("the poster"),
  backdrop: imageUrl("a wide backdrop still"),
  year: z.number().int().optional().meta({ description: "Release year, or first air year for TV" }),
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
  cast: z.array(person).max(8).optional().meta({ description: "Main cast, top billed first" }),
});

const DISPLAY_RULES =
  "Only the name or title is required: fill in whatever you already have from TMDB, OMDb or web search, and leave out the rest instead of making extra calls for it. Never invent values or image URLs. Merely mentioning a title or person in passing needs no tool, e.g. she became famous after her role in Heat. Keep your own text short and don't repeat what the screen already shows.";

const shown = () => ({ shown: true });

export const showMediaTool = toolDefinition({
  name: "show_media",
  description: `Show one movie or TV series on screen with its poster, details, ratings and cast. Use it every time you recommend or present a single title. ${DISPLAY_RULES}`,
  inputSchema: media,
}).server(shown);

export const showMediasTool = toolDefinition({
  name: "show_medias",
  description: `Show several movies or TV series on screen as a row of posters the person browses with the remote, with details of the one in focus. Use it every time you recommend or present more than one title, instead of listing them in text. ${DISPLAY_RULES}`,
  inputSchema: z.object({ heading, items: z.array(media).min(2).max(20) }),
}).server(shown);

export const showPersonTool = toolDefinition({
  name: "show_person",
  description: `Show one person, such as an actor or director, on screen with their photo and role. Use it every time you recommend or present a single person. ${DISPLAY_RULES}`,
  inputSchema: person,
}).server(shown);

export const showPersonsTool = toolDefinition({
  name: "show_persons",
  description: `Show several people, such as a cast or a set of directors, on screen as a row of photos the person browses with the remote. Use it every time you recommend or present more than one person. ${DISPLAY_RULES}`,
  inputSchema: z.object({ heading, people: z.array(person).min(2).max(20) }),
}).server(shown);
