<script lang="ts">
	import { onMount } from 'svelte';
	import { onFrame, whenVisible } from '../core/raf.js';
	import { prefersReducedMotion, detectPerfTier } from '../core/env.js';

	/**
	 * SpaceField — the infinite space foundation.
	 *
	 * Renders monochrome interstellar depth behind your interface: OLED-black
	 * base, fine drifting star dust, three parallax star layers, a faint silver
	 * nebula, and an accretion-disk vignette (black-hole inspired). Fixed and
	 * non-interactive — place it once at the back of your app.
	 */

	interface Props {
		/** Number of parallax stars (across 3 depth layers). Default: 180. */
		stars?: number;
		/** Number of fine star-dust motes. Default: 420. */
		dust?: number;
		/** Parallax strength in px as the pointer moves. Default: 20. */
		parallax?: number;
		/** Overall opacity of the cosmic detail, 0–1. Default: 1. */
		intensity?: number;
		/** Tint the brightest stars with the cold accent. Default: true. */
		accent?: boolean;
	}

	let {
		stars = 180,
		dust = 420,
		parallax = 20,
		intensity = 1,
		accent = true
	}: Props = $props();

	let canvas: HTMLCanvasElement;
	let wrap: HTMLDivElement;

	onMount(() => {
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const reduced = prefersReducedMotion();
		const tier = detectPerfTier();
		const scale = tier === 'eco' ? 0.4 : tier === 'balanced' ? 0.7 : 1;

		// Track the active theme so stars invert on the light "observatory".
		const root = document.documentElement;
		let light = root.dataset.smTheme === 'light';
		const themeObserver = new MutationObserver(() => {
			light = root.dataset.smTheme === 'light';
		});
		themeObserver.observe(root, { attributes: true, attributeFilter: ['data-sm-theme'] });

		let w = 0;
		let h = 0;
		let dpr = Math.min(window.devicePixelRatio || 1, 2);
		let t = 0;

		type Star = { x: number; y: number; z: number; r: number; tw: number; warm: boolean };
		type Mote = { x: number; y: number; z: number; r: number; vx: number; vy: number };
		let field: Star[] = [];
		let motes: Mote[] = [];

		function seed() {
			const starCount = Math.round(stars * scale);
			const dustCount = Math.round(dust * scale);
			field = Array.from({ length: starCount }, () => ({
				x: Math.random(),
				y: Math.random(),
				z: Math.random() * 0.9 + 0.1, // depth → size + parallax + brightness
				r: Math.random() * 1.4 + 0.2,
				tw: Math.random() * Math.PI * 2, // twinkle phase
				warm: accent && Math.random() < 0.22 // a few cold-accent stars
			}));
			motes = Array.from({ length: dustCount }, () => ({
				x: Math.random(),
				y: Math.random(),
				z: Math.random() * 0.6 + 0.1,
				r: Math.random() * 0.7 + 0.15,
				vx: (Math.random() - 0.5) * 0.00006,
				vy: (Math.random() - 0.5) * 0.00006
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

			ctx!.clearRect(0, 0, w, h);

			// Star dust — fine, slow, monochrome motes drifting through deep space.
			for (const m of motes) {
				m.x += m.vx;
				m.y += m.vy;
				if (m.x < 0) m.x += 1;
				else if (m.x > 1) m.x -= 1;
				if (m.y < 0) m.y += 1;
				else if (m.y > 1) m.y -= 1;
				const ox = px * parallax * 0.4 * m.z;
				const oy = py * parallax * 0.4 * m.z;
				const x = m.x * w + ox;
				const y = m.y * h + oy;
				const alpha = m.z * 0.5 * intensity;
				ctx!.beginPath();
				ctx!.arc(x, y, m.r, 0, Math.PI * 2);
				ctx!.fillStyle = light
					? `hsla(220, 16%, 30%, ${alpha * 0.5})`
					: `hsla(210, 14%, 86%, ${alpha})`;
				ctx!.fill();
			}

			// Parallax stars — three implicit depth layers via z, with twinkle.
			for (const s of field) {
				const ox = px * parallax * s.z;
				const oy = py * parallax * s.z;
				const x = s.x * w + ox;
				const y = s.y * h + oy;
				const twinkle = 0.55 + 0.45 * Math.sin(t * 1.6 + s.tw);
				const alpha = s.z * twinkle * intensity;
				ctx!.beginPath();
				ctx!.arc(x, y, s.r * (0.6 + s.z), 0, Math.PI * 2);
				if (light) {
					ctx!.fillStyle = `hsla(220, 22%, 24%, ${alpha * 0.55})`;
				} else if (s.warm) {
					// cold star-glow accent stars
					ctx!.fillStyle = `hsla(212, 90%, ${78 + s.z * 14}%, ${alpha})`;
				} else {
					ctx!.fillStyle = `hsla(210, 18%, ${82 + s.z * 16}%, ${alpha})`;
				}
				ctx!.fill();
			}
		}

		seed();
		resize();
		draw();

		const ro = new ResizeObserver(resize);
		ro.observe(wrap);
		window.addEventListener('pointermove', onMove, { passive: true });

		// Drive via the shared rAF, gated to when the field is on-screen (it is
		// fixed full-viewport, so effectively always — but this keeps it paused
		// on hidden tabs and honors reduced motion by drawing a single frame).
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
			themeObserver.disconnect();
			window.removeEventListener('pointermove', onMove);
		};
	});
</script>

<div
	bind:this={wrap}
	class="sm-field"
	aria-hidden="true"
	style="--sm-field-intensity: {intensity};"
>
	<div class="sm-nebula"></div>
	<canvas bind:this={canvas} class="sm-stars"></canvas>
	<div class="sm-accretion"></div>
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
				hsla(212, 30%, 16%, 0.35) 0%,
				transparent 55%
			),
			var(--sm-void, #050609);
		pointer-events: none;
		transition: background 0.6s ease;
	}

	/* Drifting nebula — monochrome silver clouds with a faint cold core. */
	.sm-nebula {
		position: absolute;
		inset: -20%;
		opacity: calc(0.55 * var(--sm-field-intensity));
		background:
			radial-gradient(40% 50% at 24% 32%, hsla(210, 24%, 40%, 0.34) 0%, transparent 60%),
			radial-gradient(45% 45% at 78% 26%, hsla(212, 30%, 46%, 0.26) 0%, transparent 60%),
			radial-gradient(55% 55% at 66% 84%, hsla(210, 12%, 30%, 0.30) 0%, transparent 62%);
		filter: blur(44px);
		animation: sm-nebula-drift 56s ease-in-out infinite alternate;
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

	/* Accretion disk — a faint bright ring far off, like a distant black hole. */
	.sm-accretion {
		position: absolute;
		left: 50%;
		top: 18%;
		width: 60vmax;
		height: 60vmax;
		transform: translate(-50%, -50%);
		border-radius: 50%;
		opacity: calc(0.5 * var(--sm-field-intensity));
		background: radial-gradient(
			closest-side,
			transparent 60%,
			hsla(210, 30%, 70%, 0.10) 72%,
			hsla(212, 80%, 78%, 0.07) 78%,
			transparent 82%
		);
		filter: blur(2px);
	}

	/* Gravitational vignette — light disappears into the edges of space. */
	.sm-vignette {
		position: absolute;
		inset: 0;
		background: radial-gradient(
			120% 120% at 50% 45%,
			transparent 55%,
			var(--sm-void, #050609) 100%
		);
	}

	@media (prefers-reduced-motion: reduce) {
		.sm-nebula {
			animation: none;
		}
	}
</style>
