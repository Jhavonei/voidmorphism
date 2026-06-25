<script lang="ts">
	const swatches = [
		{ name: 'void', val: '#050609' },
		{ name: 'charcoal', val: '#15171c' },
		{ name: 'graphite', val: '#22252d' },
		{ name: 'gray', val: '#595d68' },
		{ name: 'gray-light', val: '#9598a4' },
		{ name: 'silver', val: '#c4c8d2' },
		{ name: 'white', val: '#f3f5fa' },
		{ name: 'accent', val: 'hsl(212 90% 72%)' }
	];

	const principles = [
		['Refractive lensing', 'Reality behind a surface is warped like a region of spacetime, not merely blurred.'],
		['Borderless edges', 'Edges are defined by light and event-horizon darkening — never a stroke.'],
		['One gravitational field', 'Every component is a body in one page-wide spacetime that the cursor moves through.'],
		['Monochrome + one cold glow', 'Grayscale from OLED black to white, with a single cold star-glow for energy.'],
		['Gravity as the metaphor', 'Surfaces have weight; matter falls toward the cursor; light bends around mass.'],
		['Cinematic, but cheap', 'Performance tiers and reduced-motion keep it 60fps from laptop to phone.']
	];
</script>

<svelte:head>
	<title>Design &amp; Lore — Spacemorphism</title>
</svelte:head>

<header class="head">
	<span class="eyebrow">Design system &amp; lore</span>
	<h1>The interface language of a spacefaring civilization.</h1>
	<p>
		Glassmorphism blurred the background. Apple's liquid glass distorted it. Spacemorphism treats
		the whole page as one region of spacetime — surfaces are dense bodies that lens light, bend
		reality, and pull matter toward the cursor.
	</p>
</header>

<section class="compare sm-surface" data-sm-refract="false">
	<div class="row header"><span></span><span>Glassmorphism</span><span>Liquid glass</span><span>Spacemorphism</span></div>
	<div class="row"><span>Background</span><span>blurs it</span><span>distorts it</span><span class="hl">warps spacetime</span></div>
	<div class="row"><span>Foundation</span><span>light/gray</span><span>translucent</span><span class="hl">OLED black</span></div>
	<div class="row"><span>Edges</span><span>borders</span><span>strokes</span><span class="hl">event horizon</span></div>
	<div class="row"><span>Color</span><span>any</span><span>any</span><span class="hl">monochrome + cold glow</span></div>
	<div class="row"><span>Interaction</span><span>hover</span><span>hover</span><span class="hl">one gravity field</span></div>
</section>

<section class="block">
	<h2>Palette</h2>
	<div class="swatches">
		{#each swatches as s (s.name)}
			<div class="swatch">
				<span class="chip" style="background: {s.val}"></span>
				<span class="name">{s.name}</span>
				<span class="val">{s.val}</span>
			</div>
		{/each}
	</div>
	<p class="note">
		Set <code>--sm-accent-chroma: 0</code> to drop to pure grayscale, or open the
		<a href="/forge">Forge</a> to tune it live.
	</p>
</section>

<section class="block">
	<h2>Principles</h2>
	<div class="principles">
		{#each principles as [title, body] (title)}
			<div class="principle sm-surface" data-sm-refract="false">
				<h3>{title}</h3>
				<p>{body}</p>
			</div>
		{/each}
	</div>
</section>

<style>
	.eyebrow {
		font-size: 0.8rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--sm-ink-dim);
	}
	.head h1 {
		font-size: clamp(2rem, 5vw, 3.2rem);
		letter-spacing: -0.035em;
		margin: 0.5rem 0;
		max-width: 18ch;
	}
	.head p {
		color: var(--sm-ink-dim);
		max-width: 62ch;
		font-size: 1.05rem;
		line-height: 1.6;
	}
	.compare {
		margin: 2rem 0;
		overflow: hidden;
	}
	.row {
		display: grid;
		grid-template-columns: 1.1fr 1fr 1fr 1.3fr;
		gap: 1rem;
		padding: 0.8rem 1.2rem;
		border-bottom: 1px solid hsla(220, 16%, 60%, 0.07);
		font-size: 0.9rem;
		color: var(--sm-ink-dim);
	}
	.row.header {
		color: var(--sm-ink-faint);
		font-size: 0.74rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}
	.row span:first-child {
		color: var(--sm-ink);
		font-weight: 600;
	}
	.hl {
		color: hsl(212 90% 82%);
		font-weight: 600;
	}
	.block {
		margin: 3.5rem 0;
	}
	.block h2 {
		font-size: clamp(1.4rem, 4vw, 2rem);
		letter-spacing: -0.03em;
		margin: 0 0 1.25rem;
	}
	.swatches {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
		gap: 0.8rem;
	}
	.swatch {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}
	.chip {
		height: 56px;
		border-radius: 12px;
		box-shadow: 0 1px 0 0 hsla(0, 0%, 100%, 0.1) inset;
	}
	.name {
		font-weight: 600;
		font-size: 0.85rem;
	}
	.val {
		font-family: ui-monospace, monospace;
		font-size: 0.74rem;
		color: var(--sm-ink-faint);
	}
	.note {
		margin-top: 1rem;
		color: var(--sm-ink-dim);
	}
	.note code {
		font-family: ui-monospace, monospace;
		background: hsla(220, 30%, 8%, 0.7);
		padding: 0.1rem 0.4rem;
		border-radius: 6px;
	}
	.principles {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
		gap: 1rem;
	}
	.principle {
		padding: 1.3rem;
	}
	.principle h3 {
		margin: 0 0 0.4rem;
		font-size: 1.05rem;
	}
	.principle p {
		margin: 0;
		color: var(--sm-ink-dim);
		font-size: 0.9rem;
		line-height: 1.5;
	}
</style>
