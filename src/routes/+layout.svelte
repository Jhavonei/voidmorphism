<script lang="ts">
	import '$lib/styles/spacemorphism.css';
	import SpaceFilters from '$lib/components/SpaceFilters.svelte';
	import SpaceField from '$lib/components/SpaceField.svelte';

	let { children } = $props();
</script>

<!-- Spacemorphism setup: filters + infinite void foundation, mounted once. -->
<SpaceFilters />
<SpaceField />

{@render children?.()}

<style>
	:global(html),
	:global(body) {
		margin: 0;
		min-height: 100%;
		background: var(--sm-void);
	}

	:global(body) {
		color: var(--sm-ink);
		font-family: 'Inter', ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
		-webkit-font-smoothing: antialiased;
		transition:
			background 0.6s ease,
			color 0.6s ease;
	}
</style>
