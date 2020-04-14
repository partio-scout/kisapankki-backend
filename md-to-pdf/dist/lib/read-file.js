"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const iconv_lite_1 = __importDefault(require("iconv-lite"));
/**
 * Read a file with the given encoding, and return its content as a string.
 *
 * Uses iconv-lite to solve some issues with Windows encodings.
 */
exports.readFile = async (file, encoding = 'utf-8') => /utf-?8/i.test(encoding) ? fs_1.promises.readFile(file, { encoding }) : iconv_lite_1.default.decode(await fs_1.promises.readFile(file), encoding);
