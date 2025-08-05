import { esmDependencies, initializeESMDependencies, } from "../../../util/esmDependencies.js";
import { createExternalHTMLExporter } from "../html/externalHTMLExporter.js";
import { removeUnderlines } from "./removeUnderlinesRehypePlugin.js";
import { addSpacesToCheckboxes } from "./util/addSpacesToCheckboxesRehypePlugin.js";
// Needs to be sync because it's used in drag handler event (SideMenuPlugin)
// Ideally, call `await initializeESMDependencies()` before calling this function
export function cleanHTMLToMarkdown(cleanHTMLString) {
    const deps = esmDependencies;
    if (!deps) {
        throw new Error("cleanHTMLToMarkdown requires ESM dependencies to be initialized");
    }
    const markdownString = deps.unified
        .unified()
        .use(deps.rehypeParse.default, { fragment: true })
        .use(removeUnderlines)
        .use(addSpacesToCheckboxes)
        .use(deps.rehypeRemark.default)
        .use(deps.remarkGfm.default)
        .use(deps.remarkStringify.default, {
        handlers: { text: (node) => node.value },
    })
        .processSync(cleanHTMLString);
    return markdownString.value;
}
export async function blocksToMarkdown(blocks, schema, editor, options) {
    await initializeESMDependencies();
    const exporter = createExternalHTMLExporter(schema, editor);
    const externalHTML = exporter.exportBlocks(blocks, options);
    return cleanHTMLToMarkdown(externalHTML);
}
//# sourceMappingURL=markdownExporter.js.map