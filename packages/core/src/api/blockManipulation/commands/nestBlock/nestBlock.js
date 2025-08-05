import { Fragment, Slice } from "prosemirror-model";
import { ReplaceAroundStep } from "prosemirror-transform";
import { getBlockInfoFromTransaction } from "../../../getBlockInfoFromPos.js";
// TODO: Unit tests
/**
 * This is a modified version of https://github.com/ProseMirror/prosemirror-schema-list/blob/569c2770cbb8092d8f11ea53ecf78cb7a4e8f15a/src/schema-list.ts#L232
 *
 * The original function derives too many information from the parentnode and itemtype
 */
function sinkListItem(tr, itemType, groupType) {
    const { $from, $to } = tr.selection;
    const range = $from.blockRange($to, (node) => node.childCount > 0 &&
        (node.type.name === "blockGroup" || node.type.name === "column"));
    if (!range) {
        return false;
    }
    const startIndex = range.startIndex;
    if (startIndex === 0) {
        return false;
    }
    const parent = range.parent;
    const nodeBefore = parent.child(startIndex - 1);
    if (nodeBefore.type !== itemType) {
        return false;
    }
    const nestedBefore = nodeBefore.lastChild && nodeBefore.lastChild.type === groupType; // change necessary to check groupType instead of parent.type
    const inner = Fragment.from(nestedBefore ? itemType.create() : null);
    const slice = new Slice(Fragment.from(itemType.create(null, Fragment.from(groupType.create(null, inner)))), nestedBefore ? 3 : 1, 0);
    const before = range.start;
    const after = range.end;
    tr.step(new ReplaceAroundStep(before - (nestedBefore ? 3 : 1), after, before, after, slice, 1, true)).scrollIntoView();
    return true;
}
export function nestBlock(editor) {
    return editor.transact((tr) => {
        return sinkListItem(tr, editor.pmSchema.nodes["blockContainer"], editor.pmSchema.nodes["blockGroup"]);
    });
}
export function unnestBlock(editor) {
    editor._tiptapEditor.commands.liftListItem("blockContainer");
}
export function canNestBlock(editor) {
    return editor.transact((tr) => {
        const { bnBlock: blockContainer } = getBlockInfoFromTransaction(tr);
        return tr.doc.resolve(blockContainer.beforePos).nodeBefore !== null;
    });
}
export function canUnnestBlock(editor) {
    return editor.transact((tr) => {
        const { bnBlock: blockContainer } = getBlockInfoFromTransaction(tr);
        return tr.doc.resolve(blockContainer.beforePos).depth > 1;
    });
}
//# sourceMappingURL=nestBlock.js.map