import { prisma } from "../lib/db.js";
import { memoriesSchema, type Memories } from "../schemas/person.schema.js";
import {
  preferencesSchema,
  type Preferences,
  type SettingsUpdate,
} from "../schemas/settings.schema.js";
import { ServiceError } from "./service-error.js";

export type ActivePerson = {
  id: string;
  name: string;
  memories: Memories;
  preferences: Preferences;
};

const PREFERENCE_GUIDES: Record<keyof Preferences, (value: string) => string> =
  {
    country: (value) => `Country: ${value}. Prefer movies and shows available in this region.`, // prettier-ignore
    streamingServices: (value) => `Streaming services: ${value}. Prefer movies and shows available on these services.`, // prettier-ignore
    formats: (value) => `Formats: ${value}. Prefer these formats.`, // prettier-ignore
    genres: (value) => `Favorite genres: ${value}. Lean towards these genres.`, // prettier-ignore
    dislikes: (value) => `Avoid: ${value}. Steer clear of these.`, // prettier-ignore
    languages: (value) => `Preferred languages: ${value}. Prefer movies and shows originally in these languages.`, // prettier-ignore
    subtitleLanguages: (value) => `Subtitle languages: ${value}. Prefer movies and shows with subtitles available in these languages.`, // prettier-ignore
  };

const PREFERENCES_INTRO = `
Viewing preferences they set as defaults for recommendations. 
Anything they ask for in the conversation overrides these: 
if they ask for horror tonight, recommend horror even if horror is in 
their avoid list. Unset preferences mean anything goes.
`;

class PersonService {
  async createDefault(user: { id: string; name: string }) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        activePerson: {
          create: {
            name: user.name,
            user: {
              connect: {
                id: user.id,
              },
            },
          },
        },
      },
    });
  }

  async getActive(userId: string): Promise<ActivePerson> {
    const { activePerson } = await prisma.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
      select: {
        activePerson: true,
      },
    });
    if (!activePerson) {
      throw new ServiceError("This account has no active person");
    }
    return {
      id: activePerson.id,
      name: activePerson.name,
      memories: memoriesSchema.parse(activePerson.metadata),
      preferences: preferencesSchema.parse(activePerson.preferences),
    };
  }

  async getSettings(userId: string) {
    const { name, preferences } = await this.getActive(userId);
    return { name, ...preferences };
  }

  async updateSettings(userId: string, { name, ...update }: SettingsUpdate) {
    const person = await this.getActive(userId);
    const preferences = { ...person.preferences, ...update };
    await prisma.person.update({
      where: { id: person.id },
      data: { name, preferences },
    });
    return { name: name ?? person.name, ...preferences };
  }

  // Atomic jsonb updates: a read-modify-write would let parallel tool calls overwrite each other.
  async remember(personId: string, key: string, fact: string) {
    const memory = JSON.stringify({ key, fact });
    await prisma.$executeRaw`
      UPDATE "person"
      SET "metadata" = "metadata" || jsonb_build_object(${key}::text, ${memory}::jsonb), "updatedAt" = CURRENT_TIMESTAMP
      WHERE "id" = ${personId}`;
  }

  async forget(personId: string, key: string) {
    await prisma.$executeRaw`
      UPDATE "person"
      SET "metadata" = "metadata" - ${key}::text, "updatedAt" = CURRENT_TIMESTAMP
      WHERE "id" = ${personId}`;
  }

  describePreferences(preferences: Preferences) {
    const guides = Object.entries(preferences)
      .map(
        ([key, value]) =>
          [key as keyof Preferences, [value].flat().join(", ")] as const,
      )
      .filter(([, value]) => value)
      .map(([key, value]) => `- ${PREFERENCE_GUIDES[key](value)}`);
    if (guides.length === 0) {
      guides.push("- (none set, search everything)");
    }
    return [PREFERENCES_INTRO, ...guides];
  }

  describe({ name, memories, preferences }: ActivePerson) {
    const facts = Object.values(memories).map(
      ({ key, fact }) => `- ${key}: ${fact}`,
    );
    if (facts.length === 0) {
      facts.push("(nothing yet)");
    }
    return [
      "About the person you're talking to:",
      `Name: ${name} (note: refer to the person by their first name)`,
      ...this.describePreferences(preferences),
      "Memories:",
      ...facts,
    ].join("\n");
  }
}

export const personService = new PersonService();
