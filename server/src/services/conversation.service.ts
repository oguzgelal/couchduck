import type { Prisma } from "../generated/prisma/client.js";
import { prisma } from "../lib/db.js";
import { conversationDataSchema, type ConversationData } from "../schemas/conversation.schema.js";
import { aiService } from "./ai.service.js";
import { personService } from "./person.service.js";
import { NotFoundError } from "./service-error.js";

const LIST_LIMIT = 50;
const SEARCH_THRESHOLD = 0.3;
const TITLE_PROMPT =
  "Write a short title (2 to 5 words) for a conversation that starts with the message below. Reply with the title only, no quotes or punctuation at the end.";

type ConversationSummary = {
  id: string;
  title: string | null;
  updatedAt: Date;
};

class ConversationService {
  async list(userId: string, query?: string): Promise<ConversationSummary[]> {
    if (!query) {
      return prisma.conversation.findMany({
        where: { userId },
        select: { id: true, title: true, updatedAt: true },
        orderBy: { updatedAt: "desc" },
        take: LIST_LIMIT,
      });
    }
    return prisma.$queryRaw<ConversationSummary[]>`
      SELECT c."id", c."title", c."updatedAt"
      FROM "conversation" c,
      LATERAL (
        SELECT coalesce(c."title", '') || ' ' || coalesce(string_agg(part->>'content', ' '), '') AS body
        FROM jsonb_array_elements(c."data"->'messages') message,
             jsonb_array_elements(message->'parts') part
        WHERE part->>'type' = 'text'
      ) search
      WHERE c."userId" = ${userId} AND word_similarity(${query}, search.body) > ${SEARCH_THRESHOLD}
      ORDER BY word_similarity(${query}, search.body) DESC, c."updatedAt" DESC
      LIMIT ${LIST_LIMIT}`;
  }

  async get(userId: string, id: string) {
    const conversation = await prisma.conversation.findFirst({
      where: { id, userId },
      select: { id: true, title: true, data: true },
    });
    if (!conversation) throw new NotFoundError("Conversation not found");
    return {
      id: conversation.id,
      title: conversation.title,
      ...conversationDataSchema.parse(conversation.data),
    };
  }

  async clear(userId: string) {
    await prisma.conversation.deleteMany({ where: { userId } });
  }

  async save(userId: string, id: string, data: ConversationData) {
    const json = data as Prisma.InputJsonObject;
    const { count } = await prisma.conversation.updateMany({
      where: { id, userId },
      data: { data: json },
    });
    if (count > 0) return;

    const person = await personService.getActive(userId);
    await prisma.conversation.create({
      data: { id, userId, personId: person.id, data: json },
    });
    this.generateTitle(userId, id, data).catch((error: unknown) => {
      console.error("Couldn't generate a conversation title", error);
    });
  }

  private async generateTitle(userId: string, id: string, { messages }: ConversationData) {
    const firstMessage = messages
      .find((message) => message.role === "user")
      ?.parts.filter((part) => part.type === "text")
      .map((part) => part.content)
      .join("\n");
    if (!firstMessage) return;

    const title = await aiService.generateText({
      userId,
      prompt: firstMessage,
      systemPrompts: [TITLE_PROMPT],
    });
    await prisma.conversation.update({
      where: { id },
      data: { title: title.trim() },
    });
  }
}

export const conversationService = new ConversationService();
