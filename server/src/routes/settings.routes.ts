import { Hono } from "hono";
import { settingsController } from "../controllers/settings.controller.js";

export const settingsRoutes = new Hono()
  .get("/", ...settingsController.show)
  .patch("/", ...settingsController.update);
