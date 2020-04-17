/// <reference types="node" />
import { Config } from './config';
/**
 * Convert markdown to pdf.
 */
export declare const convertMdToPdf: (input: {
    path: string;
} | {
    content: string;
}, config: Config, args?: any) => Promise<{
    filename: string | undefined;
    content: string | Buffer;
}>;
