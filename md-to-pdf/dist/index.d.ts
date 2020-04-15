#!/usr/bin/env node
/// <reference types="node" />
import { Config } from './lib/config';
/**
 * Convert a markdown file to PDF.
 */
export declare const mdToPdf: (input: {
    path: string;
} | {
    content: string;
}, config?: Partial<Config>) => Promise<{
    filename: string | undefined;
    content: string | Buffer;
}>;
export default mdToPdf;
