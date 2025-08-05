import { combineTransactionSteps } from "@tiptap/core";
import { nodeToBlock } from "./nodeConversions/nodeToBlock.js";
import { getPmSchema } from "./pmUtil.js";
/**
 * Gets the parent block of a node, if it has one.
 */
function getParentBlockId(doc, pos) {
    if (pos === 0) {
        return undefined;
    }
    const resolvedPos = doc.resolve(pos);
    for (let i = resolvedPos.depth; i > 0; i--) {
        const parent = resolvedPos.node(i);
        if (isNodeBlock(parent)) {
            return parent.attrs.id;
        }
    }
    return undefined;
}
/**
 * Get a TipTap node by id
 */
export function getNodeById(id, doc) {
    let targetNode = undefined;
    let posBeforeNode = undefined;
    doc.firstChild.descendants((node, pos) => {
        // Skips traversing nodes after node with target ID has been found.
        if (targetNode) {
            return false;
        }
        // Keeps traversing nodes if block with target ID has not been found.
        if (!isNodeBlock(node) || node.attrs.id !== id) {
            return true;
        }
        targetNode = node;
        posBeforeNode = pos + 1;
        return false;
    });
    if (targetNode === undefined || posBeforeNode === undefined) {
        return undefined;
    }
    return {
        node: targetNode,
        posBeforeNode: posBeforeNode,
    };
}
export function isNodeBlock(node) {
    return node.type.isInGroup("bnBlock");
}
/**
 * Compares two blocks, ignoring their children.
 * Returns true if the blocks are different (excluding children).
 */
function areBlocksDifferentExcludingChildren(block1, block2) {
    return (block1.id !== block2.id ||
        block1.type !== block2.type ||
        JSON.stringify(block1.props) !== JSON.stringify(block2.props) ||
        JSON.stringify(block1.content) !== JSON.stringify(block2.content));
}
function determineChangeSource(transaction) {
    if (transaction.getMeta("paste")) {
        return { type: "paste" };
    }
    if (transaction.getMeta("uiEvent") === "drop") {
        return { type: "drop" };
    }
    if (transaction.getMeta("history$")) {
        return {
            type: transaction.getMeta("history$").redo ? "redo" : "undo",
        };
    }
    if (transaction.getMeta("y-sync$")) {
        if (transaction.getMeta("y-sync$").isUndoRedoOperation) {
            return { type: "undo-redo" };
        }
        return { type: "yjs-remote" };
    }
    return { type: "local" };
}
function collectAllBlocks(doc) {
    const blocks = {};
    const pmSchema = getPmSchema(doc);
    doc.descendants((node, pos) => {
        if (isNodeBlock(node)) {
            const parentId = getParentBlockId(doc, pos);
            blocks[node.attrs.id] = {
                block: nodeToBlock(node, pmSchema),
                parentId,
            };
        }
        return true;
    });
    return blocks;
}
/**
 * Get the blocks that were changed by a transaction.
 */
export function getBlocksChangedByTransaction(transaction, appendedTransactions = []) {
    const source = determineChangeSource(transaction);
    const combinedTransaction = combineTransactionSteps(transaction.before, [
        transaction,
        ...appendedTransactions,
    ]);
    const prevBlocks = collectAllBlocks(combinedTransaction.before);
    const nextBlocks = collectAllBlocks(combinedTransaction.doc);
    const changes = [];
    // Handle inserted blocks
    Object.keys(nextBlocks)
        .filter((id) => !(id in prevBlocks))
        .forEach((id) => {
        changes.push({
            type: "insert",
            block: nextBlocks[id].block,
            source,
            prevBlock: undefined,
        });
    });
    // Handle deleted blocks
    Object.keys(prevBlocks)
        .filter((id) => !(id in nextBlocks))
        .forEach((id) => {
        changes.push({
            type: "delete",
            block: prevBlocks[id].block,
            source,
            prevBlock: undefined,
        });
    });
    // Handle updated, moved, indented, outdented blocks
    Object.keys(nextBlocks)
        .filter((id) => id in prevBlocks)
        .forEach((id) => {
        const prev = prevBlocks[id];
        const next = nextBlocks[id];
        const isParentDifferent = prev.parentId !== next.parentId;
        if (isParentDifferent) {
            changes.push({
                type: "move",
                block: next.block,
                prevBlock: prev.block,
                source,
                prevParent: prev.parentId
                    ? prevBlocks[prev.parentId]?.block
                    : undefined,
                currentParent: next.parentId
                    ? nextBlocks[next.parentId]?.block
                    : undefined,
            });
        }
        else if (areBlocksDifferentExcludingChildren(prev.block, next.block)) {
            changes.push({
                type: "update",
                block: next.block,
                prevBlock: prev.block,
                source,
            });
        }
    });
    return changes;
}
//# sourceMappingURL=nodeUtil.js.map