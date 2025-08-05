import { camelToDataKebab } from "../../util/string.js";
// Function that adds necessary classes and attributes to the `dom` element
// returned from a custom inline content's 'render' function, to ensure no data
// is lost on internal copy & paste.
export function addInlineContentAttributes(element, inlineContentType, inlineContentProps, propSchema) {
    // Sets content type attribute
    element.dom.setAttribute("data-inline-content-type", inlineContentType);
    // Adds props as HTML attributes in kebab-case with "data-" prefix. Skips props
    // set to their default values.
    Object.entries(inlineContentProps)
        .filter(([prop, value]) => {
        const spec = propSchema[prop];
        return value !== spec.default;
    })
        .map(([prop, value]) => {
        return [camelToDataKebab(prop), value];
    })
        .forEach(([prop, value]) => element.dom.setAttribute(prop, value));
    if (element.contentDOM !== undefined) {
        element.contentDOM.setAttribute("data-editable", "");
    }
    return element;
}
// see https://github.com/TypeCellOS/BlockNote/pull/435
export function addInlineContentKeyboardShortcuts(config) {
    return {
        Backspace: ({ editor }) => {
            const resolvedPos = editor.state.selection.$from;
            return (editor.state.selection.empty &&
                resolvedPos.node().type.name === config.type &&
                resolvedPos.parentOffset === 0);
        },
    };
}
// This helper function helps to instantiate a InlineContentSpec with a
// config and implementation that conform to the type of Config
export function createInternalInlineContentSpec(config, implementation) {
    return {
        config,
        implementation,
    };
}
export function createInlineContentSpecFromTipTapNode(node, propSchema) {
    return createInternalInlineContentSpec({
        type: node.name,
        propSchema,
        content: node.config.content === "inline*" ? "styled" : "none",
    }, {
        node,
    });
}
export function getInlineContentSchemaFromSpecs(specs) {
    return Object.fromEntries(Object.entries(specs).map(([key, value]) => [key, value.config]));
}
//# sourceMappingURL=internal.js.map