<script lang="ts">
	import { gravityWell } from '../actions/gravityWell.js';
	import { resonance } from '../actions/resonance.js';

	/**
	 * VoidSurface — the base material primitive of Voidmorphism.
	 *
	 * Everything (cards, panels, modals, buttons) is grown from this one
	 * continuous cosmic substance. It provides: refractive void distortion,
	 * borderless event-horizon edges, layered depth, gravity-well interaction,
	 * and resonance lighting.
	 *
	 * Requires <VoidFilters /> mounted once at the app root and the stylesheet
	 * imported: `import 'svelte-voidmorphism/styles';`
	 */

	type Depth = 1 | 2 | 3 | 4;

	interface Props {
		/** Element tag to render. Default: 'div'. */
		as?: string;
		/** Dimensional plane (controls blur + refraction strength). Default: 2. */
		depth?: Depth;
		/** Border radius. Default: 'var(--vm-radius)'. */
		radius?: string;
		/** Padding. Default: '1.5rem'. */
		padding?: string;
		/** Apply SVG gravitational-lensing refraction to the backdrop. Default: true. */
		refract?: boolean;
		/** Use the deep lens (stronger pull) — for modals/foreground. Default: false. */
		deep?: boolean;
		/** React to the cursor: tilt + light attraction (gravity well). Default: false. */
		interactive?: boolean;
		/** Max tilt in degrees when interactive. Default: 6. */
		tilt?: number;
		/** Emit celestial void bloom. Default: false. */
		bloom?: boolean;
		/** Glow in unison with nearby elements (shared energy field). Default: false. */
		resonant?: boolean;
		/** Optional resonance color as HSL components, e.g. '190 95% 60%'. */
		resonanceColor?: string;
		/** Weightless idle drift. Default: false. */
		drift?: boolean;
		/** Extra classes. */
		class?: string;
		/** Inline style passthrough. */
		style?: string;
		children?: import('svelte').Snippet;
		[key: string]: unknown;
	}

	let {
		as = 'div',
		depth = 2,
		radius = 'var(--vm-radius)',
		padding = '1.5rem',
		refract = true,
		deep = false,
		interactive = false,
		tilt = 6,
		bloom = false,
		resonant = false,
		resonanceColor = '',
		drift = false,
		class: className = '',
		style = '',
		children,
		...rest
	}: Props = $props();

	const filterId = $derived(deep ? 'vm-refract-deep' : depth === 1 ? 'vm-refract-soft' : 'vm-refract');

	const composedStyle = $derived(
		`border-radius: ${radius}; padding: ${padding};` +
			(refract ? ` --vm-filter: url('#${filterId}');` : '') +
			(bloom || resonant ? ' box-shadow: var(--vm-resonance, 0 0 0 0 transparent), 0 1px 0 0 var(--vm-rim) inset, 0 -24px 48px -28px var(--vm-horizon) inset, 0 30px 70px -32px var(--vm-cast);' : '') +
			(style ? ' ' + style : '')
	);
</script>

<svelte:element
	this={as}
	class="vm-surface vm-depth-{depth} {bloom ? 'vm-bloom' : ''} {drift ? 'vm-drift' : ''} {className}"
	style={composedStyle}
	data-vm-refract={refract ? '' : undefined}
	data-vm-interactive={interactive ? '' : undefined}
	use:gravityWell={{ tilt, disabled: !interactive }}
	use:resonance={{ disabled: !resonant, color: resonanceColor }}
	{...rest}
>
	{@render children?.()}
</svelte:element>
