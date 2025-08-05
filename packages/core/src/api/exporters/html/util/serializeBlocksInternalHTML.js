import { Fragment } from "prosemirror-model";
import { UnreachableCaseError } from "../../../../util/typescript.js";
import { inlineContentToNodes, tableContentToNodes, } from "../../../nodeConversions/blockToNode.js";
export function serializeInlineContentInternalHTML(editor, blockContent, serializer, blockType, options) {
    let nodes;
    // TODO: reuse function from nodeconversions?
    if (!blockContent) {
        throw new Error("blockContent is required");
    }
    else if (typeof blockContent === "string") {
        nodes = inlineContentToNodes([blockContent], editor.pmSchema, blockType);
    }
    else if (Array.isArray(blockContent)) {
        nodes = inlineContentToNodes(blockContent, editor.pmSchema, blockType);
    }
    else if (blockContent.type === "tableContent") {
        nodes = tableContentToNodes(blockContent, editor.pmSchema);
    }
    else {
        throw new UnreachableCaseError(blockContent.type);
    }
    // We call the prosemirror serializer here because it handles Marks and Inline Content nodes nicely.
    // If we'd want to support custom serialization or externalHTML for Inline Content, we'd have to implement
    // a custom serializer here.
    const dom = serializer.serializeFragment(Fragment.from(nodes), options);
    return dom;
}
function serializeBlock(editor, block, serializer, listIndex, options) {
    const BC_NODE = editor.pmSchema.nodes["blockContainer"];
    let props = block.props;
    // set default props in case we were passed a partial block
    if (!block.props) {
        props = {};
        for (const [name, spec] of Object.entries(editor.schema.blockSchema[block.type].propSchema)) {
            if (spec.default !== undefined) {
                props[name] = spec.default;
            }
        }
    }
    const impl = editor.blockImplementations[block.type].implementation;
    const ret = impl.toInternalHTML({ ...block, props }, editor);
    if (block.type === "numberedListItem") {
        // This is a workaround to make sure there's a list index set.
        // Normally, this is set on the internal prosemirror nodes by the NumberedListIndexingPlugin,
        // but:
        // - (a) this information is not available on the Blocks passed to the serializer. (we only have access to BlockNote Blocks)
        // - (b) the NumberedListIndexingPlugin might not even have run, because we can manually call blocksToFullHTML
        //       with blocks that are not part of the active document
        ret.dom.setAttribute("data-index", listIndex.toString());
    }
    if (ret.contentDOM && block.content) {
        const ic = serializeInlineContentInternalHTML(editor, block.content, // TODO
        serializer, block.type, options);
        ret.contentDOM.appendChild(ic);
    }
    const pmType = editor.pmSchema.nodes[block.type];
    if (pmType.isInGroup("bnBlock")) {
        if (block.children && block.children.length > 0) {
            const fragment = serializeBlocks(editor, block.children, serializer, options);
            ret.contentDOM?.append(fragment);
        }
        return ret.dom;
    }
    // wrap the block in a blockContainer
    const bc = BC_NODE.spec?.toDOM?.(BC_NODE.create({
        id: block.id,
        ...props,
    }));
    bc.contentDOM?.appendChild(ret.dom);
    if (block.children && block.children.length > 0) {
        bc.contentDOM?.appendChild(serializeBlocksInternalHTML(editor, block.children, serializer, options));
    }
    return bc.dom;
}
function serializeBlocks(editor, blocks, serializer, options) {
    const doc = options?.document ?? document;
    const fragment = doc.createDocumentFragment();
    let listIndex = 0;
    for (const block of blocks) {
        if (block.type === "numberedListItem") {
            listIndex++;
        }
        else {
            listIndex = 0;
        }
        const blockDOM = serializeBlock(editor, block, serializer, listIndex, options);
        fragment.appendChild(blockDOM);
    }
    return fragment;
}
export const serializeBlocksInternalHTML = (editor, blocks, serializer, options) => {
    const BG_NODE = editor.pmSchema.nodes["blockGroup"];
    const bg = BG_NODE.spec.toDOM(BG_NODE.create({}));
    const fragment = serializeBlocks(editor, blocks, serializer, options);
    bg.contentDOM?.appendChild(fragment);
    return bg.dom;
};
//# sourceMappingURL=serializeBlocksInternalHTML.js.map