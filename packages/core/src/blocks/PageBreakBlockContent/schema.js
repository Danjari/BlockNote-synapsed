import { BlockNoteSchema } from "../../editor/BlockNoteSchema.js";
import { PageBreak } from "./PageBreakBlockContent.js";
export const pageBreakSchema = BlockNoteSchema.create({
    blockSpecs: {
        pageBreak: PageBreak,
    },
});
/**
 * Adds page break support to the given schema.
 */
export const withPageBreak = (schema) => {
    return BlockNoteSchema.create({
        blockSpecs: {
            ...schema.blockSpecs,
            ...pageBreakSchema.blockSpecs,
        },
        inlineContentSpecs: schema.inlineContentSpecs,
        styleSpecs: schema.styleSpecs,
    });
};
//# sourceMappingURL=schema.js.map