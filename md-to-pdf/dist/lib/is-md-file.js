"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const extensions = /\.(md|mkd|mdown|markdown)(\.txt)?$/i;
/**
 * Check whether a path is a markdown file.
 */
exports.isMdFile = (path) => extensions.test(path);
