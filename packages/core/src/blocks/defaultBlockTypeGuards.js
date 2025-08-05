import { CellSelection } from "prosemirror-tables";
import { defaultBlockSchema, defaultInlineContentSchema, } from "./defaultBlocks.js";
import { defaultProps } from "./defaultProps.js";
export function checkDefaultBlockTypeInSchema(blockType, editor) {
    return (blockType in editor.schema.blockSchema &&
        editor.schema.blockSchema[blockType] === defaultBlockSchema[blockType]);
}
export function checkBlockTypeInSchema(blockType, blockConfig, editor) {
    return (blockType in editor.schema.blockSchema &&
        editor.schema.blockSchema[blockType] === blockConfig);
}
export function checkDefaultInlineContentTypeInSchema(inlineContentType, editor) {
    return (inlineContentType in editor.schema.inlineContentSchema &&
        editor.schema.inlineContentSchema[inlineContentType] ===
            defaultInlineContentSchema[inlineContentType]);
}
export function checkInlineContentTypeInSchema(inlineContentType, inlineContentConfig, editor) {
    return (inlineContentType in editor.schema.inlineContentSchema &&
        editor.schema.inlineContentSchema[inlineContentType] === inlineContentConfig);
}
export function checkBlockIsDefaultType(blockType, block, editor) {
    return (block.type === blockType &&
        block.type in editor.schema.blockSchema &&
        checkDefaultBlockTypeInSchema(block.type, editor));
}
export function checkBlockIsFileBlock(block, editor) {
    return ((block.type in editor.schema.blockSchema &&
        editor.schema.blockSchema[block.type].isFileBlock) ||
        false);
}
export function checkBlockIsFileBlockWithPreview(block, editor) {
    return ((block.type in editor.schema.blockSchema &&
        editor.schema.blockSchema[block.type].isFileBlock &&
        "showPreview" in editor.schema.blockSchema[block.type].propSchema) ||
        false);
}
export function checkBlockIsFileBlockWithPlaceholder(block, editor) {
    const config = editor.schema.blockSchema[block.type];
    return config.isFileBlock && !block.props.url;
}
export function checkBlockTypeHasDefaultProp(prop, blockType, editor) {
    return (blockType in editor.schema.blockSchema &&
        prop in editor.schema.blockSchema[blockType].propSchema &&
        editor.schema.blockSchema[blockType].propSchema[prop] === defaultProps[prop]);
}
export function checkBlockHasDefaultProp(prop, block, editor) {
    return checkBlockTypeHasDefaultProp(prop, block.type, editor);
}
export function isTableCellSelection(selection) {
    return selection instanceof CellSelection;
}
//# sourceMappingURL=defaultBlockTypeGuards.js.map