"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultSynapsedTheme = void 0;
exports.generateSynapsedThemeCSS = generateSynapsedThemeCSS;
exports.getDefaultSynapsedThemeCSS = getDefaultSynapsedThemeCSS;
/**
 * Default Synapsed theme configuration
 */
exports.defaultSynapsedTheme = {
    fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Open Sans", "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    accentColor: "#6366f1", // Indigo
    borderRadius: "6px",
};
/**
 * Generate CSS variables for Synapsed theme
 *
 * @param theme - Theme configuration
 * @returns CSS string with theme variables
 */
function generateSynapsedThemeCSS(theme) {
    if (theme === void 0) { theme = exports.defaultSynapsedTheme; }
    return "\n/* Synapsed AI Extension Theme Variables */\n:root {\n  --bn-synapsed-font-family: ".concat(theme.fontFamily, ";\n  --bn-synapsed-accent-color: ").concat(theme.accentColor, ";\n  --bn-synapsed-border-radius: ").concat(theme.borderRadius, ";\n  \n  /* AI-specific colors */\n  --bn-synapsed-ai-badge-bg: ").concat(theme.accentColor, ";\n  --bn-synapsed-ai-badge-text: #ffffff;\n  --bn-synapsed-ai-hover-bg: rgba(99, 102, 241, 0.1);\n  --bn-synapsed-ai-active-bg: rgba(99, 102, 241, 0.2);\n  \n  /* Streaming indicator */\n  --bn-synapsed-streaming-color: ").concat(theme.accentColor, ";\n  --bn-synapsed-streaming-bg: rgba(99, 102, 241, 0.05);\n}\n\n/* Dark theme overrides */\n[data-color-scheme=\"dark\"] {\n  --bn-synapsed-ai-hover-bg: rgba(99, 102, 241, 0.15);\n  --bn-synapsed-ai-active-bg: rgba(99, 102, 241, 0.25);\n  --bn-synapsed-streaming-bg: rgba(99, 102, 241, 0.1);\n}\n\n/* AI slash menu item styling */\n.bn-suggestion-menu-item[data-ai-command=\"true\"] {\n  border-left: 3px solid var(--bn-synapsed-accent-color);\n}\n\n.bn-suggestion-menu-item[data-ai-command=\"true\"]:hover {\n  background-color: var(--bn-synapsed-ai-hover-bg);\n}\n\n.bn-suggestion-menu-item[data-ai-command=\"true\"] .bn-suggestion-menu-item-badge {\n  background-color: var(--bn-synapsed-ai-badge-bg);\n  color: var(--bn-synapsed-ai-badge-text);\n  border-radius: var(--bn-synapsed-border-radius);\n  padding: 2px 6px;\n  font-size: 0.75rem;\n  font-weight: 500;\n}\n\n/* Streaming indicator */\n.bn-block[data-streaming=\"true\"]::after {\n  content: \"\";\n  position: absolute;\n  right: 8px;\n  top: 8px;\n  width: 8px;\n  height: 8px;\n  background-color: var(--bn-synapsed-streaming-color);\n  border-radius: 50%;\n  animation: pulse 1.5s ease-in-out infinite;\n}\n\n@keyframes pulse {\n  0%, 100% {\n    opacity: 1;\n    transform: scale(1);\n  }\n  50% {\n    opacity: 0.5;\n    transform: scale(1.1);\n  }\n}\n");
}
/**
 * Get the default Synapsed theme CSS
 */
function getDefaultSynapsedThemeCSS() {
    return generateSynapsedThemeCSS(exports.defaultSynapsedTheme);
}
//# sourceMappingURL=theme.js.map