"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
exports.defaultConfig = {
    basedir: process.cwd(),
    stylesheet: [path_1.resolve(__dirname, '..', '..', 'markdown.css')],
    css: '',
    body_class: [],
    highlight_style: 'github',
    marked_options: {},
    pdf_options: {
        printBackground: true,
        format: 'A4',
        margin: {
            top: '30mm',
            right: '40mm',
            bottom: '30mm',
            left: '20mm',
        },
    },
    launch_options: {
        'args': [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    },
    md_file_encoding: 'utf-8',
    stylesheet_encoding: 'utf-8',
    as_html: false,
    devtools: false,
};
