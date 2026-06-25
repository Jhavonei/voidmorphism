<script lang="ts">
	import { onMount } from 'svelte';
	import { onFrame, whenVisible } from '../core/raf.js';
	import { prefersReducedMotion, detectPerfTier } from '../core/env.js';

	/**
	 * StarGrid — a grid of cells that flicker like distant stars. Optionally a
	 * circular "dead zone" (a black hole) swallows the light at its center, the
	 * cells fading to nothing inside the event horizon.
	 */

	interface Props {
		/** Cell size in px. Default: 4. */
		squareSize?: number;
		/** Gap between cells in px. Default: 6. */
		gap?: number;
		/** Per-frame chance a cell changes brightness, 0–1. Default: 0.08. */
		flickerChance?: number;
		/** Cell color components (HSL). Default cold silver. */
		color?: string;
		/** Maximum lit opacity. Default: 0.4. */
		maxOpacity?: number;
		/** Render a central black-hole dead zone. Default: false. */
		deadZone?: boolean;
		/** Extra class on the wrapper. */
		class?: string;
	}

	let {
		squareSize = 4,
		gap = 6,
		flickerChance = 0.08,
		color = '210 16% 86%',
		maxOpacity = 0.4,
		deadZone = false,
		class: className = ''
	}: Props = $props();

	let canvas: HTMLCanvasElement;
	let wrap: HTMLDivElement;

	onMount(() => {
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		const reduced = prefersReducedMotion();
		const tier = detectPerfTier();
		const chance = tier === 'eco' ? flickerChance * 0.4 : flickerChance;

		let w = 0;
		let h = 0;
		let dpr = Math.min(window.devicePixelRatio || 1, 2);
		const cell = squareSize + gap;
		let cols = 0;
		let rows = 0;
		let grid: Float32Array = new Float32Array(0);

		function resize() {
			w = wrap.clientWidth;
			h = wrap.clientHeight;
			dpr = Math.min(window.devicePixelRatio || 1, 2);
			canvas.width = w * dpr;
			canvas.height = h * dpr;
			canvas.style.width = w + 'px';
			canvas.style.height = h + 'px';
			ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
			cols = Math.ceil(w / cell);
			rows = Math.ceil(h / cell);
			grid = new Float32Array(cols * rows);
			for (let i = 0; i < grid.length; i++) grid[i] = Math.random() * maxOpacity;
		}

		const cx = () => w / 2;
		const cy = () => h * 0.42;
		const holeR = () => Math.min(w, h) * 0.22;

		function draw() {
			ctx!.clearRect(0, 0, w, h);
			for (let r = 0; r < rows; r++) {
				for (let c = 0; c < cols; c++) {
					const idx = r * cols + c;
					if (!reduced && Math.random() < chance) {
						grid[idx] = Math.random() * maxOpacity;
					}
					let a = grid[idx];
					const x = c * cell;
					const y = r * cell;
					if (deadZone) {
						const d = Math.hypot(x - cx(), y - cy());
						const hr = holeR();
						if (d < hr) a *= Math.max(0, (d / hr - 0.35) / 0.65);
					}
					if (a < 0.01) continue;
					ctx!.fillStyle = `hsla(${color}, ${a.toFixed(3)})`;
					ctx!.fillRect(x, y, squareSize, squareSize);
				}
			}
		}

		resize();
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

<div bind:this={wrap} class="sm-stargrid {className}" aria-hidden="true">
	<canvas bind:this={canvas}></canvas>
</div>

<style>
	.sm-stargrid {
		position: absolute;
		inset: 0;
		overflow: hidden;
		pointer-events: none;
	}
	.sm-stargrid canvas {
		position: absolute;
		inset: 0;
	}
</style>
