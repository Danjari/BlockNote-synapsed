import { nodeToBlock } from "../../nodeConversions/nodeToBlock.js";
import { getNodeById } from "../../nodeUtil.js";
import { getPmSchema } from "../../pmUtil.js";
export function getBlock(doc, blockIdentifier) {
    const id = typeof blockIdentifier === "string" ? blockIdentifier : blockIdentifier.id;
    const pmSchema = getPmSchema(doc);
    const posInfo = getNodeById(id, doc);
    if (!posInfo) {
        return undefined;
    }
    return nodeToBlock(posInfo.node, pmSchema);
}
export function getPrevBlock(doc, blockIdentifier) {
    const id = typeof blockIdentifier === "string" ? blockIdentifier : blockIdentifier.id;
    const posInfo = getNodeById(id, doc);
    const pmSchema = getPmSchema(doc);
    if (!posInfo) {
        return undefined;
    }
    const $posBeforeNode = doc.resolve(posInfo.posBeforeNode);
    const nodeToConvert = $posBeforeNode.nodeBefore;
    if (!nodeToConvert) {
        return undefined;
    }
    return nodeToBlock(nodeToConvert, pmSchema);
}
export function getNextBlock(doc, blockIdentifier) {
    const id = typeof blockIdentifier === "string" ? blockIdentifier : blockIdentifier.id;
    const posInfo = getNodeById(id, doc);
    const pmSchema = getPmSchema(doc);
    if (!posInfo) {
        return undefined;
    }
    const $posAfterNode = doc.resolve(posInfo.posBeforeNode + posInfo.node.nodeSize);
    const nodeToConvert = $posAfterNode.nodeAfter;
    if (!nodeToConvert) {
        return undefined;
    }
    return nodeToBlock(nodeToConvert, pmSchema);
}
export function getParentBlock(doc, blockIdentifier) {
    const id = typeof blockIdentifier === "string" ? blockIdentifier : blockIdentifier.id;
    const pmSchema = getPmSchema(doc);
    const posInfo = getNodeById(id, doc);
    if (!posInfo) {
        return undefined;
    }
    const $posBeforeNode = doc.resolve(posInfo.posBeforeNode);
    const parentNode = $posBeforeNode.node();
    const grandparentNode = $posBeforeNode.node(-1);
    const nodeToConvert = grandparentNode.type.name !== "doc"
        ? parentNode.type.name === "blockGroup"
            ? grandparentNode
            : parentNode
        : undefined;
    if (!nodeToConvert) {
        return undefined;
    }
    return nodeToBlock(nodeToConvert, pmSchema);
}
//# sourceMappingURL=getBlock.js.map