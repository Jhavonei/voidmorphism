<script lang="ts">
	import SpaceSurface from './SpaceSurface.svelte';

	/**
	 * SpacePanel — a large, calm region of void matter for layout sections,
	 * sidebars, and surfaces that other components rest within. Lower depth and
	 * a wider radius help it read as the continuous substrate everything else is
	 * grown from.
	 */

	interface Props {
		/** Dimensional plane. Default: 1 (sits behind cards/buttons). */
		depth?: 1 | 2 | 3 | 4;
		/** Padding. Default: '2.5rem'. */
		padding?: string;
		/** Border radius. Default: 'var(--sm-radius-lg)'. */
		radius?: string;
		/** Glow in unison with nearby elements. Default: false. */
		resonant?: boolean;
		/** Weightless idle drift. Default: false. */
		drift?: boolean;
		children?: import('svelte').Snippet;
		[key: string]: any;
	}

	let {
		depth = 1,
		padding = '2.5rem',
		radius = 'var(--sm-radius-lg)',
		resonant = false,
		drift = false,
		children,
		...rest
	}: Props = $props();
</script>

<SpaceSurface {depth} {padding} {radius} {resonant} {drift} {...rest}>
	{@render children?.()}
</SpaceSurface>
