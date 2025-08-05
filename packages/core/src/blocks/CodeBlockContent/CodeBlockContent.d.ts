import type { HighlighterGeneric } from "@shikijs/types";
export type CodeBlockOptions = {
    /**
     * Whether to indent lines with a tab when the user presses `Tab` in a code block.
     *
     * @default true
     */
    indentLineWithTab?: boolean;
    /**
     * The default language to use for code blocks.
     *
     * @default "text"
     */
    defaultLanguage?: string;
    /**
     * The languages that are supported in the editor.
     *
     * @example
     * {
     *   javascript: {
     *     name: "JavaScript",
     *     aliases: ["js"],
     *   },
     *   typescript: {
     *     name: "TypeScript",
     *     aliases: ["ts"],
     *   },
     * }
     */
    supportedLanguages: Record<string, {
        /**
         * The display name of the language.
         */
        name: string;
        /**
         * Aliases for this language.
         */
        aliases?: string[];
    }>;
    /**
     * The highlighter to use for code blocks.
     */
    createHighlighter?: () => Promise<HighlighterGeneric<any, any>>;
};
export declare const shikiParserSymbol: unique symbol;
export declare const shikiHighlighterPromiseSymbol: unique symbol;
export declare const defaultCodeBlockPropSchema: {
    language: {
        default: string;
    };
};
export declare const CodeBlock: {
    config: {
        type: "codeBlock";
        content: "inline";
        propSchema: {
            language: {
                default: string;
            };
        };
    };
    implementation: import("../../index.js").TiptapBlockImplementation<{
        type: "codeBlock";
        content: "inline";
        propSchema: {
            language: {
                default: string;
            };
        };
    }, any, import("../../index.js").InlineContentSchema, import("../../index.js").StyleSchema>;
};
//# sourceMappingURL=CodeBlockContent.d.ts.map