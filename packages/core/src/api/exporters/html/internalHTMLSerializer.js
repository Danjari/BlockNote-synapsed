import { DOMSerializer } from "prosemirror-model";
import { serializeBlocksInternalHTML } from "./util/serializeBlocksInternalHTML.js";
// Used to serialize BlockNote blocks and ProseMirror nodes to HTML without
// losing data. Blocks are exported using the `toInternalHTML` method in their
// `blockSpec`.
//
// The HTML created by this serializer is the same as what's rendered by the
// editor to the DOM. This means that it retains the same structure as the
// editor, including the `blockGroup` and `blockContainer` wrappers. This also
// means that it can be converted back to the original blocks without any data
// loss.
export const createInternalHTMLSerializer = (schema, editor) => {
    const serializer = DOMSerializer.fromSchema(schema);
    return {
        serializeBlocks: (blocks, options) => {
            return serializeBlocksInternalHTML(editor, blocks, serializer, options)
                .outerHTML;
        },
    };
};
//# sourceMappingURL=internalHTMLSerializer.js.map