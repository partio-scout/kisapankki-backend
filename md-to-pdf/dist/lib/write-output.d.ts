/// <reference types="node" />
import { Config } from './config';
/**
 * Write the output (either PDF or HTML) to disk.
 */
export declare const generateOutput: (html: string, relativePath: string, config: Config) => Promise<{} | {
    filename: string;
    content: string | Buffer;
}>;
