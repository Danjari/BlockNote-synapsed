import { yUndoPlugin } from "y-prosemirror";
import { BlockNoteExtension } from "../../editor/BlockNoteExtension.js";
export class UndoPlugin extends BlockNoteExtension {
    static key() {
        return "yUndoPlugin";
    }
    constructor({ editor }) {
        super();
        this.addProsemirrorPlugin(yUndoPlugin({ trackedOrigins: [editor] }));
    }
    get priority() {
        return 1000;
    }
}
//# sourceMappingURL=UndoPlugin.js.map