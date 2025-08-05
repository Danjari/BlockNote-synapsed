import type { BlockNoteEditor } from "@blocknote/core";
import type { AIStreamChunk } from "./types.js";

/**
 * Utility class for handling AI response streaming in BlockNote
 */
export class AIStreamingUtils {
  private editor: BlockNoteEditor;
  private currentStreamingBlock: any = null;
  private streamBuffer: string = "";

  constructor(editor: BlockNoteEditor) {
    this.editor = editor;
  }

  /**
   * Start streaming an AI response
   *
   * @param blockType - Type of block to create (e.g., "quote", "paragraph")
   * @param initialContent - Initial content for the block
   * @returns The created block
   */
  startStreaming(_blockType: string = "quote", initialContent: string = "") {
    // Create a new block for the AI response
    const newBlock = {
      type: "paragraph",
    } as any;

    // Insert the block after the current cursor position
    const currentBlock = this.editor.getTextCursorPosition().block;
    this.currentStreamingBlock = this.editor.insertBlocks(
      [newBlock],
      currentBlock,
      "after",
    )[0];

    // Move cursor to the new block
    this.editor.setTextCursorPosition(this.currentStreamingBlock);

    // Initialize buffer
    this.streamBuffer = initialContent;

    return this.currentStreamingBlock;
  }

  /**
   * Update the streaming content
   *
   * @param chunk - New content chunk
   */
  updateStream(chunk: AIStreamChunk) {
    if (!this.currentStreamingBlock) return;

    // Append new content to buffer
    this.streamBuffer += chunk.content;

    // Update the block content
    this.editor.updateBlock(this.currentStreamingBlock, {
      content: [{ type: "text", text: this.streamBuffer, styles: {} }],
    });

    // If streaming is complete, move cursor to end of content
    if (chunk.isComplete) {
      this.editor.setTextCursorPosition(this.currentStreamingBlock, "end");
      this.currentStreamingBlock = null;
      this.streamBuffer = "";
    }
  }

  /**
   * Complete the streaming and clean up
   */
  completeStream() {
    if (this.currentStreamingBlock) {
      this.editor.setTextCursorPosition(this.currentStreamingBlock, "end");
      this.currentStreamingBlock = null;
      this.streamBuffer = "";
    }
  }

  /**
   * Cancel the current stream
   */
  cancelStream() {
    if (this.currentStreamingBlock) {
      // Remove the streaming block
      this.editor.removeBlocks([this.currentStreamingBlock]);
      this.currentStreamingBlock = null;
      this.streamBuffer = "";
    }
  }

  /**
   * Check if currently streaming
   */
  isStreaming(): boolean {
    return this.currentStreamingBlock !== null;
  }
}

/**
 * Create a streaming utilities instance for an editor
 *
 * @param editor - BlockNote editor instance
 * @returns AIStreamingUtils instance
 */
export function createAIStreamingUtils(
  editor: BlockNoteEditor,
): AIStreamingUtils {
  return new AIStreamingUtils(editor);
}
