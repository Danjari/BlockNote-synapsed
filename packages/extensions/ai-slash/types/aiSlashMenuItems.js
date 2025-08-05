"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAISlashMenuItems = getAISlashMenuItems;
/**
 * Get AI slash menu items for the BlockNote editor
 *
 * @param editor - BlockNote editor instance
 * @param emitAICommand - Function to emit AI commands
 * @returns Array of AI slash menu items
 */
function getAISlashMenuItems(editor, emitAICommand) {
    var getSelectedText = function () {
        var selection = editor.getSelection();
        if (!selection)
            return "";
        // Get selected text from the current selection
        var from = selection.from, to = selection.to;
        var content = editor.getTextContent(from, to);
        return content.trim();
    };
    var items = [
        {
            key: "explain",
            title: "Explain",
            subtext: "Get an explanation of the selected text",
            badge: "AI",
            aliases: ["explain", "what", "how", "why"],
            group: "AI",
            onItemClick: function () {
                var selectedText = getSelectedText();
                if (!selectedText) {
                    // If no text selected, explain the current block
                    var currentBlock = editor.getTextCursorPosition().block;
                    var blockContent = editor.getTextContent(currentBlock);
                    emitAICommand("explain", { selectedText: blockContent });
                }
                else {
                    emitAICommand("explain", { selectedText: selectedText });
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
            onItemClick: function () {
                var selectedText = getSelectedText();
                if (!selectedText) {
                    // If no text selected, quiz on the current block
                    var currentBlock = editor.getTextCursorPosition().block;
                    var blockContent = editor.getTextContent(currentBlock);
                    emitAICommand("quiz-me", { selectedText: blockContent });
                }
                else {
                    emitAICommand("quiz-me", { selectedText: selectedText });
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
            onItemClick: function () {
                var selectedText = getSelectedText();
                if (!selectedText) {
                    // If no text selected, summarize the current block
                    var currentBlock = editor.getTextCursorPosition().block;
                    var blockContent = editor.getTextContent(currentBlock);
                    emitAICommand("summarize", { selectedText: blockContent });
                }
                else {
                    emitAICommand("summarize", { selectedText: selectedText });
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
            onItemClick: function () {
                var selectedText = getSelectedText();
                if (!selectedText) {
                    // If no text selected, diagram the current block
                    var currentBlock = editor.getTextCursorPosition().block;
                    var blockContent = editor.getTextContent(currentBlock);
                    emitAICommand("diagram", { selectedText: blockContent });
                }
                else {
                    emitAICommand("diagram", { selectedText: selectedText });
                }
            },
        },
    ];
    return items;
}
//# sourceMappingURL=aiSlashMenuItems.js.map