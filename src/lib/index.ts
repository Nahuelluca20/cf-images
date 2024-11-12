import { SecurityValidator } from "../validators/security-validator.js";
import { ImageService } from "./services/image-service.js";
import { UploadService } from "./services/upload-service.js";

export namespace CFImages {
	/**
	 * Configuration options for the CFImages client
	 * @interface CFImagesConfig
	 */
	export interface CFImagesConfig {
		/**
		 * Your Cloudflare API token
		 * @see https://developers.cloudflare.com/fundamentals/api/get-started/create-token/
		 * @important Never expose this token in client-side code
		 */
		token: string;

		/**
		 * Your Cloudflare account ID
		 * @important Keep this private and never expose it in client-side code
		 */
		accountId: string;

		/**
		 * Security configuration options
		 */
		security?: SecurityConfig;
	}

	/**
	 * Security configuration options
	 * @interface SecurityConfig
	 */
	export interface SecurityConfig {
		/**
		 * If true, will throw an error if the instance is created in a browser environment
		 * @default true
		 */
		preventBrowserUsage?: boolean;
	}

	/**
	 * Image upload options
	 * @interface ImageUploadOptions
	 * @see https://developers.cloudflare.com/images/upload-images/#supported-image-formats
	 */
	export interface ImageUploadOptions {
		/**
		 * URL of the image to upload
		 * @note Mutually exclusive with `file`
		 */
		url?: string;

		/**
		 * File to upload
		 * @note Mutually exclusive with `url`
		 */
		file?: File;

		/**
		 * Custom metadata for the image
		 */
		metadata: ImageMetadata;

		/**
		 * Whether the image requires signed URLs for access
		 * @see https://developers.cloudflare.com/images/manage-images/serve-images/serve-private-images/
		 */
		requireSignedURLs: boolean;
	}

	/**
	 * Image metadata type
	 * @interface ImageMetadata
	 */
	export interface ImageMetadata {
		[key: string]: string | number | boolean;
	}

	/**
	 * API response for image operations
	 * @interface ImageOperationResult
	 */
	export interface ImageOperationResult {
		result: {
			/** Unique identifier for the image */
			id: string;
			/** Original filename */
			filename: string;
			/** Custom metadata associated with the image */
			metadata: ImageMetadata;
			/** Upload timestamp */
			uploaded: string;
			/** Whether the image requires signed URLs */
			requireSignedURLs: boolean;
			/** Available image variants */
			variants: string[];
		};
		success: boolean;
		errors: string[];
		messages: string[];
	}
}

/**
 * Main class for interacting with Cloudflare Images API
 * @class CFImages
 */
export class CFImages {
	readonly #uploadService: UploadService;
	readonly #imageService: ImageService;

	/**
	 * Creates a new CFImages instance
	 * @param config - Configuration options
	 * @throws {SecurityError} If running in browser when preventBrowserUsage is true
	 * @throws {SecurityError} If required credentials are missing
	 */
	constructor(config: CFImages.CFImagesConfig) {
		SecurityValidator.validateConfiguration(config);

		this.#uploadService = new UploadService(config.accountId, config.token);
		this.#imageService = new ImageService(config.accountId, config.token);
	}

	/**
	 * Uploads an image to Cloudflare Images
	 * @param options - Upload options
	 * @returns Promise resolving to the upload result
	 * @throws {Error} If the upload fails
	 *
	 * @example
	 * ```typescript
	 * const cfImages = new CFImages({
	 *   token: 'your-token',
	 *   accountId: 'your-account-id'
	 * });
	 *
	 * // Upload from URL
	 * const result = await cfImages.uploadImage({
	 *   url: 'https://example.com/image.jpg',
	 *   metadata: { key: 'value' },
	 *   requireSignedURLs: false
	 * });
	 *
	 * // Upload from File
	 * const file = new File(['...'], 'image.jpg');
	 * const result = await cfImages.uploadImage({
	 *   file,
	 *   metadata: { key: 'value' },
	 *   requireSignedURLs: false
	 * });
	 * ```
	 */
	async uploadImage(
		options: CFImages.ImageUploadOptions,
	): Promise<CFImages.ImageOperationResult> {
		return this.#uploadService.uploadImage(options);
	}
}
