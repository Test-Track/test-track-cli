export class InvalidDataException extends Error {
    constructor(option: string) {
        super(`The parameter '${option}' is not valid. Ensure this is not a blank string and has been provided`);

        // Set the prototype explicitly (needed to support instanceof checks in TypeScript)
        Object.setPrototypeOf(this, InvalidDataException.prototype);
    }
}