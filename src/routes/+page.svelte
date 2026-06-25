<script lang="ts">
	import {
		BlackHole,
		SpaceButton,
		SpaceCard,
		ShimmerButton,
		HoverButton,
		BorderBeam,
		Marquee,
		SpaceSubscribe,
		SpaceFeatures
	} from '$lib/index.js';
	import CodeBlock from './_site/CodeBlock.svelte';

	const install = `npm install svelte-spacemorphism`;
	const quickstart = `<script>
  import 'svelte-spacemorphism/styles';
  import { SpaceField, SpaceFilters, CometCursor } from 'svelte-spacemorphism';
<\/script>

<SpaceFilters />
<SpaceField />
<CometCursor />`;
</script>

<svelte:head>
	<title>Spacemorphism — the material system for a spacefaring civilization</title>
	<meta
		name="description"
		content="Spacemorphism: a monochrome, gravity-driven, space sci-fi material system and animated-component suite for Svelte 5. The successor to glassmorphism and liquid glass."
	/>
</svelte:head>

<section class="hero">
	<BlackHole height="clamp(320px, 52vh, 560px)" />
	<div class="hero-copy">
		<span class="eyebrow">The successor to glassmorphism &amp; liquid glass</span>
		<h1>Interfaces carved from <span class="grad">spacetime</span>.</h1>
		<p>
			Spacemorphism is a monochrome, gravity-driven material system for Svelte 5. Surfaces lens
			light, bend reality, and pull star dust toward your cursor — the interface language of a
			multi-planet civilization.
		</p>
		<div class="cta">
			<ShimmerButton>Get started</ShimmerButton>
			<a href="/components" style="text-decoration:none"><HoverButton>Browse components</HoverButton></a>
		</div>
	</div>
</section>

<section class="install">
	<CodeBlock code={install} lang="bash" />
	<CodeBlock code={quickstart} />
</section>

<section class="block">
	<h2>One continuous gravitational field</h2>
	<p class="lead">
		Every surface is a body in one page-wide spacetime. Move your cursor — cards lean toward it,
		resonance ripples across neighbours, and the comet cursor drags light through the dark.
	</p>
	<div class="cards">
		<SpaceCard interactive resonant>
			<h3>Refractive lensing</h3>
			<p class="dim">Reality behind each surface is warped, not merely blurred.</p>
		</SpaceCard>
		<BorderBeam>
			<SpaceCard interactive resonant refract={false}>
				<h3>Borderless edges</h3>
				<p class="dim">Defined by light and an event horizon, never a stroke.</p>
			</SpaceCard>
		</BorderBeam>
		<SpaceCard interactive resonant>
			<h3>Gravity wells</h3>
			<p class="dim">Surfaces feel massive — they tilt and attract starlight.</p>
		</SpaceCard>
	</div>
</section>

<section class="block">
	<h2>A whole constellation of components</h2>
	<SpaceFeatures
		columns={3}
		features={[
			{ title: 'Black hole', body: 'A WebGL hero that lenses the starfield around an event horizon.', icon: '◉' },
			{ title: 'Star dust', body: 'Particles that fall into the gravity of your cursor.', icon: '✦' },
			{ title: 'Constellations', body: 'Grids that wire themselves into stars on approach.', icon: '✧' },
			{ title: 'Orbiting bodies', body: 'Satellites tracing clean circular orbits.', icon: '◌' },
			{ title: 'Beams & borders', body: 'Light that travels paths and orbits edges.', icon: '⟋' },
			{ title: 'Dissipate', body: 'Elements that scatter into drifting star dust.', icon: '∴' }
		]}
	/>
	<div class="more"><a href="/components" style="text-decoration:none"><SpaceButton>See all components →</SpaceButton></a></div>
</section>

<section class="block">
	<Marquee>
		{#each ['SOL-3', 'KEPLER-22b', 'TRAPPIST-1e', 'PROXIMA b', 'GLIESE 581g', 'TEEGARDEN b', 'LUYTEN b'] as s (s)}
			<span class="ticker">{s}</span>
		{/each}
	</Marquee>
</section>

<section class="block subscribe">
	<h2>Join the mission log</h2>
	<p class="lead">Get notified when new components dock.</p>
	<SpaceSubscribe email onsubscribe={() => new Promise((r) => setTimeout(r, 900))} />
</section>

<style>
	.hero {
		position: relative;
		margin-top: 0.5rem;
		border-radius: var(--sm-radius-lg);
		overflow: hidden;
	}
	.hero-copy {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 1rem;
		padding: clamp(1.5rem, 5vw, 3.5rem);
		max-width: 36rem;
	}
	.eyebrow {
		font-size: 0.8rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--sm-ink-dim);
	}
	h1 {
		margin: 0;
		font-size: clamp(2.2rem, 6vw, 4rem);
		line-height: 1.02;
		letter-spacing: -0.04em;
		font-weight: 850;
	}
	.grad {
		background: linear-gradient(120deg, #fff, hsl(212 90% 78%));
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
	}
	.hero-copy p {
		margin: 0;
		font-size: clamp(1rem, 2vw, 1.18rem);
		line-height: 1.55;
		color: var(--sm-ink-dim);
	}
	.cta {
		display: flex;
		gap: 0.75rem;
		flex-wrap: wrap;
		margin-top: 0.5rem;
	}

	.install {
		display: grid;
		grid-template-columns: 1fr 1.4fr;
		gap: 1rem;
		margin: 2.5rem 0;
	}

	.block {
		margin: 4rem 0;
	}
	.block h2 {
		font-size: clamp(1.5rem, 4vw, 2.2rem);
		letter-spacing: -0.03em;
		margin: 0 0 0.5rem;
	}
	.lead {
		color: var(--sm-ink-dim);
		font-size: 1.05rem;
		max-width: 52ch;
		margin: 0 0 1.5rem;
	}
	.cards {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
	}
	.cards h3 {
		margin: 0 0 0.4rem;
	}
	.dim {
		color: var(--sm-ink-dim);
		margin: 0;
	}
	.more {
		margin-top: 1.5rem;
	}
	.ticker {
		display: inline-flex;
		padding: 0.6rem 1.2rem;
		border-radius: 999px;
		background: hsla(220, 14%, 14%, 0.6);
		font-weight: 700;
		letter-spacing: 0.04em;
		white-space: nowrap;
	}
	.subscribe {
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	@media (max-width: 820px) {
		.hero-copy {
			position: static;
			background: linear-gradient(180deg, transparent, hsla(220, 40%, 3%, 0.6));
		}
		.install,
		.cards {
			grid-template-columns: 1fr;
		}
	}
</style>
