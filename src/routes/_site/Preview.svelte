<script lang="ts">
	import {
		BlackHole,
		StarDust,
		Constellation,
		DotField,
		StarGrid,
		GravityRipple,
		SpaceBeam,
		BorderBeam,
		ShineBorder,
		OrbitingBodies,
		Marquee,
		ShimmerButton,
		SpaceTabs,
		HoverButton,
		SpaceSubscribe,
		SpaceFeatures,
		SpaceCard,
		SpaceButton
	} from '$lib/index.js';

	let { slug }: { slug: string } = $props();

	// SpaceBeam demo refs
	let beamBox = $state<HTMLElement>();
	let beamA = $state<HTMLElement>();
	let beamB = $state<HTMLElement>();

	let tab = $state('orbit');
</script>

<div class="preview">
	{#if slug === 'black-hole'}
		<BlackHole height="320px" />
	{:else if slug === 'comet-cursor'}
		<div class="hint">Move your cursor anywhere — the comet follows across the whole page.</div>
	{:else if slug === 'star-dust'}
		<div class="stage"><StarDust count={140} /></div>
	{:else if slug === 'constellation'}
		<div class="stage"><Constellation /></div>
	{:else if slug === 'dot-field'}
		<div class="stage"><DotField /></div>
	{:else if slug === 'star-grid'}
		<div class="stage"><StarGrid deadZone /></div>
	{:else if slug === 'gravity-ripple'}
		<div class="stage"><GravityRipple /></div>
	{:else if slug === 'space-beam'}
		<div class="stage beam" bind:this={beamBox}>
			<div class="node" bind:this={beamA}>A</div>
			<div class="node" bind:this={beamB}>B</div>
			<SpaceBeam container={beamBox} from={beamA} to={beamB} />
		</div>
	{:else if slug === 'border-beam'}
		<BorderBeam>
			<div class="boxcard">Border beam</div>
		</BorderBeam>
	{:else if slug === 'shine-border'}
		<ShineBorder>
			<div class="boxcard">Shine border</div>
		</ShineBorder>
	{:else if slug === 'orbiting-bodies'}
		<OrbitingBodies count={3} radius={90} duration={16}>
			{#snippet body(i)}
				<div class="moon">{i + 1}</div>
			{/snippet}
			<div class="planet">☉</div>
		</OrbitingBodies>
	{:else if slug === 'marquee'}
		<Marquee>
			{#each ['SOL-3', 'KEPLER-22b', 'TRAPPIST-1e', 'PROXIMA b', 'GLIESE 581g'] as s (s)}
				<span class="chip">{s}</span>
			{/each}
		</Marquee>
	{:else if slug === 'shimmer-button'}
		<ShimmerButton>Launch sequence</ShimmerButton>
	{:else if slug === 'space-tabs'}
		<SpaceTabs
			bind:active={tab}
			tabs={[
				{ id: 'orbit', label: 'Orbit' },
				{ id: 'surface', label: 'Surface' },
				{ id: 'deep', label: 'Deep space' }
			]}
		/>
	{:else if slug === 'hover-button'}
		<HoverButton>Engage</HoverButton>
	{:else if slug === 'space-subscribe'}
		<SpaceSubscribe email onsubscribe={() => new Promise((r) => setTimeout(r, 900))} />
	{:else if slug === 'space-features'}
		<SpaceFeatures
			columns={3}
			features={[
				{ title: 'Lensing', body: 'Surfaces warp reality behind them.', icon: '◎' },
				{ title: 'Gravity', body: 'Everything leans toward the cursor.', icon: '⦿' },
				{ title: 'Star dust', body: 'Matter falls into the well.', icon: '✦' }
			]}
		/>
	{:else if slug === 'space-card'}
		<SpaceCard interactive resonant>
			<h3 style="margin:0 0 .4rem">Carved from spacetime</h3>
			<p style="margin:0;opacity:.7">A surface with weight and light.</p>
		</SpaceCard>
	{:else if slug === 'space-button'}
		<div style="display:flex;gap:.6rem;flex-wrap:wrap">
			<SpaceButton variant="primary">Primary</SpaceButton>
			<SpaceButton>Surface</SpaceButton>
			<SpaceButton variant="ghost">Ghost</SpaceButton>
		</div>
	{/if}
</div>

<style>
	.preview {
		display: grid;
		place-items: center;
		min-height: 200px;
		padding: 1.5rem;
	}
	.stage {
		position: relative;
		width: 100%;
		height: 280px;
		border-radius: var(--sm-radius);
		overflow: hidden;
		background: hsla(220, 30%, 4%, 0.4);
	}
	.beam {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 2.5rem;
	}
	.node {
		display: grid;
		place-items: center;
		width: 3rem;
		height: 3rem;
		border-radius: 50%;
		background: hsla(220, 14%, 18%, 0.9);
		box-shadow: 0 0 24px -8px hsla(212, 90%, 72%, 0.6);
		font-weight: 700;
		z-index: 1;
	}
	.boxcard {
		padding: 2rem 3rem;
		border-radius: var(--sm-radius);
		background: hsla(220, 14%, 14%, 0.7);
		font-weight: 600;
	}
	.planet {
		display: grid;
		place-items: center;
		width: 3rem;
		height: 3rem;
		border-radius: 50%;
		background: radial-gradient(circle at 35% 30%, #e8edf6, #8b909c);
		color: #111;
		font-size: 1.4rem;
	}
	.moon {
		display: grid;
		place-items: center;
		width: 1.8rem;
		height: 1.8rem;
		border-radius: 50%;
		background: hsla(212, 30%, 70%, 0.9);
		color: #06121f;
		font-size: 0.8rem;
		font-weight: 700;
	}
	.chip {
		display: inline-flex;
		padding: 0.5rem 1rem;
		border-radius: 999px;
		background: hsla(220, 14%, 16%, 0.7);
		white-space: nowrap;
		font-weight: 600;
	}
	.hint {
		opacity: 0.6;
		text-align: center;
		max-width: 28ch;
	}
</style>
