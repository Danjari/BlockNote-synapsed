import { Extension, getSchema, isNodeSelection, Mark, posToDOMRect, Node as TipTapNode, } from "@tiptap/core";
import { insertBlocks } from "../api/blockManipulation/commands/insertBlocks/insertBlocks.js";
import { moveBlocksDown, moveBlocksUp, } from "../api/blockManipulation/commands/moveBlocks/moveBlocks.js";
import { canNestBlock, canUnnestBlock, nestBlock, unnestBlock, } from "../api/blockManipulation/commands/nestBlock/nestBlock.js";
import { removeAndInsertBlocks } from "../api/blockManipulation/commands/replaceBlocks/replaceBlocks.js";
import { updateBlock } from "../api/blockManipulation/commands/updateBlock/updateBlock.js";
import { getBlock, getNextBlock, getParentBlock, getPrevBlock, } from "../api/blockManipulation/getBlock/getBlock.js";
import { insertContentAt } from "../api/blockManipulation/insertContentAt.js";
import { getSelection, getSelectionCutBlocks, setSelection, } from "../api/blockManipulation/selections/selection.js";
import { getTextCursorPosition, setTextCursorPosition, } from "../api/blockManipulation/selections/textCursorPosition.js";
import { createExternalHTMLExporter } from "../api/exporters/html/externalHTMLExporter.js";
import { blocksToMarkdown } from "../api/exporters/markdown/markdownExporter.js";
import { HTMLToBlocks } from "../api/parsers/html/parseHTML.js";
import { markdownToBlocks, markdownToHTML, } from "../api/parsers/markdown/parseMarkdown.js";
import { UniqueID } from "../extensions/UniqueID/UniqueID.js";
import { mergeCSSClasses } from "../util/browser.js";
import { UnreachableCaseError } from "../util/typescript.js";
import { getBlockNoteExtensions } from "./BlockNoteExtensions.js";
import { transformPasted } from "./transformPasted.js";
import { checkDefaultBlockTypeInSchema } from "../blocks/defaultBlockTypeGuards.js";
import { BlockNoteSchema } from "./BlockNoteSchema.js";
import { BlockNoteTipTapEditor, } from "./BlockNoteTipTapEditor.js";
import { en } from "../i18n/locales/index.js";
import { redo, undo } from "@tiptap/pm/history";
import { TextSelection, } from "@tiptap/pm/state";
import { dropCursor } from "prosemirror-dropcursor";
import { redoCommand, undoCommand, ySyncPluginKey } from "y-prosemirror";
import { createInternalHTMLSerializer } from "../api/exporters/html/internalHTMLSerializer.js";
import { inlineContentToNodes } from "../api/nodeConversions/blockToNode.js";
import { docToBlocks } from "../api/nodeConversions/nodeToBlock.js";
import { getBlocksChangedByTransaction, } from "../api/nodeUtil.js";
import { nestedListsToBlockNoteStructure } from "../api/parsers/html/util/nestedLists.js";
import { EventEmitter } from "../util/EventEmitter.js";
import { BlockNoteExtension } from "./BlockNoteExtension.js";
import "../style.css";
const blockNoteTipTapOptions = {
    enableInputRules: true,
    enablePasteRules: true,
    enableCoreExtensions: false,
};
export class BlockNoteEditor extends EventEmitter {
    options;
    /**
     * The underlying prosemirror schema
     */
    pmSchema;
    /**
     * extensions that are added to the editor, can be tiptap extensions or prosemirror plugins
     */
    extensions = {};
    /**
     * Boolean indicating whether the editor is in headless mode.
     * Headless mode means we can use features like importing / exporting blocks,
     * but there's no underlying editor (UI) instantiated.
     *
     * You probably don't need to set this manually, but use the `server-util` package instead that uses this option internally
     */
    headless = false;
    _tiptapEditor = undefined; // TODO: Type should actually reflect that it can be `undefined` in headless mode
    /**
     * Used by React to store a reference to an `ElementRenderer` helper utility to make sure we can render React elements
     * in the correct context (used by `ReactRenderUtil`)
     */
    elementRenderer = null;
    /**
     * Cache of all blocks. This makes sure we don't have to "recompute" blocks if underlying Prosemirror Nodes haven't changed.
     * This is especially useful when we want to keep track of the same block across multiple operations,
     * with this cache, blocks stay the same object reference (referential equality with ===).
     */
    blockCache = new WeakMap();
    /**
     * The dictionary contains translations for the editor.
     */
    dictionary;
    /**
     * The schema of the editor. The schema defines which Blocks, InlineContent, and Styles are available in the editor.
     */
    schema;
    blockImplementations;
    inlineContentImplementations;
    styleImplementations;
    formattingToolbar;
    linkToolbar;
    sideMenu;
    suggestionMenus;
    filePanel;
    tableHandles;
    comments;
    showSelectionPlugin;
    /**
     * The plugin for forking a document, only defined if in collaboration mode
     */
    forkYDocPlugin;
    /**
     * The `uploadFile` method is what the editor uses when files need to be uploaded (for example when selecting an image to upload).
     * This method should set when creating the editor as this is application-specific.
     *
     * `undefined` means the application doesn't support file uploads.
     *
     * @param file The file that should be uploaded.
     * @returns The URL of the uploaded file OR an object containing props that should be set on the file block (such as an id)
     */
    uploadFile;
    onUploadStartCallbacks = [];
    onUploadEndCallbacks = [];
    resolveFileUrl;
    resolveUsers;
    /**
     * Editor settings
     */
    settings;
    static create(options = {}) {
        return new BlockNoteEditor(options);
    }
    constructor(options) {
        super();
        this.options = options;
        const anyOpts = options;
        if (anyOpts.onEditorContentChange) {
            throw new Error("onEditorContentChange initialization option is deprecated, use <BlockNoteView onChange={...} />, the useEditorChange(...) hook, or editor.onChange(...)");
        }
        if (anyOpts.onTextCursorPositionChange) {
            throw new Error("onTextCursorPositionChange initialization option is deprecated, use <BlockNoteView onSelectionChange={...} />, the useEditorSelectionChange(...) hook, or editor.onSelectionChange(...)");
        }
        if (anyOpts.onEditorReady) {
            throw new Error("onEditorReady is deprecated. Editor is immediately ready for use after creation.");
        }
        if (anyOpts.editable) {
            throw new Error("editable initialization option is deprecated, use <BlockNoteView editable={true/false} />, or alternatively editor.isEditable = true/false");
        }
        this.dictionary = options.dictionary || en;
        this.settings = {
            tables: {
                splitCells: options?.tables?.splitCells ?? false,
                cellBackgroundColor: options?.tables?.cellBackgroundColor ?? false,
                cellTextColor: options?.tables?.cellTextColor ?? false,
                headers: options?.tables?.headers ?? false,
            },
            codeBlock: {
                indentLineWithTab: options?.codeBlock?.indentLineWithTab ?? true,
                defaultLanguage: options?.codeBlock?.defaultLanguage ?? "text",
                supportedLanguages: options?.codeBlock?.supportedLanguages ?? {},
                createHighlighter: options?.codeBlock?.createHighlighter ?? undefined,
            },
            heading: {
                levels: options?.heading?.levels ?? [1, 2, 3],
            },
        };
        // apply defaults
        const newOptions = {
            defaultStyles: true,
            schema: options.schema || BlockNoteSchema.create(),
            _headless: false,
            ...options,
            placeholders: {
                ...this.dictionary.placeholders,
                ...options.placeholders,
            },
        };
        if (newOptions.comments && !newOptions.resolveUsers) {
            throw new Error("resolveUsers is required when using comments");
        }
        this.resolveUsers = newOptions.resolveUsers;
        // @ts-ignore
        this.schema = newOptions.schema;
        this.blockImplementations = newOptions.schema.blockSpecs;
        this.inlineContentImplementations = newOptions.schema.inlineContentSpecs;
        this.styleImplementations = newOptions.schema.styleSpecs;
        this.extensions = getBlockNoteExtensions({
            editor: this,
            domAttributes: newOptions.domAttributes || {},
            blockSpecs: this.schema.blockSpecs,
            styleSpecs: this.schema.styleSpecs,
            inlineContentSpecs: this.schema.inlineContentSpecs,
            collaboration: newOptions.collaboration,
            trailingBlock: newOptions.trailingBlock,
            disableExtensions: newOptions.disableExtensions,
            setIdAttribute: newOptions.setIdAttribute,
            animations: newOptions.animations ?? true,
            tableHandles: checkDefaultBlockTypeInSchema("table", this),
            dropCursor: this.options.dropCursor ?? dropCursor,
            placeholders: newOptions.placeholders,
            tabBehavior: newOptions.tabBehavior,
            comments: newOptions.comments,
            pasteHandler: newOptions.pasteHandler,
        });
        // add extensions from _tiptapOptions
        (newOptions._tiptapOptions?.extensions || []).forEach((ext) => {
            this.extensions[ext.name] = ext;
        });
        // add extensions from options
        for (let ext of newOptions.extensions || []) {
            if (typeof ext === "function") {
                // factory
                ext = ext(this);
            }
            const key = ext.constructor.key();
            if (!key) {
                throw new Error(`Extension ${ext.constructor.name} does not have a key method`);
            }
            if (this.extensions[key]) {
                throw new Error(`Extension ${ext.constructor.name} already exists with key ${key}`);
            }
            this.extensions[key] = ext;
        }
        // (when passed in via the deprecated `_extensions` option)
        Object.entries(newOptions._extensions || {}).forEach(([key, ext]) => {
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const editor = this;
            const instance = typeof ext === "function" ? ext(editor) : ext;
            if (!("plugin" in instance)) {
                // Assume it is an Extension/Mark/Node
                this.extensions[key] = instance;
                return;
            }
            this.extensions[key] = new (class extends BlockNoteExtension {
                static key() {
                    return key;
                }
                constructor() {
                    super();
                    this.addProsemirrorPlugin(instance.plugin);
                }
                get priority() {
                    return instance.priority;
                }
            })();
        });
        this.formattingToolbar = this.extensions["formattingToolbar"];
        this.linkToolbar = this.extensions["linkToolbar"];
        this.sideMenu = this.extensions["sideMenu"];
        this.suggestionMenus = this.extensions["suggestionMenus"];
        this.filePanel = this.extensions["filePanel"];
        this.tableHandles = this.extensions["tableHandles"];
        this.comments = this.extensions["comments"];
        this.showSelectionPlugin = this.extensions["showSelection"];
        this.forkYDocPlugin = this.extensions["forkYDocPlugin"];
        if (newOptions.uploadFile) {
            const uploadFile = newOptions.uploadFile;
            this.uploadFile = async (file, blockId) => {
                this.onUploadStartCallbacks.forEach((callback) => callback.apply(this, [blockId]));
                try {
                    return await uploadFile(file, blockId);
                }
                finally {
                    this.onUploadEndCallbacks.forEach((callback) => callback.apply(this, [blockId]));
                }
            };
        }
        this.resolveFileUrl = newOptions.resolveFileUrl;
        this.headless = newOptions._headless;
        const collaborationEnabled = "ySyncPlugin" in this.extensions ||
            "liveblocksExtension" in this.extensions;
        if (collaborationEnabled && newOptions.initialContent) {
            // eslint-disable-next-line no-console
            console.warn("When using Collaboration, initialContent might cause conflicts, because changes should come from the collaboration provider");
        }
        const initialContent = newOptions.initialContent ||
            (collaborationEnabled
                ? [
                    {
                        type: "paragraph",
                        id: "initialBlockId",
                    },
                ]
                : [
                    {
                        type: "paragraph",
                        id: UniqueID.options.generateID(),
                    },
                ]);
        if (!Array.isArray(initialContent) || initialContent.length === 0) {
            throw new Error("initialContent must be a non-empty array of blocks, received: " +
                initialContent);
        }
        const tiptapExtensions = [
            ...Object.entries(this.extensions).map(([key, ext]) => {
                if (ext instanceof Extension ||
                    ext instanceof TipTapNode ||
                    ext instanceof Mark) {
                    // tiptap extension
                    return ext;
                }
                if (ext instanceof BlockNoteExtension && !ext.plugins.length) {
                    return undefined;
                }
                // "blocknote" extensions (prosemirror plugins)
                return Extension.create({
                    name: key,
                    priority: ext.priority,
                    addProseMirrorPlugins: () => ext.plugins,
                });
            }),
        ].filter((ext) => ext !== undefined);
        const tiptapOptions = {
            ...blockNoteTipTapOptions,
            ...newOptions._tiptapOptions,
            content: initialContent,
            extensions: tiptapExtensions,
            editorProps: {
                ...newOptions._tiptapOptions?.editorProps,
                attributes: {
                    // As of TipTap v2.5.0 the tabIndex is removed when the editor is not
                    // editable, so you can't focus it. We want to revert this as we have
                    // UI behaviour that relies on it.
                    tabIndex: "0",
                    ...newOptions._tiptapOptions?.editorProps?.attributes,
                    ...newOptions.domAttributes?.editor,
                    class: mergeCSSClasses("bn-editor", newOptions.defaultStyles ? "bn-default-styles" : "", newOptions.domAttributes?.editor?.class || ""),
                },
                transformPasted,
            },
        };
        if (!this.headless) {
            this._tiptapEditor = BlockNoteTipTapEditor.create(tiptapOptions, this.schema.styleSchema);
            this.pmSchema = this._tiptapEditor.schema;
        }
        else {
            // In headless mode, we don't instantiate an underlying TipTap editor,
            // but we still need the schema
            this.pmSchema = getSchema(tiptapOptions.extensions);
        }
        this.pmSchema.cached.blockNoteEditor = this;
        this.emit("create");
    }
    /**
     * Stores the currently active transaction, which is the accumulated transaction from all {@link dispatch} calls during a {@link transact} calls
     */
    activeTransaction = null;
    /**
     * Execute a prosemirror command. This is mostly for backwards compatibility with older code.
     *
     * @note You should prefer the {@link transact} method when possible, as it will automatically handle the dispatching of the transaction and work across blocknote transactions.
     *
     * @example
     * ```ts
     * editor.exec((state, dispatch, view) => {
     *   dispatch(state.tr.insertText("Hello, world!"));
     * });
     * ```
     */
    exec(command) {
        if (this.activeTransaction) {
            throw new Error("`exec` should not be called within a `transact` call, move the `exec` call outside of the `transact` call");
        }
        const state = this._tiptapEditor.state;
        const view = this._tiptapEditor.view;
        const dispatch = (tr) => this._tiptapEditor.dispatch(tr);
        return command(state, dispatch, view);
    }
    /**
     * Check if a command can be executed. A command should return `false` if it is not valid in the current state.
     *
     * @example
     * ```ts
     * if (editor.canExec(command)) {
     *   // show button
     * } else {
     *   // hide button
     * }
     * ```
     */
    canExec(command) {
        if (this.activeTransaction) {
            throw new Error("`canExec` should not be called within a `transact` call, move the `canExec` call outside of the `transact` call");
        }
        const state = this._tiptapEditor.state;
        const view = this._tiptapEditor.view;
        return command(state, undefined, view);
    }
    /**
     * Execute a function within a "blocknote transaction".
     * All changes to the editor within the transaction will be grouped together, so that
     * we can dispatch them as a single operation (thus creating only a single undo step)
     *
     * @note There is no need to dispatch the transaction, as it will be automatically dispatched when the callback is complete.
     *
     * @example
     * ```ts
     * // All changes to the editor will be grouped together
     * editor.transact((tr) => {
     *   tr.insertText("Hello, world!");
     * // These two operations will be grouped together in a single undo step
     *   editor.transact((tr) => {
     *     tr.insertText("Hello, world!");
     *   });
     * });
     * ```
     */
    transact(callback) {
        if (this.activeTransaction) {
            // Already in a transaction, so we can just callback immediately
            return callback(this.activeTransaction);
        }
        try {
            // Enter transaction mode, by setting a starting transaction
            this.activeTransaction = this._tiptapEditor.state.tr;
            // Capture all dispatch'd transactions
            const result = callback(this.activeTransaction);
            // Any transactions captured by the `dispatch` call will be stored in `this.activeTransaction`
            const activeTr = this.activeTransaction;
            this.activeTransaction = null;
            if (activeTr &&
                // Only dispatch if the transaction was actually modified in some way
                (activeTr.docChanged ||
                    activeTr.selectionSet ||
                    activeTr.scrolledIntoView ||
                    activeTr.storedMarksSet ||
                    !activeTr.isGeneric)) {
                // Dispatch the transaction if it was modified
                this._tiptapEditor.dispatch(activeTr);
            }
            return result;
        }
        finally {
            // We wrap this in a finally block to ensure we don't disable future transactions just because of an error in the callback
            this.activeTransaction = null;
        }
    }
    // TO DISCUSS
    /**
     * Shorthand to get a typed extension from the editor, by
     * just passing in the extension class.
     *
     * @param ext - The extension class to get
     * @param key - optional, the key of the extension in the extensions object (defaults to the extension name)
     * @returns The extension instance
     */
    extension(ext, key = ext.key()) {
        const extension = this.extensions[key];
        if (!extension) {
            throw new Error(`Extension ${key} not found`);
        }
        return extension;
    }
    /**
     * Mount the editor to a parent DOM element. Call mount(undefined) to clean up
     *
     * @warning Not needed to call manually when using React, use BlockNoteView to take care of mounting
     */
    mount = (parentElement, contentComponent) => {
        this._tiptapEditor.mount(this, parentElement, contentComponent);
    };
    /**
     * Get the underlying prosemirror state
     * @note Prefer using `editor.transact` to read the current editor state, as that will ensure the state is up to date
     * @see https://prosemirror.net/docs/ref/#state.EditorState
     */
    get prosemirrorState() {
        if (this.activeTransaction) {
            throw new Error("`prosemirrorState` should not be called within a `transact` call, move the `prosemirrorState` call outside of the `transact` call or use `editor.transact` to read the current editor state");
        }
        return this._tiptapEditor.state;
    }
    /**
     * Get the underlying prosemirror view
     * @see https://prosemirror.net/docs/ref/#view.EditorView
     */
    get prosemirrorView() {
        return this._tiptapEditor.view;
    }
    get domElement() {
        return this.prosemirrorView?.dom;
    }
    isFocused() {
        return this.prosemirrorView?.hasFocus() || false;
    }
    focus() {
        this.prosemirrorView?.focus();
    }
    onUploadStart(callback) {
        this.onUploadStartCallbacks.push(callback);
        return () => {
            const index = this.onUploadStartCallbacks.indexOf(callback);
            if (index > -1) {
                this.onUploadStartCallbacks.splice(index, 1);
            }
        };
    }
    onUploadEnd(callback) {
        this.onUploadEndCallbacks.push(callback);
        return () => {
            const index = this.onUploadEndCallbacks.indexOf(callback);
            if (index > -1) {
                this.onUploadEndCallbacks.splice(index, 1);
            }
        };
    }
    /**
     * @deprecated, use `editor.document` instead
     */
    get topLevelBlocks() {
        return this.document;
    }
    /**
     * Gets a snapshot of all top-level (non-nested) blocks in the editor.
     * @returns A snapshot of all top-level (non-nested) blocks in the editor.
     */
    get document() {
        return this.transact((tr) => {
            return docToBlocks(tr.doc, this.pmSchema);
        });
    }
    /**
     * Gets a snapshot of an existing block from the editor.
     * @param blockIdentifier The identifier of an existing block that should be
     * retrieved.
     * @returns The block that matches the identifier, or `undefined` if no
     * matching block was found.
     */
    getBlock(blockIdentifier) {
        return this.transact((tr) => getBlock(tr.doc, blockIdentifier));
    }
    /**
     * Gets a snapshot of the previous sibling of an existing block from the
     * editor.
     * @param blockIdentifier The identifier of an existing block for which the
     * previous sibling should be retrieved.
     * @returns The previous sibling of the block that matches the identifier.
     * `undefined` if no matching block was found, or it's the first child/block
     * in the document.
     */
    getPrevBlock(blockIdentifier) {
        return this.transact((tr) => getPrevBlock(tr.doc, blockIdentifier));
    }
    /**
     * Gets a snapshot of the next sibling of an existing block from the editor.
     * @param blockIdentifier The identifier of an existing block for which the
     * next sibling should be retrieved.
     * @returns The next sibling of the block that matches the identifier.
     * `undefined` if no matching block was found, or it's the last child/block in
     * the document.
     */
    getNextBlock(blockIdentifier) {
        return this.transact((tr) => getNextBlock(tr.doc, blockIdentifier));
    }
    /**
     * Gets a snapshot of the parent of an existing block from the editor.
     * @param blockIdentifier The identifier of an existing block for which the
     * parent should be retrieved.
     * @returns The parent of the block that matches the identifier. `undefined`
     * if no matching block was found, or the block isn't nested.
     */
    getParentBlock(blockIdentifier) {
        return this.transact((tr) => getParentBlock(tr.doc, blockIdentifier));
    }
    /**
     * Traverses all blocks in the editor depth-first, and executes a callback for each.
     * @param callback The callback to execute for each block. Returning `false` stops the traversal.
     * @param reverse Whether the blocks should be traversed in reverse order.
     */
    forEachBlock(callback, reverse = false) {
        const blocks = this.document.slice();
        if (reverse) {
            blocks.reverse();
        }
        function traverseBlockArray(blockArray) {
            for (const block of blockArray) {
                if (callback(block) === false) {
                    return false;
                }
                const children = reverse
                    ? block.children.slice().reverse()
                    : block.children;
                if (!traverseBlockArray(children)) {
                    return false;
                }
            }
            return true;
        }
        traverseBlockArray(blocks);
    }
    /**
     * Executes a callback whenever the editor's contents change.
     * @param callback The callback to execute.
     *
     * @deprecated use {@link BlockNoteEditor.onChange} instead
     */
    onEditorContentChange(callback) {
        this._tiptapEditor.on("update", callback);
    }
    /**
     * Executes a callback whenever the editor's selection changes.
     * @param callback The callback to execute.
     *
     * @deprecated use `onSelectionChange` instead
     */
    onEditorSelectionChange(callback) {
        this._tiptapEditor.on("selectionUpdate", callback);
    }
    /**
     * Gets a snapshot of the current text cursor position.
     * @returns A snapshot of the current text cursor position.
     */
    getTextCursorPosition() {
        return this.transact((tr) => getTextCursorPosition(tr));
    }
    /**
     * Sets the text cursor position to the start or end of an existing block. Throws an error if the target block could
     * not be found.
     * @param targetBlock The identifier of an existing block that the text cursor should be moved to.
     * @param placement Whether the text cursor should be placed at the start or end of the block.
     */
    setTextCursorPosition(targetBlock, placement = "start") {
        return this.transact((tr) => setTextCursorPosition(tr, targetBlock, placement));
    }
    /**
     * Gets a snapshot of the current selection. This contains all blocks (included nested blocks)
     * that the selection spans across.
     *
     * If the selection starts / ends halfway through a block, the returned data will contain the entire block.
     */
    getSelection() {
        return this.transact((tr) => getSelection(tr));
    }
    /**
     * Gets a snapshot of the current selection. This contains all blocks (included nested blocks)
     * that the selection spans across.
     *
     * If the selection starts / ends halfway through a block, the returned block will be
     * only the part of the block that is included in the selection.
     */
    getSelectionCutBlocks() {
        return this.transact((tr) => getSelectionCutBlocks(tr));
    }
    /**
     * Sets the selection to a range of blocks.
     * @param startBlock The identifier of the block that should be the start of the selection.
     * @param endBlock The identifier of the block that should be the end of the selection.
     */
    setSelection(startBlock, endBlock) {
        return this.transact((tr) => setSelection(tr, startBlock, endBlock));
    }
    /**
     * Checks if the editor is currently editable, or if it's locked.
     * @returns True if the editor is editable, false otherwise.
     */
    get isEditable() {
        if (!this._tiptapEditor) {
            if (!this.headless) {
                throw new Error("no editor, but also not headless?");
            }
            return false;
        }
        return this._tiptapEditor.isEditable === undefined
            ? true
            : this._tiptapEditor.isEditable;
    }
    /**
     * Makes the editor editable or locks it, depending on the argument passed.
     * @param editable True to make the editor editable, or false to lock it.
     */
    set isEditable(editable) {
        if (!this._tiptapEditor) {
            if (!this.headless) {
                throw new Error("no editor, but also not headless?");
            }
            // not relevant on headless
            return;
        }
        if (this._tiptapEditor.options.editable !== editable) {
            this._tiptapEditor.setEditable(editable);
        }
    }
    /**
     * Inserts new blocks into the editor. If a block's `id` is undefined, BlockNote generates one automatically. Throws an
     * error if the reference block could not be found.
     * @param blocksToInsert An array of partial blocks that should be inserted.
     * @param referenceBlock An identifier for an existing block, at which the new blocks should be inserted.
     * @param placement Whether the blocks should be inserted just before, just after, or nested inside the
     * `referenceBlock`.
     */
    insertBlocks(blocksToInsert, referenceBlock, placement = "before") {
        return this.transact((tr) => insertBlocks(tr, blocksToInsert, referenceBlock, placement));
    }
    /**
     * Updates an existing block in the editor. Since updatedBlock is a PartialBlock object, some fields might not be
     * defined. These undefined fields are kept as-is from the existing block. Throws an error if the block to update could
     * not be found.
     * @param blockToUpdate The block that should be updated.
     * @param update A partial block which defines how the existing block should be changed.
     */
    updateBlock(blockToUpdate, update) {
        return this.transact((tr) => updateBlock(tr, blockToUpdate, update));
    }
    /**
     * Removes existing blocks from the editor. Throws an error if any of the blocks could not be found.
     * @param blocksToRemove An array of identifiers for existing blocks that should be removed.
     */
    removeBlocks(blocksToRemove) {
        return this.transact((tr) => removeAndInsertBlocks(tr, blocksToRemove, []).removedBlocks);
    }
    /**
     * Replaces existing blocks in the editor with new blocks. If the blocks that should be removed are not adjacent or
     * are at different nesting levels, `blocksToInsert` will be inserted at the position of the first block in
     * `blocksToRemove`. Throws an error if any of the blocks to remove could not be found.
     * @param blocksToRemove An array of blocks that should be replaced.
     * @param blocksToInsert An array of partial blocks to replace the old ones with.
     */
    replaceBlocks(blocksToRemove, blocksToInsert) {
        return this.transact((tr) => removeAndInsertBlocks(tr, blocksToRemove, blocksToInsert));
    }
    /**
     * Undo the last action.
     */
    undo() {
        if (this.options.collaboration) {
            return this.exec(undoCommand);
        }
        return this.exec(undo);
    }
    /**
     * Redo the last action.
     */
    redo() {
        if (this.options.collaboration) {
            return this.exec(redoCommand);
        }
        return this.exec(redo);
    }
    /**
     * Insert a piece of content at the current cursor position.
     *
     * @param content can be a string, or array of partial inline content elements
     */
    insertInlineContent(content, { updateSelection = false } = {}) {
        const nodes = inlineContentToNodes(content, this.pmSchema);
        this.transact((tr) => {
            insertContentAt(tr, {
                from: tr.selection.from,
                to: tr.selection.to,
            }, nodes, {
                updateSelection,
            });
        });
    }
    /**
     * Gets the active text styles at the text cursor position or at the end of the current selection if it's active.
     */
    getActiveStyles() {
        return this.transact((tr) => {
            const styles = {};
            const marks = tr.selection.$to.marks();
            for (const mark of marks) {
                const config = this.schema.styleSchema[mark.type.name];
                if (!config) {
                    if (
                    // Links are not considered styles in blocknote
                    mark.type.name !== "link" &&
                        // "blocknoteIgnore" tagged marks (such as comments) are also not considered BlockNote "styles"
                        !mark.type.spec.blocknoteIgnore) {
                        // eslint-disable-next-line no-console
                        console.warn("mark not found in styleschema", mark.type.name);
                    }
                    continue;
                }
                if (config.propSchema === "boolean") {
                    styles[config.type] = true;
                }
                else {
                    styles[config.type] = mark.attrs.stringValue;
                }
            }
            return styles;
        });
    }
    /**
     * Adds styles to the currently selected content.
     * @param styles The styles to add.
     */
    addStyles(styles) {
        for (const [style, value] of Object.entries(styles)) {
            const config = this.schema.styleSchema[style];
            if (!config) {
                throw new Error(`style ${style} not found in styleSchema`);
            }
            if (config.propSchema === "boolean") {
                this._tiptapEditor.commands.setMark(style);
            }
            else if (config.propSchema === "string") {
                this._tiptapEditor.commands.setMark(style, { stringValue: value });
            }
            else {
                throw new UnreachableCaseError(config.propSchema);
            }
        }
    }
    /**
     * Removes styles from the currently selected content.
     * @param styles The styles to remove.
     */
    removeStyles(styles) {
        for (const style of Object.keys(styles)) {
            this._tiptapEditor.commands.unsetMark(style);
        }
    }
    /**
     * Toggles styles on the currently selected content.
     * @param styles The styles to toggle.
     */
    toggleStyles(styles) {
        for (const [style, value] of Object.entries(styles)) {
            const config = this.schema.styleSchema[style];
            if (!config) {
                throw new Error(`style ${style} not found in styleSchema`);
            }
            if (config.propSchema === "boolean") {
                this._tiptapEditor.commands.toggleMark(style);
            }
            else if (config.propSchema === "string") {
                this._tiptapEditor.commands.toggleMark(style, { stringValue: value });
            }
            else {
                throw new UnreachableCaseError(config.propSchema);
            }
        }
    }
    /**
     * Gets the currently selected text.
     */
    getSelectedText() {
        return this.transact((tr) => {
            return tr.doc.textBetween(tr.selection.from, tr.selection.to);
        });
    }
    /**
     * Gets the URL of the last link in the current selection, or `undefined` if there are no links in the selection.
     */
    getSelectedLinkUrl() {
        return this._tiptapEditor.getAttributes("link").href;
    }
    /**
     * Creates a new link to replace the selected content.
     * @param url The link URL.
     * @param text The text to display the link with.
     */
    createLink(url, text) {
        if (url === "") {
            return;
        }
        const mark = this.pmSchema.mark("link", { href: url });
        this.transact((tr) => {
            const { from, to } = tr.selection;
            if (text) {
                tr.insertText(text, from, to).addMark(from, from + text.length, mark);
            }
            else {
                tr.setSelection(TextSelection.create(tr.doc, to)).addMark(from, to, mark);
            }
        });
    }
    /**
     * Checks if the block containing the text cursor can be nested.
     */
    canNestBlock() {
        return canNestBlock(this);
    }
    /**
     * Nests the block containing the text cursor into the block above it.
     */
    nestBlock() {
        nestBlock(this);
    }
    /**
     * Checks if the block containing the text cursor is nested.
     */
    canUnnestBlock() {
        return canUnnestBlock(this);
    }
    /**
     * Lifts the block containing the text cursor out of its parent.
     */
    unnestBlock() {
        unnestBlock(this);
    }
    /**
     * Moves the selected blocks up. If the previous block has children, moves
     * them to the end of its children. If there is no previous block, but the
     * current blocks share a common parent, moves them out of & before it.
     */
    moveBlocksUp() {
        return moveBlocksUp(this);
    }
    /**
     * Moves the selected blocks down. If the next block has children, moves
     * them to the start of its children. If there is no next block, but the
     * current blocks share a common parent, moves them out of & after it.
     */
    moveBlocksDown() {
        return moveBlocksDown(this);
    }
    /**
     * Exports blocks into a simplified HTML string. To better conform to HTML standards, children of blocks which aren't list
     * items are un-nested in the output HTML.
     *
     * @param blocks An array of blocks that should be serialized into HTML.
     * @returns The blocks, serialized as an HTML string.
     */
    async blocksToHTMLLossy(blocks = this.document) {
        const exporter = createExternalHTMLExporter(this.pmSchema, this);
        return exporter.exportBlocks(blocks, {});
    }
    /**
     * Serializes blocks into an HTML string in the format that would normally be rendered by the editor.
     *
     * Use this method if you want to server-side render HTML (for example, a blog post that has been edited in BlockNote)
     * and serve it to users without loading the editor on the client (i.e.: displaying the blog post)
     *
     * @param blocks An array of blocks that should be serialized into HTML.
     * @returns The blocks, serialized as an HTML string.
     */
    async blocksToFullHTML(blocks) {
        const exporter = createInternalHTMLSerializer(this.pmSchema, this);
        return exporter.serializeBlocks(blocks, {});
    }
    /**
     * Parses blocks from an HTML string. Tries to create `Block` objects out of any HTML block-level elements, and
     * `InlineNode` objects from any HTML inline elements, though not all element types are recognized. If BlockNote
     * doesn't recognize an HTML element's tag, it will parse it as a paragraph or plain text.
     * @param html The HTML string to parse blocks from.
     * @returns The blocks parsed from the HTML string.
     */
    async tryParseHTMLToBlocks(html) {
        return HTMLToBlocks(html, this.pmSchema);
    }
    /**
     * Serializes blocks into a Markdown string. The output is simplified as Markdown does not support all features of
     * BlockNote - children of blocks which aren't list items are un-nested and certain styles are removed.
     * @param blocks An array of blocks that should be serialized into Markdown.
     * @returns The blocks, serialized as a Markdown string.
     */
    async blocksToMarkdownLossy(blocks = this.document) {
        return blocksToMarkdown(blocks, this.pmSchema, this, {});
    }
    /**
     * Creates a list of blocks from a Markdown string. Tries to create `Block` and `InlineNode` objects based on
     * Markdown syntax, though not all symbols are recognized. If BlockNote doesn't recognize a symbol, it will parse it
     * as text.
     * @param markdown The Markdown string to parse blocks from.
     * @returns The blocks parsed from the Markdown string.
     */
    async tryParseMarkdownToBlocks(markdown) {
        return markdownToBlocks(markdown, this.pmSchema);
    }
    /**
     * Updates the user info for the current user that's shown to other collaborators.
     */
    updateCollaborationUserInfo(user) {
        if (!this.options.collaboration) {
            throw new Error("Cannot update collaboration user info when collaboration is disabled.");
        }
        this.extensions["yCursorPlugin"].updateUser(user);
    }
    /**
     * Registers a callback which will be called before any change is applied to the editor, allowing you to cancel the change.
     */
    onBeforeChange(
    /**
     * If the callback returns `false`, the change will be canceled & not applied to the editor.
     */
    callback) {
        if (this.headless) {
            return () => {
                // noop
            };
        }
        return this.extensions["blockChange"].subscribe((context) => callback(this, context));
    }
    /**
     * A callback function that runs whenever the editor's contents change.
     *
     * @param callback The callback to execute.
     * @returns A function to remove the callback.
     */
    onChange(callback) {
        if (this.headless) {
            // Note: would be nice if this is possible in headless mode as well
            return;
        }
        const cb = ({ transaction, appendedTransactions, }) => {
            callback(this, {
                getChanges: () => getBlocksChangedByTransaction(transaction, appendedTransactions),
            });
        };
        this._tiptapEditor.on("v3-update", cb);
        return () => {
            this._tiptapEditor.off("v3-update", cb);
        };
    }
    /**
     * A callback function that runs whenever the text cursor position or selection changes.
     *
     * @param callback The callback to execute.
     * @returns A function to remove the callback.
     */
    onSelectionChange(callback, includeSelectionChangedByRemote) {
        if (this.headless) {
            return;
        }
        const cb = (e) => {
            if (e.transaction.getMeta(ySyncPluginKey) &&
                !includeSelectionChangedByRemote) {
                // selection changed because of a yjs sync (i.e.: other user was typing)
                // we don't want to trigger the callback in this case
                return;
            }
            callback(this);
        };
        this._tiptapEditor.on("selectionUpdate", cb);
        return () => {
            this._tiptapEditor.off("selectionUpdate", cb);
        };
    }
    /**
     * A callback function that runs when the editor has been initialized.
     *
     * This can be useful for plugins to initialize themselves after the editor has been initialized.
     */
    onCreate(callback) {
        this.on("create", callback);
        return () => {
            this.off("create", callback);
        };
    }
    getSelectionBoundingBox() {
        if (!this.prosemirrorView) {
            return undefined;
        }
        const { selection } = this.prosemirrorState;
        // support for CellSelections
        const { ranges } = selection;
        const from = Math.min(...ranges.map((range) => range.$from.pos));
        const to = Math.max(...ranges.map((range) => range.$to.pos));
        if (isNodeSelection(selection)) {
            const node = this.prosemirrorView.nodeDOM(from);
            if (node) {
                return node.getBoundingClientRect();
            }
        }
        return posToDOMRect(this.prosemirrorView, from, to);
    }
    get isEmpty() {
        const doc = this.document;
        // Note: only works for paragraphs as default blocks (but for now this is default in blocknote)
        // checking prosemirror directly might be faster
        return (doc.length === 0 ||
            (doc.length === 1 &&
                doc[0].type === "paragraph" &&
                doc[0].content.length === 0));
    }
    openSuggestionMenu(triggerCharacter, pluginState) {
        if (!this.prosemirrorView) {
            return;
        }
        this.focus();
        this.transact((tr) => {
            if (pluginState?.deleteTriggerCharacter) {
                tr.insertText(triggerCharacter);
            }
            tr.scrollIntoView().setMeta(this.suggestionMenus.plugins[0], {
                triggerCharacter: triggerCharacter,
                deleteTriggerCharacter: pluginState?.deleteTriggerCharacter || false,
                ignoreQueryLength: pluginState?.ignoreQueryLength || false,
            });
        });
    }
    // `forceSelectionVisible` determines whether the editor selection is shows
    // even when the editor is not focused. This is useful for e.g. creating new
    // links, so the user still sees the affected content when an input field is
    // focused.
    // TODO: Reconsider naming?
    getForceSelectionVisible() {
        return this.showSelectionPlugin.getEnabled();
    }
    setForceSelectionVisible(forceSelectionVisible) {
        this.showSelectionPlugin.setEnabled(forceSelectionVisible);
    }
    /**
     * This will convert HTML into a format that is compatible with BlockNote.
     */
    convertHtmlToBlockNoteHtml(html) {
        const htmlNode = nestedListsToBlockNoteStructure(html.trim());
        return htmlNode.innerHTML;
    }
    /**
     * Paste HTML into the editor. Defaults to converting HTML to BlockNote HTML.
     * @param html The HTML to paste.
     * @param raw Whether to paste the HTML as is, or to convert it to BlockNote HTML.
     */
    pasteHTML(html, raw = false) {
        let htmlToPaste = html;
        if (!raw) {
            htmlToPaste = this.convertHtmlToBlockNoteHtml(html);
        }
        if (!htmlToPaste) {
            return;
        }
        this.prosemirrorView?.pasteHTML(htmlToPaste);
    }
    /**
     * Paste text into the editor. Defaults to interpreting text as markdown.
     * @param text The text to paste.
     */
    pasteText(text) {
        return this.prosemirrorView?.pasteText(text);
    }
    /**
     * Paste markdown into the editor.
     * @param markdown The markdown to paste.
     */
    async pasteMarkdown(markdown) {
        return this.pasteHTML(await markdownToHTML(markdown));
    }
}
//# sourceMappingURL=BlockNoteEditor.js.map