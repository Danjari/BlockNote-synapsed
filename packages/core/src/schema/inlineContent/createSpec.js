import { Node } from "@tiptap/core";
import { inlineContentToNodes } from "../../api/nodeConversions/blockToNode.js";
import { nodeToCustomInlineContent } from "../../api/nodeConversions/nodeToBlock.js";
import { propsToAttributes } from "../blocks/internal.js";
import { addInlineContentAttributes, addInlineContentKeyboardShortcuts, createInlineContentSpecFromTipTapNode, } from "./internal.js";
export function getInlineContentParseRules(config) {
    return [
        {
            tag: `[data-inline-content-type="${config.type}"]`,
            contentElement: (element) => {
                const htmlElement = element;
                if (htmlElement.matches("[data-editable]")) {
                    return htmlElement;
                }
                return htmlElement.querySelector("[data-editable]") || htmlElement;
            },
        },
    ];
}
export function createInlineContentSpec(inlineContentConfig, inlineContentImplementation) {
    const node = Node.create({
        name: inlineContentConfig.type,
        inline: true,
        group: "inline",
        selectable: inlineContentConfig.content === "styled",
        atom: inlineContentConfig.content === "none",
        content: (inlineContentConfig.content === "styled"
            ? "inline*"
            : ""),
        addAttributes() {
            return propsToAttributes(inlineContentConfig.propSchema);
        },
        addKeyboardShortcuts() {
            return addInlineContentKeyboardShortcuts(inlineContentConfig);
        },
        parseHTML() {
            return getInlineContentParseRules(inlineContentConfig);
        },
        renderHTML({ node }) {
            const editor = this.options.editor;
            const output = inlineContentImplementation.render(nodeToCustomInlineContent(node, editor.schema.inlineContentSchema, editor.schema.styleSchema), // TODO: fix cast
            () => {
                // No-op
            }, editor);
            return addInlineContentAttributes(output, inlineContentConfig.type, node.attrs, inlineContentConfig.propSchema);
        },
        addNodeView() {
            return ({ node, getPos }) => {
                const editor = this.options.editor;
                const output = inlineContentImplementation.render(nodeToCustomInlineContent(node, editor.schema.inlineContentSchema, editor.schema.styleSchema), // TODO: fix cast
                (update) => {
                    if (typeof getPos === "boolean") {
                        return;
                    }
                    const content = inlineContentToNodes([update], editor.pmSchema);
                    editor.transact((tr) => tr.replaceWith(getPos(), getPos() + node.nodeSize, content));
                }, editor);
                return addInlineContentAttributes(output, inlineContentConfig.type, node.attrs, inlineContentConfig.propSchema);
            };
        },
    });
    return createInlineContentSpecFromTipTapNode(node, inlineContentConfig.propSchema); // TODO: fix cast
}
//# sourceMappingURL=createSpec.js.map