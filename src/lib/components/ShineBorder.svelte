<script lang="ts">
	/**
	 * ShineBorder — a soft shine that sweeps around an element's border, like
	 * starlight grazing the hull of a ship. Wrap any content.
	 */

	interface Props {
		/** Border thickness in px. Default: 1.5. */
		borderWidth?: number;
		/** Seconds for one sweep cycle. Default: 8. */
		duration?: number;
		/** Shine color(s) — a single CSS color or a comma list for a gradient. Default: silver→accent. */
		color?: string | string[];
		/** Border radius. Default: var(--sm-radius). */
		radius?: string;
		/** Extra class. */
		class?: string;
		children?: import('svelte').Snippet;
	}

	let {
		borderWidth = 1.5,
		duration = 8,
		color = ['hsl(210 16% 86%)', 'hsl(212 90% 72%)'],
		radius = 'var(--sm-radius)',
		class: className = '',
		children
	}: Props = $props();

	const stops = $derived(Array.isArray(color) ? color.join(', ') : color);
</script>

<div
	class="sm-shineborder {className}"
	style="--sm-sb-w: {borderWidth}px; --sm-sb-dur: {duration}s; --sm-sb-colors: {stops}; border-radius: {radius};"
>
	<span class="sm-shineborder-ring" aria-hidden="true"></span>
	{@render children?.()}
</div>

<style>
	.sm-shineborder {
		position: relative;
		isolation: isolate;
	}

	.sm-shineborder-ring {
		position: absolute;
		inset: 0;
		border-radius: inherit;
		padding: var(--sm-sb-w);
		background-image: radial-gradient(
			transparent,
			transparent,
			var(--sm-sb-colors),
			transparent,
			transparent
		);
		background-size: 300% 300%;
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
		animation: sm-sb-shine var(--sm-sb-dur) ease-in-out infinite;
	}

	@keyframes sm-sb-shine {
		0% {
			background-position: 0% 0%;
		}
		50% {
			background-position: 100% 100%;
		}
		100% {
			background-position: 0% 0%;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.sm-shineborder-ring {
			animation: none;
		}
	}
</style>
