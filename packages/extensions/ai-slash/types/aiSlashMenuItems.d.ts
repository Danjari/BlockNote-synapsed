import type { BlockNoteEditor } from "@blocknote/core";
import type { AISlashMenuItem, AICommandAction } from "./types.js";
/**
 * Get AI slash menu items for the BlockNote editor
 *
 * @param editor - BlockNote editor instance
 * @param emitAICommand - Function to emit AI commands
 * @returns Array of AI slash menu items
 */
export declare function getAISlashMenuItems(editor: BlockNoteEditor, emitAICommand: (action: AICommandAction, payload?: any) => void): AISlashMenuItem[];
//# sourceMappingURL=aiSlashMenuItems.d.ts.map