import { Extension } from "@tiptap/core";
import { Plugin } from "prosemirror-state";
import { acceptedMIMETypes } from "./acceptedMIMETypes.js";
import { handleFileInsertion } from "./handleFileInsertion.js";
export const createDropFileExtension = (editor) => Extension.create({
    name: "dropFile",
    addProseMirrorPlugins() {
        return [
            new Plugin({
                props: {
                    handleDOMEvents: {
                        drop(_view, event) {
                            if (!editor.isEditable) {
                                return;
                            }
                            let format = null;
                            for (const mimeType of acceptedMIMETypes) {
                                if (event.dataTransfer.types.includes(mimeType)) {
                                    format = mimeType;
                                    break;
                                }
                            }
                            if (format === null) {
                                return true;
                            }
                            if (format === "Files") {
                                handleFileInsertion(event, editor);
                                return true;
                            }
                            return false;
                        },
                    },
                },
            }),
        ];
    },
});
//# sourceMappingURL=fileDropExtension.js.map