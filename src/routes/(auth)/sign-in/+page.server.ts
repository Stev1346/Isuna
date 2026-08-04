import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getSafeLocalPath } from '$lib/server/auth/safe-redirect.server';
import { signInSchema } from '$lib/schemas/auth.js';
import { env } from '$env/dynamic/private';

const GENERIC_AUTH_ERROR = 'Invalid email or password.';

export const load: PageServerLoad = async ({ locals, url }) => {
	const auth = await locals.getAuthContext();
	if (auth?.emailVerified) {
		redirect(303, getSafeLocalPath(url.searchParams.get('redirectTo'), '/app'));
	}

	return {
		redirectTo: getSafeLocalPath(url.searchParams.get('redirectTo'), '/app')
	};
};

export const actions = {
	login: async ({ request, locals }) => {
		const formData = await request.formData();
		const raw = {
			email: String(formData.get('email') ?? ''),
			password: String(formData.get('password') ?? '')
		};
		const redirectTo = getSafeLocalPath(String(formData.get('redirectTo') ?? ''), '/app');

		const parsed = signInSchema.safeParse(raw);
		if (!parsed.success) {
			const { fieldErrors } = parsed.error.flatten();
			return fail(400, {
				email: raw.email,
				redirectTo,
				fieldErrors: {
					email: fieldErrors.email?.[0] ?? null,
					password: fieldErrors.password?.[0] ?? null
				},
				formError: null as string | null
			});
		}

		const { error } = await locals.supabase.auth.signInWithPassword(parsed.data);
		if (error) {
			console.error('signIn failed', error.code ?? error.name);
			return fail(400, {
				email: parsed.data.email,
				redirectTo,
				fieldErrors: { email: null, password: null },
				formError: GENERIC_AUTH_ERROR
			});
		}

		const auth = await locals.getAuthContext();
		if (!auth?.emailVerified) {
			await locals.supabase.auth.signOut();
			return fail(400, {
				email: parsed.data.email,
				redirectTo,
				fieldErrors: { email: null, password: null },
				formError: 'Verify your email before signing in. Check your email.'
			});
		}

		redirect(303, redirectTo);
	},

	google: async ({ request, locals, url }) => {
		const formData = await request.formData();
		const redirectTo = getSafeLocalPath(String(formData.get('redirectTo') ?? ''), '/app');

		const callbackUrl = `${env.APP_BASE_URL ?? url.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`;

		const { data, error } = await locals.supabase.auth.signInWithOAuth({
			provider: 'google',
			options: { redirectTo: callbackUrl }
		});

		if (error || !data.url) {
			console.error('Google OAuth failed', error?.code ?? error?.name);
			return fail(500, {
				email: '',
				redirectTo,
				fieldErrors: { email: null, password: null },
				formError: 'Could not start Google sign-in. Try again.'
			});
		}
		redirect(303, data.url);
	}
} satisfies Actions;
