"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidDataException = void 0;
class InvalidDataException extends Error {
    constructor(option) {
        super(`The parameter '${option}' is not valid. Ensure this is not a blank string and has been provided`);
        // Set the prototype explicitly (needed to support instanceof checks in TypeScript)
        Object.setPrototypeOf(this, InvalidDataException.prototype);
    }
}
exports.InvalidDataException = InvalidDataException;
//# sourceMappingURL=InvalidDataException.js.map