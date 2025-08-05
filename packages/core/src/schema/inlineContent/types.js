export function isLinkInlineContent(content) {
    return content.type === "link";
}
export function isPartialLinkInlineContent(content) {
    return typeof content !== "string" && content.type === "link";
}
export function isStyledTextInlineContent(content) {
    return typeof content !== "string" && content.type === "text";
}
//# sourceMappingURL=types.js.map