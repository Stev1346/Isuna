import { updatePasswordSchema } from '$lib/schemas/auth.js';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	return {
		fromRecovery: url.searchParams.get('from') === 'recovery'
	};
};

export const actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData();
		const raw = {
			password: String(formData.get('password') ?? ''),
			confirmPassword: String(formData.get('confirmPassword') ?? '')
		};

		const parsed = updatePasswordSchema.safeParse(raw);
		if (!parsed.success) {
			const { fieldErrors } = parsed.error.flatten();
			return fail(400, {
				fieldErrors: {
					password: fieldErrors.password?.[0] ?? null,
					confirmPassword: fieldErrors.confirmPassword?.[0] ?? null
				},
				formError: null as string | null
			});
		}

		const { error } = await locals.supabase.auth.updateUser({
			password: parsed.data.password
		});
		if (error) {
			console.error('updateUser password failed', error.code ?? error.name);
			return fail(400, {
				fieldErrors: { password: null, confirmPassword: null },
				formError: 'Could not update password. Try the reset link again.'
			});
		}

		redirect(303, '/app?passwordUpdated=1');
	}
} satisfies Actions;
