<script lang="ts">
	import { onMount } from 'svelte';
	import { onFrame } from '../core/raf.js';
	import { prefersReducedMotion } from '../core/env.js';
	import { trackPointer, getPointer, setMass } from '../core/spacetime.js';

	/**
	 * CometCursor — a global custom cursor rendered as a light source / comet
	 * with a decaying trail. It is the visible "mass" of the spacetime field;
	 * star-dust and surfaces react to it. Touch devices keep the native cursor.
	 *
	 * Mount once near the app root (after SpaceField).
	 */

	interface Props {
		/** Core radius in px. Default: 7. */
		size?: number;
		/** Trail length (sampled points). Default: 18. */
		trail?: number;
		/** Core color (CSS color). Default: cold star-white. */
		color?: string;
		/** Hide the native cursor while active. Default: true. */
		hideNative?: boolean;
	}

	let {
		size = 7,
		trail = 18,
		color = 'hsla(210, 60%, 96%, 1)',
		hideNative = true
	}: Props = $props();

	let canvas: HTMLCanvasElement;

	onMount(() => {
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		// Coarse pointers (touch) keep the native cursor.
		const coarse = window.matchMedia?.('(pointer: coarse)').matches;
		if (coarse) return;

		const reduced = prefersReducedMotion();
		trackPointer();
		setMass(1.4);

		let w = 0;
		let h = 0;
		let dpr = Math.min(window.devicePixelRatio || 1, 2);

		function resize() {
			w = window.innerWidth;
			h = window.innerHeight;
			dpr = Math.min(window.devicePixelRatio || 1, 2);
			canvas.width = w * dpr;
			canvas.height = h * dpr;
			canvas.style.width = w + 'px';
			canvas.style.height = h + 'px';
			ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
		}
		resize();
		window.addEventListener('resize', resize);

		if (hideNative) document.documentElement.style.cursor = 'none';

		const points: { x: number; y: number }[] = [];

		const stop = onFrame(() => {
			const { x, y, vx, vy } = getPointer();
			if (x < -9999) return; // pointer not seen yet

			// Track the head, build a fading trail.
			points.push({ x, y });
			while (points.length > trail) points.shift();

			ctx!.clearRect(0, 0, w, h);

			// Speed stretches the comet a little — like a body whipping through space.
			const speed = Math.min(Math.hypot(vx, vy), 4);

			if (!reduced) {
				// Trail: older points smaller + fainter.
				for (let i = 0; i < points.length; i++) {
					const p = points[i];
					const f = i / points.length; // 0 (old) → 1 (new)
					const r = size * (0.25 + f * 0.7);
					ctx!.beginPath();
					ctx!.arc(p.x, p.y, r, 0, Math.PI * 2);
					ctx!.fillStyle = `hsla(212, 80%, 80%, ${(f * f * 0.28).toFixed(3)})`;
					ctx!.fill();
				}
			}

			// Glow halo.
			const halo = ctx!.createRadialGradient(x, y, 0, x, y, size * (3 + speed));
			halo.addColorStop(0, 'hsla(210, 80%, 92%, 0.5)');
			halo.addColorStop(0.4, 'hsla(212, 90%, 78%, 0.22)');
			halo.addColorStop(1, 'hsla(212, 90%, 70%, 0)');
			ctx!.beginPath();
			ctx!.arc(x, y, size * (3 + speed), 0, Math.PI * 2);
			ctx!.fillStyle = halo;
			ctx!.fill();

			// Bright core.
			ctx!.beginPath();
			ctx!.arc(x, y, size * 0.5, 0, Math.PI * 2);
			ctx!.fillStyle = color;
			ctx!.fill();
		});

		return () => {
			stop();
			window.removeEventListener('resize', resize);
			if (hideNative) document.documentElement.style.cursor = '';
		};
	});
</script>

<canvas bind:this={canvas} class="sm-comet" aria-hidden="true"></canvas>

<style>
	.sm-comet {
		position: fixed;
		inset: 0;
		z-index: 9999;
		pointer-events: none;
	}
</style>
