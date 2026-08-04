import type { SupabaseClient } from '@supabase/supabase-js';

export type Profile = {
	user_id: string;
	display_name: string | null;
	locale: string;
	timezone: string;
	created_at: string;
	updated_at: string;
};

export async function getProfileByUserId(
	supabase: SupabaseClient,
	userId: string
): Promise<Profile | null> {
	const { data, error } = await supabase
		.from('profiles')
		.select('user_id, display_name, locale, timezone, created_at, updated_at')
		.eq('user_id', userId)
		.maybeSingle();

	if (error) {
		console.error('getProfileByUserId failed', error.code);
		return null;
	}

	return data;
}

export async function insertOwnProfileIgnoreConflict(
	supabase: SupabaseClient,
	userId: string
): Promise<{ ok: boolean }> {
	const { error } = await supabase.from('profiles').upsert(
		{ user_id: userId },
		{
			onConflict: 'user_id',
			ignoreDuplicates: true
		}
	);

	if (error) {
		console.error('insertOwnProfileIgnoreConflict failed', error.code);
		return { ok: false };
	}

	return { ok: true };
}
