<script lang="ts">
	import { onMount } from 'svelte';
	import { onFrame, whenVisible } from '../core/raf.js';
	import { prefersReducedMotion } from '../core/env.js';
	import { trackPointer, getPointer } from '../core/spacetime.js';

	/**
	 * Constellation — a background grid of stars (circles) wired into
	 * constellations. Nearby points connect with faint lines; stars near the
	 * cursor brighten and link more strongly, like a constellation lighting up.
	 *
	 * (The space-native reimagining of a "background boxes" grid.)
	 */

	interface Props {
		/** Grid spacing in px. Default: 56. */
		gap?: number;
		/** Star dot radius in px. Default: 1.6. */
		dotSize?: number;
		/** Max distance (px) at which two stars link. Default: 80. */
		linkDistance?: number;
		/** Reveal radius (px) around the cursor. Default: 220. */
		reveal?: number;
		/** Line/dot color components (HSL). Default cold silver '210 16% 80%'. */
		color?: string;
		/** Extra class on the wrapper. */
		class?: string;
	}

	let {
		gap = 56,
		dotSize = 1.6,
		linkDistance = 80,
		reveal = 220,
		color = '210 16% 80%',
		class: className = ''
	}: Props = $props();

	let canvas: HTMLCanvasElement;
	let wrap: HTMLDivElement;

	onMount(() => {
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		const reduced = prefersReducedMotion();
		trackPointer();

		let w = 0;
		let h = 0;
		let dpr = Math.min(window.devicePixelRatio || 1, 2);
		type Node = { x: number; y: number; tw: number };
		let nodes: Node[] = [];

		function seed() {
			nodes = [];
			for (let y = gap / 2; y < h; y += gap) {
				for (let x = gap / 2; x < w; x += gap) {
					nodes.push({
						x: x + (Math.random() - 0.5) * gap * 0.4,
						y: y + (Math.random() - 0.5) * gap * 0.4,
						tw: Math.random() * Math.PI * 2
					});
				}
			}
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
			seed();
		}

		let t = 0;
		function draw() {
			t += 0.01;
			ctx!.clearRect(0, 0, w, h);
			const rect = wrap.getBoundingClientRect();
			const ptr = getPointer();
			const px = ptr.x - rect.left;
			const py = ptr.y - rect.top;
			const hasPtr = ptr.x > -9999;

			// Links between near neighbours, brighter near the cursor.
			for (let i = 0; i < nodes.length; i++) {
				const a = nodes[i];
				const near = hasPtr ? Math.max(0, 1 - Math.hypot(px - a.x, py - a.y) / reveal) : 0.18;
				for (let j = i + 1; j < nodes.length; j++) {
					const b = nodes[j];
					const d = Math.hypot(a.x - b.x, a.y - b.y);
					if (d < linkDistance) {
						const nearB = hasPtr
							? Math.max(0, 1 - Math.hypot(px - b.x, py - b.y) / reveal)
							: 0.18;
						const alpha = (1 - d / linkDistance) * Math.max(near, nearB) * 0.5;
						if (alpha < 0.01) continue;
						ctx!.beginPath();
						ctx!.moveTo(a.x, a.y);
						ctx!.lineTo(b.x, b.y);
						ctx!.strokeStyle = `hsla(${color}, ${alpha.toFixed(3)})`;
						ctx!.lineWidth = 1;
						ctx!.stroke();
					}
				}
			}

			// Stars.
			for (const n of nodes) {
				const near = hasPtr ? Math.max(0, 1 - Math.hypot(px - n.x, py - n.y) / reveal) : 0.25;
				const tw = reduced ? 1 : 0.6 + 0.4 * Math.sin(t + n.tw);
				const alpha = (0.2 + near * 0.8) * tw;
				ctx!.beginPath();
				ctx!.arc(n.x, n.y, dotSize, 0, Math.PI * 2);
				ctx!.fillStyle = `hsla(${color}, ${alpha.toFixed(3)})`;
				ctx!.fill();
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

<div bind:this={wrap} class="sm-constellation {className}" aria-hidden="true">
	<canvas bind:this={canvas}></canvas>
</div>

<style>
	.sm-constellation {
		position: absolute;
		inset: 0;
		overflow: hidden;
		pointer-events: none;
	}
	.sm-constellation canvas {
		position: absolute;
		inset: 0;
	}
</style>
