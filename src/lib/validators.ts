// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class SecurityValidator {
	static isRunningInBrowser(): boolean {
		return typeof window !== "undefined";
	}
}
