#!/usr/bin/env node

console.log("🔗 How to Use AI Extension in Your Synapsed App\n");

// Example: How to integrate the AI extension into your Synapsed notebook application

const usageExample = `
// 1. In your Synapsed application, import the extension
import { BlockNoteEditor, getDefaultSlashMenuItems } from '@blocknote/core';
import { BlockNoteView } from '@blocknote/react';
import { 
  getAISlashMenuItems, 
  createAIStreamingUtils,
  useAISlash 
} from '@blocknote/extension-ai-slash';

// 2. Create your AI command handler
function handleAICommand(action, payload) {
  console.log('AI Command:', action, payload);
  
  // Connect to your Synapsed AI API
  switch (action) {
    case 'explain':
      // Call your /api/ai/explain endpoint
      fetch('/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: payload.selectedText,
          classId: currentClassId,
          nodeId: currentNodeId
        })
      });
      break;
      
    case 'quiz-me':
      // Call your /api/ai/quiz-me endpoint
      fetch('/api/ai/quiz-me', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: payload.selectedText,
          classId: currentClassId,
          nodeId: currentNodeId
        })
      });
      break;
      
    case 'summarize':
      // Call your /api/ai/summarize endpoint
      break;
      
    case 'diagram':
      // Call your /api/ai/diagram endpoint
      break;
  }
}

// 3. Create your editor component
function SynapsedNotebookEditor({ classId, nodeId, jwt }) {
  // Create editor with AI extension
  const editor = new BlockNoteEditor({
    slashMenuItems: [
      ...getDefaultSlashMenuItems(editor), // All original BlockNote commands
      ...getAISlashMenuItems(editor, handleAICommand) // AI commands
    ]
  });

  // Set up streaming utilities
  const streamingUtils = createAIStreamingUtils(editor);

  // Handle streaming AI responses
  function handleAIStream(action, streamData) {
    if (streamData.isFirstChunk) {
      // Start streaming
      streamingUtils.startStreaming('quote', 'AI is thinking...');
    }
    
    // Update streaming content
    streamingUtils.updateStreaming(streamData.content);
    
    if (streamData.isComplete) {
      // Finish streaming
      streamingUtils.finishStreaming();
    }
  }

  return (
    <BlockNoteView 
      editor={editor}
      theme="light"
    />
  );
}

// 4. Alternative: Using the React hook
function SynapsedNotebookWithHook({ classId, nodeId, jwt }) {
  const aiSlash = useAISlash({
    classId,
    nodeId,
    jwt,
    callbacks: {
      onAICommand: (event) => {
        // Handle AI command
        console.log('AI Command:', event.action, event.payload);
      },
      onStream: (chunk) => {
        // Handle streaming response
        console.log('Stream chunk:', chunk);
      },
      onQuizComplete: (result) => {
        // Handle quiz completion
        console.log('Quiz result:', result);
        // POST to /api/progress
        fetch('/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            classId,
            nodeId,
            quizResult: result
          })
        });
      }
    }
  });

  const editor = new BlockNoteEditor({
    slashMenuItems: [
      ...getDefaultSlashMenuItems(editor),
      ...getAISlashMenuItems(editor, aiSlash.emitAICommand)
    ]
  });

  return <BlockNoteView editor={editor} />;
}
`;

console.log(usageExample);

console.log("\n📦 Installation Options:");
console.log("=======================\n");

console.log("Option 1: Local Development (Current)");
console.log("--------------------------------------");
console.log("Since you're in the BlockNote monorepo, you can import directly:");
console.log(
  "import { getAISlashMenuItems } from './packages/extensions/ai-slash/dist/ai-slash.js';\n",
);

console.log("Option 2: Publish to npm");
console.log("------------------------");
console.log("1. Build the extension: npm run build");
console.log("2. Publish to npm: npm publish");
console.log(
  "3. Install in your app: npm install @blocknote/extension-ai-slash",
);
console.log(
  "4. Import: import { getAISlashMenuItems } from '@blocknote/extension-ai-slash';\n",
);

console.log("Option 3: Git submodule");
console.log("----------------------");
console.log("1. Add as git submodule to your Synapsed repo");
console.log("2. Build and link locally");
console.log("3. Import from local path\n");

console.log("🎯 Recommended: Start with Option 1 for development!");
console.log("Then move to Option 2 when ready for production.");
