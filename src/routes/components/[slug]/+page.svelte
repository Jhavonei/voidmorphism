<script lang="ts">
	import Preview from '../../_site/Preview.svelte';
	import CodeBlock from '../../_site/CodeBlock.svelte';
	import type { PageData } from './$types.js';

	let { data }: { data: PageData } = $props();
	const entry = $derived(data.entry);
</script>

<svelte:head>
	<title>{entry.name} — Spacemorphism</title>
	<meta name="description" content={entry.blurb} />
</svelte:head>

<a class="back" href="/components">← All components</a>

<header class="head">
	<span class="cat">{entry.category}</span>
	<h1>{entry.name}</h1>
	<p>{entry.blurb}</p>
</header>

<section class="demo sm-surface" data-sm-refract="false">
	<Preview slug={entry.slug} />
</section>

<section class="usage">
	<h2>Usage</h2>
	<CodeBlock code={entry.code} />
</section>

<section class="props">
	<h2>Props</h2>
	<div class="table">
		<div class="row header">
			<span>Prop</span><span>Type</span><span>Default</span><span>Description</span>
		</div>
		{#each entry.props as p (p.name)}
			<div class="row">
				<span class="mono accent">{p.name}</span>
				<span class="mono">{p.type}</span>
				<span class="mono dim">{p.default}</span>
				<span>{p.desc}</span>
			</div>
		{/each}
	</div>
</section>

<style>
	.back {
		display: inline-block;
		margin: 0.5rem 0 1rem;
		color: var(--sm-ink-dim);
		text-decoration: none;
		font-size: 0.9rem;
	}
	.back:hover {
		color: var(--sm-ink);
	}
	.cat {
		font-size: 0.78rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: hsl(212 90% 78%);
	}
	.head h1 {
		font-size: clamp(2rem, 5vw, 3rem);
		letter-spacing: -0.03em;
		margin: 0.25rem 0;
	}
	.head p {
		color: var(--sm-ink-dim);
		max-width: 60ch;
		margin: 0 0 1.5rem;
	}
	.demo {
		margin: 1.5rem 0 2.5rem;
		min-height: 240px;
		overflow: hidden;
	}
	.usage,
	.props {
		margin: 2.5rem 0;
	}
	.usage h2,
	.props h2 {
		font-size: 0.85rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--sm-ink-faint);
		margin: 0 0 1rem;
	}
	.table {
		border-radius: var(--sm-radius);
		overflow: hidden;
		background: hsla(220, 30%, 5%, 0.4);
	}
	.row {
		display: grid;
		grid-template-columns: 1.2fr 1.4fr 1fr 2fr;
		gap: 1rem;
		padding: 0.75rem 1rem;
		border-bottom: 1px solid hsla(220, 16%, 60%, 0.07);
		font-size: 0.88rem;
	}
	.row:last-child {
		border-bottom: none;
	}
	.row.header {
		color: var(--sm-ink-faint);
		font-size: 0.74rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}
	.mono {
		font-family: ui-monospace, Menlo, Consolas, monospace;
		font-size: 0.82rem;
	}
	.accent {
		color: hsl(212 90% 80%);
	}
	.dim {
		color: var(--sm-ink-faint);
	}

	@media (max-width: 720px) {
		.row {
			grid-template-columns: 1fr 1fr;
		}
	}
</style>
