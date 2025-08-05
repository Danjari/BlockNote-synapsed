import { EventEmitter } from "../util/EventEmitter.js";
export class BlockNoteExtension extends EventEmitter {
    static key() {
        throw new Error("You must implement the key method in your extension");
    }
    addProsemirrorPlugin(plugin) {
        this.plugins.push(plugin);
    }
    plugins = [];
    get priority() {
        return undefined;
    }
    // eslint-disable-next-line
    constructor(..._args) {
        super();
        // Allow subclasses to have constructors with parameters
        // without this, we can't easily implement BlockNoteEditor.extension(MyExtension) pattern
    }
}
//# sourceMappingURL=BlockNoteExtension.js.map