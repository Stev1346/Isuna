import { getSafeLocalPath } from '$lib/server/auth/safe-redirect.server';
import type { EmailOtpType } from '@supabase/supabase-js';
import type { RequestHandler } from './$types';
import { redirect } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, locals }) => {
	const next = getSafeLocalPath(url.searchParams.get('next'), '/app');
	const code = url.searchParams.get('code');
	const tokenHash = url.searchParams.get('token_hash');
	const type = url.searchParams.get('type') as EmailOtpType | null;

	if (code) {
		const { error } = await locals.supabase.auth.exchangeCodeForSession(code);
		if (!error) {
			redirect(303, next);
		}
		console.error('exchangeCodeForSession failed', error.code ?? error.name);
		redirect(303, '/register?error=verification');
	}

	if (tokenHash && type) {
		const { error } = await locals.supabase.auth.verifyOtp({
			type,
			token_hash: tokenHash
		});
		if (!error) {
			redirect(303, next);
		}
		console.error('verifyOtp failed', error.code ?? error.name);
		redirect(303, '/register?error=verification');
	}

	console.error('auth callback missing code/token_hash');
	redirect(303, '/register?error=verification');
};
