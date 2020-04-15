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
const fs_1 = require("fs");
const path_1 = require("path");
const __1 = require("..");
ava_1.before(() => {
    const filesToDelete = [path_1.resolve(__dirname, 'basic', 'api-test.pdf'), path_1.resolve(__dirname, 'basic', 'api-test.html')];
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
ava_1.default('should compile the basic example to pdf', async (t) => {
    const pdf = await __1.mdToPdf({ path: path_1.resolve(__dirname, 'basic', 'test.md') });
    t.is(pdf.filename, '');
    t.truthy(pdf.content);
});
ava_1.default('should compile the basic example to pdf and write to disk', async (t) => {
    const pdf = await __1.mdToPdf({ path: path_1.resolve(__dirname, 'basic', 'test.md') }, { dest: path_1.resolve(__dirname, 'basic', 'api-test.pdf') });
    t.is(path_1.basename(pdf.filename), 'api-test.pdf');
    t.notThrows(() => fs_1.readFileSync(path_1.resolve(__dirname, 'basic', 'api-test.pdf'), 'utf-8'));
});
ava_1.default('should compile the basic example to html and write to disk', async (t) => {
    const pdf = await __1.mdToPdf({ path: path_1.resolve(__dirname, 'basic', 'test.md') }, { dest: path_1.resolve(__dirname, 'basic', 'api-test.html'), as_html: true });
    t.is(path_1.basename(pdf.filename), 'api-test.html');
    t.notThrows(() => fs_1.readFileSync(path_1.resolve(__dirname, 'basic', 'api-test.html'), 'utf-8'));
});
