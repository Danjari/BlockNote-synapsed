import { Transaction } from "prosemirror-state";
import { BlockNoteExtension } from "../../editor/BlockNoteExtension.js";
import { BlocksChanged } from "../../index.js";
/**
 * This plugin can filter transactions before they are applied to the editor, but with a higher-level API than `filterTransaction` from prosemirror.
 */
export declare class BlockChangePlugin extends BlockNoteExtension {
    static key(): string;
    private beforeChangeCallbacks;
    constructor();
    subscribe(callback: (context: {
        getChanges: () => BlocksChanged<any, any, any>;
        tr: Transaction;
    }) => boolean | void): () => void;
}
//# sourceMappingURL=BlockChangePlugin.d.ts.map