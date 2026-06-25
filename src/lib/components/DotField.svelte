<script lang="ts">
	import { onMount } from 'svelte';
	import { onFrame, whenVisible } from '../core/raf.js';
	import { prefersReducedMotion } from '../core/env.js';
	import { trackPointer, getPointer } from '../core/spacetime.js';

	/**
	 * DotField — a crisp dot-grid background (pure CSS). With `mask`, the dots
	 * only reveal in a soft radius around the cursor, like sensors lighting up.
	 */

	interface Props {
		/** Grid spacing in px. Default: 24. */
		gap?: number;
		/** Dot radius in px. Default: 1. */
		dotSize?: number;
		/** Reveal dots only near the cursor. Default: true. */
		mask?: boolean;
		/** Reveal radius in px (when masked). Default: 240. */
		reveal?: number;
		/** Dot color. Default: cold silver. */
		color?: string;
		/** Extra class on the wrapper. */
		class?: string;
	}

	let {
		gap = 24,
		dotSize = 1,
		mask = true,
		reveal = 240,
		color = 'hsla(210, 14%, 70%, 0.5)',
		class: className = ''
	}: Props = $props();

	let wrap: HTMLDivElement;

	onMount(() => {
		if (!mask) return;
		const reduced = prefersReducedMotion();
		trackPointer();
		// center the mask if reduced motion (no follow)
		if (reduced) {
			wrap.style.setProperty('--sm-dot-x', '50%');
			wrap.style.setProperty('--sm-dot-y', '50%');
			return;
		}
		let visible = true;
		const stopVisible = whenVisible(wrap, (v) => (visible = v));
		const stopFrame = onFrame(() => {
			if (!visible) return;
			const ptr = getPointer();
			if (ptr.x < -9999) return;
			const rect = wrap.getBoundingClientRect();
			wrap.style.setProperty('--sm-dot-x', `${ptr.x - rect.left}px`);
			wrap.style.setProperty('--sm-dot-y', `${ptr.y - rect.top}px`);
		});
		return () => {
			stopFrame();
			stopVisible();
		};
	});
</script>

<div
	bind:this={wrap}
	class="sm-dotfield {className}"
	class:sm-masked={mask}
	aria-hidden="true"
	style="--sm-dot-gap: {gap}px; --sm-dot-size: {dotSize}px; --sm-dot-color: {color}; --sm-dot-reveal: {reveal}px;"
></div>

<style>
	.sm-dotfield {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background-image: radial-gradient(
			var(--sm-dot-color) var(--sm-dot-size),
			transparent var(--sm-dot-size)
		);
		background-size: var(--sm-dot-gap) var(--sm-dot-gap);
		background-position: center;
	}

	.sm-masked {
		-webkit-mask: radial-gradient(
			circle var(--sm-dot-reveal) at var(--sm-dot-x, 50%) var(--sm-dot-y, 50%),
			#000 0%,
			transparent 100%
		);
		mask: radial-gradient(
			circle var(--sm-dot-reveal) at var(--sm-dot-x, 50%) var(--sm-dot-y, 50%),
			#000 0%,
			transparent 100%
		);
	}
</style>
