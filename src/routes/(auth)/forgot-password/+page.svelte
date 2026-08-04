<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();
</script>

<main>
	<h1>Forgot Password</h1>

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

		<button type="submit">Reset Password</button>
	</form>

	<p><a href={resolve('/sign-in')}>Back to sign in</a></p>
</main>
