"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const helpText = `
  ${chalk_1.default.bold('$ md-to-pdf')} [options] path/to/file.md

  ${chalk_1.default.dim.underline.bold('Options:')}

    -h, --help ${chalk_1.default.dim('...............')} Output usage information
    -v, --version ${chalk_1.default.dim('............')} Output version
    -w, --watch ${chalk_1.default.dim('..............')} Watch the current file(s) for changes
    --basedir ${chalk_1.default.dim('................')} Base directory to be served by the file server
    --stylesheet ${chalk_1.default.dim('.............')} Path to a local or remote stylesheet (can be passed multiple times)
    --css ${chalk_1.default.dim('....................')} String of styles
    --body-class ${chalk_1.default.dim('.............')} Classes to be added to the body tag (can be passed multiple times)
    --highlight-style ${chalk_1.default.dim('........')} Style to be used by highlight.js (default: github)
    --marked-options ${chalk_1.default.dim('.........')} Set custom options for marked (as a JSON string)
    --pdf-options ${chalk_1.default.dim('............')} Set custom options for the generated PDF (as a JSON string)
    --launch-options ${chalk_1.default.dim('.........')} Set custom launch options for Puppeteer
    --port ${chalk_1.default.dim('...................')} Set the port to run the http server on
    --md-file-encoding ${chalk_1.default.dim('.......')} Set the file encoding for the markdown file
    --stylesheet-encoding ${chalk_1.default.dim('....')} Set the file encoding for the stylesheet
    --as-html ${chalk_1.default.dim('................')} Output as HTML instead
    --config-file ${chalk_1.default.dim('............')} Path to a JSON or JS configuration file
    --devtools ${chalk_1.default.dim('...............')} Open the browser with devtools instead of creating PDF

  ${chalk_1.default.dim.underline.bold('Examples:')}

  ${chalk_1.default.gray('–')} Convert ./file.md and save to ./file.pdf

    ${chalk_1.default.cyan('$ md2pdf file.md')}

  ${chalk_1.default.gray('–')} Convert all markdown files in current directory

    ${chalk_1.default.cyan('$ md2pdf ./*.md')}

  ${chalk_1.default.gray('–')} Convert all markdown files in current directory recursively

    ${chalk_1.default.cyan('$ md2pdf ./**/*.md')}

  ${chalk_1.default.gray('–')} Convert path/to/file.md with a different base directory

    ${chalk_1.default.cyan('$ md2pdf path/to/file.md --basedir path')}

  ${chalk_1.default.gray('–')} Convert file.md using custom-markdown.css

    ${chalk_1.default.cyan('$ md2pdf file.md --stylesheet custom-markdown.css')}

  ${chalk_1.default.gray('–')} Convert file.md using the Monokai theme for code highlighting

    ${chalk_1.default.cyan('$ md2pdf file.md --highlight-style monokai')}

  ${chalk_1.default.gray('–')} Convert file.md using custom page options

    ${chalk_1.default.cyan('$ md2pdf file.md --pdf-options \'{ "format": "Letter" }\'')}

  ${chalk_1.default.gray('–')} Convert file.md but save the intermediate HTML instead

    ${chalk_1.default.cyan('$ md2pdf file.md --as-html')}
`;
exports.help = () => console.log(helpText);
