import { getAuthContext } from '$lib/server/auth/context.server';
import { createSupabaseServerClient } from '$lib/server/supabase.server';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createSupabaseServerClient(event.cookies);

	event.locals.getAuthContext = () => getAuthContext(event.locals.supabase);

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
};
