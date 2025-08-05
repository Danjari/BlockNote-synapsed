import { Mark } from "@tiptap/core";
import { UnreachableCaseError } from "../../util/typescript.js";
import { addStyleAttributes, createInternalStyleSpec, stylePropsToAttributes, } from "./internal.js";
// TODO: support serialization
export function getStyleParseRules(config) {
    return [
        {
            tag: `[data-style-type="${config.type}"]`,
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
export function createStyleSpec(styleConfig, styleImplementation) {
    const mark = Mark.create({
        name: styleConfig.type,
        addAttributes() {
            return stylePropsToAttributes(styleConfig.propSchema);
        },
        parseHTML() {
            return getStyleParseRules(styleConfig);
        },
        renderHTML({ mark }) {
            let renderResult;
            if (styleConfig.propSchema === "boolean") {
                // @ts-ignore not sure why this is complaining
                renderResult = styleImplementation.render();
            }
            else if (styleConfig.propSchema === "string") {
                renderResult = styleImplementation.render(mark.attrs.stringValue);
            }
            else {
                throw new UnreachableCaseError(styleConfig.propSchema);
            }
            // const renderResult = styleImplementation.render();
            return addStyleAttributes(renderResult, styleConfig.type, mark.attrs.stringValue, styleConfig.propSchema);
        },
    });
    return createInternalStyleSpec(styleConfig, {
        mark,
    });
}
//# sourceMappingURL=createSpec.js.map