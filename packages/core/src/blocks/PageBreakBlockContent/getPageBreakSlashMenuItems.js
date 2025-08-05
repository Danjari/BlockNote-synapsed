import { insertOrUpdateBlock } from "../../extensions/SuggestionMenu/getDefaultSlashMenuItems.js";
import { pageBreakSchema } from "./schema.js";
export function checkPageBreakBlocksInSchema(editor) {
    return ("pageBreak" in editor.schema.blockSchema &&
        editor.schema.blockSchema["pageBreak"] ===
            pageBreakSchema.blockSchema["pageBreak"]);
}
export function getPageBreakSlashMenuItems(editor) {
    const items = [];
    if (checkPageBreakBlocksInSchema(editor)) {
        items.push({
            ...editor.dictionary.slash_menu.page_break,
            onItemClick: () => {
                insertOrUpdateBlock(editor, {
                    type: "pageBreak",
                });
            },
            key: "page_break",
        });
    }
    return items;
}
//# sourceMappingURL=getPageBreakSlashMenuItems.js.map