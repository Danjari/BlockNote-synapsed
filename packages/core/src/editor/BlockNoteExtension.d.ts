import { Plugin } from "prosemirror-state";
import { EventEmitter } from "../util/EventEmitter.js";
export declare abstract class BlockNoteExtension<TEvent extends Record<string, any> = any> extends EventEmitter<TEvent> {
    static key(): string;
    protected addProsemirrorPlugin(plugin: Plugin): void;
    readonly plugins: Plugin[];
    get priority(): number | undefined;
    constructor(..._args: any[]);
}
//# sourceMappingURL=BlockNoteExtension.d.ts.map