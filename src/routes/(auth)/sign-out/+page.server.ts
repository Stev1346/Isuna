import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {};

export const actions = {
	default: async ({ locals }) => {
		const { error } = await locals.supabase.auth.signOut();
		if (error) {
			console.error('signOut failed', error.code ?? error.name);
		}
		redirect(303, '/sign-in');
	}
} satisfies Actions;
