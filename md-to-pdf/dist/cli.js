#!/usr/bin/env node
"use strict";
// --
// Packages
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const arg_1 = __importDefault(require("arg"));
const chalk_1 = __importDefault(require("chalk"));
const chokidar_1 = require("chokidar");
const get_port_1 = __importDefault(require("get-port"));
const get_stdin_1 = __importDefault(require("get-stdin"));
const listr_1 = __importDefault(require("listr"));
const path_1 = __importDefault(require("path"));
const config_1 = require("./lib/config");
const help_1 = require("./lib/help");
const helpers_1 = require("./lib/helpers");
const md_to_pdf_1 = require("./lib/md-to-pdf");
const serve_dir_1 = require("./lib/serve-dir");
// --
// Configure CLI Arguments
const cliFlags = arg_1.default({
    '--help': Boolean,
    '--version': Boolean,
    '--basedir': String,
    '--watch': Boolean,
    '--stylesheet': [String],
    '--css': String,
    '--body-class': [String],
    '--highlight-style': String,
    '--marked-options': String,
    '--html-pdf-options': String,
    '--pdf-options': String,
    '--launch-options': String,
    '--port': Number,
    '--md-file-encoding': String,
    '--stylesheet-encoding': String,
    '--as-html': Boolean,
    '--config-file': String,
    '--devtools': Boolean,
    // aliases
    '-h': '--help',
    '-v': '--version',
    '-w': '--watch',
});
// --
// Run
main(cliFlags, config_1.defaultConfig).catch((error) => {
    console.error(error);
    process.exit(1);
});
// --
// Define Main Function
async function main(args, config) {
    var _a;
    helpers_1.setProcessAndTermTitle('md-to-pdf');
    if (args['--version']) {
        return console.log(require('../package').version);
    }
    if (args['--help']) {
        return help_1.help();
    }
    /**
     * 1. Get input.
     */
    const files = args._;
    const stdin = await get_stdin_1.default();
    if (files.length === 0 && !stdin) {
        return help_1.help();
    }
    /**
     * 2. Read config file and merge it into the config object.
     */
    if (args['--config-file']) {
        try {
            const configFile = require(path_1.default.resolve(args['--config-file']));
            config = Object.assign(Object.assign(Object.assign({}, config), configFile), { pdf_options: Object.assign(Object.assign({}, config.pdf_options), configFile.pdf_options) });
        }
        catch (error) {
            console.warn(chalk_1.default.red(`Warning: couldn't read config file: ${path_1.default.resolve(args['--config-file'])}`));
            console.warn(error instanceof SyntaxError ? error.message : error);
        }
    }
    /**
     * 3. Start the file server.
     */
    if (args['--basedir']) {
        config.basedir = args['--basedir'];
    }
    config.port = (_a = args['--port']) !== null && _a !== void 0 ? _a : (await get_port_1.default());
    const server = await serve_dir_1.serveDirectory(config);
    /**
     * 4. Either process stdin or create a Listr task for each file.
     */
    if (stdin) {
        await md_to_pdf_1.convertMdToPdf({ content: stdin }, config, args)
            .then(async () => serve_dir_1.closeServer(server))
            .catch(async (error) => {
            await serve_dir_1.closeServer(server);
            throw error;
        });
        return;
    }
    const getListrTask = (file) => ({
        title: `generating ${args['--as-html'] ? 'HTML' : 'PDF'} from ${chalk_1.default.underline(file)}`,
        task: async () => md_to_pdf_1.convertMdToPdf({ path: file }, config, args),
    });
    await new listr_1.default(files.map(getListrTask), { concurrent: true, exitOnError: false })
        .run()
        .then(() => {
        if (args['--watch']) {
            console.log(chalk_1.default.bgBlue('\n watching for changes \n'));
            chokidar_1.watch(files).on('change', async (file) => new listr_1.default([getListrTask(file)], { exitOnError: false }).run().catch(console.error));
        }
        else {
            server.close();
        }
    })
        .catch((error) => {
        /**
         * In watch mode the error needs to be shown immediately because the `main` function's catch handler will never execute.
         *
         * @todo is this correct or does `main` actually finish and the process is just kept alive because of the file server?
         */
        if (args['--watch']) {
            return console.error(error);
        }
        throw error;
    });
}
