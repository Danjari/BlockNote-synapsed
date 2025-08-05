import { ySyncPlugin } from "y-prosemirror";
import { BlockNoteExtension } from "../../editor/BlockNoteExtension.js";
export class SyncPlugin extends BlockNoteExtension {
    static key() {
        return "ySyncPlugin";
    }
    constructor(fragment) {
        super();
        this.addProsemirrorPlugin(ySyncPlugin(fragment));
    }
    get priority() {
        return 1001;
    }
}
//# sourceMappingURL=SyncPlugin.js.map