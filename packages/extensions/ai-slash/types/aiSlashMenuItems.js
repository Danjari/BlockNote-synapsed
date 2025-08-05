/**
 * Get AI slash menu items for the BlockNote editor
 *
 * This function returns AI slash menu items that can be integrated with BlockNote's
 * suggestion menu system. The items will appear in the slash menu when typing "/".
 *
 * @param editor - The BlockNote editor instance
 * @param emitAICommand - Function to emit AI commands
 * @returns Array of AI slash menu items compatible with BlockNote's suggestion menu
 */
export function getAISlashMenuItems(editor, emitAICommand) {
    const getSelectedText = () => {
        return editor.getSelectedText();
    };
    const getCurrentBlockContent = () => {
        // For now, return a simple fallback
        // In a real implementation, you might want to extract text from the current block
        return "current block content";
    };
    const items = [
        {
            key: "explain",
            title: "Explain",
            subtext: "Get an explanation of the selected text",
            badge: "AI",
            aliases: ["explain", "what", "how", "why"],
            group: "AI",
            onItemClick: () => {
                const selectedText = getSelectedText();
                const content = selectedText || getCurrentBlockContent();
                emitAICommand("explain", { selectedText: content });
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
                const content = selectedText || getCurrentBlockContent();
                emitAICommand("quiz-me", { selectedText: content });
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
                const content = selectedText || getCurrentBlockContent();
                emitAICommand("summarize", { selectedText: content });
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
                const content = selectedText || getCurrentBlockContent();
                emitAICommand("diagram", { selectedText: content });
            },
        },
    ];
    return items;
}
//# sourceMappingURL=aiSlashMenuItems.js.map