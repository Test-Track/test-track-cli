"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="9d48be52-0390-53ae-b03f-e1425ecdd1bf")}catch(e){}}();

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
//# debugId=9d48be52-0390-53ae-b03f-e1425ecdd1bf
