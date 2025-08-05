export function getDraggableBlockFromElement(element, view) {
    while (element &&
        element.parentElement &&
        element.parentElement !== view.dom &&
        element.getAttribute?.("data-node-type") !== "blockContainer") {
        element = element.parentElement;
    }
    if (element.getAttribute?.("data-node-type") !== "blockContainer") {
        return undefined;
    }
    return { node: element, id: element.getAttribute("data-id") };
}
//# sourceMappingURL=getDraggableBlockFromElement.js.map