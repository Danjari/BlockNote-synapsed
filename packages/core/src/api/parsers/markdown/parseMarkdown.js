import { initializeESMDependencies } from "../../../util/esmDependencies.js";
import { HTMLToBlocks } from "../html/parseHTML.js";
// modified version of https://github.com/syntax-tree/mdast-util-to-hast/blob/main/lib/handlers/code.js
// that outputs a data-language attribute instead of a CSS class (e.g.: language-typescript)
function code(state, node) {
    const value = node.value ? node.value : "";
    /** @type {Properties} */
    const properties = {};
    if (node.lang) {
        // changed line
        properties["data-language"] = node.lang;
    }
    // Create `<code>`.
    /** @type {Element} */
    let result = {
        type: "element",
        tagName: "code",
        properties,
        children: [{ type: "text", value }],
    };
    if (node.meta) {
        result.data = { meta: node.meta };
    }
    state.patch(node, result);
    result = state.applyData(node, result);
    // Create `<pre>`.
    result = {
        type: "element",
        tagName: "pre",
        properties: {},
        children: [result],
    };
    state.patch(node, result);
    return result;
}
export async function markdownToHTML(markdown) {
    const deps = await initializeESMDependencies();
    const htmlString = deps.unified
        .unified()
        .use(deps.remarkParse.default)
        .use(deps.remarkGfm.default)
        .use(deps.remarkRehype.default, {
        handlers: {
            ...deps.remarkRehype.defaultHandlers,
            code,
        },
    })
        .use(deps.rehypeStringify.default)
        .processSync(markdown);
    return htmlString.value;
}
export async function markdownToBlocks(markdown, pmSchema) {
    const htmlString = await markdownToHTML(markdown);
    return HTMLToBlocks(htmlString, pmSchema);
}
//# sourceMappingURL=parseMarkdown.js.map