<script lang="ts">
	import {
		dissolve,
		dissipate,
		warp,
		gravityPulse,
		glitch,
		morph,
		phaseShift,
		pixelate,
		shatter
	} from '$lib/index.js';
	import TransitionDemo from '../_site/TransitionDemo.svelte';
	import CodeBlock from '../_site/CodeBlock.svelte';

	const demos = [
		{ label: 'dissolve', fn: dissolve },
		{ label: 'dissipate', fn: dissipate },
		{ label: 'warp', fn: warp },
		{ label: 'gravityPulse', fn: gravityPulse },
		{ label: 'glitch', fn: glitch },
		{ label: 'morph', fn: morph },
		{ label: 'phaseShift', fn: phaseShift },
		{ label: 'pixelate', fn: pixelate },
		{ label: 'shatter', fn: shatter }
	];

	const usage = `<script>
  import { dissipate } from 'svelte-spacemorphism';
  let show = $state(true);
<\/script>

{#if show}
  <div transition:dissipate={{ duration: 700 }}>Matter</div>
{/if}`;
</script>

<svelte:head>
	<title>Transitions — Spacemorphism</title>
</svelte:head>

<header class="head">
	<h1>Transitions</h1>
	<p>
		Cinematic enter/exit motion. <strong>dissipate</strong> scatters into star dust,
		<strong>warp</strong> bends like an event horizon, <strong>seamless</strong> morphs shared
		elements between routes.
	</p>
</header>

<section class="usage"><CodeBlock code={usage} /></section>

<section class="grid">
	{#each demos as d (d.label)}
		<TransitionDemo label={d.label} fn={d.fn} />
	{/each}
</section>

<style>
	.head h1 {
		font-size: clamp(2rem, 5vw, 3rem);
		letter-spacing: -0.03em;
		margin: 1rem 0 0.25rem;
	}
	.head p {
		color: var(--sm-ink-dim);
		max-width: 60ch;
		margin: 0 0 1.5rem;
	}
	.usage {
		margin: 1.5rem 0 2rem;
		max-width: 640px;
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
		gap: 1rem;
	}
</style>
