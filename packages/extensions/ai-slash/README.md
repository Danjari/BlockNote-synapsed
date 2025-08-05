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
npm install @blocknote/extension-ai-slash
```

### Basic Usage

```javascript
import { BlockNoteEditor } from '@blocknote/core';
import { getAISlashMenuItems } from '@blocknote/extension-ai-slash';

// Create editor with AI commands
const editor = new BlockNoteEditor({
  slashMenuItems: [
    ...getDefaultSlashMenuItems(editor), // All original BlockNote commands
    ...getAISlashMenuItems(editor, handleAICommand) // AI commands
  ]
});

// Handle AI commands
function handleAICommand(action, payload) {
  console.log('AI Command:', action, payload);
  // Connect to your AI API here
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

### `useAISlash(config)`

React hook for AI functionality.

**Parameters:**
- `config` - Configuration object (optional)

**Returns:** AI hook with event emitter

### `createAIStreamingUtils(editor)`

Creates streaming utilities for real-time AI responses.

**Parameters:**
- `editor` - BlockNote editor instance

**Returns:** AIStreamingUtils instance

## 🎨 Theming

The extension includes Synapsed theme with indigo accent colors:

```css
:root {
  --bn-synapsed-accent-color: #6366f1;
  --bn-synapsed-font-family: "Inter", sans-serif;
}
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
  SynapsedTheme
} from '@blocknote/extension-ai-slash';
```

## 🔗 Integration Example

```javascript
import { BlockNoteEditor, getDefaultSlashMenuItems } from '@blocknote/core';
import { getAISlashMenuItems, createAIStreamingUtils } from '@blocknote/extension-ai-slash';

// Create editor
const editor = new BlockNoteEditor({
  slashMenuItems: [
    ...getDefaultSlashMenuItems(editor), // All original commands
    ...getAISlashMenuItems(editor, handleAICommand) // AI commands
  ]
});

// AI command handler
function handleAICommand(action, payload) {
  switch (action) {
    case 'explain':
      // Call your AI API for explanation
      break;
    case 'quiz-me':
      // Generate quiz
      break;
    case 'summarize':
      // Summarize content
      break;
    case 'diagram':
      // Create diagram
      break;
  }
}

// Streaming utilities
const streamingUtils = createAIStreamingUtils(editor);

// Start streaming AI response
streamingUtils.startStreaming('quote', 'AI is thinking...');

// Update streaming content
streamingUtils.updateStreaming('This is the AI response...');

// Finish streaming
streamingUtils.finishStreaming();
```

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

## 🧪 Testing

Run the test suite:

```bash
npm test
```

Or test manually:

```bash
node test-extension.js
node test-compatibility.js
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