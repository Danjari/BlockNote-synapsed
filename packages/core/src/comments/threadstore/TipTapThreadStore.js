import { ThreadStore } from "./ThreadStore.js";
/**
 * The `TiptapThreadStore` integrates with Tiptap's collaboration provider for comment management.
 * You can pass a `TiptapCollabProvider` to the constructor which takes care of storing the comments.
 *
 * Under the hood, this actually works similarly to the `YjsThreadStore` implementation. (comments are stored in the Yjs document)
 */
export class TiptapThreadStore extends ThreadStore {
    userId;
    provider;
    constructor(userId, provider, auth) {
        super(auth);
        this.userId = userId;
        this.provider = provider;
    }
    /**
     * Creates a new thread with an initial comment.
     */
    async createThread(options) {
        let thread = this.provider.createThread({
            data: options.metadata,
        });
        thread = this.provider.addComment(thread.id, {
            content: options.initialComment.body,
            data: {
                metadata: options.initialComment.metadata,
                userId: this.userId,
            },
        });
        return this.tiptapThreadToThreadData(thread);
    }
    // TipTapThreadStore does not support addThreadToDocument
    addThreadToDocument = undefined;
    /**
     * Adds a comment to a thread.
     */
    async addComment(options) {
        const thread = this.provider.addComment(options.threadId, {
            content: options.comment.body,
            data: {
                metadata: options.comment.metadata,
                userId: this.userId,
            },
        });
        return this.tiptapCommentToCommentData(thread.comments[thread.comments.length - 1]);
    }
    /**
     * Updates a comment in a thread.
     */
    async updateComment(options) {
        const comment = this.provider.getThreadComment(options.threadId, options.commentId, true);
        if (!comment) {
            throw new Error("Comment not found");
        }
        this.provider.updateComment(options.threadId, options.commentId, {
            content: options.comment.body,
            data: {
                ...comment.data,
                metadata: options.comment.metadata,
            },
        });
    }
    tiptapCommentToCommentData(comment) {
        const reactions = [];
        for (const reaction of (comment.data?.reactions ||
            [])) {
            const existingReaction = reactions.find((r) => r.emoji === reaction.emoji);
            if (existingReaction) {
                existingReaction.userIds.push(reaction.userId);
                existingReaction.createdAt = new Date(Math.min(existingReaction.createdAt.getTime(), reaction.createdAt));
            }
            else {
                reactions.push({
                    emoji: reaction.emoji,
                    createdAt: new Date(reaction.createdAt),
                    userIds: [reaction.userId],
                });
            }
        }
        return {
            type: "comment",
            id: comment.id,
            body: comment.content,
            metadata: comment.data?.metadata,
            userId: comment.data?.userId,
            createdAt: new Date(comment.createdAt),
            updatedAt: new Date(comment.updatedAt),
            reactions,
        };
    }
    tiptapThreadToThreadData(thread) {
        return {
            type: "thread",
            id: thread.id,
            comments: thread.comments.map((comment) => this.tiptapCommentToCommentData(comment)),
            resolved: !!thread.resolvedAt,
            metadata: thread.data?.metadata,
            createdAt: new Date(thread.createdAt),
            updatedAt: new Date(thread.updatedAt),
        };
    }
    /**
     * Deletes a comment from a thread.
     */
    async deleteComment(options) {
        this.provider.deleteComment(options.threadId, options.commentId);
    }
    /**
     * Deletes a thread.
     */
    async deleteThread(options) {
        this.provider.deleteThread(options.threadId);
    }
    /**
     * Marks a thread as resolved.
     */
    async resolveThread(options) {
        this.provider.updateThread(options.threadId, {
            resolvedAt: new Date().toISOString(),
        });
    }
    /**
     * Marks a thread as unresolved.
     */
    async unresolveThread(options) {
        this.provider.updateThread(options.threadId, {
            resolvedAt: null,
        });
    }
    /**
     * Adds a reaction to a comment.
     *
     * Auth: should be possible by anyone with comment access
     */
    async addReaction(options) {
        const comment = this.provider.getThreadComment(options.threadId, options.commentId, true);
        if (!comment) {
            throw new Error("Comment not found");
        }
        this.provider.updateComment(options.threadId, options.commentId, {
            data: {
                ...comment.data,
                reactions: [
                    ...(comment.data?.reactions || []),
                    {
                        emoji: options.emoji,
                        createdAt: Date.now(),
                        userId: this.userId,
                    },
                ],
            },
        });
    }
    /**
     * Deletes a reaction from a comment.
     *
     * Auth: should be possible by the reaction author
     */
    async deleteReaction(options) {
        const comment = this.provider.getThreadComment(options.threadId, options.commentId, true);
        if (!comment) {
            throw new Error("Comment not found");
        }
        this.provider.updateComment(options.threadId, options.commentId, {
            data: {
                ...comment.data,
                reactions: (comment.data?.reactions || []).filter((reaction) => reaction.emoji !== options.emoji && reaction.userId !== this.userId),
            },
        });
    }
    getThread(threadId) {
        const thread = this.provider.getThread(threadId);
        if (!thread) {
            throw new Error("Thread not found");
        }
        return this.tiptapThreadToThreadData(thread);
    }
    getThreads() {
        return new Map(this.provider
            .getThreads()
            .map((thread) => [thread.id, this.tiptapThreadToThreadData(thread)]));
    }
    subscribe(cb) {
        const newCb = () => {
            cb(this.getThreads());
        };
        this.provider.watchThreads(newCb);
        return () => {
            this.provider.unwatchThreads(newCb);
        };
    }
}
//# sourceMappingURL=TipTapThreadStore.js.map