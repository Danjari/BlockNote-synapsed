import { BlockNoteEditor, filterSuggestionItems } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { en } from "@blocknote/core/locales";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import {
  SuggestionMenuController,
  getDefaultReactSlashMenuItems,
  useCreateBlockNote,
  usePrefersColorScheme,
} from "@blocknote/react";
import { useEffect, useState } from "react";

// Import your custom AI extension
// @ts-ignore
import { getAISlashMenuItems } from "../../../../packages/extensions/ai-slash/dist/ai-slash.js";

export default function App() {
  // Creates a new editor instance.
  const editor = useCreateBlockNote({
    dictionary: en,
    // We set some initial content for demo purposes
    initialContent: [
      {
        type: "heading",
        props: {
          level: 1,
        },
        content: "Custom AI Extension Test",
      },
      {
        type: "paragraph",
        content:
          "This is a test of your custom AI slash extension. Try typing '/' to see the slash menu with your AI commands.",
      },
      {
        type: "paragraph",
        content:
          "Select some text and try AI commands like '/explain' or '/summarize' to test your custom extension functionality.",
      },
      {
        type: "paragraph",
        content:
          "Open source software refers to computer programs whose source code is made available to the public, allowing anyone to view, modify, and distribute the code. This model stands in contrast to proprietary software, where the source code is kept secret and only the original creators have the right to make changes.",
      },
    ],
  });

  const [aiResponses, setAiResponses] = useState<string[]>([]);

  // Custom AI command handler
  const handleAICommand = (action: string, payload?: any) => {
    console.log("🤖 Custom AI Command:", action, payload);

    const selectedText = payload?.selectedText || "current block content";

    // Simulate AI responses for your custom extension
    const responses = {
      explain: `**Explanation of selected text:**\n\n"${selectedText}"\n\nThis text appears to be about software development and open source principles. The AI extension is working correctly and can process the selected content.`,
      summarize: `**Summary:**\n\nThe selected content discusses ${selectedText.includes("open source") ? "open source software principles and benefits" : "the selected text content"}. The AI extension successfully processed and summarized the information.`,
      "quiz-me": `**Quiz Question:**\n\nBased on the selected text, what is the main benefit of open source software?\n\nA) It's always free\nB) It promotes transparency and collaboration\nC) It's easier to use\nD) It has better security\n\n**Answer:** B) It promotes transparency and collaboration`,
      diagram: `**Diagram Generated:**\n\n\`\`\`mermaid\ngraph TD\n    A[Selected Content] --> B[AI Processing]\n    B --> C[Custom Extension]\n    C --> D[Diagram Output]\n    D --> E[Your Editor]\n\`\`\`\n\nYour custom AI extension successfully created a diagram representation!`,
    };

    const response =
      (responses as any)[action] ||
      `AI command "${action}" executed successfully with your custom extension!`;

    // Add response to the list
    setAiResponses((prev) => [...prev, response]);

    // Insert the response into the editor
    editor.insertBlocks(
      [
        {
          type: "paragraph",
          content: response,
        },
      ],
      editor.getTextCursorPosition().block,
      "after",
    );
  };

  const themePreference = usePrefersColorScheme();

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <div
        style={{
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: "8px",
          padding: "20px",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ margin: "0 0 10px 0", color: "#1e293b" }}>
          🧪 Custom AI Extension Test
        </h2>
        <p style={{ margin: "0 0 15px 0", color: "#475569" }}>
          This example uses your custom AI slash extension instead of the
          built-in AI extension.
        </p>
        <div
          style={{
            background: "#fef3c7",
            border: "1px solid #f59e0b",
            borderRadius: "6px",
            padding: "15px",
          }}
        >
          <h4 style={{ margin: "0 0 10px 0", color: "#92400e" }}>
            Test Commands:
          </h4>
          <ul style={{ margin: "0", paddingLeft: "20px", color: "#92400e" }}>
            <li>
              <code>/explain</code> - Explain selected text
            </li>
            <li>
              <code>/quiz-me</code> - Generate quiz questions
            </li>
            <li>
              <code>/summarize</code> - Summarize content
            </li>
            <li>
              <code>/diagram</code> - Create diagrams
            </li>
          </ul>
        </div>
      </div>

      <BlockNoteView
        editor={editor}
        slashMenu={false} // Disable default slash menu
      >
        {/* Custom slash menu with your AI extension */}
        <SuggestionMenuController
          triggerCharacter="/"
          getItems={async (query) => {
            const defaultItems = getDefaultReactSlashMenuItems(editor);
            const aiItems = getAISlashMenuItems(editor, handleAICommand);
            const allItems = [...defaultItems, ...aiItems];
            return filterSuggestionItems(allItems, query);
          }}
        />
      </BlockNoteView>

      {aiResponses.length > 0 && (
        <div
          style={{
            marginTop: "20px",
            background: "#f0f9ff",
            border: "1px solid #0ea5e9",
            borderRadius: "8px",
            padding: "20px",
          }}
        >
          <h3 style={{ margin: "0 0 15px 0", color: "#0369a1" }}>
            AI Responses Log:
          </h3>
          {aiResponses.map((response, index) => (
            <div
              key={index}
              style={{
                background: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "6px",
                padding: "15px",
                marginBottom: "10px",
              }}
            >
              <strong>Response {index + 1}:</strong>
              <pre
                style={{
                  whiteSpace: "pre-wrap",
                  margin: "10px 0 0 0",
                  fontSize: "14px",
                  color: "#374151",
                }}
              >
                {response}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
