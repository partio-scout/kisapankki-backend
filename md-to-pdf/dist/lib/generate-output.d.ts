/// <reference types="node" />
import { Config } from './config';
/**
 * Generate the output (either PDF or HTML).
 */
export declare const generateOutput: (html: string, relativePath: string, config: Config) => Promise<{
    filename: string | undefined;
    content: string | Buffer;
} | undefined>;
