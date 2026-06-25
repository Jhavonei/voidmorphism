<script lang="ts">
	import SpaceSurface from './SpaceSurface.svelte';
	import { dissolve } from '../transitions/dissolve.js';
	import { fade } from 'svelte/transition';

	/**
	 * SpaceModal — a foreground dimensional anomaly. It uses the deep refractive
	 * lens to pull the entire interface behind it inward, with a gravitational
	 * scrim darkening the surrounding void. Closes on Escape or scrim click.
	 */

	interface Props {
		/** Whether the modal is open (bindable). */
		open?: boolean;
		/** Width of the modal. Default: 'min(90vw, 480px)'. */
		width?: string;
		/** Close when the scrim is clicked. Default: true. */
		dismissable?: boolean;
		children?: import('svelte').Snippet;
		[key: string]: any;
	}

	let {
		open = $bindable(false),
		width = 'min(90vw, 480px)',
		dismissable = true,
		children,
		...rest
	}: Props = $props();

	function close() {
		if (dismissable) open = false;
	}

	function onKey(e: KeyboardEvent) {
		if (e.key === 'Escape') close();
	}
</script>

<svelte:window onkeydown={onKey} />

{#if open}
	<div class="sm-modal-scrim" transition:fade={{ duration: 280 }}>
		<button
			class="sm-modal-scrim-hit"
			aria-label="Close modal"
			onclick={close}
			tabindex="-1"
		></button>
		<div class="sm-modal-pos" transition:dissolve={{ duration: 520, color: '150, 195, 255' }}>
			<SpaceSurface
				depth={3}
				deep
				bloom
				resonant
				radius="var(--sm-radius-lg)"
				padding="2rem"
				role="dialog"
				aria-modal="true"
				style={`width: ${width};`}
				{...rest}
			>
				{@render children?.()}
			</SpaceSurface>
		</div>
	</div>
{/if}

<style>
	.sm-modal-scrim {
		position: fixed;
		inset: 0;
		z-index: 1000;
		display: grid;
		place-items: center;
		/* Gravitational scrim: the void deepens around the anomaly. */
		background: radial-gradient(
			120% 120% at 50% 50%,
			hsla(220, 50%, 3%, 0.5) 0%,
			hsla(220, 60%, 1%, 0.88) 100%
		);
		-webkit-backdrop-filter: blur(4px) brightness(0.6);
		backdrop-filter: blur(4px) brightness(0.6);
		padding: 1.5rem;
	}

	.sm-modal-scrim-hit {
		position: absolute;
		inset: 0;
		border: none;
		background: transparent;
		cursor: pointer;
	}

	.sm-modal-pos {
		position: relative;
		z-index: 1;
	}
</style>
