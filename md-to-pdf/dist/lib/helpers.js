"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
/**
 * Get the directory that a file is in.
 */
exports.getDir = (filePath) => path_1.resolve(path_1.parse(filePath).dir);
/**
 * Get a margin object from a CSS-like margin string.
 */
exports.getMarginObject = (margin) => {
    if (typeof margin !== 'string') {
        throw new TypeError(`margin needs to be a string.`);
    }
    const [top, right, bottom, left, ...remaining] = margin.split(' ');
    if (remaining.length > 0) {
        throw new Error(`invalid margin input "${margin}": can have max 4 values.`);
    }
    return left
        ? { top, right, bottom, left }
        : bottom
            ? { top, right, bottom, left: right }
            : right
                ? { top, right, bottom: top, left: right }
                : top
                    ? { top, right: top, bottom: top, left: top }
                    : undefined;
};
exports.setProcessAndTermTitle = (title) => {
    process.title = title;
    process.stdout.write(`${String.fromCharCode(27)}]0;${title}${String.fromCharCode(7)}`);
};
