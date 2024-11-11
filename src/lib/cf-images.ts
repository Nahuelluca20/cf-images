export namespace CFImages {
	export interface CFImagesProps {
		/**
		 * Your cloudflare token
		 */
		token: string;
		/**
		 * Your cloudflare accountID
		 */
		accountId: string;
	}

	/**
	 * UploadData for the CFImages class.
	 * check de supported formats, dimensions and sizes:
	 * https://developers.cloudflare.com/images/upload-images/#supported-image-formats
	 */
	export interface UploadData {
		/**
		 * You have to use only one of these: file or url. You cannot use both at the
		 * same time, they are mutually exclusive.
		 */
		url?: string;
		file: File;
		metadata: { key: string; value: string | number | boolean };
		/**
		 * You can serve private images by using signed URL tokens. When an image
		 * requires a signed URL, the image cannot be accessed without a token unless
		 * it is being requested for a variant set to always allow public access.
		 * https://developers.cloudflare.com/images/manage-images/serve-images/serve-private-images/
		 */
		requireSignedURLs: boolean;
	}

	export interface Result {
		result: {
			id: string;
			filename: string;
			metadata: {
				[key: string]: string;
			};
			/**
			 * time when image was upload
			 */
			uploaded: string;
			requireSignedURLs: boolean;
			/**
			 * the variants of image public and thumbnail
			 */
			variants: string[];
		};
		success: boolean;
		errors: Array<string>;
		messages: Array<string>;
	}
}

export class CFImages {
	readonly #token: string;
	readonly #accountId: string;
	readonly #baseUrl: string;

	constructor({ token, accountId }: CFImages.CFImagesProps) {
		if (!token) throw new Error("Cloudflare token is required");
		if (!accountId) throw new Error("Cloudflare account ID is required");

		this.#token = token;
		this.#accountId = accountId;
		this.#baseUrl = `https://api.cloudflare.com/client/v4/accounts/${this.#accountId}/images/v1`;
	}

	async uploadImage({
		url,
		file,
		metadata,
		requireSignedURLs,
	}: CFImages.UploadData): Promise<CFImages.Result> {
		if (!url && !file) {
			throw new Error("Either url or file must be provided");
		}
		if (url && file) {
			throw new Error("Cannot provide both url and file");
		}

		const formData = new FormData();
		if (url) {
			formData.append("url", url);
		} else {
			formData.append("file", file);
		}

		formData.append("metadata", JSON.stringify(metadata));
		formData.append("requireSignedURLs", String(requireSignedURLs));

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
					`Cloudflare API error: ${errorData.errors?.[0]?.message || response.statusText}`,
				);
			}

			const data = await response.json();
			return data as CFImages.Result;
		} catch (error) {
			if (error instanceof Error) {
				throw new Error(`Failed to upload image: ${error.message}`);
			}
			throw new Error("An unknown error occurred while uploading the image");
		}
	}
}
