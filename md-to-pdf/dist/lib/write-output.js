"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = __importDefault(require("puppeteer"));
const is_http_url_1 = require("./is-http-url");
/**
 * Write the output (either PDF or HTML) to disk.
 */
exports.generateOutput = async (html, relativePath, config) => {
    if (!config.dest) {
        throw new Error('No output file destination has been specified.');
    }
    const browser = await puppeteer_1.default.launch(Object.assign({ devtools: config.devtools }, config.launch_options));
    const page = await browser.newPage();
    await page.goto(`http://localhost:${config.port}${relativePath}`); // make sure relative paths work as expected
    await page.setContent(html); // overwrite the page content with what was generated from the markdown
    await Promise.all([
        ...config.stylesheet.map(async (stylesheet) => page.addStyleTag(is_http_url_1.isHttpUrl(stylesheet) ? { url: stylesheet } : { path: stylesheet })),
        config.css ? page.addStyleTag({ content: config.css }) : undefined,
    ]);
    /**
     * Trick to wait for network to be idle.
     *
     * @todo replace with page.waitForNetworkIdle once exposed
     * @see https://github.com/GoogleChrome/puppeteer/issues/3083
     */
    await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
        page.evaluate(() => history.pushState(undefined, '', '#')),
    ]);
    let outputFileContent = '';
    if (config.devtools) {
        await new Promise(resolve => page.on('close', resolve));
    }
    else {
        if (config.as_html) {
            outputFileContent = await page.content();
        }
        else {
            await page.emulateMediaType('screen');
            outputFileContent = await page.pdf(config.pdf_options);
        }
    }
    await browser.close();
    return config.devtools ? {} : { filename: config.dest, content: outputFileContent };
};
