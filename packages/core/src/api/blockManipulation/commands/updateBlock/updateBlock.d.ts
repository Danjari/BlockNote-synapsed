import type { Transaction } from "prosemirror-state";
import { Transform } from "prosemirror-transform";
import type { Block, PartialBlock } from "../../../../blocks/defaultBlocks.js";
import type { BlockIdentifier, BlockSchema } from "../../../../schema/blocks/types.js";
import type { InlineContentSchema } from "../../../../schema/inlineContent/types.js";
import type { StyleSchema } from "../../../../schema/styles/types.js";
export declare const updateBlockCommand: <BSchema extends BlockSchema, I extends InlineContentSchema, S extends StyleSchema>(posBeforeBlock: number, block: PartialBlock<BSchema, I, S>) => ({ tr, dispatch, }: {
    tr: Transaction;
    dispatch?: () => void;
}) => boolean;
export declare function updateBlockTr<BSchema extends BlockSchema, I extends InlineContentSchema, S extends StyleSchema>(tr: Transform, posBeforeBlock: number, block: PartialBlock<BSchema, I, S>, replaceFromPos?: number, replaceToPos?: number): void;
export declare function updateBlock<BSchema extends BlockSchema = any, I extends InlineContentSchema = any, S extends StyleSchema = any>(tr: Transaction, blockToUpdate: BlockIdentifier, update: PartialBlock<BSchema, I, S>, replaceFromPos?: number, replaceToPos?: number): Block<BSchema, I, S>;
//# sourceMappingURL=updateBlock.d.ts.map