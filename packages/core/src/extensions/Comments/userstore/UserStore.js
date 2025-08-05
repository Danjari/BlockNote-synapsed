import { EventEmitter } from "../../../util/EventEmitter.js";
/**
 * The `UserStore` is used to retrieve and cache information about users.
 *
 * It does this by calling `resolveUsers` (which is user-defined in the Editor Options)
 * for users that are not yet cached.
 */
export class UserStore extends EventEmitter {
    resolveUsers;
    userCache = new Map();
    // avoid duplicate loads
    loadingUsers = new Set();
    constructor(resolveUsers) {
        super();
        this.resolveUsers = resolveUsers;
    }
    /**
     * Load information about users based on an array of user ids.
     */
    async loadUsers(userIds) {
        const missingUsers = userIds.filter((id) => !this.userCache.has(id) && !this.loadingUsers.has(id));
        if (missingUsers.length === 0) {
            return;
        }
        for (const id of missingUsers) {
            this.loadingUsers.add(id);
        }
        try {
            const users = await this.resolveUsers(missingUsers);
            for (const user of users) {
                this.userCache.set(user.id, user);
            }
            this.emit("update", this.userCache);
        }
        finally {
            for (const id of missingUsers) {
                // delete the users from the loading set
                // on a next call to `loadUsers` we will either
                // return the cached user or retry loading the user if the request failed failed
                this.loadingUsers.delete(id);
            }
        }
    }
    /**
     * Retrieve information about a user based on their id, if cached.
     *
     * The user will have to be loaded via `loadUsers` first
     */
    getUser(userId) {
        return this.userCache.get(userId);
    }
    /**
     * Subscribe to changes in the user store.
     *
     * @param cb - The callback to call when the user store changes.
     * @returns A function to unsubscribe from the user store.
     */
    subscribe(cb) {
        return this.on("update", cb);
    }
}
//# sourceMappingURL=UserStore.js.map