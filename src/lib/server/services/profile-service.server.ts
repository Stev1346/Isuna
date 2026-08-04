import type { SupabaseClient } from '@supabase/supabase-js';
import {
	getProfileByUserId,
	insertOwnProfileIgnoreConflict,
	type Profile
} from '$lib/server/db/queries/profiles.server';

export async function ensureProfile(
	supabase: SupabaseClient,
	userId: string
): Promise<Profile | null> {
	const existingProfile = await getProfileByUserId(supabase, userId);
	if (existingProfile) {
		return existingProfile;
	}

	const { ok } = await insertOwnProfileIgnoreConflict(supabase, userId);
	if (!ok) {
		return null;
	}

	return getProfileByUserId(supabase, userId);
}
