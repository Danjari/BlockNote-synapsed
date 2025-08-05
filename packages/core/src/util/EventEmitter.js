// from https://raw.githubusercontent.com/ueberdosis/tiptap/develop/packages/core/src/EventEmitter.ts (MIT)
export class EventEmitter {
    // eslint-disable-next-line @typescript-eslint/ban-types
    callbacks = {};
    on(event, fn) {
        if (!this.callbacks[event]) {
            this.callbacks[event] = [];
        }
        this.callbacks[event].push(fn);
        return () => this.off(event, fn);
    }
    emit(event, ...args) {
        const callbacks = this.callbacks[event];
        if (callbacks) {
            callbacks.forEach((callback) => callback.apply(this, args));
        }
    }
    off(event, fn) {
        const callbacks = this.callbacks[event];
        if (callbacks) {
            if (fn) {
                this.callbacks[event] = callbacks.filter((callback) => callback !== fn);
            }
            else {
                delete this.callbacks[event];
            }
        }
    }
    removeAllListeners() {
        this.callbacks = {};
    }
}
//# sourceMappingURL=EventEmitter.js.map