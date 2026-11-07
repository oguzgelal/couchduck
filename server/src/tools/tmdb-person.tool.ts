import {
  appendToResponse,
  end_date,
  language,
  page,
  PERSON_SUB_RESOURCES,
  person_id,
  start_date,
} from "../schemas/tmdb.schema.js";
import { tmdbPrompts, tmdbTool } from "./tmdb-tool.js";

const PERSON = "a person";

export const tmdbPersonTools = [
  tmdbTool({
    name: "person_popular",
    path: "/person/popular",
    description: "Get the most popular people in movies and TV right now.",
    params: { language, page },
  }),
  tmdbTool({
    name: "person_details",
    path: "/person/{person_id}",
    lazy: false,
    description: `${tmdbPrompts.details(PERSON)} Includes their biography, birthday and what they're known for.`,
    params: { person_id, language, append_to_response: appendToResponse(PERSON_SUB_RESOURCES) },
  }),
  tmdbTool({
    name: "person_changes",
    path: "/person/{person_id}/changes",
    description: tmdbPrompts.changes(PERSON),
    params: { person_id, start_date, end_date, page },
  }),
  tmdbTool({
    name: "person_combined_credits",
    path: "/person/{person_id}/combined_credits",
    description: "Get every movie and TV series a person acted in or worked on.",
    params: { person_id, language },
  }),
  tmdbTool({
    name: "person_movie_credits",
    path: "/person/{person_id}/movie_credits",
    description: "Get every movie a person acted in or worked on.",
    params: { person_id, language },
  }),
  tmdbTool({
    name: "person_tv_credits",
    path: "/person/{person_id}/tv_credits",
    description: "Get every TV series a person acted in or worked on.",
    params: { person_id, language },
  }),
  tmdbTool({
    name: "person_external_ids",
    path: "/person/{person_id}/external_ids",
    description: tmdbPrompts.externalIds(PERSON),
    params: { person_id },
  }),
  tmdbTool({
    name: "person_images",
    path: "/person/{person_id}/images",
    description: tmdbPrompts.images(PERSON),
    params: { person_id },
  }),
  tmdbTool({
    name: "person_tagged_images",
    path: "/person/{person_id}/tagged_images",
    description: "Get the movie and TV images a person has been tagged in.",
    params: { person_id, page },
  }),
  tmdbTool({ name: "person_latest", path: "/person/latest", description: tmdbPrompts.latest("person") }),
  tmdbTool({
    name: "person_translations",
    path: "/person/{person_id}/translations",
    description: "Get the translations of a person's biography into every available language.",
    params: { person_id },
  }),
];
