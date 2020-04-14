/**
 * Get the directory that a file is in.
 */
export declare const getDir: (filePath: string) => string;
/**
 * Get a margin object from a CSS-like margin string.
 */
export declare const getMarginObject: (margin: string) => {
    top?: string | number | undefined;
    right?: string | number | undefined;
    bottom?: string | number | undefined;
    left?: string | number | undefined;
} | undefined;
export declare const setProcessAndTermTitle: (title: string) => void;
