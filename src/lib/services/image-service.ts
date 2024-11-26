import type { CFImages } from "../index.js";

export namespace ImageService {
	export interface ImageServiceConf {
		/**
		 * @param imagesAccountHash - Your Images account hash
		 */
		imagesAccountHash: string;
	}
}

/**
 * Service for managing existing images
 * @class ImageService
 */
export class ImageService {
	readonly #serveImageURL: string;
	readonly #imagesAccountHash: ImageService.ImageServiceConf["imagesAccountHash"];
	/**
	 * Creates an instance of ImageService
	 */
	constructor(
		imagesAccountHash: ImageService.ImageServiceConf["imagesAccountHash"],
	) {
		this.#imagesAccountHash = imagesAccountHash;
		this.#serveImageURL = `https://imagedelivery.net/${this.#imagesAccountHash}`;
	}

	async getImage({
		imageId,
		variantName,
	}: CFImages.ServeImageParams): Promise<CFImages.ServeImageResponse> {
		if (!imageId || !variantName) {
			throw new Error("ImageId or variantName are not valid");
		}

		try {
			const publicImageUrl = `${this.#serveImageURL}/${imageId}/${variantName}`;

			return { url: publicImageUrl };
		} catch (error) {
			throw new Error(`Cloudflare API error: ${error}`);
		}
	}

	// Future methods:
	/**
	 * Lists all images
	 * @param page - Page number for pagination
	 * @returns Promise resolving to the list of images
	 */
	// async listImages(page?: number): Promise<CFImages.ImageListResult>
}
