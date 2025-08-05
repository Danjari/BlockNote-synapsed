// some dependencies only export as ESM modules. This makes them incompatible with Node CJS.
// To work around this, we load these dependencies as dynamic imports in a function that initializes them.
// (to reproduce this issue, run ts-node on a file that users server-util)
export let esmDependencies;
export async function initializeESMDependencies() {
    if (esmDependencies) {
        return esmDependencies;
    }
    const vals = await Promise.all([
        import("rehype-parse"),
        import("rehype-stringify"),
        import("unified"),
        import("hast-util-from-dom"),
        import("rehype-remark"),
        import("remark-gfm"),
        import("remark-stringify"),
        import("remark-parse"),
        import("remark-rehype"),
        import("rehype-format"),
    ]);
    esmDependencies = {
        rehypeParse: vals[0],
        rehypeStringify: vals[1],
        unified: vals[2],
        hastUtilFromDom: vals[3],
        rehypeRemark: vals[4],
        remarkGfm: vals[5],
        remarkStringify: vals[6],
        remarkParse: vals[7],
        remarkRehype: vals[8],
        rehypeFormat: vals[9],
    };
    return esmDependencies;
}
//# sourceMappingURL=esmDependencies.js.map