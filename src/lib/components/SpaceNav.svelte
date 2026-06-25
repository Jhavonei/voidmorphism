<script lang="ts">
	import SpaceSurface from './SpaceSurface.svelte';

	/**
	 * SpaceNav — a floating navigation bar grown from the same void substance.
	 * Borderless, resonant, and weightless. Drop links/brand in as children.
	 */

	interface Props {
		/** Stick to the top of the viewport. Default: false. */
		sticky?: boolean;
		/** Border radius. Default: 'var(--sm-radius-pill)'. */
		radius?: string;
		children?: import('svelte').Snippet;
		[key: string]: any;
	}

	let { sticky = false, radius = 'var(--sm-radius-pill)', children, ...rest }: Props = $props();
</script>

<nav class="sm-nav-outer" class:sticky>
	<SpaceSurface
		depth={2}
		resonant
		{radius}
		padding="0.6rem 1.1rem"
		class="sm-nav"
		{...rest}
	>
		{@render children?.()}
	</SpaceSurface>
</nav>

<style>
	.sm-nav-outer {
		width: 100%;
		display: flex;
		justify-content: center;
	}

	.sm-nav-outer.sticky {
		position: sticky;
		top: 1rem;
		z-index: 100;
	}

	:global(.sm-nav) {
		display: flex;
		align-items: center;
		gap: 1.25rem;
	}
</style>
