<script lang="ts">
	import {
		SpaceSurface,
		SpaceCard,
		OrbitingBodies,
		Marquee,
		StarGrid,
		BorderBeam,
		SpaceTabs,
		ShimmerButton
	} from '$lib/index.js';

	let view = $state('overview');

	const gauges = [
		{ label: 'Life support', value: 98, unit: '%' },
		{ label: 'Reactor', value: 74, unit: '%' },
		{ label: 'Hull integrity', value: 91, unit: '%' },
		{ label: 'O₂ reserve', value: 63, unit: '%' }
	];

	const crew = [
		{ name: 'Cmdr. Vega', role: 'Commander', status: 'on deck' },
		{ name: 'Dr. Okonkwo', role: 'Xenobiology', status: 'lab' },
		{ name: 'Eng. Sato', role: 'Propulsion', status: 'reactor' },
		{ name: 'Lt. Moreau', role: 'Navigation', status: 'on deck' }
	];

	const comms = [
		'⟢ TRAPPIST-1e relay synced',
		'⟢ solar storm in 04:12:00',
		'⟢ cargo pod 7 docked',
		'⟢ water recycler nominal',
		'⟢ deep-space ping +1.4s',
		'⟢ crew rotation in 6h'
	];
</script>

<svelte:head>
	<title>Habitat Console — Spacemorphism</title>
</svelte:head>

<div class="hab">
	<div class="bg"><StarGrid deadZone flickerChance={0.06} /></div>

	<header class="topbar sm-surface" data-sm-refract="false">
		<div class="id">
			<span class="dot"></span>
			<div>
				<strong>HABITAT ORION-IV</strong>
				<span class="sub">Sector 9 · geostationary · multi-planet relay</span>
			</div>
		</div>
		<SpaceTabs
			bind:active={view}
			tabs={[
				{ id: 'overview', label: 'Overview' },
				{ id: 'systems', label: 'Systems' },
				{ id: 'crew', label: 'Crew' }
			]}
		/>
		<ShimmerButton>Abort</ShimmerButton>
	</header>

	<section class="grid">
		<BorderBeam radius="var(--sm-radius-lg)">
			<SpaceSurface class="orbit-panel" radius="var(--sm-radius-lg)" padding="1.5rem">
				<h3>Orbital map</h3>
				<div class="orbit-wrap">
					<OrbitingBodies count={2} radius={120} duration={26}>
						{#snippet body(i)}<div class="sat">{i === 0 ? '🛰' : '🌑'}</div>{/snippet}
						<OrbitingBodies count={3} radius={64} duration={16} path={false}>
							{#snippet body(i)}<div class="moon">{i + 1}</div>{/snippet}
							<div class="planet">◐</div>
						</OrbitingBodies>
					</OrbitingBodies>
				</div>
			</SpaceSurface>
		</BorderBeam>

		<SpaceSurface class="gauges" padding="1.5rem">
			<h3>Systems</h3>
			<div class="gauge-list">
				{#each gauges as g (g.label)}
					<div class="gauge">
						<div class="gl"><span>{g.label}</span><span class="gv">{g.value}{g.unit}</span></div>
						<div class="bar"><span style="width: {g.value}%"></span></div>
					</div>
				{/each}
			</div>
		</SpaceSurface>

		<SpaceCard interactive resonant class="crew">
			<h3>Crew</h3>
			<ul>
				{#each crew as c (c.name)}
					<li>
						<span class="cn">{c.name}</span>
						<span class="cr">{c.role}</span>
						<span class="cs">{c.status}</span>
					</li>
				{/each}
			</ul>
		</SpaceCard>

		<SpaceSurface class="comms" padding="1.25rem">
			<h3>Comms feed</h3>
			<Marquee duration={22}>
				{#each comms as c (c)}<span class="msg">{c}</span>{/each}
			</Marquee>
		</SpaceSurface>
	</section>

	<p class="hint">A flagship dashboard composed entirely from Spacemorphism components — view: <strong>{view}</strong>.</p>
</div>

<style>
	.hab {
		position: relative;
		border-radius: var(--sm-radius-lg);
		overflow: hidden;
		padding: 1rem;
		isolation: isolate;
	}
	.bg {
		position: absolute;
		inset: 0;
		z-index: -1;
		opacity: 0.5;
	}
	.topbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.9rem 1.2rem;
		flex-wrap: wrap;
	}
	.id {
		display: flex;
		align-items: center;
		gap: 0.7rem;
	}
	.id .dot {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: radial-gradient(circle at 35% 30%, #fff, hsl(212 90% 72%) 70%);
		box-shadow: 0 0 14px hsl(212 90% 72%);
	}
	.id strong {
		letter-spacing: 0.08em;
	}
	.sub {
		display: block;
		font-size: 0.78rem;
		color: var(--sm-ink-faint);
	}
	.grid {
		display: grid;
		grid-template-columns: 1.4fr 1fr;
		grid-auto-rows: auto;
		gap: 1rem;
		margin-top: 1rem;
	}
	:global(.hab .orbit-panel) {
		grid-row: span 2;
	}
	h3 {
		margin: 0 0 1rem;
		font-size: 0.8rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--sm-ink-faint);
	}
	.orbit-wrap {
		display: grid;
		place-items: center;
		min-height: 320px;
	}
	.planet {
		display: grid;
		place-items: center;
		width: 3rem;
		height: 3rem;
		border-radius: 50%;
		background: radial-gradient(circle at 35% 30%, #e8edf6, #82879a);
		color: #111;
		font-size: 1.6rem;
	}
	.moon {
		display: grid;
		place-items: center;
		width: 1.6rem;
		height: 1.6rem;
		border-radius: 50%;
		background: hsla(212, 30%, 72%, 0.9);
		color: #06121f;
		font-size: 0.75rem;
		font-weight: 700;
	}
	.sat {
		font-size: 1.3rem;
		filter: drop-shadow(0 0 8px hsla(212, 90%, 72%, 0.6));
	}
	.gauge-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.gl {
		display: flex;
		justify-content: space-between;
		font-size: 0.88rem;
		margin-bottom: 0.4rem;
	}
	.gv {
		font-family: ui-monospace, monospace;
		color: hsl(212 90% 80%);
	}
	.bar {
		height: 6px;
		border-radius: 999px;
		background: hsla(220, 20%, 30%, 0.5);
		overflow: hidden;
	}
	.bar span {
		display: block;
		height: 100%;
		background: linear-gradient(90deg, hsl(210 18% 80%), hsl(212 90% 72%));
		border-radius: 999px;
	}
	:global(.hab .crew ul) {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}
	:global(.hab .crew li) {
		display: grid;
		grid-template-columns: 1.2fr 1fr auto;
		gap: 0.5rem;
		align-items: center;
		font-size: 0.9rem;
	}
	.cn {
		font-weight: 600;
	}
	.cr {
		color: var(--sm-ink-dim);
		font-size: 0.82rem;
	}
	.cs {
		font-size: 0.74rem;
		color: hsl(212 90% 80%);
		text-transform: uppercase;
		letter-spacing: 0.06em;
	}
	.msg {
		display: inline-flex;
		padding: 0 1rem;
		color: var(--sm-ink-dim);
		white-space: nowrap;
	}
	.hint {
		margin-top: 1rem;
		color: var(--sm-ink-faint);
		font-size: 0.85rem;
	}
	@media (max-width: 820px) {
		.grid {
			grid-template-columns: 1fr;
		}
		:global(.hab .orbit-panel) {
			grid-row: auto;
		}
	}
</style>
