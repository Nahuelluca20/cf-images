import { CFImages } from "../index.js";

/**
 * Service for handling image upload operations
 * @class UploadService
 */
export class UploadService {
	readonly #baseUrl: string;
	readonly #token: string;

	/**
	 * Creates an instance of UploadService
	 * @param accountId - Cloudflare account ID
	 * @param token - Cloudflare API token
	 */
	constructor(accountId: string, token: string) {
		this.#baseUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1`;
		this.#token = token;
	}

	/**
	 * Validates upload options
	 * @param options - Upload options to validate
	 * @throws {Error} If neither url nor file is provided
	 * @throws {Error} If both url and file are provided
	 */
	private validateUploadOptions(options: CFImages.ImageUploadOptions): void {
		const { url, file } = options;

		if (!url && !file) {
			throw new Error("Either url or file must be provided");
		}
		if (url && file) {
			throw new Error("Cannot provide both url and file");
		}
	}

	/**
	 * Uploads an image to Cloudflare Images
	 * @param options - Upload options
	 * @returns Promise resolving to the upload result
	 * @throws {Error} If the upload fails
	 */
	async uploadImage(
		options: CFImages.ImageUploadOptions,
	): Promise<CFImages.ImageOperationResult> {
		this.validateUploadOptions(options);

		const formData = new FormData();

		if (options.url) {
			formData.append("url", options.url);
		} else if (options.file) {
			formData.append("file", options.file);
		}

		formData.append("metadata", JSON.stringify(options.metadata));
		formData.append("requireSignedURLs", String(options.requireSignedURLs));

		try {
			const response = await fetch(this.#baseUrl, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${this.#token}`,
				},
				body: formData,
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(
					//@ts-ignore
					`Cloudflare API error: ${errorData.errors?.[0]?.message || response.statusText}`,
				);
			}

			return (await response.json()) as CFImages.ImageOperationResult;
		} catch (error) {
			if (error instanceof Error) {
				throw new Error(`Failed to upload image: ${error.message}`);
			}
			throw new Error("An unknown error occurred while uploading the image");
		}
	}
}
