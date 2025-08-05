import { createBlockSpec, } from "../../schema/index.js";
import { defaultProps } from "../defaultProps.js";
import { parseEmbedElement } from "./helpers/parse/parseEmbedElement.js";
import { parseFigureElement } from "./helpers/parse/parseFigureElement.js";
import { createFileBlockWrapper } from "./helpers/render/createFileBlockWrapper.js";
import { createLinkWithCaption } from "./helpers/toExternalHTML/createLinkWithCaption.js";
export const filePropSchema = {
    backgroundColor: defaultProps.backgroundColor,
    // File name.
    name: {
        default: "",
    },
    // File url.
    url: {
        default: "",
    },
    // File caption.
    caption: {
        default: "",
    },
};
export const fileBlockConfig = {
    type: "file",
    propSchema: filePropSchema,
    content: "none",
    isFileBlock: true,
};
export const fileRender = (block, editor) => {
    return createFileBlockWrapper(block, editor);
};
export const fileParse = (element) => {
    if (element.tagName === "EMBED") {
        // Ignore if parent figure has already been parsed.
        if (element.closest("figure")) {
            return undefined;
        }
        return parseEmbedElement(element);
    }
    if (element.tagName === "FIGURE") {
        const parsedFigure = parseFigureElement(element, "embed");
        if (!parsedFigure) {
            return undefined;
        }
        const { targetElement, caption } = parsedFigure;
        return {
            ...parseEmbedElement(targetElement),
            caption,
        };
    }
    return undefined;
};
export const fileToExternalHTML = (block) => {
    if (!block.props.url) {
        const div = document.createElement("p");
        div.textContent = "Add file";
        return {
            dom: div,
        };
    }
    const fileSrcLink = document.createElement("a");
    fileSrcLink.href = block.props.url;
    fileSrcLink.textContent = block.props.name || block.props.url;
    if (block.props.caption) {
        return createLinkWithCaption(fileSrcLink, block.props.caption);
    }
    return {
        dom: fileSrcLink,
    };
};
export const FileBlock = createBlockSpec(fileBlockConfig, {
    render: fileRender,
    parse: fileParse,
    toExternalHTML: fileToExternalHTML,
});
//# sourceMappingURL=FileBlockContent.js.map