import { Hono } from "hono";
import { conversationController } from "../controllers/conversation.controller.js";

export const conversationRoutes = new Hono()
  .get("/", ...conversationController.list)
  .delete("/", ...conversationController.clear)
  .get("/:id", ...conversationController.show)
  .put("/:id", ...conversationController.save);
