import type { SupabaseClient } from '@supabase/supabase-js';

export type AuthContext = {
	userId: string;
	email?: string;
	emailVerified: boolean;
};

export async function getAuthContext(supabase: SupabaseClient): Promise<AuthContext | null> {
	const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
	const userId = claimsData?.claims?.sub;
	if (claimsError || typeof userId !== 'string' || userId.length === 0) {
		return null;
	}

	const { data: userData, error: userError } = await supabase.auth.getUser();
	const user = userData.user;
	if (userError || !user || user.id !== userId) {
		return null;
	}

	return {
		userId,
		email: user.email,
		emailVerified: Boolean(user.email_confirmed_at)
	};
}
