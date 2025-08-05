import type { BlockNoteEditor } from "@blocknote/core";
import type { AIStreamChunk } from "./types.js";
/**
 * Utility class for handling AI response streaming in BlockNote
 */
export declare class AIStreamingUtils {
    private editor;
    private currentStreamingBlock;
    private streamBuffer;
    constructor(editor: BlockNoteEditor);
    /**
     * Start streaming an AI response
     *
     * @param blockType - Type of block to create (e.g., "quote", "paragraph")
     * @param initialContent - Initial content for the block
     * @returns The created block
     */
    startStreaming(blockType?: string, initialContent?: string): any;
    /**
     * Update the streaming content
     *
     * @param chunk - New content chunk
     */
    updateStream(chunk: AIStreamChunk): void;
    /**
     * Complete the streaming and clean up
     */
    completeStream(): void;
    /**
     * Cancel the current stream
     */
    cancelStream(): void;
    /**
     * Check if currently streaming
     */
    isStreaming(): boolean;
}
/**
 * Create a streaming utilities instance for an editor
 *
 * @param editor - BlockNote editor instance
 * @returns AIStreamingUtils instance
 */
export declare function createAIStreamingUtils(editor: BlockNoteEditor): AIStreamingUtils;
//# sourceMappingURL=streamingUtils.d.ts.map