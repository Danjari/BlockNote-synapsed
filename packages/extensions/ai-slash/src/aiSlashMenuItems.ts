import type { BlockNoteEditor } from "@blocknote/core";
import type { AISlashMenuItem, AICommandAction } from "./types.js";

/**
 * Get AI slash menu items for the BlockNote editor
 * 
 * @param editor - BlockNote editor instance
 * @param emitAICommand - Function to emit AI commands
 * @returns Array of AI slash menu items
 */
export function getAISlashMenuItems(
  editor: BlockNoteEditor,
  emitAICommand: (action: AICommandAction, payload?: any) => void
): AISlashMenuItem[] {
  const getSelectedText = () => {
    const selection = editor.getSelection();
    if (!selection) return "";
    
    // Get selected text from the current selection
    const { from, to } = selection;
    const content = editor.getTextContent(from, to);
    return content.trim();
  };

  const items: AISlashMenuItem[] = [
    {
      key: "explain",
      title: "Explain",
      subtext: "Get an explanation of the selected text",
      badge: "AI",
      aliases: ["explain", "what", "how", "why"],
      group: "AI",
      onItemClick: () => {
        const selectedText = getSelectedText();
        if (!selectedText) {
          // If no text selected, explain the current block
          const currentBlock = editor.getTextCursorPosition().block;
          const blockContent = editor.getTextContent(currentBlock);
          emitAICommand("explain", { selectedText: blockContent });
        } else {
          emitAICommand("explain", { selectedText });
        }
      },
    },
    {
      key: "quiz-me",
      title: "Quiz Me",
      subtext: "Generate a quiz based on the content",
      badge: "AI",
      aliases: ["quiz", "test", "question"],
      group: "AI",
      onItemClick: () => {
        const selectedText = getSelectedText();
        if (!selectedText) {
          // If no text selected, quiz on the current block
          const currentBlock = editor.getTextCursorPosition().block;
          const blockContent = editor.getTextContent(currentBlock);
          emitAICommand("quiz-me", { selectedText: blockContent });
        } else {
          emitAICommand("quiz-me", { selectedText });
        }
      },
    },
    {
      key: "summarize",
      title: "Summarize",
      subtext: "Create a summary of the selected text",
      badge: "AI",
      aliases: ["summary", "summarize", "tl;dr"],
      group: "AI",
      onItemClick: () => {
        const selectedText = getSelectedText();
        if (!selectedText) {
          // If no text selected, summarize the current block
          const currentBlock = editor.getTextCursorPosition().block;
          const blockContent = editor.getTextContent(currentBlock);
          emitAICommand("summarize", { selectedText: blockContent });
        } else {
          emitAICommand("summarize", { selectedText });
        }
      },
    },
    {
      key: "diagram",
      title: "Create Diagram",
      subtext: "Generate a diagram from the content",
      badge: "AI",
      aliases: ["diagram", "chart", "visualize"],
      group: "AI",
      onItemClick: () => {
        const selectedText = getSelectedText();
        if (!selectedText) {
          // If no text selected, diagram the current block
          const currentBlock = editor.getTextCursorPosition().block;
          const blockContent = editor.getTextContent(currentBlock);
          emitAICommand("diagram", { selectedText: blockContent });
        } else {
          emitAICommand("diagram", { selectedText });
        }
      },
    },
  ];

  return items;
} 