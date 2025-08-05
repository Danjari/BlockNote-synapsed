import { DOMParser } from "prosemirror-model";
import { nodeToBlock } from "../../nodeConversions/nodeToBlock.js";
import { nestedListsToBlockNoteStructure } from "./util/nestedLists.js";
export async function HTMLToBlocks(html, pmSchema) {
    const htmlNode = nestedListsToBlockNoteStructure(html);
    const parser = DOMParser.fromSchema(pmSchema);
    // Other approach might be to use
    // const doc = pmSchema.nodes["doc"].createAndFill()!;
    // and context: doc.resolve(3),
    const parentNode = parser.parse(htmlNode, {
        topNode: pmSchema.nodes["blockGroup"].create(),
    });
    const blocks = [];
    for (let i = 0; i < parentNode.childCount; i++) {
        blocks.push(nodeToBlock(parentNode.child(i), pmSchema));
    }
    return blocks;
}
//# sourceMappingURL=parseHTML.js.map