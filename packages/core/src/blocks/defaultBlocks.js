import Bold from "@tiptap/extension-bold";
import Code from "@tiptap/extension-code";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import Underline from "@tiptap/extension-underline";
import { BackgroundColor } from "../extensions/BackgroundColor/BackgroundColorMark.js";
import { TextColor } from "../extensions/TextColor/TextColorMark.js";
import { createStyleSpecFromTipTapMark, getBlockSchemaFromSpecs, getInlineContentSchemaFromSpecs, getStyleSchemaFromSpecs, } from "../schema/index.js";
import { AudioBlock } from "./AudioBlockContent/AudioBlockContent.js";
import { CodeBlock } from "./CodeBlockContent/CodeBlockContent.js";
import { FileBlock } from "./FileBlockContent/FileBlockContent.js";
import { Heading } from "./HeadingBlockContent/HeadingBlockContent.js";
import { ImageBlock } from "./ImageBlockContent/ImageBlockContent.js";
import { ToggleListItem } from "./ListItemBlockContent/ToggleListItemBlockContent/ToggleListItemBlockContent.js";
import { BulletListItem } from "./ListItemBlockContent/BulletListItemBlockContent/BulletListItemBlockContent.js";
import { CheckListItem } from "./ListItemBlockContent/CheckListItemBlockContent/CheckListItemBlockContent.js";
import { NumberedListItem } from "./ListItemBlockContent/NumberedListItemBlockContent/NumberedListItemBlockContent.js";
import { Paragraph } from "./ParagraphBlockContent/ParagraphBlockContent.js";
import { Quote } from "./QuoteBlockContent/QuoteBlockContent.js";
import { Table } from "./TableBlockContent/TableBlockContent.js";
import { VideoBlock } from "./VideoBlockContent/VideoBlockContent.js";
export const defaultBlockSpecs = {
    paragraph: Paragraph,
    heading: Heading,
    quote: Quote,
    codeBlock: CodeBlock,
    toggleListItem: ToggleListItem,
    bulletListItem: BulletListItem,
    numberedListItem: NumberedListItem,
    checkListItem: CheckListItem,
    table: Table,
    file: FileBlock,
    image: ImageBlock,
    video: VideoBlock,
    audio: AudioBlock,
};
export const defaultBlockSchema = getBlockSchemaFromSpecs(defaultBlockSpecs);
export const defaultStyleSpecs = {
    bold: createStyleSpecFromTipTapMark(Bold, "boolean"),
    italic: createStyleSpecFromTipTapMark(Italic, "boolean"),
    underline: createStyleSpecFromTipTapMark(Underline, "boolean"),
    strike: createStyleSpecFromTipTapMark(Strike, "boolean"),
    code: createStyleSpecFromTipTapMark(Code, "boolean"),
    textColor: TextColor,
    backgroundColor: BackgroundColor,
};
export const defaultStyleSchema = getStyleSchemaFromSpecs(defaultStyleSpecs);
export const defaultInlineContentSpecs = {
    text: { config: "text", implementation: {} },
    link: { config: "link", implementation: {} },
};
export const defaultInlineContentSchema = getInlineContentSchemaFromSpecs(defaultInlineContentSpecs);
//# sourceMappingURL=defaultBlocks.js.map