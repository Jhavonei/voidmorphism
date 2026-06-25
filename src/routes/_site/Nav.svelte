<script lang="ts">
	import { page } from '$app/stores';
	import { SoundToggle } from '$lib/index.js';
	import { ui, toggleTheme, applyPerf, perfTiers } from './site.svelte.js';

	const links = [
		{ href: '/', label: 'Home' },
		{ href: '/components', label: 'Components' },
		{ href: '/transitions', label: 'Transitions' },
		{ href: '/forge', label: 'Forge' },
		{ href: '/design', label: 'Design' },
		{ href: '/habitat', label: 'Habitat' }
	];

	function isActive(href: string, path: string): boolean {
		return href === '/' ? path === '/' : path.startsWith(href);
	}

	function cyclePerf() {
		const i = perfTiers.indexOf(ui.perf);
		applyPerf(perfTiers[(i + 1) % perfTiers.length]);
	}
</script>

<nav class="nav sm-surface" data-sm-refract="false">
	<a class="brand" href="/">
		<span class="dot"></span>
		space<span class="brand-dim">morphism</span>
	</a>

	<div class="links">
		{#each links as l (l.href)}
			<a class="link" class:active={isActive(l.href, $page.url.pathname)} href={l.href}>{l.label}</a>
		{/each}
	</div>

	<div class="tools">
		<button class="tool" onclick={cyclePerf} title="Performance tier">{ui.perf}</button>
		<button class="tool" onclick={toggleTheme} title="Toggle theme" aria-label="Toggle theme">
			{ui.theme === 'dark' ? '☾' : '☀'}
		</button>
		<SoundToggle />
		<a class="tool gh" href="https://github.com/yourusername/svelte-spacemorphism" target="_blank" rel="noreferrer">GitHub</a>
	</div>
</nav>

<style>
	.nav {
		position: sticky;
		top: 0.75rem;
		z-index: 100;
		display: flex;
		align-items: center;
		gap: 1rem;
		margin: 0.75rem auto;
		padding: 0.6rem 0.9rem;
		max-width: 1100px;
		border-radius: var(--sm-radius-pill);
	}
	.brand {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		font-weight: 800;
		letter-spacing: -0.02em;
		color: var(--sm-ink);
		text-decoration: none;
	}
	.brand-dim {
		color: var(--sm-ink-faint);
	}
	.dot {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: radial-gradient(circle at 35% 30%, #fff, hsl(212 90% 72%) 70%, #0a0a0f);
		box-shadow: 0 0 16px -2px hsl(212 90% 72%);
	}
	.links {
		display: flex;
		gap: 0.25rem;
		margin: 0 auto;
		flex-wrap: wrap;
	}
	.link {
		padding: 0.4rem 0.8rem;
		border-radius: 999px;
		color: var(--sm-ink-dim);
		text-decoration: none;
		font-weight: 600;
		font-size: 0.92rem;
		transition: color 0.2s ease, background 0.2s ease;
	}
	.link:hover {
		color: var(--sm-ink);
	}
	.link.active {
		color: var(--sm-ink);
		background: hsla(220, 14%, 20%, 0.6);
	}
	.tools {
		display: flex;
		align-items: center;
		gap: 0.4rem;
	}
	.tool {
		border: none;
		background: hsla(220, 12%, 16%, 0.7);
		color: var(--sm-ink-dim);
		font: inherit;
		font-size: 0.8rem;
		font-weight: 600;
		padding: 0.45rem 0.7rem;
		border-radius: 999px;
		cursor: pointer;
		text-decoration: none;
		text-transform: capitalize;
	}
	.tool:hover {
		color: hsl(212 90% 80%);
	}
	.gh {
		text-transform: none;
	}

	@media (max-width: 720px) {
		.links {
			display: none;
		}
	}
</style>
