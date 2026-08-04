import { test, expect } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

const url = process.env.PUBLIC_SUPABASE_URL!;
const anonKey = process.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

test.describe('auth gates', () => {
    test('unauthenticated /app redirects to sign-in', async ({ page}) =>{
        await page.goto('/app');
        await expect(page).toHaveURL(/\/sign-in/);
        expect(page.url()).toContain('redirectTo=');
        await expect(page.getByRole('heading', {name: 'Sign in'})).toBeVisible();
    });
});

test.describe('verified session', () =>{
    const password = 'Password1';
    let email: string;
    let userId: string;

    test.beforeAll(async () => {
        test.skip(!url || !anonKey || !serviceKey, 'Supabase env not configured');

        const admin = createClient(url, serviceKey, {
            auth: {autoRefreshToken: false, persistSession: false}
        });
        email = `e2e-${Date.now()}@example.com`;
        const created = await admin.auth.admin.createUser({
            email,
            password,
            email_confirm: true
        });
        if(created.error || !created.data.user) throw created.error;
        userId = created.data.user.id;
    });

    test.afterAll(async () => {
		if (!serviceKey || !userId) return;
		const admin = createClient(url, serviceKey, {
			auth: { autoRefreshToken: false, persistSession: false }
		});
		await admin.auth.admin.deleteUser(userId);
	});

    test('sign-in reaches /app; sign-out blocks /app again', async ({ page }) => {
		test.skip(!email, 'fixture missing');
		await page.goto('/sign-in');
		await page.getByLabel('Email').fill(email);
		await page.getByLabel('Password').fill(password);
		await page.getByRole('button', { name: 'Sign in' }).click();
		await expect(page).toHaveURL(/\/app/);
		await expect(page.getByRole('heading', { name: 'Isuna' })).toBeVisible();
		await expect(page.getByText('Protected app shell.')).toBeVisible();
		await page.getByRole('link', { name: 'Sign out' }).click();
		await page.getByRole('button', { name: 'Sign out' }).click();
		await expect(page).toHaveURL(/\/sign-in/);
		await page.goto('/app');
		await expect(page).toHaveURL(/\/sign-in/);
	});
});

test.describe('OD-19 unverified', () => {
	const password = 'Password1';
	let email: string;
	let userId: string;
	test.beforeAll(async () => {
		test.skip(!url || !anonKey || !serviceKey, 'Supabase env not configured');
		const admin = createClient(url, serviceKey, {
			auth: { autoRefreshToken: false, persistSession: false }
		});
		email = `e2e-unverified-${Date.now()}@example.com`;
		const created = await admin.auth.admin.createUser({
			email,
			password,
			email_confirm: false // unverified
		});
		if (created.error || !created.data.user) throw created.error;
		userId = created.data.user.id;
	});
	test.afterAll(async () => {
		if (!serviceKey || !userId) return;
		const admin = createClient(url, serviceKey, {
			auth: { autoRefreshToken: false, persistSession: false }
		});
		await admin.auth.admin.deleteUser(userId);
	});
	test('unverified user cannot open /app', async ({ page }) => {
		test.skip(!email, 'fixture missing');
		// Sign-in action signs out unverified users — expect stay on sign-in with error,
		// OR if a session somehow exists, /app redirects to unverified.
		await page.goto('/sign-in');
		await page.getByLabel('Email').fill(email);
		await page.getByLabel('Password').fill(password);
		await page.getByRole('button', { name: 'Sign in' }).click();
		// Your login action rejects unverified — assert alert or query param.
		await expect(page).toHaveURL(/\/sign-in/);
		await expect(
			page.getByRole('alert').or(page.getByText(/verify/i))
		).toBeVisible();
		await page.goto('/app');
		await expect(page).toHaveURL(/\/sign-in/);
	});
});