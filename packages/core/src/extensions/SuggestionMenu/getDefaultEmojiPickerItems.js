import { checkDefaultInlineContentTypeInSchema } from "../../blocks/defaultBlockTypeGuards.js";
// Temporary fix for https://github.com/missive/emoji-mart/pull/929
let emojiLoadingPromise;
async function loadEmojiMart() {
    if (emojiLoadingPromise) {
        return emojiLoadingPromise;
    }
    emojiLoadingPromise = (async () => {
        // load dynamically because emoji-mart doesn't specify type: module and breaks in nodejs
        const [emojiMartModule, emojiDataModule] = await Promise.all([
            import("emoji-mart"),
            // use a dynamic import to encourage bundle-splitting
            // and a smaller initial client bundle size
            import("@emoji-mart/data"),
        ]);
        const emojiMart = "default" in emojiMartModule ? emojiMartModule.default : emojiMartModule;
        const emojiData = "default" in emojiDataModule
            ? emojiDataModule.default
            : emojiDataModule;
        await emojiMart.init({ data: emojiData });
        return { emojiMart, emojiData };
    })();
    return emojiLoadingPromise;
}
export async function getDefaultEmojiPickerItems(editor, query) {
    if (!checkDefaultInlineContentTypeInSchema("text", editor)) {
        return [];
    }
    const { emojiData, emojiMart } = await loadEmojiMart();
    const emojisToShow = query.trim() === ""
        ? Object.values(emojiData.emojis)
        : (await emojiMart.SearchIndex.search(query));
    return emojisToShow.map((emoji) => ({
        id: emoji.skins[0].native,
        onItemClick: () => editor.insertInlineContent(emoji.skins[0].native + " "),
    }));
}
//# sourceMappingURL=getDefaultEmojiPickerItems.js.map