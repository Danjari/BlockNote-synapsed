import { ThreadStoreAuth } from "./ThreadStoreAuth.js";
/*
 * The DefaultThreadStoreAuth class defines the authorization rules for interacting with comments.
 * We take a role ("comment" or "editor") and implement the rules.
 *
 * This class is then used in the UI to show / hide specific interactions.
 *
 * Rules:
 * - View-only users should not be able to see any comments
 * - Comment-only users and editors can:
 * - - create new comments / replies / reactions
 * - - edit / delete their own comments / reactions
 * - - resolve / unresolve threads
 * - Editors can also delete any comment or thread
 */
export class DefaultThreadStoreAuth extends ThreadStoreAuth {
    userId;
    role;
    constructor(userId, role) {
        super();
        this.userId = userId;
        this.role = role;
    }
    /**
     * Auth: should be possible by anyone with comment access
     */
    canCreateThread() {
        return true;
    }
    /**
     * Auth: should be possible by anyone with comment access
     */
    canAddComment(_thread) {
        return true;
    }
    /**
     * Auth: should only be possible by the comment author
     */
    canUpdateComment(comment) {
        return comment.userId === this.userId;
    }
    /**
     * Auth: should be possible by the comment author OR an editor of the document
     */
    canDeleteComment(comment) {
        return comment.userId === this.userId || this.role === "editor";
    }
    /**
     * Auth: should only be possible by an editor of the document
     */
    canDeleteThread(_thread) {
        return this.role === "editor";
    }
    /**
     * Auth: should be possible by anyone with comment access
     */
    canResolveThread(_thread) {
        return true;
    }
    /**
     * Auth: should be possible by anyone with comment access
     */
    canUnresolveThread(_thread) {
        return true;
    }
    /**
     * Auth: should be possible by anyone with comment access
     *
     * Note: will also check if the user has already reacted with the same emoji. TBD: is that a nice design or should this responsibility be outside of auth?
     */
    canAddReaction(comment, emoji) {
        if (!emoji) {
            return true;
        }
        return !comment.reactions.some((reaction) => reaction.emoji === emoji && reaction.userIds.includes(this.userId));
    }
    /**
     * Auth: should be possible by anyone with comment access
     *
     * Note: will also check if the user has already reacted with the same emoji. TBD: is that a nice design or should this responsibility be outside of auth?
     */
    canDeleteReaction(comment, emoji) {
        if (!emoji) {
            return true;
        }
        return comment.reactions.some((reaction) => reaction.emoji === emoji && reaction.userIds.includes(this.userId));
    }
}
//# sourceMappingURL=DefaultThreadStoreAuth.js.map