<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<main>
	<h1>Isuna</h1>
	<p>Protected app shell.</p>

	{#if data.auth.email}
		<p>Signed in as {data.auth.email}</p>
	{/if}

	{#if data.profile}
		<p>Locale: {data.profile.locale} · Timezone: {data.profile.timezone}</p>
	{:else}
		<p role="alert">Profile could not be loaded.</p>
	{/if}

	<p><a href={resolve('/sign-out')}>Sign out</a></p>
</main>
