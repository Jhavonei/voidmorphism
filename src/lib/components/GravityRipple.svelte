<script lang="ts">
	import { onMount } from 'svelte';
	import { onFrame, whenVisible } from '../core/raf.js';
	import { prefersReducedMotion } from '../core/env.js';

	/**
	 * GravityRipple — concentric rings expanding from a center, like ripples in
	 * spacetime / gravitational waves. Pure canvas, monochrome with a cold core.
	 */

	interface Props {
		/** Number of simultaneous rings. Default: 5. */
		rings?: number;
		/** Seconds for a ring to travel from center to edge. Default: 4. */
		period?: number;
		/** Center X as a fraction 0–1. Default: 0.5. */
		originX?: number;
		/** Center Y as a fraction 0–1. Default: 0.5. */
		originY?: number;
		/** Ring color components (HSL). Default cold accent. */
		color?: string;
		/** Extra class on the wrapper. */
		class?: string;
	}

	let {
		rings = 5,
		period = 4,
		originX = 0.5,
		originY = 0.5,
		color = '212 80% 76%',
		class: className = ''
	}: Props = $props();

	let canvas: HTMLCanvasElement;
	let wrap: HTMLDivElement;

	onMount(() => {
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		const reduced = prefersReducedMotion();

		let w = 0;
		let h = 0;
		let dpr = Math.min(window.devicePixelRatio || 1, 2);
		let start = performance.now();

		function resize() {
			w = wrap.clientWidth;
			h = wrap.clientHeight;
			dpr = Math.min(window.devicePixelRatio || 1, 2);
			canvas.width = w * dpr;
			canvas.height = h * dpr;
			canvas.style.width = w + 'px';
			canvas.style.height = h + 'px';
			ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
		}

		function render(now: number) {
			ctx!.clearRect(0, 0, w, h);
			const ox = w * originX;
			const oy = h * originY;
			const maxR = Math.hypot(Math.max(ox, w - ox), Math.max(oy, h - oy));
			const elapsed = (now - start) / 1000;
			for (let i = 0; i < rings; i++) {
				const phase = ((elapsed / period + i / rings) % 1 + 1) % 1;
				const r = phase * maxR;
				const alpha = (1 - phase) * 0.4;
				if (alpha < 0.01 || r < 1) continue;
				ctx!.beginPath();
				ctx!.arc(ox, oy, r, 0, Math.PI * 2);
				ctx!.strokeStyle = `hsla(${color}, ${alpha.toFixed(3)})`;
				ctx!.lineWidth = 1.5;
				ctx!.stroke();
			}
		}

		resize();
		render(performance.now());
		const ro = new ResizeObserver(resize);
		ro.observe(wrap);

		let visible = true;
		const stopVisible = whenVisible(wrap, (v) => (visible = v));
		const stopFrame = reduced
			? () => {}
			: onFrame((now) => {
					if (visible) render(now);
				});

		return () => {
			stopFrame();
			stopVisible();
			ro.disconnect();
		};
	});
</script>

<div bind:this={wrap} class="sm-ripple {className}" aria-hidden="true">
	<canvas bind:this={canvas}></canvas>
</div>

<style>
	.sm-ripple {
		position: absolute;
		inset: 0;
		overflow: hidden;
		pointer-events: none;
	}
	.sm-ripple canvas {
		position: absolute;
		inset: 0;
	}
</style>
