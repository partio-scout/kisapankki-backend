"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const marked_1 = require("marked");
const os_1 = require("os");
const path_1 = require("path");
const config_1 = require("../lib/config");
const get_html_1 = require("../lib/get-html");
const get_marked_with_highlighter_1 = require("../lib/get-marked-with-highlighter");
const get_output_file_path_1 = require("../lib/get-output-file-path");
const helpers_1 = require("../lib/helpers");
const is_http_url_1 = require("../lib/is-http-url");
const is_md_file_1 = require("../lib/is-md-file");
const read_file_1 = require("../lib/read-file");
// --
// helpers
ava_1.default('setProcessAndTermTitle should not throw', (t) => {
    t.notThrows(() => helpers_1.setProcessAndTermTitle('md-to-pdf tests'));
});
ava_1.default('getDir should get the directory the given file is in', (t) => {
    const filePath = path_1.posix.join('/', 'var', 'foo', 'bar.txt');
    t.regex(helpers_1.getDir(filePath), new RegExp(`\\${path_1.sep}var\\${path_1.sep}foo`));
});
ava_1.default('getMarginObject should be able to handle all valid CSS margin inputs', (t) => {
    t.deepEqual(helpers_1.getMarginObject('1em'), { top: '1em', right: '1em', bottom: '1em', left: '1em' });
    t.deepEqual(helpers_1.getMarginObject('1px 2px'), { top: '1px', right: '2px', bottom: '1px', left: '2px' });
    t.deepEqual(helpers_1.getMarginObject('1mm 2mm 3mm'), { top: '1mm', right: '2mm', bottom: '3mm', left: '2mm' });
    t.deepEqual(helpers_1.getMarginObject('1in 2in 3in 4in'), { top: '1in', right: '2in', bottom: '3in', left: '4in' });
    t.is(helpers_1.getMarginObject(''), undefined);
    t.throws(() => helpers_1.getMarginObject(undefined));
    t.throws(() => helpers_1.getMarginObject({}));
    t.throws(() => helpers_1.getMarginObject(0));
    t.throws(() => helpers_1.getMarginObject('1em 2em 3em 4em 5em'));
});
// --
// get-html
ava_1.default('getHtml should return a valid html document', (t) => {
    const html = get_html_1.getHtml('', config_1.defaultConfig).replace(/\n/g, '');
    t.regex(html, /<!DOCTYPE html>.*<html>.*<head>.*<body class="">.*<\/body>.*<\/html>/);
});
ava_1.default('getHtml should inject rendered markdown', (t) => {
    const html = get_html_1.getHtml('# Foo', config_1.defaultConfig).replace(/\n/g, '');
    t.regex(html, /<body class=""><h1 id="foo">Foo<\/h1>.*<\/body>/);
});
ava_1.default('getHtml should inject body classes', (t) => {
    const html = get_html_1.getHtml('', Object.assign(Object.assign({}, config_1.defaultConfig), { body_class: ['foo', 'bar'] })).replace(/\n/g, '');
    t.regex(html, /<body class="foo bar">/);
});
// --
// get-marked-with-highlighter
ava_1.default('getMarked should highlight js code', (t) => {
    const marked = get_marked_with_highlighter_1.getMarked({});
    const html = marked('```js\nvar foo="bar";\n```');
    t.true(html.includes('<code class="hljs js">'));
});
ava_1.default('getMarked should highlight unknown code as plaintext', (t) => {
    const marked = get_marked_with_highlighter_1.getMarked({});
    const html = marked('```\nvar foo="bar";\n```');
    t.true(html.includes('<code class="hljs plaintext">'));
});
ava_1.default('getMarked should accept a custom renderer', (t) => {
    const renderer = new marked_1.Renderer();
    renderer.link = (href, _, text) => `<a class="custom" href="${href}">${text}</a>`;
    const marked = get_marked_with_highlighter_1.getMarked({ renderer });
    const html = marked('[Foo](/bar)');
    t.true(html.includes('<a class="custom" href="/bar">Foo</a>'));
});
ava_1.default('getMarked should accept a custom renderer with custom code highlighter', (t) => {
    const renderer = new marked_1.Renderer();
    renderer.code = (code) => `<custom-code>${code}</custom-code>`;
    const marked = get_marked_with_highlighter_1.getMarked({ renderer });
    const html = marked('```\nvar foo="bar";\n```');
    t.true(html.includes('<custom-code>var foo="bar";</custom-code>'));
});
// --
// get-pdf-file-path
ava_1.default('getOutputFilePath should return the same path but with different extension', (t) => {
    const mdFilePath = path_1.posix.join('/', 'var', 'foo', 'bar.md');
    t.is(get_output_file_path_1.getOutputFilePath(mdFilePath, 'pdf'), `${path_1.sep}var${path_1.sep}foo${path_1.sep}bar.pdf`);
    t.is(get_output_file_path_1.getOutputFilePath(mdFilePath, 'html'), `${path_1.sep}var${path_1.sep}foo${path_1.sep}bar.html`);
});
// --
// read-file
ava_1.default('readFile should return the content of a file', async (t) => {
    const gitignore = path_1.resolve(__dirname, 'basic', 'markdown-mark.svg');
    const gitignoreContent = `<svg xmlns="http://www.w3.org/2000/svg" width="208" height="128" viewBox="0 0 208 128"><rect width="198" height="118" x="5" y="5" ry="10" stroke="#000" stroke-width="10" fill="none"/><path d="M30 98V30h20l20 25 20-25h20v68H90V59L70 84 50 59v39zm125 0l-30-33h20V30h20v35h20z"/></svg>${os_1.EOL}`;
    t.is(await read_file_1.readFile(gitignore), gitignoreContent);
    t.is(await read_file_1.readFile(gitignore, 'windows1252'), gitignoreContent);
});
// --
// is-md-file
ava_1.default('isMdFile should return true if the file extension indicates a markdown file', (t) => {
    t.is(is_md_file_1.isMdFile('md.txt'), false);
    t.is(is_md_file_1.isMdFile('.md.txt'), true);
    t.is(is_md_file_1.isMdFile('test.txt'), false);
    t.is(is_md_file_1.isMdFile('test.md'), true);
    t.is(is_md_file_1.isMdFile('test.md.notmd'), false);
    t.is(is_md_file_1.isMdFile('test.md.txt'), true);
    t.is(is_md_file_1.isMdFile('test.mkd'), true);
    t.is(is_md_file_1.isMdFile('test.mkd.txt'), true);
    t.is(is_md_file_1.isMdFile('test.mdown'), true);
    t.is(is_md_file_1.isMdFile('test.mdown.txt'), true);
    t.is(is_md_file_1.isMdFile('test.markdown'), true);
    t.is(is_md_file_1.isMdFile('test.markdown.txt'), true);
});
// --
// is-url
ava_1.default('isUrl should return true for strings that are valid http(s) urls', (t) => {
    t.is(is_http_url_1.isHttpUrl('foo'), false);
    t.is(is_http_url_1.isHttpUrl('foo/bar'), false);
    t.is(is_http_url_1.isHttpUrl('/foo/bar'), false);
    t.is(is_http_url_1.isHttpUrl('http/foo/bar'), false);
    t.is(is_http_url_1.isHttpUrl('http://foo/bar'), true);
    t.is(is_http_url_1.isHttpUrl('foo://bar'), false);
    t.is(is_http_url_1.isHttpUrl('file:///foobar'), false);
    t.is(is_http_url_1.isHttpUrl('C:\\foo\\bar'), false);
});
