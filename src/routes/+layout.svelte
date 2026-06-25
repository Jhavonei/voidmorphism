<script lang="ts">
	import '$lib/styles/voidmorphism.css';
	import VoidFilters from '$lib/components/VoidFilters.svelte';
	import VoidField from '$lib/components/VoidField.svelte';

	let { children } = $props();
</script>

<!-- Voidmorphism setup: filters + infinite void foundation, mounted once. -->
<VoidFilters />
<VoidField />

{@render children?.()}

<style>
	:global(html),
	:global(body) {
		margin: 0;
		min-height: 100%;
		background: var(--vm-void);
	}

	:global(body) {
		color: var(--vm-ink);
		font-family: 'Inter', ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
		-webkit-font-smoothing: antialiased;
		transition:
			background 0.6s ease,
			color 0.6s ease;
	}
</style>
