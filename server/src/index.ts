import "dotenv/config";
import { Hono } from "hono";
import { inertia } from "@hono/inertia";
import { rootView } from "./inertia/root-view.js";
import { aiRoutes } from "./routes/ai.routes.js";
import { authRoutes } from "./routes/auth.routes.js";
import { chatRoutes } from "./routes/chat.routes.js";
import { conversationRoutes } from "./routes/conversation.routes.js";
import { deviceRoutes } from "./routes/device.routes.js";
import { settingsRoutes } from "./routes/settings.routes.js";

const app = new Hono()
  .use(inertia({ rootView }))
  .route("/api/auth", authRoutes)
  .route("/device", deviceRoutes)
  .route("/chat", chatRoutes)
  .route("/ai", aiRoutes)
  .route("/conversations", conversationRoutes)
  .route("/settings", settingsRoutes);

export default app;
