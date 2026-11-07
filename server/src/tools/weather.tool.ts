import { toolDefinition } from "@tanstack/ai";
import { z } from "zod";
import { weatherSchema } from "../schemas/weather.schema.js";
import { weatherService } from "../services/weather.service.js";
import { withStatus } from "./tool-status.js";

export const weatherTool = toolDefinition({
  name: "get_weather",
  description: "Get the current weather for a city.",
  inputSchema: withStatus({
    city: z.string().meta({ description: "City name only, without country or region, e.g. Tokyo" }),
  }),
  outputSchema: weatherSchema,
}).server(({ city }, context) => weatherService.getCurrent(city, context?.abortSignal));
