// See https://svelte.dev/docs/kit/types#app.d.ts

import type { AuthContext } from '$lib/server/auth/context.server';
import type { SupabaseClient } from '@supabase/supabase-js';

// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient;
			getAuthContext(): Promise<AuthContext | null>;
		}
	}
}

export {};
