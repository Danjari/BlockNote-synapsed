/**
 * Get AI slash menu items for the BlockNote editor
 *
 *
 *
 *
 * @param emitAICommand - Function to emit AI commands
 * @returns Array of AI slash menu items
 */
export function getAISlashMenuItems(editor, emitAICommand) {
    const getSelectedText = () => {
        return editor.getSelectedText();
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
                if (!selectedText) {
                    // If no text selected, explain the current block
                    emitAICommand("explain", { selectedText: "current block content" });
                }
                else {
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
                    emitAICommand("quiz-me", { selectedText: "current block content" });
                }
                else {
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
                    emitAICommand("summarize", { selectedText: "current block content" });
                }
                else {
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
                    emitAICommand("diagram", { selectedText: "current block content" });
                }
                else {
                    emitAICommand("diagram", { selectedText });
                }
            },
        },
    ];
    return items;
}
//# sourceMappingURL=aiSlashMenuItems.js.map