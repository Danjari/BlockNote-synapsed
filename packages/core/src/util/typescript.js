export class UnreachableCaseError extends Error {
    constructor(val) {
        super(`Unreachable case: ${val}`);
    }
}
export function assertEmpty(obj, throwError = true) {
    const { "data-test": dataTest, ...rest } = obj; // exclude data-test
    if (Object.keys(rest).length > 0 && throwError) {
        throw new Error("Object must be empty " + JSON.stringify(obj));
    }
}
//# sourceMappingURL=typescript.js.map