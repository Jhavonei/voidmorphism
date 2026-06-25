<script lang="ts">
	import { onMount } from 'svelte';
	import { SpaceCard, SpaceButton, setSpaceConfig } from '$lib/index.js';
	import CodeBlock from '../_site/CodeBlock.svelte';

	let chroma = $state(1);
	let blur = $state(11);
	let refract = $state(18);
	let radius = $state(22);
	let accentL = $state(72);

	function apply() {
		if (typeof document === 'undefined') return;
		const r = document.documentElement.style;
		r.setProperty('--sm-blur', `${blur}px`);
		r.setProperty('--sm-refract-scale', String(refract));
		r.setProperty('--sm-radius', `${radius}px`);
		r.setProperty('--sm-accent-l', `${accentL}%`);
		setSpaceConfig({ chroma });
	}

	function syncUrl() {
		if (typeof history === 'undefined') return;
		const p = new URLSearchParams({
			c: chroma.toFixed(2),
			b: String(blur),
			r: String(refract),
			rad: String(radius),
			l: String(accentL)
		});
		history.replaceState(null, '', `?${p}`);
	}

	$effect(() => {
		// re-run whenever any control changes
		void [chroma, blur, refract, radius, accentL];
		apply();
		syncUrl();
	});

	onMount(() => {
		const p = new URLSearchParams(location.search);
		if (p.has('c')) chroma = parseFloat(p.get('c')!);
		if (p.has('b')) blur = parseInt(p.get('b')!);
		if (p.has('r')) refract = parseInt(p.get('r')!);
		if (p.has('rad')) radius = parseInt(p.get('rad')!);
		if (p.has('l')) accentL = parseInt(p.get('l')!);
		return () => {
			// reset overrides when leaving the forge
			const r = document.documentElement.style;
			r.removeProperty('--sm-blur');
			r.removeProperty('--sm-refract-scale');
			r.removeProperty('--sm-radius');
			r.removeProperty('--sm-accent-l');
			setSpaceConfig({ chroma: 1 });
		};
	});

	const tokens = $derived(`:root {
  --sm-accent-chroma: ${chroma.toFixed(2)};
  --sm-accent-l: ${accentL}%;
  --sm-blur: ${blur}px;
  --sm-refract-scale: ${refract};
  --sm-radius: ${radius}px;
}`);
</script>

<svelte:head>
	<title>Forge — Spacemorphism</title>
</svelte:head>

<header class="head">
	<h1>The Forge</h1>
	<p>Tune the material live, then copy the tokens. The URL captures your settings — share it.</p>
</header>

<div class="layout">
	<section class="controls sm-surface" data-sm-refract="false">
		<label>
			<span>Accent chroma <em>{chroma.toFixed(2)}</em></span>
			<input type="range" min="0" max="1" step="0.01" bind:value={chroma} />
		</label>
		<label>
			<span>Accent lightness <em>{accentL}%</em></span>
			<input type="range" min="40" max="90" step="1" bind:value={accentL} />
		</label>
		<label>
			<span>Blur <em>{blur}px</em></span>
			<input type="range" min="0" max="30" step="1" bind:value={blur} />
		</label>
		<label>
			<span>Refraction <em>{refract}</em></span>
			<input type="range" min="0" max="40" step="1" bind:value={refract} />
		</label>
		<label>
			<span>Radius <em>{radius}px</em></span>
			<input type="range" min="0" max="40" step="1" bind:value={radius} />
		</label>
	</section>

	<section class="stage">
		<SpaceCard interactive resonant bloom>
			<h3>Live material</h3>
			<p class="dim">Drag the sliders. The whole substance re-forms.</p>
			<SpaceButton variant="primary">Primary</SpaceButton>
		</SpaceCard>
	</section>
</div>

<section class="out">
	<h2>Tokens</h2>
	<CodeBlock code={tokens} lang="css" />
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
	.layout {
		display: grid;
		grid-template-columns: 320px 1fr;
		gap: 1.5rem;
		align-items: start;
	}
	.controls {
		display: flex;
		flex-direction: column;
		gap: 1.1rem;
		padding: 1.5rem;
	}
	label {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		font-size: 0.88rem;
		color: var(--sm-ink-dim);
	}
	label em {
		float: right;
		font-style: normal;
		color: hsl(212 90% 80%);
		font-family: ui-monospace, monospace;
	}
	input[type='range'] {
		width: 100%;
		accent-color: hsl(212 90% 72%);
	}
	.stage {
		display: grid;
		place-items: center;
		min-height: 320px;
	}
	.stage h3 {
		margin: 0 0 0.4rem;
	}
	.dim {
		color: var(--sm-ink-dim);
		margin: 0 0 1rem;
	}
	.out {
		margin: 2.5rem 0;
		max-width: 560px;
	}
	.out h2 {
		font-size: 0.85rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--sm-ink-faint);
		margin: 0 0 1rem;
	}
	@media (max-width: 820px) {
		.layout {
			grid-template-columns: 1fr;
		}
	}
</style>
