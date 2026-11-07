import { createFactory } from "hono/factory";
import { zValidator } from "@hono/zod-validator";
import { SETTINGS_OPTIONS, settingsUpdateSchema } from "../schemas/settings.schema.js";
import { authService } from "../services/auth.service.js";
import { personService } from "../services/person.service.js";

const factory = createFactory();

class SettingsController {
  show = factory.createHandlers(async (c) => {
    const session = await authService.getSession(c.req.raw.headers);
    if (!session) return c.json({ error: "Unauthorized" }, 401);
    return c.json(await personService.getSettings(session.user.id));
  });

  options = factory.createHandlers((c) => c.json(SETTINGS_OPTIONS));

  update = factory.createHandlers(zValidator("json", settingsUpdateSchema), async (c) => {
    const session = await authService.getSession(c.req.raw.headers);
    if (!session) return c.json({ error: "Unauthorized" }, 401);
    const person = await personService.getActive(session.user.id);
    await personService.updateSettings(person.id, c.req.valid("json"));
    return c.json(await personService.getSettings(session.user.id));
  });
}

export const settingsController = new SettingsController();
