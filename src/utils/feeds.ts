export function getSiteBaseUrl(context: { site?: URL }): string {
	const href = context.site?.href ?? "https://terminal-blog.example.com";
	return href.endsWith("/") ? href.slice(0, -1) : href;
}
