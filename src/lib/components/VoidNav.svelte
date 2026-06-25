<script lang="ts">
	import VoidSurface from './VoidSurface.svelte';

	/**
	 * VoidNav — a floating navigation bar grown from the same void substance.
	 * Borderless, resonant, and weightless. Drop links/brand in as children.
	 */

	interface Props {
		/** Stick to the top of the viewport. Default: false. */
		sticky?: boolean;
		/** Border radius. Default: 'var(--vm-radius-pill)'. */
		radius?: string;
		children?: import('svelte').Snippet;
		[key: string]: any;
	}

	let { sticky = false, radius = 'var(--vm-radius-pill)', children, ...rest }: Props = $props();
</script>

<nav class="vm-nav-outer" class:sticky>
	<VoidSurface
		depth={2}
		resonant
		{radius}
		padding="0.6rem 1.1rem"
		class="vm-nav"
		{...rest}
	>
		{@render children?.()}
	</VoidSurface>
</nav>

<style>
	.vm-nav-outer {
		width: 100%;
		display: flex;
		justify-content: center;
	}

	.vm-nav-outer.sticky {
		position: sticky;
		top: 1rem;
		z-index: 100;
	}

	:global(.vm-nav) {
		display: flex;
		align-items: center;
		gap: 1.25rem;
	}
</style>
