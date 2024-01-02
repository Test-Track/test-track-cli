export class ResultFileEmptyException extends Error {
    constructor(filePath: string) {
        super(`ResultFIleEmptyException: The result file provided ('${filePath}') is empty`);

        // Set the prototype explicitly (needed to support instanceof checks in TypeScript)
        Object.setPrototypeOf(this, ResultFileEmptyException.prototype);
    }
}