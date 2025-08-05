/**
 * The mapping factory is a utility function to easily create mappings for
 * a BlockNoteSchema. Using the factory makes it easier to get typescript code completion etc.
 */
export function mappingFactory(_schema) {
    return {
        createBlockMapping: (mapping) => mapping,
        createInlineContentMapping: (mapping) => mapping,
        createStyleMapping: (mapping) => mapping,
    };
}
//# sourceMappingURL=mapping.js.map