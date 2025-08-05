export function getPmSchema(trOrNode) {
    if ("doc" in trOrNode) {
        return trOrNode.doc.type.schema;
    }
    return trOrNode.type.schema;
}
function getBlockNoteEditor(schema) {
    return schema.cached.blockNoteEditor;
}
export function getBlockNoteSchema(schema) {
    return getBlockNoteEditor(schema).schema;
}
export function getBlockSchema(schema) {
    return getBlockNoteSchema(schema).blockSchema;
}
export function getInlineContentSchema(schema) {
    return getBlockNoteSchema(schema).inlineContentSchema;
}
export function getStyleSchema(schema) {
    return getBlockNoteSchema(schema).styleSchema;
}
export function getBlockCache(schema) {
    return getBlockNoteEditor(schema).blockCache;
}
//# sourceMappingURL=pmUtil.js.map