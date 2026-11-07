import { askUserQuestionTool } from "./ask-user-question.tool.js";
import { currentTimeTool } from "./current-time.tool.js";
import { thinkTool } from "./think.tool.js";
import { updateSettingsTool } from "./update-settings.tool.js";
import { upsertMemoryTool } from "./upsert-memory.tool.js";
import { weatherTool } from "./weather.tool.js";

export const chatTools = [
  thinkTool,
  askUserQuestionTool,
  currentTimeTool,
  weatherTool,
  upsertMemoryTool,
  updateSettingsTool,
];
