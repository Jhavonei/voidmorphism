<script lang="ts">
	import '$lib/styles/spacemorphism.css';
	import { SpaceFilters, SpaceField, CometCursor } from '$lib/index.js';
	import Nav from './_site/Nav.svelte';

	let { children } = $props();
</script>

<!-- Spacemorphism setup: refraction filters + infinite space foundation + comet cursor. -->
<SpaceFilters />
<SpaceField />
<CometCursor />

<Nav />

<main>
	{@render children?.()}
</main>

<footer class="footer">
	<span>Spacemorphism — the interface language of a spacefaring civilization.</span>
	<span class="dim">Monochrome · gravity-driven · zero-dependency · MIT</span>
</footer>

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

	:global(*) {
		box-sizing: border-box;
	}

	main {
		max-width: 1100px;
		margin: 0 auto;
		padding: 1.5rem 1.25rem 4rem;
	}

	.footer {
		max-width: 1100px;
		margin: 0 auto;
		padding: 2.5rem 1.25rem 3.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		border-top: 1px solid hsla(220, 16%, 60%, 0.08);
		color: var(--sm-ink-dim);
		font-size: 0.9rem;
	}
	.dim {
		color: var(--sm-ink-faint);
		font-size: 0.82rem;
	}
</style>
