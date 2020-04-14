"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const highlight_js_1 = require("highlight.js");
const marked_1 = __importDefault(require("marked"));
exports.getMarked = (options) => {
    var _a;
    const renderer = (_a = options.renderer) !== null && _a !== void 0 ? _a : new marked_1.default.Renderer();
    // only add if the renderer has no custom `code` property yet
    if (!Object.prototype.hasOwnProperty.call(renderer, 'code')) {
        renderer.code = (code, language) => {
            // if the given language is not available in highlight.js, fall back to plaintext
            const languageName = language && highlight_js_1.getLanguage(language) ? language : 'plaintext';
            return `<pre><code class="hljs ${languageName}">${highlight_js_1.highlight(languageName, code).value}</code></pre>`;
        };
    }
    marked_1.default.setOptions(Object.assign(Object.assign({}, options), { renderer }));
    return marked_1.default;
};
