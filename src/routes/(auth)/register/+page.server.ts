import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { registerSchema } from '$lib/schemas/auth';
import { env } from '$env/dynamic/private';

const GENERIC_CHECK_EMAIL =
	'If that email is valid, we have sent a verification link. Check your inbox.';

export const load: PageServerLoad = async ({ locals }) => {
	const auth = await locals.getAuthContext();
	if (auth?.emailVerified) {
		redirect(303, '/app');
	}
};

export const actions = {
	default: async ({ request, locals, url }) => {
		const formData = await request.formData();
		const raw = {
			email: String(formData.get('email') ?? ''),
			password: String(formData.get('password') ?? ''),
			confirmPassword: String(formData.get('confirmPassword') ?? '')
		};

		const parsed = registerSchema.safeParse(raw);
		if (!parsed.success) {
			const { fieldErrors } = parsed.error.flatten();
			return fail(400, {
				email: raw.email,
				fieldErrors: {
					email: fieldErrors.email?.[0] ?? null,
					password: fieldErrors.password?.[0] ?? null,
					confirmPassword: fieldErrors.confirmPassword?.[0] ?? null
				},
				formError: null as string | null,
				message: null as string | null
			});
		}

		const { email, password } = parsed.data;
		const emailRedirectTo = `${env.APP_BASE_URL ?? url.origin}/auth/callback`;

		const { error } = await locals.supabase.auth.signUp({
			email,
			password,
			options: { emailRedirectTo }
		});

		if (error) {
			console.error('signup failed', error.code ?? error.name);
		}

		return {
			email,
			fieldErrors: {
				email: null,
				password: null,
				confirmPassword: null
			},
			formError: null as string | null,
			message: GENERIC_CHECK_EMAIL
		};
	}
} satisfies Actions;
