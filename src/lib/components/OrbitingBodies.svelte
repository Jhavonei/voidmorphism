<script lang="ts">
	/**
	 * OrbitingBodies — places one or more bodies on a circular orbit around a
	 * center, like satellites or planets. Render the center via the default
	 * slot/children; the orbiting bodies come from the `body` snippet which
	 * receives its index so you can vary each one.
	 *
	 *   <OrbitingBodies count={3} radius={120}>
	 *     {#snippet body(i)}<Moon n={i} />{/snippet}
	 *     <Planet />   <!-- the center -->
	 *   </OrbitingBodies>
	 */

	interface Props {
		/** Number of bodies evenly spaced on the orbit. Default: 1. */
		count?: number;
		/** Orbit radius in px. Default: 120. */
		radius?: number;
		/** Seconds for one revolution. Default: 20. */
		duration?: number;
		/** Reverse the orbit direction. Default: false. */
		reverse?: boolean;
		/** Show the orbit ring. Default: true. */
		path?: boolean;
		/** Extra class. */
		class?: string;
		/** The orbiting body, given its index. */
		body?: import('svelte').Snippet<[number]>;
		/** The center content. */
		children?: import('svelte').Snippet;
	}

	let {
		count = 1,
		radius = 120,
		duration = 20,
		reverse = false,
		path = true,
		class: className = '',
		body,
		children
	}: Props = $props();

	const bodies = $derived(Array.from({ length: Math.max(1, count) }, (_, i) => i));
</script>

<div class="sm-orbit {className}" style="--sm-orbit-r: {radius}px; --sm-orbit-dur: {duration}s;">
	{#if path}
		<span class="sm-orbit-ring" aria-hidden="true"></span>
	{/if}

	<div class="sm-orbit-center">
		{@render children?.()}
	</div>

	{#each bodies as i (i)}
		<div
			class="sm-orbit-body"
			class:sm-reverse={reverse}
			style="--sm-orbit-delay: {(-duration * i) / bodies.length}s;"
		>
			<div class="sm-orbit-body-inner" class:sm-reverse={reverse}>
				{@render body?.(i)}
			</div>
		</div>
	{/each}
</div>

<style>
	.sm-orbit {
		position: relative;
		display: grid;
		place-items: center;
		width: calc(var(--sm-orbit-r) * 2);
		height: calc(var(--sm-orbit-r) * 2);
	}

	.sm-orbit-ring {
		position: absolute;
		inset: 0;
		border-radius: 50%;
		border: 1px solid hsla(210, 16%, 70%, 0.16);
		pointer-events: none;
	}

	.sm-orbit-center {
		position: absolute;
		display: grid;
		place-items: center;
		z-index: 1;
	}

	.sm-orbit-body {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 0;
		height: 0;
		transform-origin: 0 0;
		animation: sm-orbit-spin var(--sm-orbit-dur) linear infinite;
		animation-delay: var(--sm-orbit-delay, 0s);
	}
	.sm-orbit-body.sm-reverse {
		animation-direction: reverse;
	}

	/* Counter-rotate the inner so the body stays upright as it orbits. */
	.sm-orbit-body-inner {
		transform: translate(-50%, -50%);
		animation: sm-orbit-counter var(--sm-orbit-dur) linear infinite;
		animation-delay: var(--sm-orbit-delay, 0s);
	}
	.sm-orbit-body-inner.sm-reverse {
		animation-direction: reverse;
	}

	@keyframes sm-orbit-spin {
		from {
			transform: rotate(0deg) translateX(var(--sm-orbit-r));
		}
		to {
			transform: rotate(360deg) translateX(var(--sm-orbit-r));
		}
	}
	@keyframes sm-orbit-counter {
		from {
			transform: translate(-50%, -50%) rotate(0deg);
		}
		to {
			transform: translate(-50%, -50%) rotate(-360deg);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.sm-orbit-body,
		.sm-orbit-body-inner {
			animation: none;
		}
	}
</style>
