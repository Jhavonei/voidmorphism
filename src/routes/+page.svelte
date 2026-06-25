<script lang="ts">
	import SpaceSurface from '$lib/components/SpaceSurface.svelte';
	import SpacePanel from '$lib/components/SpacePanel.svelte';
	import SpaceCard from '$lib/components/SpaceCard.svelte';
	import SpaceButton from '$lib/components/SpaceButton.svelte';
	import SpaceInput from '$lib/components/SpaceInput.svelte';
	import SpaceModal from '$lib/components/SpaceModal.svelte';
	import SpaceNav from '$lib/components/SpaceNav.svelte';

	let modalOpen = $state(false);
	let email = $state('');
	let theme = $state<'dark' | 'light'>('dark');

	function toggleTheme() {
		theme = theme === 'dark' ? 'light' : 'dark';
		document.documentElement.dataset.vmTheme = theme;
	}

	const principles = [
		{
			title: 'Refractive Space Distortion',
			body: 'Reality beneath each surface is warped and pulled inward through gravitational lensing — not merely blurred behind frosted glass.'
		},
		{
			title: 'Borderless Construction',
			body: 'No strokes, no outlines. Edges are defined purely by light behavior, refractive shifts, and event-horizon darkening.'
		},
		{
			title: 'One Continuous Material',
			body: 'Every card, panel, and control is a different manifestation of the same cosmic substance — sharing light, depth, and resonance.'
		},
		{
			title: 'Gravity Wells',
			body: 'Move your cursor near a surface. It leans toward you, attracts light, and feels genuinely massive — like an object with weight in space.'
		},
		{
			title: 'Cinematic Contrast',
			body: 'OLED blacks stay black. Highlights stay crisp. No gray haze, no washed-out transparency — only high dynamic range depth.'
		},
		{
			title: 'Resonance Lighting',
			body: 'Components near one another glow in unison, as if connected by one shared energy field. The interface feels alive.'
		}
	];
</script>

<svelte:head>
	<title>Spacemorphism — a cinematic material system for Svelte 5</title>
	<meta
		name="description"
		content="Spacemorphism: interfaces carved from refractive void matter. A space-inspired Svelte 5 material system with gravitational lensing, borderless surfaces, and resonance lighting."
	/>
</svelte:head>

<div class="page">
	<!-- Floating nav -->
	<SpaceNav sticky>
		<span class="brand">void<span class="brand-accent">morphism</span></span>
		<span class="nav-spacer"></span>
		<a class="nav-link" href="#principles">Principles</a>
		<a class="nav-link" href="#material">Material</a>
		<a class="nav-link" href="#start">Start</a>
		<SpaceButton size="sm" variant="ghost" onclick={toggleTheme}>
			{theme === 'dark' ? 'Light' : 'Dark'} mode
		</SpaceButton>
		<SpaceButton size="sm" variant="primary" onclick={() => (modalOpen = true)}>Live Demo</SpaceButton>
	</SpaceNav>

	<!-- Hero -->
	<section class="hero">
		<span class="eyebrow">A new-era interface material</span>
		<h1 class="title">void<span class="accent">morphism</span></h1>
		<p class="tagline">
			Not glass sitting on top of content. A distortion in spacetime itself — interfaces carved
			from refractive void matter, suspended in an infinite black.
		</p>
		<div class="hero-actions">
			<SpaceButton variant="primary" size="lg" onclick={() => (modalOpen = true)}>
				Open the void
			</SpaceButton>
			<SpaceButton variant="surface" size="lg">
				<a href="#principles" style="color:inherit;text-decoration:none;">Explore principles</a>
			</SpaceButton>
		</div>
		<p class="hint">Move your cursor across the surfaces below — they have mass.</p>
	</section>

	<!-- Principles grid -->
	<section id="principles" class="principles">
		<h2 class="section-title">Defining characteristics</h2>
		<p class="section-desc">Six properties that separate Spacemorphism from glassmorphism and liquid glass.</p>
		<div class="grid">
			{#each principles as p (p.title)}
				<SpaceCard depth={2} padding="1.75rem">
					<h3 class="card-title">{p.title}</h3>
					<p class="card-body">{p.body}</p>
				</SpaceCard>
			{/each}
		</div>
	</section>

	<!-- Material showcase: depth + merging -->
	<section id="material" class="material">
		<h2 class="section-title">One continuous material</h2>
		<p class="section-desc">
			Panels, cards, and controls are different manifestations of the same substance — sharing
			light, depth, and refraction.
		</p>

		<SpacePanel depth={1} padding="2.5rem" resonant>
			<div class="showcase">
				<div class="showcase-col">
					<h3 class="card-title">Depth fields</h3>
					<p class="card-body">Each surface lives on its own dimensional plane.</p>
					<div class="depth-stack">
						<SpaceSurface depth={1} padding="1rem" interactive>Depth 1</SpaceSurface>
						<SpaceSurface depth={2} padding="1rem" interactive>Depth 2</SpaceSurface>
						<SpaceSurface depth={3} padding="1rem" interactive bloom>Depth 3 · bloom</SpaceSurface>
					</div>
				</div>

				<div class="showcase-col">
					<h3 class="card-title">Controls</h3>
					<p class="card-body">Borderless inputs and gravity-reactive buttons.</p>
					<SpaceInput label="Join the waitlist" placeholder="you@galaxy.dev" type="email" bind:value={email} />
					<div class="btn-row">
						<SpaceButton variant="primary">Subscribe</SpaceButton>
						<SpaceButton variant="surface">Maybe later</SpaceButton>
						<SpaceButton variant="ghost">Dismiss</SpaceButton>
					</div>
				</div>
			</div>
		</SpacePanel>
	</section>

	<!-- Getting started -->
	<section id="start" class="start">
		<h2 class="section-title">Get started</h2>
		<SpacePanel depth={2} padding="2rem">
			<pre class="code-block"><code>{`npm install svelte-voidmorphism`}</code></pre>
			<pre class="code-block"><code>{`<` +
					`script>
  import 'svelte-voidmorphism/styles';
  import { SpaceFilters, SpaceField, SpaceCard } from 'svelte-voidmorphism';
<` +
					`/script>

<SpaceFilters />
<SpaceField />

<SpaceCard interactive resonant>
  Carved from refractive void matter.
</SpaceCard>`}</code></pre>
		</SpacePanel>
	</section>

	<!-- Footer -->
	<footer class="footer">
		<p>MIT License · Built with Svelte 5 Runes · Spacemorphism</p>
		<p>
			<a href="https://github.com/yourusername/svelte-voidmorphism">GitHub</a> ·
			<a href="https://www.npmjs.com/package/svelte-voidmorphism">npm</a>
		</p>
	</footer>
</div>

<!-- Live demo modal -->
<SpaceModal bind:open={modalOpen} width="min(92vw, 440px)">
	<h3 class="card-title" style="margin-top:0;">A dimensional anomaly</h3>
	<p class="card-body">
		This modal uses the deep refractive lens — the entire interface behind it is pulled inward,
		while the surrounding void darkens like a gravity well. Press Escape or click the scrim to
		close.
	</p>
	<div class="btn-row">
		<SpaceButton variant="primary" onclick={() => (modalOpen = false)}>Close the void</SpaceButton>
	</div>
</SpaceModal>

<style>
	.page {
		max-width: 1080px;
		margin: 0 auto;
		padding: 1.25rem 1.5rem 0;
	}

	/* Nav */
	.brand {
		font-weight: 800;
		letter-spacing: -0.02em;
		font-size: 1.1rem;
		color: var(--sm-ink);
	}
	.brand-accent {
		color: var(--sm-accent-2);
	}
	.nav-spacer {
		flex: 1;
	}
	.nav-link {
		color: var(--sm-ink-dim);
		text-decoration: none;
		font-size: 0.92rem;
		transition: color 0.2s var(--sm-ease);
	}
	.nav-link:hover {
		color: var(--sm-ink);
	}

	/* Hero */
	.hero {
		min-height: 72vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: 3rem 0 4rem;
	}

	.eyebrow {
		text-transform: uppercase;
		letter-spacing: 0.32em;
		font-size: 0.72rem;
		color: var(--sm-ink-faint);
		margin-bottom: 1.25rem;
	}

	.title {
		font-size: clamp(3.2rem, 12vw, 7rem);
		font-weight: 900;
		margin: 0;
		letter-spacing: -0.04em;
		line-height: 0.95;
		color: var(--sm-ink);
		text-shadow:
			0 0 60px hsla(272, 92%, 67%, 0.4),
			0 0 120px hsla(45, 96%, 60%, 0.12);
	}
	.accent {
		background: linear-gradient(120deg, var(--sm-accent), var(--sm-accent-2));
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.tagline {
		font-size: clamp(1.05rem, 2.4vw, 1.35rem);
		color: var(--sm-ink-dim);
		max-width: 44ch;
		margin: 1.5rem 0 2.25rem;
		line-height: 1.55;
	}

	.hero-actions {
		display: flex;
		gap: 1rem;
		justify-content: center;
		flex-wrap: wrap;
	}

	.hint {
		margin-top: 2rem;
		font-size: 0.85rem;
		color: var(--sm-ink-faint);
	}

	/* Sections */
	section {
		padding: 4rem 0;
	}
	.section-title {
		font-size: clamp(1.8rem, 4vw, 2.6rem);
		font-weight: 800;
		letter-spacing: -0.03em;
		margin: 0 0 0.5rem;
		color: var(--sm-ink);
	}
	.section-desc {
		color: var(--sm-ink-dim);
		max-width: 56ch;
		margin: 0 0 2.25rem;
		line-height: 1.55;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 1.25rem;
	}

	.card-title {
		margin: 0 0 0.6rem;
		font-size: 1.15rem;
		font-weight: 700;
		color: var(--sm-ink);
	}
	.card-body {
		margin: 0;
		color: var(--sm-ink-dim);
		font-size: 0.95rem;
		line-height: 1.6;
	}

	/* Material showcase */
	.showcase {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2.5rem;
	}
	.showcase-col {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	.depth-stack {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-top: 0.5rem;
		font-weight: 600;
	}
	.btn-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		margin-top: 0.5rem;
	}

	/* Code */
	.code-block {
		background: hsla(272, 55%, 6%, 0.5);
		border-radius: var(--sm-radius-sm);
		padding: 1.1rem 1.4rem;
		overflow-x: auto;
		margin: 0 0 1rem;
		box-shadow: 0 1px 0 0 var(--sm-rim-soft) inset;
	}
	.code-block code {
		font-family: 'Fira Code', ui-monospace, 'Courier New', monospace;
		font-size: 0.86rem;
		color: var(--sm-accent-2);
		white-space: pre;
	}

	/* Footer */
	.footer {
		text-align: center;
		padding: 3rem 0 4rem;
		color: var(--sm-ink-faint);
		font-size: 0.88rem;
	}
	.footer a {
		color: var(--sm-accent-2);
		text-decoration: none;
	}
	.footer a:hover {
		text-decoration: underline;
	}

	@media (max-width: 720px) {
		.showcase {
			grid-template-columns: 1fr;
		}
	}
</style>
