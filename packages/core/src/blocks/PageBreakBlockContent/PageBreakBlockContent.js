import { createBlockSpec, } from "../../schema/index.js";
export const pageBreakConfig = {
    type: "pageBreak",
    propSchema: {},
    content: "none",
    isFileBlock: false,
    isSelectable: false,
};
export const pageBreakRender = () => {
    const pageBreak = document.createElement("div");
    pageBreak.className = "bn-page-break";
    pageBreak.setAttribute("data-page-break", "");
    return {
        dom: pageBreak,
    };
};
export const pageBreakParse = (element) => {
    if (element.tagName === "DIV" && element.hasAttribute("data-page-break")) {
        return {
            type: "pageBreak",
        };
    }
    return undefined;
};
export const pageBreakToExternalHTML = () => {
    const pageBreak = document.createElement("div");
    pageBreak.setAttribute("data-page-break", "");
    return {
        dom: pageBreak,
    };
};
export const PageBreak = createBlockSpec(pageBreakConfig, {
    render: pageBreakRender,
    parse: pageBreakParse,
    toExternalHTML: pageBreakToExternalHTML,
});
//# sourceMappingURL=PageBreakBlockContent.js.map