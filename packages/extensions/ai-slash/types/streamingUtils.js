"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIStreamingUtils = void 0;
exports.createAIStreamingUtils = createAIStreamingUtils;
/**
 * Utility class for handling AI response streaming in BlockNote
 */
var AIStreamingUtils = /** @class */ (function () {
    function AIStreamingUtils(editor) {
        this.currentStreamingBlock = null;
        this.streamBuffer = "";
        this.editor = editor;
    }
    /**
     * Start streaming an AI response
     *
     * @param blockType - Type of block to create (e.g., "quote", "paragraph")
     * @param initialContent - Initial content for the block
     * @returns The created block
     */
    AIStreamingUtils.prototype.startStreaming = function (blockType, initialContent) {
        if (blockType === void 0) { blockType = "quote"; }
        if (initialContent === void 0) { initialContent = ""; }
        // Create a new block for the AI response
        var newBlock = {
            type: blockType,
            content: initialContent ? [{ type: "text", text: initialContent }] : undefined,
        };
        // Insert the block after the current cursor position
        var currentBlock = this.editor.getTextCursorPosition().block;
        this.currentStreamingBlock = this.editor.insertBlocks([newBlock], currentBlock, "after")[0];
        // Move cursor to the new block
        this.editor.setTextCursorPosition(this.currentStreamingBlock);
        // Initialize buffer
        this.streamBuffer = initialContent;
        return this.currentStreamingBlock;
    };
    /**
     * Update the streaming content
     *
     * @param chunk - New content chunk
     */
    AIStreamingUtils.prototype.updateStream = function (chunk) {
        if (!this.currentStreamingBlock)
            return;
        // Append new content to buffer
        this.streamBuffer += chunk.content;
        // Update the block content
        this.editor.updateBlock(this.currentStreamingBlock, {
            content: [{ type: "text", text: this.streamBuffer }],
        });
        // If streaming is complete, move cursor to end of content
        if (chunk.isComplete) {
            this.editor.setTextCursorPosition(this.currentStreamingBlock, "end");
            this.currentStreamingBlock = null;
            this.streamBuffer = "";
        }
    };
    /**
     * Complete the streaming and clean up
     */
    AIStreamingUtils.prototype.completeStream = function () {
        if (this.currentStreamingBlock) {
            this.editor.setTextCursorPosition(this.currentStreamingBlock, "end");
            this.currentStreamingBlock = null;
            this.streamBuffer = "";
        }
    };
    /**
     * Cancel the current stream
     */
    AIStreamingUtils.prototype.cancelStream = function () {
        if (this.currentStreamingBlock) {
            // Remove the streaming block
            this.editor.removeBlocks([this.currentStreamingBlock]);
            this.currentStreamingBlock = null;
            this.streamBuffer = "";
        }
    };
    /**
     * Check if currently streaming
     */
    AIStreamingUtils.prototype.isStreaming = function () {
        return this.currentStreamingBlock !== null;
    };
    return AIStreamingUtils;
}());
exports.AIStreamingUtils = AIStreamingUtils;
/**
 * Create a streaming utilities instance for an editor
 *
 * @param editor - BlockNote editor instance
 * @returns AIStreamingUtils instance
 */
function createAIStreamingUtils(editor) {
    return new AIStreamingUtils(editor);
}
//# sourceMappingURL=streamingUtils.js.map