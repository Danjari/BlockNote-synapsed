export function stylePropsToAttributes(propSchema) {
    if (propSchema === "boolean") {
        return {};
    }
    return {
        stringValue: {
            default: undefined,
            keepOnSplit: true,
            parseHTML: (element) => element.getAttribute("data-value"),
            renderHTML: (attributes) => attributes.stringValue !== undefined
                ? {
                    "data-value": attributes.stringValue,
                }
                : {},
        },
    };
}
// Function that adds necessary classes and attributes to the `dom` element
// returned from a custom style's 'render' function, to ensure no data is lost
// on internal copy & paste.
export function addStyleAttributes(element, styleType, styleValue, propSchema) {
    // Sets content type attribute
    element.dom.setAttribute("data-style-type", styleType);
    // Adds style value as an HTML attribute in kebab-case with "data-" prefix, if
    // the style takes a string value.
    if (propSchema === "string") {
        element.dom.setAttribute("data-value", styleValue);
    }
    if (element.contentDOM !== undefined) {
        element.contentDOM.setAttribute("data-editable", "");
    }
    return element;
}
// This helper function helps to instantiate a stylespec with a
// config and implementation that conform to the type of Config
export function createInternalStyleSpec(config, implementation) {
    return {
        config,
        implementation,
    };
}
export function createStyleSpecFromTipTapMark(mark, propSchema) {
    return createInternalStyleSpec({
        type: mark.name,
        propSchema,
    }, {
        mark,
    });
}
export function getStyleSchemaFromSpecs(specs) {
    return Object.fromEntries(Object.entries(specs).map(([key, value]) => [key, value.config]));
}
//# sourceMappingURL=internal.js.map