import { Plugin } from "prosemirror-state";
import { getBlocksChangedByTransaction } from "../../api/nodeUtil.js";
import { BlockNoteExtension } from "../../editor/BlockNoteExtension.js";
/**
 * This plugin can filter transactions before they are applied to the editor, but with a higher-level API than `filterTransaction` from prosemirror.
 */
export class BlockChangePlugin extends BlockNoteExtension {
    static key() {
        return "blockChange";
    }
    beforeChangeCallbacks = [];
    constructor() {
        super();
        this.addProsemirrorPlugin(new Plugin({
            filterTransaction: (tr) => {
                let changes = undefined;
                return this.beforeChangeCallbacks.reduce((acc, cb) => {
                    if (acc === false) {
                        // We only care that we hit a `false` result, so we can stop iterating.
                        return acc;
                    }
                    return (cb({
                        getChanges() {
                            if (changes) {
                                return changes;
                            }
                            changes = getBlocksChangedByTransaction(tr);
                            return changes;
                        },
                        tr,
                    }) !== false);
                }, true);
            },
        }));
    }
    subscribe(callback) {
        this.beforeChangeCallbacks.push(callback);
        return () => {
            this.beforeChangeCallbacks = this.beforeChangeCallbacks.filter((cb) => cb !== callback);
        };
    }
}
//# sourceMappingURL=BlockChangePlugin.js.map