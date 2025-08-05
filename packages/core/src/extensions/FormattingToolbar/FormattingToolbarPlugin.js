import { isNodeSelection, isTextSelection, posToDOMRect } from "@tiptap/core";
import { Plugin, PluginKey, TextSelection, } from "prosemirror-state";
import { BlockNoteExtension } from "../../editor/BlockNoteExtension.js";
export class FormattingToolbarView {
    editor;
    pmView;
    state;
    emitUpdate;
    preventHide = false;
    preventShow = false;
    shouldShow = ({ view, state, from, to }) => {
        const { doc, selection } = state;
        const { empty } = selection;
        // Sometime check for `empty` is not enough.
        // Doubleclick an empty paragraph returns a node size of 2.
        // So we check also for an empty text size.
        const isEmptyTextBlock = !doc.textBetween(from, to).length && isTextSelection(state.selection);
        // Don't show toolbar inside code blocks
        if (selection.$from.parent.type.spec.code ||
            (isNodeSelection(selection) && selection.node.type.spec.code)) {
            return false;
        }
        if (empty || isEmptyTextBlock) {
            return false;
        }
        const focusedElement = document.activeElement;
        if (!this.isElementWithinEditorWrapper(focusedElement) && view.editable) {
            // editable editors must have focus for the toolbar to show
            return false;
        }
        return true;
    };
    constructor(editor, pmView, emitUpdate) {
        this.editor = editor;
        this.pmView = pmView;
        this.emitUpdate = () => {
            if (!this.state) {
                throw new Error("Attempting to update uninitialized formatting toolbar");
            }
            emitUpdate(this.state);
        };
        pmView.dom.addEventListener("mousedown", this.viewMousedownHandler);
        pmView.root.addEventListener("mouseup", this.mouseupHandler);
        pmView.dom.addEventListener("dragstart", this.dragHandler);
        pmView.dom.addEventListener("dragover", this.dragHandler);
        pmView.dom.addEventListener("blur", this.blurHandler);
        // Setting capture=true ensures that any parent container of the editor that
        // gets scrolled will trigger the scroll event. Scroll events do not bubble
        // and so won't propagate to the document by default.
        pmView.root.addEventListener("scroll", this.scrollHandler, true);
    }
    blurHandler = (event) => {
        if (this.preventHide) {
            this.preventHide = false;
            return;
        }
        const editorWrapper = this.pmView.dom.parentElement;
        // Checks if the focus is moving to an element outside the editor. If it is,
        // the toolbar is hidden.
        if (
        // An element is clicked.
        event &&
            event.relatedTarget &&
            // Element is inside the editor.
            (editorWrapper === event.relatedTarget ||
                editorWrapper.contains(event.relatedTarget) ||
                event.relatedTarget.matches(".bn-ui-container, .bn-ui-container *"))) {
            return;
        }
        if (this.state?.show) {
            this.state.show = false;
            this.emitUpdate();
        }
    };
    isElementWithinEditorWrapper = (element) => {
        if (!element) {
            return false;
        }
        const editorWrapper = this.pmView.dom.parentElement;
        if (!editorWrapper) {
            return false;
        }
        return editorWrapper.contains(element);
    };
    viewMousedownHandler = (e) => {
        if (!this.isElementWithinEditorWrapper(e.target) ||
            e.button === 0) {
            this.preventShow = true;
        }
    };
    mouseupHandler = () => {
        if (this.preventShow) {
            this.preventShow = false;
            setTimeout(() => this.update(this.pmView));
        }
    };
    // For dragging the whole editor.
    dragHandler = () => {
        if (this.state?.show) {
            this.state.show = false;
            this.emitUpdate();
        }
    };
    scrollHandler = () => {
        if (this.state?.show) {
            this.state.referencePos = this.getSelectionBoundingBox();
            this.emitUpdate();
        }
    };
    update(view, oldState) {
        // Delays the update to handle edge case with drag and drop, where the view
        // is blurred asynchronously and happens only after the state update.
        // Wrapping in a setTimeout gives enough time to wait for the blur event to
        // occur before updating the toolbar.
        const { state, composing } = view;
        const { doc, selection } = state;
        const isSame = oldState && oldState.doc.eq(doc) && oldState.selection.eq(selection);
        if (composing || isSame) {
            return;
        }
        // support for CellSelections
        const { ranges } = selection;
        const from = Math.min(...ranges.map((range) => range.$from.pos));
        const to = Math.max(...ranges.map((range) => range.$to.pos));
        const shouldShow = this.shouldShow({
            view,
            state,
            from,
            to,
        });
        // in jsdom, Range.prototype.getClientRects is not implemented,
        // this would cause `getSelectionBoundingBox` to fail
        // we can just ignore jsdom for now and not show the toolbar
        const jsdom = typeof Range.prototype.getClientRects === "undefined";
        // Checks if menu should be shown/updated.
        if (!this.preventShow && (shouldShow || this.preventHide) && !jsdom) {
            // Unlike other UI elements, we don't prevent the formatting toolbar from
            // showing when the editor is not editable. This is because some buttons,
            // e.g. the download file button, should still be accessible. Therefore,
            // logic for hiding when the editor is non-editable is handled
            // individually in each button.
            const newReferencePos = this.getSelectionBoundingBox();
            // Workaround to ensure the correct reference position when rendering 
            // React components. Without this, e.g. updating styles on React inline
            // content causes the formatting toolbar to be in the wrong place. We 
            // know the component has not yet rendered if the reference position has 
            // zero dimensions.
            if (newReferencePos.x === 0 ||
                newReferencePos.y === 0 ||
                newReferencePos.width === 0 ||
                newReferencePos.height === 0) {
                // Updates the reference position again following the render.
                queueMicrotask(() => {
                    const nextState = {
                        show: true,
                        referencePos: this.getSelectionBoundingBox(),
                    };
                    this.state = nextState;
                    this.emitUpdate();
                    // For some reason, while the selection doesn't actually change and
                    // remains correct, it visually appears to be collapsed. This forces
                    // a ProseMirror view update, which fixes the issue.
                    view.dispatch(view.state.tr.setSelection(TextSelection.create(view.state.doc, view.state.selection.from + 1, view.state.selection.to)));
                    // 2 separate `dispatch` calls are needed, else ProseMirror realizes
                    // that the transaction is a no-op and doesn't update the view.
                    view.dispatch(view.state.tr.setSelection(TextSelection.create(view.state.doc, view.state.selection.from - 1, view.state.selection.to)));
                });
                return;
            }
            const nextState = {
                show: true,
                referencePos: this.getSelectionBoundingBox(),
            };
            if (nextState.show !== this.state?.show ||
                nextState.referencePos.toJSON() !== this.state?.referencePos.toJSON()) {
                this.state = nextState;
                this.emitUpdate();
            }
            return;
        }
        // Checks if menu should be hidden.
        if (this.state?.show &&
            !this.preventHide &&
            (!shouldShow || this.preventShow || !this.editor.isEditable)) {
            this.state.show = false;
            this.emitUpdate();
            return;
        }
    }
    destroy() {
        this.pmView.dom.removeEventListener("mousedown", this.viewMousedownHandler);
        this.pmView.root.removeEventListener("mouseup", this.mouseupHandler);
        this.pmView.dom.removeEventListener("dragstart", this.dragHandler);
        this.pmView.dom.removeEventListener("dragover", this.dragHandler);
        this.pmView.dom.removeEventListener("blur", this.blurHandler);
        this.pmView.root.removeEventListener("scroll", this.scrollHandler, true);
    }
    closeMenu = () => {
        if (this.state?.show) {
            this.state.show = false;
            this.emitUpdate();
        }
    };
    getSelectionBoundingBox() {
        const { state } = this.pmView;
        const { selection } = state;
        // support for CellSelections
        const { ranges } = selection;
        const from = Math.min(...ranges.map((range) => range.$from.pos));
        const to = Math.max(...ranges.map((range) => range.$to.pos));
        if (isNodeSelection(selection)) {
            const node = this.pmView.nodeDOM(from);
            if (node) {
                return node.getBoundingClientRect();
            }
        }
        return posToDOMRect(this.pmView, from, to);
    }
}
export const formattingToolbarPluginKey = new PluginKey("FormattingToolbarPlugin");
export class FormattingToolbarProsemirrorPlugin extends BlockNoteExtension {
    static key() {
        return "formattingToolbar";
    }
    view;
    constructor(editor) {
        super();
        this.addProsemirrorPlugin(new Plugin({
            key: formattingToolbarPluginKey,
            view: (editorView) => {
                this.view = new FormattingToolbarView(editor, editorView, (state) => {
                    this.emit("update", state);
                });
                return this.view;
            },
            props: {
                handleKeyDown: (_view, event) => {
                    if (event.key === "Escape" && this.shown) {
                        this.view.closeMenu();
                        return true;
                    }
                    return false;
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
    closeMenu = () => this.view.closeMenu();
}
//# sourceMappingURL=FormattingToolbarPlugin.js.map