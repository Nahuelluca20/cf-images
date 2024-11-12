/**
 * Custom error class for security-related issues
 * @class SecurityError
 * @extends Error
 */
export class SecurityError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "SecurityError";
	}
}
