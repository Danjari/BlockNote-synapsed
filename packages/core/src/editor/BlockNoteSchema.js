import { defaultBlockSpecs, defaultInlineContentSpecs, defaultStyleSpecs, } from "../blocks/defaultBlocks.js";
import { getBlockSchemaFromSpecs, getInlineContentSchemaFromSpecs, getStyleSchemaFromSpecs, } from "../schema/index.js";
function removeUndefined(obj) {
    if (!obj) {
        return obj;
    }
    return Object.fromEntries(Object.entries(obj).filter(([, value]) => value !== undefined));
}
export class BlockNoteSchema {
    blockSpecs;
    inlineContentSpecs;
    styleSpecs;
    blockSchema;
    inlineContentSchema;
    styleSchema;
    // Helper so that you can use typeof schema.BlockNoteEditor
    BlockNoteEditor = "only for types";
    Block = "only for types";
    PartialBlock = "only for types";
    static create(options) {
        return new BlockNoteSchema(options);
        // as BlockNoteSchema<
        // BlockSchemaFromSpecs<BSpecs>,
        // InlineContentSchemaFromSpecs<ISpecs>,
        // StyleSchemaFromSpecs<SSpecs>
        // >;
    }
    constructor(opts) {
        this.blockSpecs = removeUndefined(opts?.blockSpecs) || defaultBlockSpecs;
        this.inlineContentSpecs =
            removeUndefined(opts?.inlineContentSpecs) || defaultInlineContentSpecs;
        this.styleSpecs = removeUndefined(opts?.styleSpecs) || defaultStyleSpecs;
        this.blockSchema = getBlockSchemaFromSpecs(this.blockSpecs);
        this.inlineContentSchema = getInlineContentSchemaFromSpecs(this.inlineContentSpecs);
        this.styleSchema = getStyleSchemaFromSpecs(this.styleSpecs);
    }
}
//# sourceMappingURL=BlockNoteSchema.js.map