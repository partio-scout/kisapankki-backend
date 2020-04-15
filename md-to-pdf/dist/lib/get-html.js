"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_marked_with_highlighter_1 = require("./get-marked-with-highlighter");
/**
 * Generates a HTML document from a markdown string and returns it as a string.
 */
exports.getHtml = (md, config) => `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body class="${config.body_class.join(' ')}">
${get_marked_with_highlighter_1.getMarked(config.marked_options)(md)}
</body>
</html>
`;
