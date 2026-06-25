<script lang="ts">
	/**
	 * BorderBeam — a beam of light that orbits an element's border, like a
	 * satellite tracing an orbit. Wrap any content; the beam rides the rounded
	 * rectangle perimeter. Honors reduced motion (beam holds still).
	 */

	interface Props {
		/** Border thickness in px. Default: 1.5. */
		borderWidth?: number;
		/** Seconds for one full orbit. Default: 6. */
		duration?: number;
		/** Beam color (CSS color). Default: cold accent. */
		color?: string;
		/** Trailing length of the beam as a fraction of the perimeter, 0–1. Default: 0.2. */
		length?: number;
		/** Border radius (matches your content). Default: 'inherit'. */
		radius?: string;
		/** Extra class. */
		class?: string;
		children?: import('svelte').Snippet;
	}

	let {
		borderWidth = 1.5,
		duration = 6,
		color = 'hsl(212 90% 72%)',
		length = 0.2,
		radius = 'var(--sm-radius)',
		class: className = '',
		children
	}: Props = $props();

	const stop = $derived(`${Math.max(0.02, length) * 100}%`);
</script>

<div
	class="sm-borderbeam {className}"
	style="--sm-bb-w: {borderWidth}px; --sm-bb-dur: {duration}s; --sm-bb-color: {color}; --sm-bb-stop: {stop}; border-radius: {radius};"
>
	<span class="sm-borderbeam-ring" aria-hidden="true"></span>
	{@render children?.()}
</div>

<style>
	@property --sm-bb-angle {
		syntax: '<angle>';
		inherits: false;
		initial-value: 0deg;
	}

	.sm-borderbeam {
		position: relative;
		isolation: isolate;
	}

	.sm-borderbeam-ring {
		position: absolute;
		inset: 0;
		border-radius: inherit;
		padding: var(--sm-bb-w);
		background: conic-gradient(
			from var(--sm-bb-angle),
			transparent 0%,
			var(--sm-bb-color) var(--sm-bb-stop),
			transparent calc(var(--sm-bb-stop) + 1%)
		);
		-webkit-mask:
			linear-gradient(#000 0 0) content-box,
			linear-gradient(#000 0 0);
		mask:
			linear-gradient(#000 0 0) content-box,
			linear-gradient(#000 0 0);
		-webkit-mask-composite: xor;
		mask-composite: exclude;
		pointer-events: none;
		z-index: 1;
		animation: sm-bb-spin var(--sm-bb-dur) linear infinite;
	}

	@keyframes sm-bb-spin {
		to {
			--sm-bb-angle: 360deg;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.sm-borderbeam-ring {
			animation: none;
		}
	}
</style>
