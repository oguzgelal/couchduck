import { Hono } from "hono";
import { settingsController } from "../controllers/settings.controller.js";

export const settingsRoutes = new Hono()
  .get("/", ...settingsController.show)
  .get("/options", ...settingsController.options)
  .patch("/", ...settingsController.update);
