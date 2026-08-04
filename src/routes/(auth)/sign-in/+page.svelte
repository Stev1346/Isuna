<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
</script>

{#if page.url.searchParams.get('error') === 'unverified'}
	<p role="alert">Verify your email before opening the app.</p>
{/if}

<main>
	<h1>Sign in</h1>

	{#if form?.formError}
		<p role="alert">{form.formError}</p>
	{/if}

	<form action="?/google" method="post">
		<input type="hidden" name="redirectTo" value={form?.redirectTo ?? data.redirectTo} />
		<button type="submit">Continue with Google</button>
	</form>

	<form action="?/login" method="POST">
		<input type="hidden" name="redirectTo" value={form?.redirectTo ?? data.redirectTo} />

		<label>
			Email
			<input type="email" name="email" autocomplete="email" required value={form?.email ?? ''} />
		</label>
		{#if form?.fieldErrors?.email}
			<p role="alert">{form.fieldErrors.email}</p>
		{/if}

		<label>
			Password
			<input type="password" name="password" autocomplete="current-password" required />
		</label>
		{#if form?.fieldErrors?.password}
			<p role="alert">{form.fieldErrors.password}</p>
		{/if}

		<button type="submit">Sign in</button>
	</form>

	<p><a href={resolve('/forgot-password')}>Forgot Password</a></p>

	<p><a href={resolve('/register')}>Create an account</a></p>
</main>
