import { YjsThreadStoreBase } from "./YjsThreadStoreBase.js";
/**
 * This is a REST-based implementation of the YjsThreadStoreBase.
 * It Reads data directly from the underlying document (same as YjsThreadStore),
 * but for Writes, it sends data to a REST API that should:
 * - check the user has the correct permissions to make the desired changes
 * - apply the updates to the underlying Yjs document
 *
 * (see https://github.com/TypeCellOS/BlockNote-demo-nextjs-hocuspocus)
 *
 * The reason we still use the Yjs document as underlying storage is that it makes it easy to
 * sync updates in real-time to other collaborators.
 * (but technically, you could also implement a different storage altogether
 * and not store the thread related data in the Yjs document)
 */
export class RESTYjsThreadStore extends YjsThreadStoreBase {
    BASE_URL;
    headers;
    constructor(BASE_URL, headers, threadsYMap, auth) {
        super(threadsYMap, auth);
        this.BASE_URL = BASE_URL;
        this.headers = headers;
    }
    doRequest = async (path, method, body) => {
        const response = await fetch(`${this.BASE_URL}${path}`, {
            method,
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
                ...this.headers,
            },
        });
        if (!response.ok) {
            throw new Error(`Failed to ${method} ${path}: ${response.statusText}`);
        }
        return response.json();
    };
    addThreadToDocument = async (options) => {
        const { threadId, ...rest } = options;
        return this.doRequest(`/${threadId}/addToDocument`, "POST", rest);
    };
    createThread = async (options) => {
        return this.doRequest("", "POST", options);
    };
    addComment = (options) => {
        const { threadId, ...rest } = options;
        return this.doRequest(`/${threadId}/comments`, "POST", rest);
    };
    updateComment = (options) => {
        const { threadId, commentId, ...rest } = options;
        return this.doRequest(`/${threadId}/comments/${commentId}`, "PUT", rest);
    };
    deleteComment = (options) => {
        const { threadId, commentId, ...rest } = options;
        return this.doRequest(`/${threadId}/comments/${commentId}?soft=${!!rest.softDelete}`, "DELETE");
    };
    deleteThread = (options) => {
        return this.doRequest(`/${options.threadId}`, "DELETE");
    };
    resolveThread = (options) => {
        return this.doRequest(`/${options.threadId}/resolve`, "POST");
    };
    unresolveThread = (options) => {
        return this.doRequest(`/${options.threadId}/unresolve`, "POST");
    };
    addReaction = (options) => {
        const { threadId, commentId, ...rest } = options;
        return this.doRequest(`/${threadId}/comments/${commentId}/reactions`, "POST", rest);
    };
    deleteReaction = (options) => {
        return this.doRequest(`/${options.threadId}/comments/${options.commentId}/reactions/${options.emoji}`, "DELETE");
    };
}
//# sourceMappingURL=RESTYjsThreadStore.js.map