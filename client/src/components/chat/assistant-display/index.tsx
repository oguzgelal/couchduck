import type { ReactNode } from "react";
import { MediaPart } from "./media/media-part";
import { MediasPart } from "./media/medias-part";
import type { Media } from "./media/types";
import { PersonPart } from "./person/person-part";
import { PersonsPart } from "./person/persons-part";
import type { Credit, Person } from "./person/types";
import { MediaSkeleton, PersonRowSkeleton, PersonSkeleton, PosterRowSkeleton } from "./skeleton";

type Input = Record<string, any> | undefined;

const named = (people: Person[] | undefined) => people?.filter((person) => person?.name);
const titled = <T extends Media | Credit>(items: T[] | undefined) => items?.filter((item) => item?.title);
const cleanMedia = (media: Media): Media => ({ ...media, cast: named(media.cast) });

const DISPLAYS: Record<string, { render: (input: Input) => ReactNode; skeleton: ReactNode }> = {
  show_media: {
    render: (input) => input?.title && <MediaPart media={cleanMedia(input as Media)} />,
    skeleton: <MediaSkeleton />,
  },
  show_medias: {
    render: (input) => {
      const items = titled<Media>(input?.items)?.map(cleanMedia);
      return items?.length ? <MediasPart list={{ heading: input?.heading, items }} /> : null;
    },
    skeleton: <PosterRowSkeleton />,
  },
  show_person: {
    render: (input) =>
      input?.name && <PersonPart person={{ ...(input as Person), knownFor: titled<Credit>(input.knownFor) }} />,
    skeleton: <PersonSkeleton />,
  },
  show_persons: {
    render: (input) => {
      const people = named(input?.people);
      return people?.length ? <PersonsPart list={{ heading: input?.heading, people }} /> : null;
    },
    skeleton: <PersonRowSkeleton />,
  },
};

export const isDisplayTool = (name: string) => name in DISPLAYS;

export function AssistantDisplay({ name, input, isStreaming }: { name: string; input: Input; isStreaming: boolean }) {
  const display = DISPLAYS[name];
  if (!display) return null;
  return display.render(input) || (isStreaming ? display.skeleton : null);
}
