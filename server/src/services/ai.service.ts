import {
  chat,
  maxIterations,
  type AnyTool,
  type ChatMiddleware,
  type chatParamsFromRequest,
} from "@tanstack/ai";
import { openRouterText } from "@tanstack/ai-openrouter";
import { prisma } from "../lib/db.js";
import { UsageLimitError } from "./service-error.js";

const CHAT_MODEL = "anthropic/claude-sonnet-5.5";
const SMALL_MODEL = "anthropic/claude-haiku-4.5";
const MAX_ITERATIONS = 10;
const MONTHLY_CAP_USD = 10;
const USAGE_HOLD_USD = 0.1;

export type ChatRun = Pick<
  Awaited<ReturnType<typeof chatParamsFromRequest>>,
  "messages" | "threadId" | "runId" | "parentRunId" | "resume"
>;

type ChatRequest<TContext> = {
  userId: string;
  run: ChatRun;
  systemPrompts: string[];
  tools: AnyTool[];
  context: TContext;
  abortController: AbortController;
};

type TextRequest = {
  userId: string;
  prompt: string;
  systemPrompts: string[];
};

class AiService {
  async chat<TContext>({
    userId,
    run,
    systemPrompts,
    tools,
    context,
    abortController,
  }: ChatRequest<TContext>) {
    const { limitReached } = await this.getUsage(userId);
    if (limitReached) {
      throw new UsageLimitError("You've used this month's AI allowance.");
    }

    return chat({
      adapter: openRouterText(CHAT_MODEL),
      messages: run.messages,
      threadId: run.threadId,
      runId: run.runId,
      parentRunId: run.parentRunId,
      resume: run.resume,
      systemPrompts,
      tools,
      context,
      agentLoopStrategy: maxIterations(MAX_ITERATIONS),
      abortController,
      middleware: [this.usageMiddleware(userId)],
    });
  }

  async generateText({ userId, prompt, systemPrompts }: TextRequest) {
    const { text } = await chat({
      adapter: openRouterText(SMALL_MODEL),
      messages: [{ role: "user", content: prompt }],
      systemPrompts,
      stream: false,
      middleware: [this.usageMiddleware(userId)],
    });
    return text;
  }

  async getUsage(userId: string) {
    const usage = await prisma.aiUsage.findUnique({
      where: {
        userId_key: {
          key: this.currentMonthKey(),
          userId,
        },
      },
    });
    const usd = usage?.usd ?? 0;
    return {
      usd,
      capUsd: MONTHLY_CAP_USD,
      limitReached: usd >= MONTHLY_CAP_USD,
    };
  }

  private usageMiddleware(userId: string): ChatMiddleware {
    return {
      name: "usage",
      onStart: () => this.recordUsage(userId, USAGE_HOLD_USD),
      onUsage: (_, usage) =>
        this.recordUsage(
          userId,
          (usage.cost ?? 0) + (usage.costDetails?.upstreamCost ?? 0),
        ),
      onFinish: () => this.recordUsage(userId, -USAGE_HOLD_USD),
    };
  }

  private async recordUsage(userId: string, usd: number) {
    const key = this.currentMonthKey();
    await prisma.aiUsage.upsert({
      where: { userId_key: { userId, key } },
      create: { userId, key, usd },
      update: { usd: { increment: usd } },
    });
  }

  private currentMonthKey() {
    const now = new Date();
    return `${String(now.getUTCMonth() + 1).padStart(2, "0")}-${now.getUTCFullYear()}`;
  }
}

export const aiService = new AiService();
