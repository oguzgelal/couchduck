import { createFactory } from "hono/factory";
import { zValidator } from "@hono/zod-validator";
import {
  conversationDataSchema,
  conversationParamSchema,
  conversationsQuerySchema,
} from "../schemas/conversation.schema.js";
import { authService } from "../services/auth.service.js";
import { conversationService } from "../services/conversation.service.js";
import { NotFoundError } from "../services/service-error.js";

const factory = createFactory();

class ConversationController {
  list = factory.createHandlers(zValidator("query", conversationsQuerySchema), async (c) => {
    const session = await authService.getSession(c.req.raw.headers);
    if (!session) return c.json({ error: "Unauthorized" }, 401);
    const { q } = c.req.valid("query");
    return c.json(await conversationService.list(session.user.id, q));
  });

  clear = factory.createHandlers(async (c) => {
    const session = await authService.getSession(c.req.raw.headers);
    if (!session) return c.json({ error: "Unauthorized" }, 401);
    await conversationService.clear(session.user.id);
    return c.body(null, 204);
  });

  show = factory.createHandlers(zValidator("param", conversationParamSchema), async (c) => {
    const session = await authService.getSession(c.req.raw.headers);
    if (!session) return c.json({ error: "Unauthorized" }, 401);
    const { id } = c.req.valid("param");
    try {
      return c.json(await conversationService.get(session.user.id, id));
    } catch (error) {
      if (!(error instanceof NotFoundError)) throw error;
      return c.json({ error: error.message }, 404);
    }
  });

  save = factory.createHandlers(
    zValidator("param", conversationParamSchema),
    zValidator("json", conversationDataSchema),
    async (c) => {
      const session = await authService.getSession(c.req.raw.headers);
      if (!session) return c.json({ error: "Unauthorized" }, 401);
      const { id } = c.req.valid("param");
      await conversationService.save(session.user.id, id, c.req.valid("json"));
      return c.body(null, 204);
    },
  );
}

export const conversationController = new ConversationController();
