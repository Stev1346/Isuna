import { ensureProfile } from '$lib/server/services/profile-service.server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, parent }) => {
	const { auth } = await parent();

	const profile = await ensureProfile(locals.supabase, auth.userId);

	return {
		profile
	};
};
