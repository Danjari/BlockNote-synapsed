/**
 * Retrieves the position just before the nearest block node in a ProseMirror
 * doc, relative to a position. If the position is within a block node or its
 * descendants, the position just before it is returned. If the position is not
 * within a block node or its descendants, the position just before the next
 * closest block node is returned. If the position is beyond the last block, the
 * position just before the last block is returned.
 * @param doc The ProseMirror doc.
 * @param pos An integer position in the document.
 * @returns The position just before the nearest blockContainer node.
 */
export function getNearestBlockPos(doc, pos) {
    const $pos = doc.resolve(pos);
    // Checks if the position provided is already just before a block node, in
    // which case we return the position.
    if ($pos.nodeAfter && $pos.nodeAfter.type.isInGroup("bnBlock")) {
        return {
            posBeforeNode: $pos.pos,
            node: $pos.nodeAfter,
        };
    }
    // Checks the node containing the position and its ancestors until a
    // block node is found and returned.
    let depth = $pos.depth;
    let node = $pos.node(depth);
    while (depth > 0) {
        if (node.type.isInGroup("bnBlock")) {
            return {
                posBeforeNode: $pos.before(depth),
                node: node,
            };
        }
        depth--;
        node = $pos.node(depth);
    }
    // If the position doesn't lie within a block node, we instead find the
    // position of the next closest one. If the position is beyond the last block,
    // we return the position of the last block. While running `doc.descendants`
    // is expensive, this case should be very rarely triggered. However, it's
    // possible for the position to sometimes be beyond the last block node. This
    // is a problem specifically when using the collaboration plugin.
    const allBlockContainerPositions = [];
    doc.descendants((node, pos) => {
        if (node.type.isInGroup("bnBlock")) {
            allBlockContainerPositions.push(pos);
        }
    });
    // eslint-disable-next-line no-console
    console.warn(`Position ${pos} is not within a blockContainer node.`);
    const resolvedPos = doc.resolve(allBlockContainerPositions.find((position) => position >= pos) ||
        allBlockContainerPositions[allBlockContainerPositions.length - 1]);
    return {
        posBeforeNode: resolvedPos.pos,
        node: resolvedPos.nodeAfter,
    };
}
/**
 * Gets information regarding the ProseMirror nodes that make up a block in a
 * BlockNote document. This includes the main `blockContainer` node, the
 * `blockContent` node with the block's main body, and the optional `blockGroup`
 * node which contains the block's children. As well as the nodes, also returns
 * the ProseMirror positions just before & after each node.
 * @param node The main `blockContainer` node that the block information should
 * be retrieved from,
 * @param bnBlockBeforePosOffset the position just before the
 * `blockContainer` node in the document.
 */
export function getBlockInfoWithManualOffset(node, bnBlockBeforePosOffset) {
    if (!node.type.isInGroup("bnBlock")) {
        throw new Error(`Attempted to get bnBlock node at position but found node of different type ${node.type.name}`);
    }
    const bnBlockNode = node;
    const bnBlockBeforePos = bnBlockBeforePosOffset;
    const bnBlockAfterPos = bnBlockBeforePos + bnBlockNode.nodeSize;
    const bnBlock = {
        node: bnBlockNode,
        beforePos: bnBlockBeforePos,
        afterPos: bnBlockAfterPos,
    };
    if (bnBlockNode.type.name === "blockContainer") {
        let blockContent;
        let blockGroup;
        bnBlockNode.forEach((node, offset) => {
            if (node.type.spec.group === "blockContent") {
                // console.log(beforePos, offset);
                const blockContentNode = node;
                const blockContentBeforePos = bnBlockBeforePos + offset + 1;
                const blockContentAfterPos = blockContentBeforePos + node.nodeSize;
                blockContent = {
                    node: blockContentNode,
                    beforePos: blockContentBeforePos,
                    afterPos: blockContentAfterPos,
                };
            }
            else if (node.type.name === "blockGroup") {
                const blockGroupNode = node;
                const blockGroupBeforePos = bnBlockBeforePos + offset + 1;
                const blockGroupAfterPos = blockGroupBeforePos + node.nodeSize;
                blockGroup = {
                    node: blockGroupNode,
                    beforePos: blockGroupBeforePos,
                    afterPos: blockGroupAfterPos,
                };
            }
        });
        if (!blockContent) {
            throw new Error(`blockContainer node does not contain a blockContent node in its children: ${bnBlockNode}`);
        }
        return {
            isBlockContainer: true,
            bnBlock,
            blockContent,
            childContainer: blockGroup,
            blockNoteType: blockContent.node.type.name,
        };
    }
    else {
        if (!bnBlock.node.type.isInGroup("childContainer")) {
            throw new Error(`bnBlock node is not in the childContainer group: ${bnBlock.node}`);
        }
        return {
            isBlockContainer: false,
            bnBlock: bnBlock,
            childContainer: bnBlock,
            blockNoteType: bnBlock.node.type.name,
        };
    }
}
/**
 * Gets information regarding the ProseMirror nodes that make up a block in a
 * BlockNote document. This includes the main `blockContainer` node, the
 * `blockContent` node with the block's main body, and the optional `blockGroup`
 * node which contains the block's children. As well as the nodes, also returns
 * the ProseMirror positions just before & after each node.
 * @param posInfo An object with the main `blockContainer` node that the block
 * information should be retrieved from, and the position just before it in the
 * document.
 */
export function getBlockInfo(posInfo) {
    return getBlockInfoWithManualOffset(posInfo.node, posInfo.posBeforeNode);
}
/**
 * Gets information regarding the ProseMirror nodes that make up a block from a
 * resolved position just before the `blockContainer` node in the document that
 * corresponds to it.
 * @param resolvedPos The resolved position just before the `blockContainer`
 * node.
 */
export function getBlockInfoFromResolvedPos(resolvedPos) {
    if (!resolvedPos.nodeAfter) {
        throw new Error(`Attempted to get blockContainer node at position ${resolvedPos.pos} but a node at this position does not exist`);
    }
    return getBlockInfoWithManualOffset(resolvedPos.nodeAfter, resolvedPos.pos);
}
/**
 * Gets information regarding the ProseMirror nodes that make up a block. The
 * block chosen is the one currently containing the current ProseMirror
 * selection.
 * @param state The ProseMirror editor state.
 */
export function getBlockInfoFromSelection(state) {
    const posInfo = getNearestBlockPos(state.doc, state.selection.anchor);
    return getBlockInfo(posInfo);
}
/**
 * Gets information regarding the ProseMirror nodes that make up a block. The
 * block chosen is the one currently containing the current ProseMirror
 * selection.
 * @param tr The ProseMirror transaction.
 */
export function getBlockInfoFromTransaction(tr) {
    const posInfo = getNearestBlockPos(tr.doc, tr.selection.anchor);
    return getBlockInfo(posInfo);
}
//# sourceMappingURL=getBlockInfoFromPos.js.map