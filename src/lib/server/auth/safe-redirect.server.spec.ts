import { describe, expect, it } from 'vitest';
import { getSafeLocalPath } from './safe-redirect.server';

describe('getSafeLocalPath', () => {
	it('returns a fallback for null/empty', () => {
		expect(getSafeLocalPath(null, '/app')).toBe('/app');
		expect(getSafeLocalPath('', '/app')).toBe('/app');
	});

	it('allows a relative local path', () => {
		expect(getSafeLocalPath('/account/password', '/app')).toBe('/account/password');
		expect(getSafeLocalPath('/app?x=1', '/app')).toBe('/app?x=1');
	});

	it('rejects absolute and protocol-relative URLs', () => {
		expect(getSafeLocalPath('https://evil.com', '/app')).toBe('/app');
		expect(getSafeLocalPath('//evil.com', '/app')).toBe('/app');
		expect(getSafeLocalPath('/\\evil.com', '/app')).toBe('/app');
	});

	it('rejects paths that do not start with /', () => {
		expect(getSafeLocalPath('app', '/app')).toBe('/app');
	});
});
