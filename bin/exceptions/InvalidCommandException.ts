export class InvalidCommandException extends Error {
    constructor(message: string) {
        super(message);

        // Set the prototype explicitly (needed to support instanceof checks in TypeScript)
        Object.setPrototypeOf(this, InvalidCommandException.prototype);
    }
}