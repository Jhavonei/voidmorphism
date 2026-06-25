<script lang="ts">
	/**
	 * ShimmerButton — a control with a shimmer of starlight traveling around its
	 * inner edge, over the spacemorphism material. Renders a <button> by default.
	 */

	interface Props {
		/** Element/tag to render. Default: 'button'. */
		as?: string;
		/** Shimmer color. Default: cold star-white. */
		color?: string;
		/** Seconds for one shimmer revolution. Default: 3. */
		shimmerDuration?: number;
		/** Background (CSS). Default: a charcoal glass. */
		background?: string;
		/** Border radius. Default: var(--sm-radius-pill). */
		radius?: string;
		/** Extra class. */
		class?: string;
		children?: import('svelte').Snippet;
		[key: string]: unknown;
	}

	let {
		as = 'button',
		color = 'hsla(210, 60%, 96%, 0.9)',
		shimmerDuration = 3,
		background = 'linear-gradient(180deg, hsla(220,12%,18%,0.9), hsla(220,14%,12%,0.92))',
		radius = 'var(--sm-radius-pill)',
		class: className = '',
		children,
		...rest
	}: Props = $props();
</script>

<svelte:element
	this={as}
	class="sm-shimmer {className}"
	style="--sm-sh-color: {color}; --sm-sh-dur: {shimmerDuration}s; --sm-sh-bg: {background}; --sm-sh-radius: {radius};"
	{...rest}
>
	<span class="sm-shimmer-spark" aria-hidden="true"></span>
	<span class="sm-shimmer-label">{@render children?.()}</span>
</svelte:element>

<style>
	.sm-shimmer {
		position: relative;
		isolation: isolate;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.72rem 1.6rem;
		border: none;
		border-radius: var(--sm-sh-radius);
		background: var(--sm-sh-bg);
		color: var(--sm-ink, #f3f5fa);
		font: inherit;
		font-weight: 600;
		cursor: pointer;
		overflow: hidden;
		-webkit-tap-highlight-color: transparent;
		box-shadow:
			0 1px 0 0 hsla(0, 0%, 100%, 0.14) inset,
			0 8px 24px -12px hsla(220, 60%, 2%, 0.9);
		transition: transform 0.2s var(--sm-ease, ease);
	}
	.sm-shimmer:active {
		transform: scale(0.97);
	}

	/* The shimmer spark: a soft conic highlight rotating behind the label. */
	.sm-shimmer-spark {
		position: absolute;
		inset: -120%;
		z-index: -1;
		background: conic-gradient(
			from 0deg,
			transparent 0deg,
			var(--sm-sh-color) 20deg,
			transparent 60deg
		);
		animation: sm-shimmer-spin var(--sm-sh-dur) linear infinite;
		opacity: 0.5;
	}

	.sm-shimmer-label {
		position: relative;
		z-index: 1;
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
	}

	@keyframes sm-shimmer-spin {
		to {
			transform: rotate(360deg);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.sm-shimmer-spark {
			animation: none;
		}
	}
</style>
