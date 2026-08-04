import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url, setHeaders }) => {
	setHeaders({
		'cache-control': 'private, no-store'
	});

	const auth = await locals.getAuthContext();

	if (!auth) {
		const redirectTo = `${url.pathname}${url.search}`;
		redirect(303, `/sign-in?redirectTo=${encodeURIComponent(redirectTo)}`);
	}

	if (!auth.emailVerified) {
		redirect(303, '/sign-in?error=unverified');
	}

	return {
		auth: {
			userId: auth.userId,
			email: auth.email ?? null,
			emailVerified: auth.emailVerified
		}
	};
};
