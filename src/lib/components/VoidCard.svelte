<script lang="ts">
	import VoidSurface from './VoidSurface.svelte';
	import { voidDissolve } from '../transitions/voidDissolve.js';
	import { type EasingFunction, easeOutExpo } from '../transitions/easing.js';

	/**
	 * VoidCard — a Voidmorphism content card carved from refractive void matter.
	 * Built on <VoidSurface />, it adds a void-dissolve enter/exit transition.
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
		/** Border radius. Default: 'var(--vm-radius)'. */
		radius?: string;
		/** Card width. Default: 'auto'. */
		width?: string;
		/** Void dissolve glow color (RGB string). Default: '170, 110, 255'. */
		voidColor?: string;
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
		radius = 'var(--vm-radius)',
		width = 'auto',
		voidColor = '170, 110, 255',
		children,
		...restProps
	}: Props = $props();
</script>

{#if visible}
	<div transition:voidDissolve={{ duration, easing, voidColor }} style="width: {width};">
		<VoidSurface {depth} {interactive} {resonant} {bloom} {padding} {radius} {...restProps}>
			{@render children?.()}
		</VoidSurface>
	</div>
{/if}
