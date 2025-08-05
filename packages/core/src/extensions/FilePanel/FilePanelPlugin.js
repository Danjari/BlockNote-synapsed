import { Plugin, PluginKey } from "prosemirror-state";
import { ySyncPluginKey } from "y-prosemirror";
import { BlockNoteExtension } from "../../editor/BlockNoteExtension.js";
export class FilePanelView {
    editor;
    pluginKey;
    pmView;
    state;
    emitUpdate;
    constructor(editor, pluginKey, pmView, emitUpdate) {
        this.editor = editor;
        this.pluginKey = pluginKey;
        this.pmView = pmView;
        this.emitUpdate = () => {
            if (!this.state) {
                throw new Error("Attempting to update uninitialized file panel");
            }
            emitUpdate(this.state);
        };
        pmView.dom.addEventListener("mousedown", this.mouseDownHandler);
        pmView.dom.addEventListener("dragstart", this.dragstartHandler);
        // Setting capture=true ensures that any parent container of the editor that
        // gets scrolled will trigger the scroll event. Scroll events do not bubble
        // and so won't propagate to the document by default.
        pmView.root.addEventListener("scroll", this.scrollHandler, true);
    }
    mouseDownHandler = () => {
        if (this.state?.show) {
            this.state.show = false;
            this.emitUpdate();
        }
    };
    // For dragging the whole editor.
    dragstartHandler = () => {
        if (this.state?.show) {
            this.state.show = false;
            this.emitUpdate();
        }
    };
    scrollHandler = () => {
        if (this.state?.show) {
            const blockElement = this.pmView.root.querySelector(`[data-node-type="blockContainer"][data-id="${this.state.block.id}"]`);
            if (!blockElement) {
                return;
            }
            this.state.referencePos = blockElement.getBoundingClientRect();
            this.emitUpdate();
        }
    };
    update(view, prevState) {
        const pluginState = this.pluginKey.getState(view.state);
        const prevPluginState = this.pluginKey.getState(prevState);
        if (!this.state?.show && pluginState?.block && this.editor.isEditable) {
            const blockElement = this.pmView.root.querySelector(`[data-node-type="blockContainer"][data-id="${pluginState.block.id}"]`);
            if (!blockElement) {
                return;
            }
            this.state = {
                show: true,
                referencePos: blockElement.getBoundingClientRect(),
                block: pluginState.block,
            };
            this.emitUpdate();
            return;
        }
        const isOpening = pluginState?.block && !prevPluginState?.block;
        const isClosing = !pluginState?.block && prevPluginState?.block;
        if (isOpening && this.state && !this.state.show) {
            this.state.show = true;
            this.emitUpdate();
        }
        if (isClosing && this.state?.show) {
            this.state.show = false;
            this.emitUpdate();
        }
    }
    closeMenu = () => {
        if (this.state?.show) {
            this.state.show = false;
            this.emitUpdate();
        }
    };
    destroy() {
        this.pmView.dom.removeEventListener("mousedown", this.mouseDownHandler);
        this.pmView.dom.removeEventListener("dragstart", this.dragstartHandler);
        this.pmView.root.removeEventListener("scroll", this.scrollHandler, true);
    }
}
const filePanelPluginKey = new PluginKey("FilePanelPlugin");
export class FilePanelProsemirrorPlugin extends BlockNoteExtension {
    static key() {
        return "filePanel";
    }
    view;
    constructor(editor) {
        super();
        this.addProsemirrorPlugin(new Plugin({
            key: filePanelPluginKey,
            view: (editorView) => {
                this.view = new FilePanelView(editor, filePanelPluginKey, editorView, (state) => {
                    this.emit("update", state);
                });
                return this.view;
            },
            props: {
                handleKeyDown: (_view, event) => {
                    if (event.key === "Escape" && this.shown) {
                        this.view?.closeMenu();
                        return true;
                    }
                    return false;
                },
            },
            state: {
                init: () => {
                    return {
                        block: undefined,
                    };
                },
                apply: (transaction, prev) => {
                    const state = transaction.getMeta(filePanelPluginKey);
                    if (state) {
                        return state;
                    }
                    if (!transaction.getMeta(ySyncPluginKey) &&
                        (transaction.selectionSet || transaction.docChanged)) {
                        return { block: undefined };
                    }
                    return prev;
                },
            },
        }));
    }
    get shown() {
        return this.view?.state?.show || false;
    }
    onUpdate(callback) {
        return this.on("update", callback);
    }
    closeMenu = () => this.view?.closeMenu();
}
//# sourceMappingURL=FilePanelPlugin.js.map