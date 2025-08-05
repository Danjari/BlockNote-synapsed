export class Exporter {
    mappings;
    options;
    constructor(_schema, // only used for type inference
    mappings, options) {
        this.mappings = mappings;
        this.options = options;
    }
    async resolveFile(url) {
        if (!this.options?.resolveFileUrl) {
            return (await fetch(url)).blob();
        }
        const ret = await this.options.resolveFileUrl(url);
        if (ret instanceof Blob) {
            return ret;
        }
        return (await fetch(ret)).blob();
    }
    mapStyles(styles) {
        const stylesArray = Object.entries(styles).map(([key, value]) => {
            const mappedStyle = this.mappings.styleMapping[key](value, this);
            return mappedStyle;
        });
        return stylesArray;
    }
    mapInlineContent(inlineContent) {
        return this.mappings.inlineContentMapping[inlineContent.type](inlineContent, this);
    }
    transformInlineContent(inlineContentArray) {
        return inlineContentArray.map((ic) => this.mapInlineContent(ic));
    }
    async mapBlock(block, nestingLevel, numberedListIndex, children) {
        return this.mappings.blockMapping[block.type](block, this, nestingLevel, numberedListIndex, children);
    }
}
//# sourceMappingURL=Exporter.js.map