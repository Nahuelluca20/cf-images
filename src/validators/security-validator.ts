/**
 * Validator class for security-related checks
 * @class SecurityValidator
 */

import { SecurityError } from "../lib/errors/security-error.js";
import { CFImages } from "../lib/index.js";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class SecurityValidator {
	/**
	 * Validates the initial configuration
	 * @param config - Configuration options
	 * @throws {SecurityError} If running in browser when preventBrowserUsage is true
	 * @throws {SecurityError} If required credentials are missing
	 */
	static validateConfiguration(config: CFImages.CFImagesConfig): void {
		const {
			token,
			accountId,
			security = { preventBrowserUsage: true },
		} = config;

		if (
			security.preventBrowserUsage &&
			SecurityValidator.isRunningInBrowser()
		) {
			throw new SecurityError(
				"CFImages instance detected in browser environment. " +
					"For security reasons, this library should only be used in server-side code. " +
					"See documentation for secure implementation examples.",
			);
		}

		if (!token || !accountId) {
			throw new SecurityError(
				"Both token and accountId are required. " +
					"These should be obtained from secure environment variables, not hardcoded.",
			);
		}
	}

	/**
	 * Checks if code is running in a browser environment
	 * @returns {boolean} True if running in browser
	 * @private
	 */
	private static isRunningInBrowser(): boolean {
		return typeof window !== "undefined";
	}
}
