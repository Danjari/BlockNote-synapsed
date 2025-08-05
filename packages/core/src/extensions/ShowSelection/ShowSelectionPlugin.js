import { Plugin, PluginKey } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";
import { BlockNoteExtension } from "../../editor/BlockNoteExtension.js";
const PLUGIN_KEY = new PluginKey(`blocknote-show-selection`);
/**
 * Plugin that shows adds a decoration around the current selection
 * This can be used to highlight the current selection in the UI even when the
 * text editor is not focused.
 */
export class ShowSelectionPlugin extends BlockNoteExtension {
    editor;
    static key() {
        return "showSelection";
    }
    enabled = false;
    constructor(editor) {
        super();
        this.editor = editor;
        this.addProsemirrorPlugin(new Plugin({
            key: PLUGIN_KEY,
            props: {
                decorations: (state) => {
                    const { doc, selection } = state;
                    if (!this.enabled) {
                        return DecorationSet.empty;
                    }
                    const dec = Decoration.inline(selection.from, selection.to, {
                        "data-show-selection": "true",
                    });
                    return DecorationSet.create(doc, [dec]);
                },
            },
        }));
    }
    setEnabled(enabled) {
        if (this.enabled === enabled) {
            return;
        }
        this.enabled = enabled;
        this.editor.transact((tr) => tr.setMeta(PLUGIN_KEY, {}));
    }
    getEnabled() {
        return this.enabled;
    }
}
//# sourceMappingURL=ShowSelectionPlugin.js.map