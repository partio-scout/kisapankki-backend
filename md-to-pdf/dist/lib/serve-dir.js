"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const serve_handler_1 = __importDefault(require("serve-handler"));
/**
 * Serve a directory on a random port using a HTTP server and the serve-handler package.
 *
 * @returns a promise that resolves with the server instance once the server is ready and listening.
 */
exports.serveDirectory = async ({ basedir, port }) => new Promise((resolve) => {
    const server = http_1.createServer(async (request, response) => serve_handler_1.default(request, response, { public: basedir }));
    server.listen(port, () => resolve(server));
});
/**
 * Close the given server instance asynchronously.
 */
exports.closeServer = async (server) => new Promise((resolve) => server.close(resolve));
