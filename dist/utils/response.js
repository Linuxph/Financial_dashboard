"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildResponse = void 0;
const buildResponse = (success, message, data) => {
    if (data === undefined) {
        return { success, message };
    }
    return { success, message, data };
};
exports.buildResponse = buildResponse;
