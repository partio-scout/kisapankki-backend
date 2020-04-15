"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const generate_output_1 = require("./generate-output");
const get_html_1 = require("./get-html");
const get_output_file_path_1 = require("./get-output-file-path");
const helpers_1 = require("./helpers");
const read_file_1 = require("./read-file");
const grayMatter = require('gray-matter');
/**
 * Convert markdown to pdf.
 */
exports.convertMdToPdf = async (input, config, args = {}) => {
    const mdFileContent = 'content' in input
        ? input.content
        : await read_file_1.readFile(input.path, args['--md-file-encoding'] || config.md_file_encoding);
    const { content: md, data: frontMatterConfig } = grayMatter(mdFileContent);
    // merge front-matter config
    config = Object.assign(Object.assign(Object.assign({}, config), frontMatterConfig), { pdf_options: Object.assign(Object.assign({}, config.pdf_options), frontMatterConfig.pdf_options) });
    const { headerTemplate, footerTemplate, displayHeaderFooter } = config.pdf_options;
    if ((headerTemplate || footerTemplate) && displayHeaderFooter === undefined) {
        config.pdf_options.displayHeaderFooter = true;
    }
    // sanitize array cli arguments
    for (const option of ['stylesheet', 'body_class']) {
        if (!Array.isArray(config[option])) {
            config[option] = [config[option]].filter((value) => Boolean(value));
        }
    }
    // merge cli args into config
    const jsonArgs = ['--marked-options', '--pdf-options', '--launch-options'];
    for (const arg of Object.entries(args)) {
        const [argKey, argValue] = arg;
        const key = argKey.slice(2).replace(/-/g, '_');
        config[key] = jsonArgs.includes(argKey) ? JSON.parse(argValue) : argValue;
    }
    // sanitize the margin in pdf_options
    if (typeof config.pdf_options.margin === 'string') {
        config.pdf_options.margin = helpers_1.getMarginObject(config.pdf_options.margin);
    }
    // set output destination
    if (config.dest === undefined) {
        config.dest = 'path' in input ? get_output_file_path_1.getOutputFilePath(input.path, config.as_html ? 'html' : 'pdf') : 'stdout';
    }
    const highlightStylesheet = path_1.resolve(path_1.dirname(require.resolve('highlight.js')), '..', 'styles', `${config.highlight_style}.css`);
    config.stylesheet = [...new Set([...config.stylesheet, highlightStylesheet])];
    const html = get_html_1.getHtml(md, config);
    const relativePath = 'path' in input ? path_1.resolve(input.path).replace(config.basedir, '') : '/';
    const output = await generate_output_1.generateOutput(html, relativePath, config);
    if (!output) {
        if (config.devtools) {
            throw new Error('No file is generated when the --devtools option is enabled.');
        }
        throw new Error(`Failed to create ${config.as_html ? 'HTML' : 'PDF'}.`);
    }
    if (output.filename) {
        if (output.filename === 'stdout') {
            process.stdout.write(output.content);
        }
        else {
            await fs_1.promises.writeFile(output.filename, output.content);
        }
    }
    return output;
};
