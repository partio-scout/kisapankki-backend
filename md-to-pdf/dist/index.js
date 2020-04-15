#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
/*Object.defineProperty(exports, "__esModule", { value: true });*/
const get_port_1 = __importDefault(require("get-port"));
const config_1 = require("./lib/config");
const helpers_1 = require("./lib/helpers");
const md_to_pdf_1 = require("./lib/md-to-pdf");
const serve_dir_1 = require("./lib/serve-dir");
/**
 * Convert a markdown file to PDF.
 */
exports.mdToPdf = async (input, config = {}) => {
    if (!('path' in input ? input.path : input.content)) {
        throw new Error('Specify either content or path.');
    }
    if (!config.port) {
        config.port = await get_port_1.default();
    }
    if (!config.basedir) {
        config.basedir = 'path' in input ? helpers_1.getDir(input.path) : process.cwd();
    }
    if (!config.dest) {
        config.dest = '';
    }
    const mergedConfig = Object.assign(Object.assign(Object.assign({}, config_1.defaultConfig), config), { pdf_options: Object.assign(Object.assign({}, config_1.defaultConfig.pdf_options), config.pdf_options) });
    const server = await serve_dir_1.serveDirectory(mergedConfig);
    const pdf = await md_to_pdf_1.convertMdToPdf(input, mergedConfig);
    server.close();
    return pdf;
};
exports.default = exports.mdToPdf;
