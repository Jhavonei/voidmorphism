<script lang="ts">
	/**
	 * HoverButton — an interactive button that comes alive on hover: a cold dot
	 * expands to flood the surface while the label slides aside to reveal it,
	 * like a system arming. Keyboard and reduced-motion friendly.
	 */

	interface Props {
		/** Element/tag to render. Default: 'button'. */
		as?: string;
		/** Accent flood color. Default: cold accent. */
		color?: string;
		/** Border radius. Default: var(--sm-radius-pill). */
		radius?: string;
		/** Extra class. */
		class?: string;
		children?: import('svelte').Snippet;
		[key: string]: unknown;
	}

	let {
		as = 'button',
		color = 'hsl(212 90% 72%)',
		radius = 'var(--sm-radius-pill)',
		class: className = '',
		children,
		...rest
	}: Props = $props();
</script>

<svelte:element
	this={as}
	class="sm-hoverbtn {className}"
	style="--sm-hb-color: {color}; --sm-hb-radius: {radius};"
	{...rest}
>
	<span class="sm-hoverbtn-dot" aria-hidden="true"></span>
	<span class="sm-hoverbtn-label">{@render children?.()}</span>
	<span class="sm-hoverbtn-label sm-hoverbtn-label-hover" aria-hidden="true">
		{@render children?.()}
		<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
			<path d="M5 12h14M13 6l6 6-6 6" />
		</svg>
	</span>
</svelte:element>

<style>
	.sm-hoverbtn {
		position: relative;
		isolation: isolate;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.72rem 1.6rem;
		border: none;
		border-radius: var(--sm-hb-radius);
		background: hsla(220, 12%, 16%, 0.85);
		color: var(--sm-ink, #f3f5fa);
		font: inherit;
		font-weight: 600;
		cursor: pointer;
		overflow: hidden;
		-webkit-tap-highlight-color: transparent;
		box-shadow: 0 1px 0 0 hsla(0, 0%, 100%, 0.1) inset;
	}

	/* The expanding cold dot. */
	.sm-hoverbtn-dot {
		position: absolute;
		left: 1.1rem;
		top: 50%;
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: var(--sm-hb-color);
		transform: translateY(-50%) scale(1);
		transition: transform 0.5s var(--sm-ease-warp, cubic-bezier(0.16, 1, 0.3, 1));
		z-index: -1;
	}
	.sm-hoverbtn:hover .sm-hoverbtn-dot,
	.sm-hoverbtn:focus-visible .sm-hoverbtn-dot {
		transform: translateY(-50%) scale(28);
	}

	.sm-hoverbtn-label {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		transition:
			transform 0.4s var(--sm-ease-warp, cubic-bezier(0.16, 1, 0.3, 1)),
			opacity 0.3s ease;
	}

	/* Default label slides out; hover label (with arrow) slides in, in dark ink. */
	.sm-hoverbtn-label-hover {
		position: absolute;
		inset: 0;
		justify-content: center;
		color: hsl(220 40% 10%);
		transform: translateX(110%);
		opacity: 0;
	}
	.sm-hoverbtn:hover .sm-hoverbtn-label:not(.sm-hoverbtn-label-hover),
	.sm-hoverbtn:focus-visible .sm-hoverbtn-label:not(.sm-hoverbtn-label-hover) {
		transform: translateX(-110%);
		opacity: 0;
	}
	.sm-hoverbtn:hover .sm-hoverbtn-label-hover,
	.sm-hoverbtn:focus-visible .sm-hoverbtn-label-hover {
		transform: translateX(0);
		opacity: 1;
	}

	.sm-hoverbtn:focus-visible {
		outline: 2px solid hsl(212 90% 72%);
		outline-offset: 2px;
	}

	@media (prefers-reduced-motion: reduce) {
		.sm-hoverbtn-dot,
		.sm-hoverbtn-label {
			transition: none;
		}
	}
</style>
