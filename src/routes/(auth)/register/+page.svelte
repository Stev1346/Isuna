<script lang="ts">
	import { page } from '$app/state';
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();
</script>

<main>
	<h1>Create account</h1>

	{#if page.url.searchParams.get('error') === 'verification'}
		<p role="alert">Verification link was invalid or expired. Try registering again.</p>
	{/if}

	{#if form?.message}
		<p role="status">{form.message}</p>
	{/if}

	{#if form?.formError}
		<p role="alert">{form.formError}</p>
	{/if}

	<form method="POST">
		<label>
			Email
			<input type="email" name="email" autocomplete="email" required value={form?.email ?? ''} />
		</label>

		{#if form?.fieldErrors?.email}
			<p role="alert">{form.fieldErrors.email}</p>
		{/if}
		<label>
			Password
			<input type="password" name="password" autocomplete="new-password" required />
		</label>

		{#if form?.fieldErrors?.password}
			<p role="alert">{form.fieldErrors.password}</p>
		{/if}
		<label>
			Confirm Password
			<input type="password" name="confirmPassword" autocomplete="new-password" required />
		</label>

		{#if form?.fieldErrors?.confirmPassword}
			<p role="alert">{form.fieldErrors.confirmPassword}</p>
		{/if}

		<button type="submit">Register</button>
	</form>
</main>
