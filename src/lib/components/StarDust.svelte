<script lang="ts">
	import { onMount } from 'svelte';
	import { onFrame, whenVisible } from '../core/raf.js';
	import { prefersReducedMotion, detectPerfTier } from '../core/env.js';
	import { trackPointer, getPointer, getMass } from '../core/spacetime.js';

	/**
	 * StarDust — an interactive field of fine star-dust motes. Particles drift
	 * through space and are pulled toward the cursor by the shared spacetime
	 * field, like dust falling into a gravity well. Monochrome by default with
	 * a few cold-accent motes.
	 */

	interface Props {
		/** Number of motes (auto-scaled by performance tier). Default: 160. */
		count?: number;
		/** Base drift speed. Default: 1. */
		speed?: number;
		/** Gravitational pull strength toward the cursor, 0–1. Default: 0.6. */
		gravity?: number;
		/** Mote color (CSS color). Default: cold star-white. */
		color?: string;
		/** Max mote radius in px. Default: 1.8. */
		size?: number;
		/** Extra class on the wrapper. */
		class?: string;
	}

	let {
		count = 160,
		speed = 1,
		gravity = 0.6,
		color = 'hsla(210, 16%, 88%, 1)',
		size = 1.8,
		class: className = ''
	}: Props = $props();

	let canvas: HTMLCanvasElement;
	let wrap: HTMLDivElement;

	onMount(() => {
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const reduced = prefersReducedMotion();
		const tier = detectPerfTier();
		const scale = tier === 'eco' ? 0.4 : tier === 'balanced' ? 0.7 : 1;
		trackPointer();

		let w = 0;
		let h = 0;
		let dpr = Math.min(window.devicePixelRatio || 1, 2);

		type P = { x: number; y: number; vx: number; vy: number; r: number; warm: boolean };
		let parts: P[] = [];

		function seed() {
			const n = Math.round(count * scale);
			parts = Array.from({ length: n }, () => ({
				x: Math.random() * w,
				y: Math.random() * h,
				vx: (Math.random() - 0.5) * 0.2 * speed,
				vy: (Math.random() - 0.5) * 0.2 * speed,
				r: Math.random() * size + 0.2,
				warm: Math.random() < 0.18
			}));
		}

		function resize() {
			w = wrap.clientWidth;
			h = wrap.clientHeight;
			dpr = Math.min(window.devicePixelRatio || 1, 2);
			canvas.width = w * dpr;
			canvas.height = h * dpr;
			canvas.style.width = w + 'px';
			canvas.style.height = h + 'px';
			ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
			if (parts.length === 0) seed();
		}

		function draw() {
			ctx!.clearRect(0, 0, w, h);
			const rect = wrap.getBoundingClientRect();
			const ptr = getPointer();
			const px = ptr.x - rect.left;
			const py = ptr.y - rect.top;
			const hasPtr = ptr.x > -9999;
			const g = gravity * getMass();

			for (const p of parts) {
				if (hasPtr && !reduced) {
					const dx = px - p.x;
					const dy = py - p.y;
					const d2 = dx * dx + dy * dy + 400;
					const force = (g * 60) / d2;
					p.vx += dx * force;
					p.vy += dy * force;
				}
				p.vx *= 0.96;
				p.vy *= 0.96;
				p.x += p.vx * speed;
				p.y += p.vy * speed;

				// wrap around edges
				if (p.x < 0) p.x += w;
				else if (p.x > w) p.x -= w;
				if (p.y < 0) p.y += h;
				else if (p.y > h) p.y -= h;

				ctx!.beginPath();
				ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
				ctx!.fillStyle = p.warm ? 'hsla(212, 90%, 80%, 0.9)' : color;
				ctx!.fill();
			}
		}

		resize();
		seed();
		draw();

		const ro = new ResizeObserver(resize);
		ro.observe(wrap);

		let visible = true;
		const stopVisible = whenVisible(wrap, (v) => (visible = v));
		const stopFrame = reduced
			? () => {}
			: onFrame(() => {
					if (visible) draw();
				});

		return () => {
			stopFrame();
			stopVisible();
			ro.disconnect();
		};
	});
</script>

<div bind:this={wrap} class="sm-stardust {className}" aria-hidden="true">
	<canvas bind:this={canvas}></canvas>
</div>

<style>
	.sm-stardust {
		position: absolute;
		inset: 0;
		overflow: hidden;
		pointer-events: none;
	}
	.sm-stardust canvas {
		position: absolute;
		inset: 0;
	}
</style>
