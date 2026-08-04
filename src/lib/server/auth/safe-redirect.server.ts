/**
 * Allow only same-origin relative paths.
 * Rejects protocol-relative URLs (//evil.com) and absolute URLs.
 */

export function getSafeLocalPath(candidate: string | null | undefined, fallback = '/'): string {
	if (!candidate) {
		return fallback;
	}

	if (!candidate.startsWith('/')) {
		return fallback;
	}

	if (candidate.startsWith('//')) {
		return fallback;
	}

	if (candidate.includes('\\') || candidate.includes('://')) {
		return fallback;
	}

	return candidate;
}
