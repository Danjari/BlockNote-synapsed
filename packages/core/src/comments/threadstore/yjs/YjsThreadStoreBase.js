import { ThreadStore } from "../ThreadStore.js";
import { yMapToThread } from "./yjsHelpers.js";
/**
 * This is an abstract class that only implements the READ methods required by the ThreadStore interface.
 * The data is read from a Yjs Map.
 */
export class YjsThreadStoreBase extends ThreadStore {
    threadsYMap;
    constructor(threadsYMap, auth) {
        super(auth);
        this.threadsYMap = threadsYMap;
    }
    // TODO: async / reactive interface?
    getThread(threadId) {
        const yThread = this.threadsYMap.get(threadId);
        if (!yThread) {
            throw new Error("Thread not found");
        }
        const thread = yMapToThread(yThread);
        return thread;
    }
    getThreads() {
        const threadMap = new Map();
        this.threadsYMap.forEach((yThread, id) => {
            threadMap.set(id, yMapToThread(yThread));
        });
        return threadMap;
    }
    subscribe(cb) {
        const observer = () => {
            cb(this.getThreads());
        };
        this.threadsYMap.observeDeep(observer);
        return () => {
            this.threadsYMap.unobserveDeep(observer);
        };
    }
}
//# sourceMappingURL=YjsThreadStoreBase.js.map