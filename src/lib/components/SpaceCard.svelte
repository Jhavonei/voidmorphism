<script lang="ts">
	import SpaceSurface from './SpaceSurface.svelte';
	import { dissolve } from '../transitions/dissolve.js';
	import { type EasingFunction, easeOutExpo } from '../transitions/easing.js';

	/**
	 * SpaceCard — a Spacemorphism content card carved from refractive void matter.
	 * Built on <SpaceSurface />, it adds a void-dissolve enter/exit transition.
	 */

	interface Props {
		/** Whether the card is mounted (drives the void-dissolve transition). */
		visible?: boolean;
		/** Dissolve transition duration in ms. Default: 800. */
		duration?: number;
		/** Easing for the dissolve. */
		easing?: EasingFunction;
		/** Dimensional plane (blur + refraction strength). Default: 2. */
		depth?: 1 | 2 | 3 | 4;
		/** React to the cursor (tilt + light attraction). Default: true. */
		interactive?: boolean;
		/** Glow in unison with nearby elements. Default: true. */
		resonant?: boolean;
		/** Emit celestial void bloom. Default: false. */
		bloom?: boolean;
		/** Card padding. Default: '2rem'. */
		padding?: string;
		/** Border radius. Default: 'var(--sm-radius)'. */
		radius?: string;
		/** Card width. Default: 'auto'. */
		width?: string;
		/** Dissolve glow color (RGB string). Default: cold star-white '150, 195, 255'. */
		glow?: string;
		children?: import('svelte').Snippet;
		[key: string]: any;
	}

	let {
		visible = true,
		duration = 800,
		easing = easeOutExpo,
		depth = 2,
		interactive = true,
		resonant = true,
		bloom = false,
		padding = '2rem',
		radius = 'var(--sm-radius)',
		width = 'auto',
		glow = '150, 195, 255',
		children,
		...restProps
	}: Props = $props();
</script>

{#if visible}
	<div transition:dissolve={{ duration, easing, color: glow }} style="width: {width};">
		<SpaceSurface {depth} {interactive} {resonant} {bloom} {padding} {radius} {...restProps}>
			{@render children?.()}
		</SpaceSurface>
	</div>
{/if}
