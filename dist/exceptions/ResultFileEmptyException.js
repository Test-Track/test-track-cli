"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="115527df-415a-51fb-8eba-74c368b3db0c")}catch(e){}}();

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
//# debugId=115527df-415a-51fb-8eba-74c368b3db0c
