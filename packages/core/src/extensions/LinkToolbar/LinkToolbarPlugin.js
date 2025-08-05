import { getMarkRange, posToDOMRect } from "@tiptap/core";
import { Plugin, PluginKey } from "prosemirror-state";
import { getPmSchema } from "../../api/pmUtil.js";
import { BlockNoteExtension } from "../../editor/BlockNoteExtension.js";
class LinkToolbarView {
    editor;
    pmView;
    state;
    emitUpdate;
    menuUpdateTimer;
    startMenuUpdateTimer;
    stopMenuUpdateTimer;
    mouseHoveredLinkMark;
    mouseHoveredLinkMarkRange;
    keyboardHoveredLinkMark;
    keyboardHoveredLinkMarkRange;
    linkMark;
    linkMarkRange;
    constructor(editor, pmView, emitUpdate) {
        this.editor = editor;
        this.pmView = pmView;
        this.emitUpdate = () => {
            if (!this.state) {
                throw new Error("Attempting to update uninitialized link toolbar");
            }
            emitUpdate(this.state);
        };
        this.startMenuUpdateTimer = () => {
            this.menuUpdateTimer = setTimeout(() => {
                this.update(this.pmView, undefined, true);
            }, 250);
        };
        this.stopMenuUpdateTimer = () => {
            if (this.menuUpdateTimer) {
                clearTimeout(this.menuUpdateTimer);
                this.menuUpdateTimer = undefined;
            }
            return false;
        };
        this.pmView.dom.addEventListener("mouseover", this.mouseOverHandler);
        this.pmView.root.addEventListener("click", this.clickHandler, true);
        // Setting capture=true ensures that any parent container of the editor that
        // gets scrolled will trigger the scroll event. Scroll events do not bubble
        // and so won't propagate to the document by default.
        this.pmView.root.addEventListener("scroll", this.scrollHandler, true);
    }
    mouseOverHandler = (event) => {
        // Resets the link mark currently hovered by the mouse cursor.
        this.mouseHoveredLinkMark = undefined;
        this.mouseHoveredLinkMarkRange = undefined;
        this.stopMenuUpdateTimer();
        if (event.target instanceof HTMLAnchorElement &&
            event.target.nodeName === "A") {
            // Finds link mark at the hovered element's position to update mouseHoveredLinkMark and
            // mouseHoveredLinkMarkRange.
            const hoveredLinkElement = event.target;
            const posInHoveredLinkMark = this.pmView.posAtDOM(hoveredLinkElement, 0) + 1;
            const resolvedPosInHoveredLinkMark = this.pmView.state.doc.resolve(posInHoveredLinkMark);
            const marksAtPos = resolvedPosInHoveredLinkMark.marks();
            for (const mark of marksAtPos) {
                if (mark.type.name === this.pmView.state.schema.mark("link").type.name) {
                    this.mouseHoveredLinkMark = mark;
                    this.mouseHoveredLinkMarkRange =
                        getMarkRange(resolvedPosInHoveredLinkMark, mark.type, mark.attrs) ||
                            undefined;
                    break;
                }
            }
        }
        this.startMenuUpdateTimer();
        return false;
    };
    clickHandler = (event) => {
        const editorWrapper = this.pmView.dom.parentElement;
        if (
        // Toolbar is open.
        this.linkMark &&
            // An element is clicked.
            event &&
            event.target &&
            // The clicked element is not the editor.
            !(editorWrapper === event.target ||
                editorWrapper.contains(event.target))) {
            if (this.state?.show) {
                this.state.show = false;
                this.emitUpdate();
            }
        }
    };
    scrollHandler = () => {
        if (this.linkMark !== undefined) {
            if (this.state?.show) {
                this.state.referencePos = posToDOMRect(this.pmView, this.linkMarkRange.from, this.linkMarkRange.to);
                this.emitUpdate();
            }
        }
    };
    editLink(url, text) {
        this.editor.transact((tr) => {
            const pmSchema = getPmSchema(tr);
            tr.insertText(text, this.linkMarkRange.from, this.linkMarkRange.to);
            tr.addMark(this.linkMarkRange.from, this.linkMarkRange.from + text.length, pmSchema.mark("link", { href: url }));
        });
        this.pmView.focus();
        if (this.state?.show) {
            this.state.show = false;
            this.emitUpdate();
        }
    }
    deleteLink() {
        this.editor.transact((tr) => tr
            .removeMark(this.linkMarkRange.from, this.linkMarkRange.to, this.linkMark.type)
            .setMeta("preventAutolink", true));
        this.pmView.focus();
        if (this.state?.show) {
            this.state.show = false;
            this.emitUpdate();
        }
    }
    update(view, oldState, fromMouseOver = false) {
        const { state } = view;
        const isSame = oldState &&
            oldState.selection.from === state.selection.from &&
            oldState.selection.to === state.selection.to;
        if (isSame || !this.pmView.hasFocus()) {
            return;
        }
        // Saves the currently hovered link mark before it's updated.
        const prevLinkMark = this.linkMark;
        // Resets the currently hovered link mark.
        this.linkMark = undefined;
        this.linkMarkRange = undefined;
        // Resets the link mark currently hovered by the keyboard cursor.
        this.keyboardHoveredLinkMark = undefined;
        this.keyboardHoveredLinkMarkRange = undefined;
        // Finds link mark at the editor selection's position to update keyboardHoveredLinkMark and
        // keyboardHoveredLinkMarkRange.
        if (this.pmView.state.selection.empty) {
            const marksAtPos = this.pmView.state.selection.$from.marks();
            for (const mark of marksAtPos) {
                if (mark.type.name === this.pmView.state.schema.mark("link").type.name) {
                    this.keyboardHoveredLinkMark = mark;
                    this.keyboardHoveredLinkMarkRange =
                        getMarkRange(this.pmView.state.selection.$from, mark.type, mark.attrs) || undefined;
                    break;
                }
            }
        }
        if (this.mouseHoveredLinkMark && fromMouseOver) {
            this.linkMark = this.mouseHoveredLinkMark;
            this.linkMarkRange = this.mouseHoveredLinkMarkRange;
        }
        // Keyboard cursor position takes precedence over mouse hovered link.
        if (this.keyboardHoveredLinkMark) {
            this.linkMark = this.keyboardHoveredLinkMark;
            this.linkMarkRange = this.keyboardHoveredLinkMarkRange;
        }
        if (this.linkMark && this.editor.isEditable) {
            this.state = {
                show: true,
                referencePos: posToDOMRect(this.pmView, this.linkMarkRange.from, this.linkMarkRange.to),
                url: this.linkMark.attrs.href,
                text: this.pmView.state.doc.textBetween(this.linkMarkRange.from, this.linkMarkRange.to),
            };
            this.emitUpdate();
            return;
        }
        // Hides menu.
        if (this.state?.show &&
            prevLinkMark &&
            (!this.linkMark || !this.editor.isEditable)) {
            this.state.show = false;
            this.emitUpdate();
            return;
        }
    }
    closeMenu = () => {
        if (this.state?.show) {
            this.state.show = false;
            this.emitUpdate();
        }
    };
    destroy() {
        this.pmView.dom.removeEventListener("mouseover", this.mouseOverHandler);
        this.pmView.root.removeEventListener("scroll", this.scrollHandler, true);
        this.pmView.root.removeEventListener("click", this.clickHandler, true);
    }
}
export const linkToolbarPluginKey = new PluginKey("LinkToolbarPlugin");
export class LinkToolbarProsemirrorPlugin extends BlockNoteExtension {
    static key() {
        return "linkToolbar";
    }
    view;
    constructor(editor) {
        super();
        this.addProsemirrorPlugin(new Plugin({
            key: linkToolbarPluginKey,
            view: (editorView) => {
                this.view = new LinkToolbarView(editor, editorView, (state) => {
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
    onUpdate(callback) {
        return this.on("update", callback);
    }
    /**
     * Edit the currently hovered link.
     */
    editLink = (url, text) => {
        this.view.editLink(url, text);
    };
    /**
     * Delete the currently hovered link.
     */
    deleteLink = () => {
        this.view.deleteLink();
    };
    /**
     * When hovering on/off links using the mouse cursor, the link toolbar will
     * open & close with a delay.
     *
     * This function starts the delay timer, and should be used for when the mouse
     * cursor enters the link toolbar.
     */
    startHideTimer = () => {
        this.view.startMenuUpdateTimer();
    };
    /**
     * When hovering on/off links using the mouse cursor, the link toolbar will
     * open & close with a delay.
     *
     * This function stops the delay timer, and should be used for when the mouse
     * cursor exits the link toolbar.
     */
    stopHideTimer = () => {
        this.view.stopMenuUpdateTimer();
    };
    get shown() {
        return this.view?.state?.show || false;
    }
    closeMenu = () => this.view.closeMenu();
}
//# sourceMappingURL=LinkToolbarPlugin.js.map