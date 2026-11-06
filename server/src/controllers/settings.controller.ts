import { createFactory } from "hono/factory";
import { zValidator } from "@hono/zod-validator";
import { settingsUpdateSchema } from "../schemas/settings.schema.js";
import { authService } from "../services/auth.service.js";
import { personService } from "../services/person.service.js";

const factory = createFactory();

class SettingsController {
  show = factory.createHandlers(async (c) => {
    const session = await authService.getSession(c.req.raw.headers);
    if (!session) return c.json({ error: "Unauthorized" }, 401);
    return c.json(await personService.getSettings(session.user.id));
  });

  update = factory.createHandlers(zValidator("json", settingsUpdateSchema), async (c) => {
    const session = await authService.getSession(c.req.raw.headers);
    if (!session) return c.json({ error: "Unauthorized" }, 401);
    return c.json(await personService.updateSettings(session.user.id, c.req.valid("json")));
  });
}

export const settingsController = new SettingsController();
