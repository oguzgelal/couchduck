import { prisma } from "../lib/db.js";
import { memoriesSchema, type Memories } from "../schemas/person.schema.js";
import { preferencesSchema, type Preferences, type SettingsUpdate } from "../schemas/settings.schema.js";
import { ServiceError } from "./service-error.js";

export type ActivePerson = {
  id: string;
  name: string;
  memories: Memories;
  preferences: Preferences;
};

const PREFERENCE_LABELS: Record<keyof Preferences, string> = {
  country: "Country",
  language: "Preferred language",
  streamingServices: "Streaming services they have",
  formats: "Formats they like",
  genres: "Favorite genres",
  dislikes: "Wants to avoid",
};

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

  describe({ name, memories, preferences }: ActivePerson) {
    const settings = Object.entries(preferences)
      .map(([key, value]) => [PREFERENCE_LABELS[key as keyof Preferences], [value].flat().join(", ")])
      .filter(([, value]) => value)
      .map(([label, value]) => `${label}: ${value}`);
    const facts = Object.values(memories).map(
      ({ key, fact }) => `- ${key}: ${fact}`,
    );
    if (facts.length === 0) {
      facts.push("(nothing yet)");
    }
    return [
      "About the person you're talking to:",
      `Name: ${name}`,
      ...settings,
      "Memories:",
      ...facts,
    ].join("\n");
  }
}

export const personService = new PersonService();
