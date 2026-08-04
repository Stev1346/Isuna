import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { forgotPasswordSchema } from '$lib/schemas/auth.js';
import { env } from '$env/dynamic/private';

const GENERIC_SENT = 'If an account exists, the email link proves you can access that inbox and lets you set a new password.';

export const load: PageServerLoad = async ({ locals }) => {
	const auth = await locals.getAuthContext();
	if (auth?.emailVerified) {
		redirect(303, '/account/password');
	}
};

export const actions = {
	default: async ({ request, locals, url }) => {
		const formData = await request.formData();
		const raw = { email: String(formData.get('email') ?? '') };

		const parsed = forgotPasswordSchema.safeParse(raw);
		if (!parsed.success) {
			const { fieldErrors } = parsed.error.flatten();
			return fail(400, {
				email: raw.email,
				fieldErrors: { email: fieldErrors.email?.[0] ?? null },
				formError: null as string | null,
				message: null as string | null
			});
		}

		const redirectTo = `${env.APP_BASE_URL ?? url.origin}/auth/callback?next=${encodeURIComponent('/account/password?from=recovery')}`;

		const { error } = await locals.supabase.auth.resetPasswordForEmail(parsed.data.email, {
			redirectTo
		});
		if (error) {
			console.error('resetPasswordForEmail failed', error.code ?? error.name);
		}

		return {
			email: parsed.data.email,
			fieldErrors: { email: null },
			formError: null as string | null,
			message: GENERIC_SENT
		};
	}
} satisfies Actions;
