"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
/**
 * Derive the output file path from a source file.
 */
exports.getOutputFilePath = (mdFilePath, extension) => {
    const { dir, name } = path_1.parse(mdFilePath);
    return path_1.join(dir, `${name}.${extension}`);
};
