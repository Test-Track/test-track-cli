"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileNotFoundException = void 0;
class FileNotFoundException extends Error {
    constructor(filePath) {
        super(`File named ${filePath} not found`);
        // Set the prototype explicitly (needed to support instanceof checks in TypeScript)
        Object.setPrototypeOf(this, FileNotFoundException.prototype);
    }
}
exports.FileNotFoundException = FileNotFoundException;
//# sourceMappingURL=FileNotFoundException.js.map