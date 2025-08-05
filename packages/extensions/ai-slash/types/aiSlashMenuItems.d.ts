import type { BlockNoteEditor } from "@blocknote/core";
import type { AICommandAction } from "./types.js";
type DefaultReactSuggestionItem = {
    key: string;
    title: string;
    onItemClick: () => void;
    subtext?: string;
    badge?: string;
    aliases?: string[];
    group?: string;
    icon?: any;
    size?: "default" | "small";
};
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
export declare function getAISlashMenuItems(editor: BlockNoteEditor, emitAICommand: (action: AICommandAction, payload?: any) => void): DefaultReactSuggestionItem[];
export {};
//# sourceMappingURL=aiSlashMenuItems.d.ts.map