<script lang="ts">
	import { catalog, categories } from '../_site/catalog.js';
</script>

<svelte:head>
	<title>Components — Spacemorphism</title>
</svelte:head>

<header class="head">
	<h1>Components</h1>
	<p>Every piece is monochrome, gravity-aware, reduced-motion safe, and zero-dependency.</p>
</header>

{#each categories as cat (cat)}
	<section class="group">
		<h2>{cat}</h2>
		<div class="grid">
			{#each catalog.filter((e) => e.category === cat) as e (e.slug)}
				<a class="card sm-surface" href="/components/{e.slug}" data-sm-refract="false">
					<h3>{e.name}</h3>
					<p>{e.blurb}</p>
					<span class="go">Open →</span>
				</a>
			{/each}
		</div>
	</section>
{/each}

<style>
	.head h1 {
		font-size: clamp(2rem, 5vw, 3rem);
		letter-spacing: -0.03em;
		margin: 1rem 0 0.25rem;
	}
	.head p {
		color: var(--sm-ink-dim);
		margin: 0 0 1.5rem;
	}
	.group {
		margin: 2.5rem 0;
	}
	.group h2 {
		font-size: 0.85rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--sm-ink-faint);
		margin: 0 0 1rem;
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
		gap: 1rem;
	}
	.card {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		padding: 1.4rem;
		text-decoration: none;
		color: var(--sm-ink);
	}
	.card h3 {
		margin: 0;
		font-size: 1.1rem;
	}
	.card p {
		margin: 0;
		color: var(--sm-ink-dim);
		font-size: 0.9rem;
		line-height: 1.5;
	}
	.go {
		margin-top: 0.4rem;
		color: hsl(212 90% 78%);
		font-weight: 600;
		font-size: 0.9rem;
	}
</style>
