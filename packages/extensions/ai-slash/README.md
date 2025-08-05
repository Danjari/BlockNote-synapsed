# BlockNote AI Slash Extension

AI-powered slash commands extension for BlockNote editor. This extension adds AI functionality to BlockNote while maintaining full compatibility with all existing features.

## ✨ Features

- **AI Slash Commands**: `/explain`, `/quiz-me`, `/summarize`, `/diagram`
- **Full BlockNote Compatibility**: All existing commands work alongside AI commands
- **Event-Driven Architecture**: Clean separation between UI and AI logic
- **Streaming Support**: Real-time AI response streaming
- **Synapsed Theme**: Custom styling with indigo accent colors
- **TypeScript Support**: Full type safety

## 🚀 Quick Start

### Installation

```bash
npm install @danjari/blocknote-ai-extension
```

### Basic Usage

```javascript
import { BlockNoteEditor, getDefaultSlashMenuItems } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/react";
import {
  getAISlashMenuItems,
  createAIStreamingUtils,
} from "@danjari/blocknote-ai-extension";

// Create AI command handler
function handleAICommand(action, payload) {
  console.log("AI Command:", action, payload);

  // Connect to your AI API here
  switch (action) {
    case "explain":
      // Call your AI API for explanation
      break;
    case "quiz-me":
      // Generate quiz
      break;
    case "summarize":
      // Summarize content
      break;
    case "diagram":
      // Create diagram
      break;
  }
}

// Create editor with AI commands
const editor = new BlockNoteEditor({
  slashMenuItems: [
    ...getDefaultSlashMenuItems(editor), // All original BlockNote commands
    ...getAISlashMenuItems(editor, handleAICommand), // AI commands
  ],
});

// Set up streaming utilities
const streamingUtils = createAIStreamingUtils(editor);

// Render the editor
function MyEditor() {
  return <BlockNoteView editor={editor} />;
}
```

## 🎯 Available Commands

### Original BlockNote Commands (All Work!)

- `/paragraph` - Regular text block
- `/heading` - Heading (H1, H2, H3)
- `/bulletListItem` - Bullet list item
- `/numberedListItem` - Numbered list item
- `/quote` - Quote block
- `/code` - Code block
- `/image` - Image block
- `/table` - Table
- `/divider` - Horizontal divider
- And many more...

### AI Commands (New!)

- `/explain` 🤖 - Explain selected text
- `/quiz-me` 🤖 - Generate quiz based on content
- `/summarize` 🤖 - Summarize selected text
- `/diagram` 🤖 - Create diagram from content

## 🔧 API Reference

### `getAISlashMenuItems(editor, emitAICommand)`

Returns AI slash menu items for the BlockNote editor.

**Parameters:**

- `editor` - BlockNote editor instance
- `emitAICommand` - Function to handle AI commands

**Returns:** Array of slash menu items

**Example:**

```javascript
const menuItems = getAISlashMenuItems(editor, (action, payload) => {
  console.log("AI Command:", action, payload);
});
```

### `createAIStreamingUtils(editor)`

Creates streaming utilities for real-time AI responses.

**Parameters:**

- `editor` - BlockNote editor instance

**Returns:** AIStreamingUtils instance

**Example:**

```javascript
const streamingUtils = createAIStreamingUtils(editor);

// Start streaming AI response
streamingUtils.startStreaming("quote", "AI is thinking...");

// Update streaming content
streamingUtils.updateStreaming("This is the AI response...");

// Finish streaming
streamingUtils.finishStreaming();
```

### `useAISlash(config)`

React hook for AI functionality.

**Parameters:**

- `config` - Configuration object (optional)

**Returns:** AI hook with event emitter

**Example:**

```javascript
const aiSlash = useAISlash({
  callbacks: {
    onAICommand: (event) => {
      console.log("AI Command:", event.action, event.payload);
    },
    onStream: (chunk) => {
      console.log("Stream chunk:", chunk);
    },
  },
});
```

## 🔗 Complete Integration Example

```javascript
import { BlockNoteEditor, getDefaultSlashMenuItems } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/react";
import {
  getAISlashMenuItems,
  createAIStreamingUtils,
  useAISlash,
} from "@danjari/blocknote-ai-extension";

function MyAIEditor() {
  // Set up streaming utilities
  const [streamingUtils, setStreamingUtils] = useState(null);

  // AI command handler
  const handleAICommand = async (action, payload) => {
    console.log("AI Command:", action, payload);

    // Start streaming indicator
    if (streamingUtils) {
      streamingUtils.startStreaming("quote", "AI is thinking...");
    }

    try {
      // Call your AI API
      const response = await fetch("/api/ai/" + action, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: payload.selectedText,
          action: action,
        }),
      });

      const data = await response.json();

      // Update streaming content
      if (streamingUtils) {
        streamingUtils.updateStreaming(data.content);
        streamingUtils.finishStreaming();
      }
    } catch (error) {
      console.error("AI API error:", error);
      if (streamingUtils) {
        streamingUtils.finishStreaming();
      }
    }
  };

  // Create editor
  const editor = useMemo(() => {
    const editorInstance = new BlockNoteEditor({
      slashMenuItems: [
        ...getDefaultSlashMenuItems(editorInstance), // All original commands
        ...getAISlashMenuItems(editorInstance, handleAICommand), // AI commands
      ],
    });

    // Set up streaming utilities
    setStreamingUtils(createAIStreamingUtils(editorInstance));

    return editorInstance;
  }, []);

  return <BlockNoteView editor={editor} />;
}
```

## 🎨 Theming

The extension includes Synapsed theme with indigo accent colors:

```css
:root {
  --bn-synapsed-accent-color: #6366f1;
  --bn-synapsed-font-family: "Inter", sans-serif;
}
```

Import the theme CSS:

```javascript
import "@danjari/blocknote-ai-extension/theme.css";
```

## 📦 Exports

```javascript
import {
  // Main functions
  useAISlash,
  getAISlashMenuItems,
  createAIStreamingUtils,
  AIStreamingUtils,

  // Theme
  defaultSynapsedTheme,
  generateSynapsedThemeCSS,
  getDefaultSynapsedThemeCSS,

  // Types
  AICommandAction,
  AICommandPayload,
  AISlashConfig,
  AISlashHook,
  AISlashMenuItem,
  SynapsedTheme,
} from "@danjari/blocknote-ai-extension";
```

## 🧪 Testing

### Run the test suite:

```bash
npm test
```

### Test manually:

```bash
# Test extension functionality
node test-extension.js

# Test compatibility with BlockNote
node test-compatibility.js

# Test all commands
node test-all-commands.js

# View integration example
node integration-example.js
```

### Browser Testing:

Open `simple-test.html` in your browser to test the extension in a web environment.

## ✅ Compatibility

**✅ Full BlockNote Compatibility**

- All original slash commands work
- All block types supported
- All formatting options available
- No breaking changes

**✅ AI Commands**

- Properly grouped under "AI" category
- No conflicts with existing commands
- Follow BlockNote command structure
- Type-safe implementation

## 🔧 Development

### Building the extension:

```bash
npm run build
```

### Development mode:

```bash
npm run dev
```

### Preview:

```bash
npm run preview
```

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 🚀 Roadmap

- [ ] Interactive quiz blocks
- [ ] More AI commands
- [ ] Custom AI model support
- [ ] Advanced streaming features
- [ ] Collaborative AI features
