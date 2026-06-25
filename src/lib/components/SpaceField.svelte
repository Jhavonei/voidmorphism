<script lang="ts">
	import { onMount } from 'svelte';

	/**
	 * SpaceField — the infinite black foundation.
	 *
	 * Renders interstellar depth behind your interface: OLED-black base, a slow
	 * drifting nebula, a parallax starfield, and a faint gravitational vignette.
	 * It is fixed and non-interactive — place it once at the back of your app.
	 */

	interface Props {
		/** Number of stars. Default: 160. */
		stars?: number;
		/** Nebula hue (matches --sm-matter-h by default). Default: 270. */
		hue?: number;
		/** Parallax strength in px as the pointer moves. Default: 18. */
		parallax?: number;
		/** Overall opacity of the cosmic detail. Default: 1. */
		intensity?: number;
	}

	let { stars = 160, hue = 270, parallax = 18, intensity = 1 }: Props = $props();

	let canvas: HTMLCanvasElement;
	let wrap: HTMLDivElement;

	onMount(() => {
		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const ctx = canvas.getContext('2d')!;

		// Track the active theme so stars invert on the light "bright nebula".
		const root = document.documentElement;
		let light = root.dataset.vmTheme === 'light';
		const themeObserver = new MutationObserver(() => {
			light = root.dataset.vmTheme === 'light';
		});
		themeObserver.observe(root, { attributes: true, attributeFilter: ['data-sm-theme'] });

		let w = 0;
		let h = 0;
		let dpr = Math.min(window.devicePixelRatio || 1, 2);
		let raf = 0;
		let t = 0;

		type Star = { x: number; y: number; z: number; r: number; tw: number };
		let field: Star[] = [];

		function seed() {
			field = Array.from({ length: stars }, () => ({
				x: Math.random(),
				y: Math.random(),
				z: Math.random() * 0.9 + 0.1, // depth → size + parallax + brightness
				r: Math.random() * 1.4 + 0.2,
				tw: Math.random() * Math.PI * 2 // twinkle phase
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
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		}

		let px = 0;
		let py = 0;
		let tpx = 0;
		let tpy = 0;
		function onMove(e: PointerEvent) {
			tpx = (e.clientX / window.innerWidth - 0.5) * 2;
			tpy = (e.clientY / window.innerHeight - 0.5) * 2;
		}

		function draw() {
			px += (tpx - px) * 0.05;
			py += (tpy - py) * 0.05;
			t += 0.006;

			ctx.clearRect(0, 0, w, h);

			for (const s of field) {
				const ox = px * parallax * s.z;
				const oy = py * parallax * s.z;
				const x = s.x * w + ox;
				const y = s.y * h + oy;
				const twinkle = 0.55 + 0.45 * Math.sin(t * 1.6 + s.tw);
				const alpha = s.z * twinkle * intensity;
				ctx.beginPath();
				ctx.arc(x, y, s.r * (0.6 + s.z), 0, Math.PI * 2);
				// Light theme: dark violet specks. Dark theme: luminous gold-white stars.
				ctx.fillStyle = light
					? `hsla(${hue}, 45%, ${28 + s.z * 14}%, ${alpha * 0.5})`
					: `hsla(${hue + 20}, 80%, ${80 + s.z * 16}%, ${alpha})`;
				ctx.fill();
			}

			if (!reduced) raf = requestAnimationFrame(draw);
		}

		seed();
		resize();
		draw();

		const ro = new ResizeObserver(resize);
		ro.observe(wrap);
		window.addEventListener('pointermove', onMove, { passive: true });

		return () => {
			cancelAnimationFrame(raf);
			ro.disconnect();
			themeObserver.disconnect();
			window.removeEventListener('pointermove', onMove);
		};
	});
</script>

<div
	bind:this={wrap}
	class="sm-field"
	aria-hidden="true"
	style="--sm-field-hue: {hue}; --sm-field-intensity: {intensity};"
>
	<div class="sm-nebula"></div>
	<canvas bind:this={canvas} class="sm-stars"></canvas>
	<div class="sm-vignette"></div>
</div>

<style>
	.sm-field {
		position: fixed;
		inset: 0;
		z-index: -1;
		overflow: hidden;
		background:
			radial-gradient(
				120% 120% at 50% -10%,
				hsla(var(--sm-field-hue), 60%, 12%, 0.45) 0%,
				transparent 55%
			),
			var(--sm-void, #07040f);
		pointer-events: none;
		transition: background 0.6s ease;
	}

	/* Drifting nebula — deep, atmospheric, never gray. */
	.sm-nebula {
		position: absolute;
		inset: -20%;
		opacity: calc(0.7 * var(--sm-field-intensity));
		background:
			/* violet core */
			radial-gradient(
				40% 50% at 22% 30%,
				hsla(var(--sm-field-hue), 85%, 24%, 0.5) 0%,
				transparent 60%
			),
			/* magenta drift */
			radial-gradient(
				45% 45% at 80% 25%,
				hsla(calc(var(--sm-field-hue) + 30), 80%, 20%, 0.42) 0%,
				transparent 60%
			),
			/* solar gold glow */
			radial-gradient(
				50% 50% at 68% 82%,
				hsla(45, 90%, 30%, 0.3) 0%,
				transparent 62%
			);
		filter: blur(40px);
		animation: sm-nebula-drift 48s ease-in-out infinite alternate;
	}

	@keyframes sm-nebula-drift {
		0% {
			transform: translate3d(-2%, -1%, 0) scale(1);
		}
		100% {
			transform: translate3d(3%, 2%, 0) scale(1.12);
		}
	}

	.sm-stars {
		position: absolute;
		inset: 0;
	}

	/* Gravitational vignette — light disappears into the edges of the void. */
	.sm-vignette {
		position: absolute;
		inset: 0;
		background: radial-gradient(120% 120% at 50% 45%, transparent 55%, var(--sm-void, #07040f) 100%);
	}

	@media (prefers-reduced-motion: reduce) {
		.sm-nebula {
			animation: none;
		}
	}
</style>
