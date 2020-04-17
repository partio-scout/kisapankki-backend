"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Check whether the input is a url.
 *
 * @returns `true` if a URL can be constructed from `input`, `false` otherwise.
 */
exports.isHttpUrl = (input) => {
    try {
        return new URL(input).protocol.startsWith('http');
    }
    catch (_) {
        return false;
    }
};
