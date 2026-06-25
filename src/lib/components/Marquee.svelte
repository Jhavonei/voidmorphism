<script lang="ts">
	/**
	 * Marquee — an infinite scrolling row (or column) with gradient fade edges,
	 * for logo walls, testimonials, telemetry tickers. Duplicates its children
	 * to loop seamlessly; pauses on hover by default.
	 */

	interface Props {
		/** Seconds for one full loop. Default: 28. */
		duration?: number;
		/** Reverse direction. Default: false. */
		reverse?: boolean;
		/** Scroll vertically instead of horizontally. Default: false. */
		vertical?: boolean;
		/** Pause when hovered. Default: true. */
		pauseOnHover?: boolean;
		/** Gap between items (CSS length). Default: '1.5rem'. */
		gap?: string;
		/** How many copies to render for a seamless loop. Default: 2. */
		repeat?: number;
		/** Fade the leading/trailing edges. Default: true. */
		fade?: boolean;
		/** Extra class. */
		class?: string;
		children?: import('svelte').Snippet;
	}

	let {
		duration = 28,
		reverse = false,
		vertical = false,
		pauseOnHover = true,
		gap = '1.5rem',
		repeat = 2,
		fade = true,
		class: className = '',
		children
	}: Props = $props();

	const copies = $derived(Array.from({ length: Math.max(2, repeat) }));
</script>

<div
	class="sm-marquee {className}"
	class:sm-vertical={vertical}
	class:sm-fade={fade}
	class:sm-pause={pauseOnHover}
	style="--sm-mq-dur: {duration}s; --sm-mq-gap: {gap};"
	style:--sm-mq-dir={reverse ? 'reverse' : 'normal'}
>
	{#each copies as _, i (i)}
		<div class="sm-marquee-track" aria-hidden={i > 0 ? 'true' : undefined}>
			{@render children?.()}
		</div>
	{/each}
</div>

<style>
	.sm-marquee {
		display: flex;
		overflow: hidden;
		gap: var(--sm-mq-gap);
		flex-direction: row;
	}
	.sm-marquee.sm-vertical {
		flex-direction: column;
	}

	.sm-marquee-track {
		display: flex;
		flex-shrink: 0;
		gap: var(--sm-mq-gap);
		min-width: 100%;
		flex-direction: row;
		animation: sm-marquee-x var(--sm-mq-dur) linear infinite;
		animation-direction: var(--sm-mq-dir, normal);
	}
	.sm-vertical .sm-marquee-track {
		flex-direction: column;
		min-width: 0;
		min-height: 100%;
		animation-name: sm-marquee-y;
	}

	.sm-pause:hover .sm-marquee-track {
		animation-play-state: paused;
	}

	@keyframes sm-marquee-x {
		from {
			transform: translateX(0);
		}
		to {
			transform: translateX(calc(-100% - var(--sm-mq-gap)));
		}
	}
	@keyframes sm-marquee-y {
		from {
			transform: translateY(0);
		}
		to {
			transform: translateY(calc(-100% - var(--sm-mq-gap)));
		}
	}

	.sm-fade {
		-webkit-mask: linear-gradient(
			to right,
			transparent,
			#000 12%,
			#000 88%,
			transparent
		);
		mask: linear-gradient(to right, transparent, #000 12%, #000 88%, transparent);
	}
	.sm-fade.sm-vertical {
		-webkit-mask: linear-gradient(
			to bottom,
			transparent,
			#000 12%,
			#000 88%,
			transparent
		);
		mask: linear-gradient(to bottom, transparent, #000 12%, #000 88%, transparent);
	}

	@media (prefers-reduced-motion: reduce) {
		.sm-marquee-track {
			animation: none;
		}
	}
</style>
