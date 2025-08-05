import { Editor, EditorOptions, Editor as TiptapEditor } from "@tiptap/core";
import { EditorState, Transaction } from "@tiptap/pm/state";
import { PartialBlock } from "../blocks/defaultBlocks.js";
import { StyleSchema } from "../schema/index.js";
import type { BlockNoteEditor } from "./BlockNoteEditor.js";
export type BlockNoteTipTapEditorOptions = Partial<Omit<EditorOptions, "content">> & {
    content: PartialBlock<any, any, any>[];
};
/**
 * Custom Editor class that extends TiptapEditor and separates
 * the creation of the view from the constructor.
 */
export declare class BlockNoteTipTapEditor extends TiptapEditor {
    private _state;
    static create: (options: BlockNoteTipTapEditorOptions, styleSchema: StyleSchema) => BlockNoteTipTapEditor;
    protected constructor(options: BlockNoteTipTapEditorOptions, styleSchema: StyleSchema);
    get state(): EditorState;
    dispatch(transaction: Transaction): void;
    forceEnablePlugins(): void;
    /**
     * Replace the default `createView` method with a custom one - which we call on mount
     */
    private createViewAlternative;
    /**
     * Mounts / unmounts the editor to a dom element
     *
     * @param element DOM element to mount to, ur null / undefined to destroy
     */
    mount: (blockNoteEditor: BlockNoteEditor<any, any, any>, element?: HTMLElement | null, contentComponent?: any) => void;
}
declare module "@tiptap/core" {
    interface EditorEvents {
        /**
         * This is a custom event that will be emitted in Tiptap V3.
         * We use it to provide the appendedTransactions, until Tiptap V3 is released.
         */
        "v3-update": {
            editor: Editor;
            transaction: Transaction;
            appendedTransactions: Transaction[];
        };
    }
}
//# sourceMappingURL=BlockNoteTipTapEditor.d.ts.map