"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importStar(require("ava"));
const child_process_1 = require("child_process");
const fs_1 = require("fs");
const path_1 = require("path");
ava_1.before(() => {
    const filesToDelete = [
        path_1.resolve(__dirname, 'basic', 'test.pdf'),
        path_1.resolve(__dirname, 'basic', 'test-stdio.pdf'),
        path_1.resolve(__dirname, 'nested', 'root.pdf'),
        path_1.resolve(__dirname, 'nested', 'level-one', 'one.pdf'),
        path_1.resolve(__dirname, 'nested', 'level-one', 'level-two', 'two.pdf'),
    ];
    for (const file of filesToDelete) {
        try {
            fs_1.unlinkSync(file);
        }
        catch (error) {
            if (error.code !== 'ENOENT') {
                throw error;
            }
        }
    }
});
ava_1.default('should compile the basic example to pdf using --basedir', (t) => {
    const cmd = [
        path_1.resolve(__dirname, '..', '..', 'node_modules', '.bin', 'ts-node'),
        path_1.resolve(__dirname, '..', 'cli'),
        path_1.resolve(__dirname, 'basic', 'test.md'),
        '--basedir',
        path_1.resolve(__dirname, 'basic'),
    ].join(' ');
    t.notThrows(() => child_process_1.execSync(cmd));
    t.notThrows(() => fs_1.readFileSync(path_1.resolve(__dirname, 'basic', 'test.pdf'), 'utf-8'));
});
ava_1.default('should compile the basic example using stdio', (t) => {
    const cmd = [
        'cat',
        path_1.resolve(__dirname, 'basic', 'test.md'),
        '|',
        path_1.resolve(__dirname, '..', '..', 'node_modules', '.bin', 'ts-node'),
        path_1.resolve(__dirname, '..', 'cli'),
        '--basedir',
        path_1.resolve(__dirname, 'basic'),
        '>',
        path_1.resolve(__dirname, 'basic', 'test-stdio.pdf'),
    ].join(' ');
    t.notThrows(() => child_process_1.execSync(cmd));
    t.notThrows(() => fs_1.readFileSync(path_1.resolve(__dirname, 'basic', 'test-stdio.pdf'), 'utf-8'));
});
ava_1.default('should compile the nested example to pdfs', (t) => {
    const cmd = [
        path_1.resolve(__dirname, '..', '..', 'node_modules', '.bin', 'ts-node'),
        path_1.resolve(__dirname, '..', 'cli'),
        'root.md',
        path_1.join('level-one', 'one.md'),
        path_1.join('level-one', 'level-two', 'two.md'),
    ].join(' ');
    t.notThrows(() => child_process_1.execSync(cmd, { cwd: path_1.resolve(__dirname, 'nested') }));
    t.notThrows(() => fs_1.readFileSync(path_1.resolve(__dirname, 'nested', 'root.pdf'), 'utf-8'));
    t.notThrows(() => fs_1.readFileSync(path_1.resolve(__dirname, 'nested', 'level-one', 'one.pdf'), 'utf-8'));
    t.notThrows(() => fs_1.readFileSync(path_1.resolve(__dirname, 'nested', 'level-one', 'level-two', 'two.pdf'), 'utf-8'));
});
