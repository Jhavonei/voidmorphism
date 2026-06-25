<script lang="ts">
	import { onMount } from 'svelte';

	/**
	 * SpaceBeam — a beam of light traveling a curved path between two elements,
	 * like a comms link between stations. Give it the container plus the two
	 * endpoint elements (bound refs); it overlays an SVG and animates a light
	 * pulse along the connection.
	 *
	 *   <div bind:this={box} style="position:relative">
	 *     <div bind:this={a}>A</div>
	 *     <div bind:this={b}>B</div>
	 *     <SpaceBeam container={box} from={a} to={b} />
	 *   </div>
	 */

	interface Props {
		/** The positioned container the SVG overlays. */
		container?: HTMLElement | null;
		/** Start element. */
		from?: HTMLElement | null;
		/** End element. */
		to?: HTMLElement | null;
		/** Curve height (px); positive bows up, negative down. Default: -40. */
		curvature?: number;
		/** Seconds for one pulse to travel. Default: 3. */
		duration?: number;
		/** Beam color. Default: cold accent. */
		color?: string;
		/** Faint base-line color. Default: silver low-alpha. */
		baseColor?: string;
		/** Stroke width. Default: 2. */
		width?: number;
		/** Reverse pulse direction. Default: false. */
		reverse?: boolean;
		/** Extra class. */
		class?: string;
	}

	let {
		container = null,
		from = null,
		to = null,
		curvature = -40,
		duration = 3,
		color = 'hsl(212 90% 72%)',
		baseColor = 'hsla(210, 16%, 70%, 0.18)',
		width = 2,
		reverse = false,
		class: className = ''
	}: Props = $props();

	let w = $state(0);
	let h = $state(0);
	let d = $state('');

	function recompute() {
		if (!container || !from || !to) return;
		const c = container.getBoundingClientRect();
		const a = from.getBoundingClientRect();
		const b = to.getBoundingClientRect();
		w = c.width;
		h = c.height;
		const ax = a.left - c.left + a.width / 2;
		const ay = a.top - c.top + a.height / 2;
		const bx = b.left - c.left + b.width / 2;
		const by = b.top - c.top + b.height / 2;
		const mx = (ax + bx) / 2;
		const my = (ay + by) / 2 + curvature;
		d = `M ${ax},${ay} Q ${mx},${my} ${bx},${by}`;
	}

	onMount(() => {
		recompute();
		const ro = new ResizeObserver(recompute);
		if (container) ro.observe(container);
		if (from) ro.observe(from);
		if (to) ro.observe(to);
		window.addEventListener('resize', recompute, { passive: true });
		window.addEventListener('scroll', recompute, { passive: true, capture: true });
		return () => {
			ro.disconnect();
			window.removeEventListener('resize', recompute);
			window.removeEventListener('scroll', recompute, { capture: true } as EventListenerOptions);
		};
	});
</script>

<svg
	class="sm-beam {className}"
	width={w}
	height={h}
	viewBox="0 0 {w} {h}"
	fill="none"
	aria-hidden="true"
>
	{#if d}
		<path {d} stroke={baseColor} stroke-width={width} stroke-linecap="round" />
		<path
			{d}
			class="sm-beam-pulse"
			class:sm-reverse={reverse}
			stroke={color}
			stroke-width={width}
			stroke-linecap="round"
			pathLength="100"
			style="--sm-beam-dur: {duration}s;"
		/>
	{/if}
</svg>

<style>
	.sm-beam {
		position: absolute;
		inset: 0;
		pointer-events: none;
		overflow: visible;
	}

	.sm-beam-pulse {
		stroke-dasharray: 14 86;
		filter: drop-shadow(0 0 4px currentColor);
		animation: sm-beam-travel var(--sm-beam-dur) linear infinite;
	}
	.sm-beam-pulse.sm-reverse {
		animation-direction: reverse;
	}

	@keyframes sm-beam-travel {
		from {
			stroke-dashoffset: 100;
		}
		to {
			stroke-dashoffset: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.sm-beam-pulse {
			animation: none;
		}
	}
</style>
