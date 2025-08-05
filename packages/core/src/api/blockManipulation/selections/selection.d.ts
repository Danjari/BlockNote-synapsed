import { type Transaction } from "prosemirror-state";
import { Block } from "../../../blocks/defaultBlocks.js";
import { Selection } from "../../../editor/selectionTypes.js";
import { BlockIdentifier, BlockSchema, InlineContentSchema, StyleSchema } from "../../../schema/index.js";
export declare function getSelection<BSchema extends BlockSchema, I extends InlineContentSchema, S extends StyleSchema>(tr: Transaction): Selection<BSchema, I, S> | undefined;
export declare function setSelection(tr: Transaction, startBlock: BlockIdentifier, endBlock: BlockIdentifier): void;
export declare function getSelectionCutBlocks(tr: Transaction): {
    blocks: Block<Record<string, import("../../../schema/index.js").BlockConfig>, InlineContentSchema, StyleSchema>[];
    blockCutAtStart: string | undefined;
    blockCutAtEnd: string | undefined;
    _meta: {
        startPos: number;
        endPos: number;
    };
};
//# sourceMappingURL=selection.d.ts.map