/**
 * catalog — metadata that drives the showcase gallery and per-component pages.
 * Showcase-only (lives under routes/_site, never published).
 */

export type Category = 'Signature' | 'Backgrounds' | 'Motion' | 'Interactive' | 'Material';

export interface PropDoc {
	name: string;
	type: string;
	default: string;
	desc: string;
}

export interface Entry {
	slug: string;
	name: string;
	category: Category;
	blurb: string;
	code: string;
	props: PropDoc[];
}

export const catalog: Entry[] = [
	{
		slug: 'black-hole',
		name: 'BlackHole',
		category: 'Signature',
		blurb: 'A hand-rolled WebGL black hole that gravitationally lenses a starfield, with an accretion disk and photon ring.',
		code: `<script>
  import { BlackHole } from 'svelte-spacemorphism';
<\/script>

<BlackHole height="480px" mass={1} disk />`,
		props: [
			{ name: 'height', type: 'string', default: "'480px'", desc: 'Block height.' },
			{ name: 'mass', type: 'number', default: '1', desc: 'Lensing strength.' },
			{ name: 'eventRadius', type: 'number', default: '0.18', desc: 'Horizon radius.' },
			{ name: 'disk', type: 'boolean', default: 'true', desc: 'Render the accretion disk.' },
			{ name: 'accent', type: 'number', default: '1', desc: 'Cold-accent tint (0–1).' }
		]
	},
	{
		slug: 'comet-cursor',
		name: 'CometCursor',
		category: 'Signature',
		blurb: 'A global custom cursor rendered as a comet of light with a decaying trail — the visible mass of the spacetime field.',
		code: `<script>
  import { CometCursor } from 'svelte-spacemorphism';
<\/script>

<CometCursor />`,
		props: [
			{ name: 'size', type: 'number', default: '7', desc: 'Core radius (px).' },
			{ name: 'trail', type: 'number', default: '18', desc: 'Trail length.' },
			{ name: 'hideNative', type: 'boolean', default: 'true', desc: 'Hide the native cursor.' }
		]
	},
	{
		slug: 'star-dust',
		name: 'StarDust',
		category: 'Backgrounds',
		blurb: 'An interactive field of star dust pulled toward the cursor by the shared spacetime gravity field.',
		code: `<div style="position: relative; height: 320px">
  <StarDust count={160} gravity={0.6} />
</div>`,
		props: [
			{ name: 'count', type: 'number', default: '160', desc: 'Mote count (perf-scaled).' },
			{ name: 'gravity', type: 'number', default: '0.6', desc: 'Pull toward the cursor.' },
			{ name: 'speed', type: 'number', default: '1', desc: 'Drift speed.' }
		]
	},
	{
		slug: 'constellation',
		name: 'Constellation',
		category: 'Backgrounds',
		blurb: 'A grid of stars wired into constellations that light up and link near the cursor.',
		code: `<div style="position: relative; height: 320px">
  <Constellation gap={56} linkDistance={80} />
</div>`,
		props: [
			{ name: 'gap', type: 'number', default: '56', desc: 'Grid spacing (px).' },
			{ name: 'linkDistance', type: 'number', default: '80', desc: 'Max link distance.' },
			{ name: 'reveal', type: 'number', default: '220', desc: 'Cursor reveal radius.' }
		]
	},
	{
		slug: 'dot-field',
		name: 'DotField',
		category: 'Backgrounds',
		blurb: 'A crisp dot grid that, when masked, only reveals near the cursor like sensors lighting up.',
		code: `<div style="position: relative; height: 320px">
  <DotField gap={24} mask />
</div>`,
		props: [
			{ name: 'gap', type: 'number', default: '24', desc: 'Grid spacing (px).' },
			{ name: 'mask', type: 'boolean', default: 'true', desc: 'Reveal near the cursor.' },
			{ name: 'reveal', type: 'number', default: '240', desc: 'Reveal radius (px).' }
		]
	},
	{
		slug: 'star-grid',
		name: 'StarGrid',
		category: 'Backgrounds',
		blurb: 'A grid of cells that flicker like distant stars, with an optional black-hole dead zone.',
		code: `<div style="position: relative; height: 320px">
  <StarGrid flickerChance={0.08} deadZone />
</div>`,
		props: [
			{ name: 'squareSize', type: 'number', default: '4', desc: 'Cell size (px).' },
			{ name: 'flickerChance', type: 'number', default: '0.08', desc: 'Flicker probability.' },
			{ name: 'deadZone', type: 'boolean', default: 'false', desc: 'Central black hole.' }
		]
	},
	{
		slug: 'gravity-ripple',
		name: 'GravityRipple',
		category: 'Backgrounds',
		blurb: 'Concentric rings expanding outward like ripples in spacetime / gravitational waves.',
		code: `<div style="position: relative; height: 320px">
  <GravityRipple rings={5} period={4} />
</div>`,
		props: [
			{ name: 'rings', type: 'number', default: '5', desc: 'Simultaneous rings.' },
			{ name: 'period', type: 'number', default: '4', desc: 'Seconds per ring.' }
		]
	},
	{
		slug: 'space-beam',
		name: 'SpaceBeam',
		category: 'Motion',
		blurb: 'A light beam traveling a curved path between two elements — a comms link between stations.',
		code: `<SpaceBeam container={box} from={a} to={b} />`,
		props: [
			{ name: 'curvature', type: 'number', default: '-40', desc: 'Curve height (px).' },
			{ name: 'duration', type: 'number', default: '3', desc: 'Seconds per pulse.' },
			{ name: 'reverse', type: 'boolean', default: 'false', desc: 'Reverse direction.' }
		]
	},
	{
		slug: 'border-beam',
		name: 'BorderBeam',
		category: 'Motion',
		blurb: "A beam of light that orbits an element's border like a satellite tracing an orbit.",
		code: `<BorderBeam duration={6}>
  <div>Content</div>
</BorderBeam>`,
		props: [
			{ name: 'duration', type: 'number', default: '6', desc: 'Seconds per orbit.' },
			{ name: 'length', type: 'number', default: '0.2', desc: 'Beam length (0–1).' },
			{ name: 'borderWidth', type: 'number', default: '1.5', desc: 'Border thickness.' }
		]
	},
	{
		slug: 'shine-border',
		name: 'ShineBorder',
		category: 'Motion',
		blurb: 'A soft shine that sweeps around a border like starlight grazing a hull.',
		code: `<ShineBorder duration={8}>
  <div>Content</div>
</ShineBorder>`,
		props: [
			{ name: 'duration', type: 'number', default: '8', desc: 'Seconds per sweep.' },
			{ name: 'borderWidth', type: 'number', default: '1.5', desc: 'Border thickness.' }
		]
	},
	{
		slug: 'orbiting-bodies',
		name: 'OrbitingBodies',
		category: 'Motion',
		blurb: 'Satellites on a circular orbit around a center, evenly spaced and upright.',
		code: `<OrbitingBodies count={3} radius={120}>
  {#snippet body(i)}<div class="moon">{i}</div>{/snippet}
  <div class="planet" />
</OrbitingBodies>`,
		props: [
			{ name: 'count', type: 'number', default: '1', desc: 'Bodies on the orbit.' },
			{ name: 'radius', type: 'number', default: '120', desc: 'Orbit radius (px).' },
			{ name: 'duration', type: 'number', default: '20', desc: 'Seconds per revolution.' }
		]
	},
	{
		slug: 'marquee',
		name: 'Marquee',
		category: 'Motion',
		blurb: 'An infinite scrolling row with gradient fade edges — for logo walls and telemetry tickers.',
		code: `<Marquee duration={28} pauseOnHover>
  <span>SOL-3</span><span>KEPLER-22b</span><span>TRAPPIST-1e</span>
</Marquee>`,
		props: [
			{ name: 'duration', type: 'number', default: '28', desc: 'Seconds per loop.' },
			{ name: 'reverse', type: 'boolean', default: 'false', desc: 'Reverse direction.' },
			{ name: 'vertical', type: 'boolean', default: 'false', desc: 'Scroll vertically.' }
		]
	},
	{
		slug: 'shimmer-button',
		name: 'ShimmerButton',
		category: 'Interactive',
		blurb: 'A control with a shimmer of starlight traveling around its inner edge.',
		code: `<ShimmerButton>Launch</ShimmerButton>`,
		props: [
			{ name: 'shimmerDuration', type: 'number', default: '3', desc: 'Seconds per revolution.' },
			{ name: 'color', type: 'string', default: 'cold white', desc: 'Shimmer color.' }
		]
	},
	{
		slug: 'space-tabs',
		name: 'SpaceTabs',
		category: 'Interactive',
		blurb: 'A tab bar whose active indicator slides and morphs between tabs (measured FLIP).',
		code: `<SpaceTabs tabs={[{id:'a',label:'Orbit'},{id:'b',label:'Surface'}]} bind:active />`,
		props: [
			{ name: 'tabs', type: '{id,label}[]', default: '—', desc: 'Tabs to render.' },
			{ name: 'active', type: 'string', default: 'first', desc: 'Active id (bindable).' }
		]
	},
	{
		slug: 'hover-button',
		name: 'HoverButton',
		category: 'Interactive',
		blurb: 'A button that floods with cold light and reveals an arrow on hover, like a system arming.',
		code: `<HoverButton>Engage</HoverButton>`,
		props: [{ name: 'color', type: 'string', default: 'cold accent', desc: 'Flood color.' }]
	},
	{
		slug: 'space-subscribe',
		name: 'SpaceSubscribe',
		category: 'Interactive',
		blurb: 'A subscribe / newsletter control whose state labels dissipate into star dust.',
		code: `<SpaceSubscribe email onsubscribe={async (e) => await join(e)} />`,
		props: [
			{ name: 'email', type: 'boolean', default: 'false', desc: 'Show an email field.' },
			{ name: 'status', type: "'idle'|'loading'|'subscribed'", default: "'idle'", desc: 'State (bindable).' },
			{ name: 'onsubscribe', type: '(email?) => void', default: '—', desc: 'Submit handler.' }
		]
	},
	{
		slug: 'space-features',
		name: 'SpaceFeatures',
		category: 'Interactive',
		blurb: 'A bento-style feature grid built from gravity-reactive SpaceSurface cards.',
		code: `<SpaceFeatures columns={3} features={[
  { title: 'Lensing', body: 'Surfaces warp reality behind them.', icon: '◎' }
]} />`,
		props: [
			{ name: 'features', type: 'Feature[]', default: '—', desc: 'Cards to render.' },
			{ name: 'columns', type: 'number', default: '3', desc: 'Grid columns.' }
		]
	},
	{
		slug: 'space-card',
		name: 'SpaceCard',
		category: 'Material',
		blurb: 'The core content card carved from refractive space material, with a dissolve transition.',
		code: `<SpaceCard interactive resonant>
  <h3>Carved from spacetime</h3>
</SpaceCard>`,
		props: [
			{ name: 'interactive', type: 'boolean', default: 'true', desc: 'Gravity-well tilt.' },
			{ name: 'resonant', type: 'boolean', default: 'true', desc: 'Glow with neighbours.' },
			{ name: 'depth', type: '1 | 2 | 3 | 4', default: '2', desc: 'Dimensional plane.' }
		]
	},
	{
		slug: 'space-button',
		name: 'SpaceButton',
		category: 'Material',
		blurb: 'A gravity-reactive control carved from the same material; primary / surface / ghost.',
		code: `<SpaceButton variant="primary">Enter the void</SpaceButton>`,
		props: [
			{ name: 'variant', type: "'primary'|'surface'|'ghost'", default: "'surface'", desc: 'Visual weight.' },
			{ name: 'size', type: "'sm'|'md'|'lg'", default: "'md'", desc: 'Control size.' }
		]
	}
];

export const categories: Category[] = ['Signature', 'Backgrounds', 'Motion', 'Interactive', 'Material'];

export function entryBySlug(slug: string): Entry | undefined {
	return catalog.find((e) => e.slug === slug);
}
