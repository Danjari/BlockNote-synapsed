# @blocknote/extension-ai-slash

AI-powered slash commands extension for BlockNote editor. This extension adds intelligent AI commands to the BlockNote slash menu, enabling users to interact with AI directly within the editor.

## Features

- **AI Slash Commands**: `/explain`, `/quiz-me`, `/summarize`, `/diagram`
- **Streaming Responses**: Real-time AI response streaming with visual indicators
- **Context Awareness**: Commands work with selected text or current block content
- **Synapsed Theme**: Custom styling with indigo accent colors
- **Event-Driven Architecture**: Clean separation between UI and AI logic

## Installation

```bash
npm install @blocknote/extension-ai-slash
```

## Usage

### Basic Setup

```tsx
import { useAISlash, getAISlashMenuItems } from "@blocknote/extension-ai-slash";
import { BlockNoteView } from "@blocknote/react";

function MyEditor() {
  const aiSlash = useAISlash({
    classId: "my-class",
    nodeId: "my-node",
    jwt: "auth-token",
    callbacks: {
      onAICommand: (event) => {
        // Handle AI command - make API call to your AI service
        console.log("AI Command:", event.action, event.payload);
      },
      onStream: (chunk) => {
        // Handle streaming response
        console.log("Stream chunk:", chunk);
      },
      onQuizComplete: (result) => {
        // Handle quiz completion
        console.log("Quiz result:", result);
      },
    },
  });

  return (
    <BlockNoteView
      editor={editor}
      slashMenuItems={getAISlashMenuItems(editor, aiSlash.emitAICommand)}
    />
  );
}
```

### Available Commands

| Command | Description | Usage |
|---------|-------------|-------|
| `/explain` | Get explanation of selected text | Select text, type `/explain` |
| `/quiz-me` | Generate quiz from content | Select text, type `/quiz-me` |
| `/summarize` | Create summary of content | Select text, type `/summarize` |
| `/diagram` | Generate diagram from content | Select text, type `/diagram` |

### Streaming Responses

The extension provides utilities for handling streaming AI responses:

```tsx
import { createAIStreamingUtils } from "@blocknote/extension-ai-slash";

const streamingUtils = createAIStreamingUtils(editor);

// Start streaming
streamingUtils.startStreaming("quote", "AI is thinking...");

// Update with chunks
streamingUtils.updateStream({ content: "Hello", isComplete: false });
streamingUtils.updateStream({ content: " World!", isComplete: true });

// Complete streaming
streamingUtils.completeStream();
```

### Theming

The extension includes Synapsed theme variables that can be customized:

```css
:root {
  --bn-synapsed-accent-color: #6366f1;
  --bn-synapsed-font-family: "Inter", sans-serif;
  --bn-synapsed-border-radius: 6px;
}
```

## API Reference

### `useAISlash(config)`

React hook that provides AI slash functionality.

**Parameters:**
- `config` (AISlashConfig): Configuration object

**Returns:**
- `AISlashHook`: Object with methods for AI interaction

### `getAISlashMenuItems(editor, emitAICommand)`

Generates slash menu items for AI commands.

**Parameters:**
- `editor` (BlockNoteEditor): BlockNote editor instance
- `emitAICommand` (function): Function to emit AI commands

**Returns:**
- `AISlashMenuItem[]`: Array of slash menu items

### `createAIStreamingUtils(editor)`

Creates utilities for handling streaming responses.

**Parameters:**
- `editor` (BlockNoteEditor): BlockNote editor instance

**Returns:**
- `AIStreamingUtils`: Streaming utilities instance

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Contributing

This extension is part of the BlockNote ecosystem. Please follow the BlockNote contribution guidelines. 