// Main exports
export { useAISlash } from "./useAISlash.js";
export { getAISlashMenuItems } from "./aiSlashMenuItems.js";
export { createAIStreamingUtils, AIStreamingUtils } from "./streamingUtils.js";
export { generateSynapsedThemeCSS, getDefaultSynapsedThemeCSS, defaultSynapsedTheme } from "./theme.js";

// Type exports
export type {
  AICommandAction,
  AICommandPayload,
  AICommandEvent,
  AIStreamChunk,
  QuizResult,
  AISlashCallbacks,
  AISlashConfig,
  AISlashHook,
  AISlashMenuItem,
  SynapsedTheme,
} from "./types.js";

// CSS export
import "./theme.css"; 