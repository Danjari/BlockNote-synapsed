import { Schema } from "prosemirror-model";
import { BlockSchema, InlineContentSchema, StyleSchema } from "../../../schema/index.js";
import { Block } from "../../../blocks/defaultBlocks.js";
export declare function HTMLToBlocks<BSchema extends BlockSchema, I extends InlineContentSchema, S extends StyleSchema>(html: string, pmSchema: Schema): Promise<Block<BSchema, I, S>[]>;
//# sourceMappingURL=parseHTML.d.ts.map