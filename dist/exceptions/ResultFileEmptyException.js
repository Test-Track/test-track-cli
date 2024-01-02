"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultFileEmptyException = void 0;
class ResultFileEmptyException extends Error {
    constructor(filePath) {
        super(`ResultFIleEmptyException: The result file provided ('${filePath}') is empty`);
        // Set the prototype explicitly (needed to support instanceof checks in TypeScript)
        Object.setPrototypeOf(this, ResultFileEmptyException.prototype);
    }
}
exports.ResultFileEmptyException = ResultFileEmptyException;
//# sourceMappingURL=ResultFileEmptyException.js.map