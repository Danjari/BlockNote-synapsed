import type { SynapsedTheme } from "./types.js";

/**
 * Default Synapsed theme configuration
 */
export const defaultSynapsedTheme: SynapsedTheme = {
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
export function generateSynapsedThemeCSS(theme: SynapsedTheme = defaultSynapsedTheme): string {
  return `
/* Synapsed AI Extension Theme Variables */
:root {
  --bn-synapsed-font-family: ${theme.fontFamily};
  --bn-synapsed-accent-color: ${theme.accentColor};
  --bn-synapsed-border-radius: ${theme.borderRadius};
  
  /* AI-specific colors */
  --bn-synapsed-ai-badge-bg: ${theme.accentColor};
  --bn-synapsed-ai-badge-text: #ffffff;
  --bn-synapsed-ai-hover-bg: rgba(99, 102, 241, 0.1);
  --bn-synapsed-ai-active-bg: rgba(99, 102, 241, 0.2);
  
  /* Streaming indicator */
  --bn-synapsed-streaming-color: ${theme.accentColor};
  --bn-synapsed-streaming-bg: rgba(99, 102, 241, 0.05);
}

/* Dark theme overrides */
[data-color-scheme="dark"] {
  --bn-synapsed-ai-hover-bg: rgba(99, 102, 241, 0.15);
  --bn-synapsed-ai-active-bg: rgba(99, 102, 241, 0.25);
  --bn-synapsed-streaming-bg: rgba(99, 102, 241, 0.1);
}

/* AI slash menu item styling */
.bn-suggestion-menu-item[data-ai-command="true"] {
  border-left: 3px solid var(--bn-synapsed-accent-color);
}

.bn-suggestion-menu-item[data-ai-command="true"]:hover {
  background-color: var(--bn-synapsed-ai-hover-bg);
}

.bn-suggestion-menu-item[data-ai-command="true"] .bn-suggestion-menu-item-badge {
  background-color: var(--bn-synapsed-ai-badge-bg);
  color: var(--bn-synapsed-ai-badge-text);
  border-radius: var(--bn-synapsed-border-radius);
  padding: 2px 6px;
  font-size: 0.75rem;
  font-weight: 500;
}

/* Streaming indicator */
.bn-block[data-streaming="true"]::after {
  content: "";
  position: absolute;
  right: 8px;
  top: 8px;
  width: 8px;
  height: 8px;
  background-color: var(--bn-synapsed-streaming-color);
  border-radius: 50%;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.1);
  }
}
`;
}

/**
 * Get the default Synapsed theme CSS
 */
export function getDefaultSynapsedThemeCSS(): string {
  return generateSynapsedThemeCSS(defaultSynapsedTheme);
} 