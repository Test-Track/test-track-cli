export class FileNotFoundException extends Error {
    constructor(filePath: string) {
        super(`File named ${filePath} not found`);

        // Set the prototype explicitly (needed to support instanceof checks in TypeScript)
        Object.setPrototypeOf(this, FileNotFoundException.prototype);
    }
}