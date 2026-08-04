<script lang="ts">
	import type { PageProps } from './$types';

	let { form, data }: PageProps = $props();
</script>

<main>
	<h1>Change Password</h1>
	{#if form?.formError}
		<p role="alert">{form.formError}</p>
	{/if}

	{#if data.fromRecovery}
		<p role="status">
			Your email is verified because you opened the reset link. Choose a new password to continue.
		</p>
	{/if}

	<form method="post">
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

		<button type="submit">Update Password</button>
	</form>
</main>
