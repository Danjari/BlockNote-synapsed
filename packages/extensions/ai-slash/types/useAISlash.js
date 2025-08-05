"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAISlash = useAISlash;
var react_1 = require("react");
/**
 * React hook for AI slash commands in BlockNote editor
 *
 * @param config - Configuration object with callbacks and metadata
 * @returns Object with methods to interact with AI commands
 */
function useAISlash(config) {
    if (config === void 0) { config = {}; }
    var callbacks = config.callbacks;
    var callbacksRef = (0, react_1.useRef)(callbacks);
    // Update callbacks ref when they change
    callbacksRef.current = callbacks;
    var emitAICommand = (0, react_1.useCallback)(function (action, payload) {
        var _a, _b;
        if (payload === void 0) { payload = {}; }
        var event = {
            action: action,
            payload: __assign(__assign({}, payload), { classId: config.classId, nodeId: config.nodeId, jwt: config.jwt })
        };
        (_b = (_a = callbacksRef.current) === null || _a === void 0 ? void 0 : _a.onAICommand) === null || _b === void 0 ? void 0 : _b.call(_a, event);
    }, [config.classId, config.nodeId, config.jwt]);
    var updateStream = (0, react_1.useCallback)(function (chunk) {
        var _a, _b;
        (_b = (_a = callbacksRef.current) === null || _a === void 0 ? void 0 : _a.onStream) === null || _b === void 0 ? void 0 : _b.call(_a, chunk);
    }, []);
    var completeQuiz = (0, react_1.useCallback)(function (result) {
        var _a, _b;
        (_b = (_a = callbacksRef.current) === null || _a === void 0 ? void 0 : _a.onQuizComplete) === null || _b === void 0 ? void 0 : _b.call(_a, result);
    }, []);
    return {
        emitAICommand: emitAICommand,
        updateStream: updateStream,
        completeQuiz: completeQuiz,
    };
}
//# sourceMappingURL=useAISlash.js.map