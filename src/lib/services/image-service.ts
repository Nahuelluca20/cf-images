/**
 * Service for managing existing images
 * @class ImageService
 */
export class ImageService {
	readonly #baseUrl: string;
	readonly #token: string;

	/**
	 * Creates an instance of ImageService
	 * @param accountId - Cloudflare account ID
	 * @param token - Cloudflare API token
	 */
	constructor(accountId: string, token: string) {
		this.#baseUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1`;
		this.#token = token;
	}

	// Future methods:
	/**
	 * Gets an image by ID
	 * @param imageId - ID of the image to retrieve
	 * @returns Promise resolving to the image details
	 */
	// async getImage(imageId: string): Promise<CFImages.ImageOperationResult>

	/**
	 * Lists all images
	 * @param page - Page number for pagination
	 * @returns Promise resolving to the list of images
	 */
	// async listImages(page?: number): Promise<CFImages.ImageListResult>
}
