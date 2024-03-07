"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="382f56f8-89c4-525e-8daa-49ff110d047d")}catch(e){}}();

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
//# debugId=382f56f8-89c4-525e-8daa-49ff110d047d
