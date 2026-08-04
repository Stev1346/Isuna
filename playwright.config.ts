import { defineConfig } from '@playwright/test';
import { loadEnv } from 'vite';

const env = loadEnv('development', process.cwd(), '');

// Playwright has no top-level `env` option — inject into process.env for test workers.
process.env.PUBLIC_SUPABASE_URL ??= env.PUBLIC_SUPABASE_URL ?? '';
process.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY ??= env.PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? '';
process.env.SUPABASE_SERVICE_ROLE_KEY ??= env.SUPABASE_SERVICE_ROLE_KEY ?? '';

export default defineConfig({
	webServer: {
		command: 'pnpm run build && pnpm run preview -- --host 127.0.0.1 --port 4173',
		port: 4173,
		reuseExistingServer: !process.env.CI,
		env: {
			...process.env,
			PUBLIC_SUPABASE_URL: process.env.PUBLIC_SUPABASE_URL,
			PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY,
			SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY
		}
	},
	use: {
		baseURL: 'http://127.0.0.1:4173'
	},
	testMatch: '**/*.e2e.{ts,js}'
});
