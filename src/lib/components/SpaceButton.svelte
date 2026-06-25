<script lang="ts">
	import SpaceSurface from './SpaceSurface.svelte';

	/**
	 * SpaceButton — a tactile control carved from void matter. It tilts toward the
	 * cursor (gravity well), attracts light, and — on the primary variant — emits
	 * a soft celestial bloom. Borderless by design.
	 */

	type Variant = 'primary' | 'surface' | 'ghost';
	type Size = 'sm' | 'md' | 'lg';

	interface Props {
		/** Visual weight. Default: 'surface'. */
		variant?: Variant;
		/** Control size. Default: 'md'. */
		size?: Size;
		/** Resonate with nearby elements. Default: true. */
		resonant?: boolean;
		/** Disable interaction. Default: false. */
		disabled?: boolean;
		children?: import('svelte').Snippet;
		[key: string]: any;
	}

	let {
		variant = 'surface',
		size = 'md',
		resonant = true,
		disabled = false,
		children,
		...rest
	}: Props = $props();

	const pad = $derived(size === 'sm' ? '0.5rem 1rem' : size === 'lg' ? '0.95rem 2.1rem' : '0.72rem 1.6rem');
	const fontSize = $derived(size === 'sm' ? '0.85rem' : size === 'lg' ? '1.1rem' : '0.98rem');
</script>

<SpaceSurface
	as="button"
	depth={1}
	radius="var(--sm-radius-pill)"
	padding={pad}
	interactive={!disabled}
	tilt={4}
	bloom={variant === 'primary'}
	{resonant}
	resonanceColor={variant === 'primary' ? '212 90% 72%' : ''}
	class="sm-btn sm-btn-{variant}"
	style={`font-size: ${fontSize}; --sm-btn-disabled: ${disabled ? 1 : 0};`}
	disabled={disabled || undefined}
	{...rest}
>
	{@render children?.()}
</SpaceSurface>

<style>
	:global(.sm-btn) {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		font-weight: 650;
		line-height: 1;
		border: none;
		color: var(--sm-ink);
		white-space: nowrap;
		user-select: none;
		-webkit-tap-highlight-color: transparent;
	}

	:global(.sm-btn[disabled]) {
		opacity: 0.4;
		pointer-events: none;
	}

	/* Primary: the brightest manifestation of the substance — silver glass,
	   cold star-glow edge. Reads as polished spacecraft alloy under starlight. */
	:global(.sm-btn-primary) {
		background-image: linear-gradient(
			135deg,
			hsla(210, 18%, 92%, 0.95) 0%,
			hsla(212, 16%, 78%, 0.9) 52%,
			var(--sm-accent) 165%
		);
		color: hsl(220 40% 12%);
		text-shadow: 0 1px 10px hsla(210, 40%, 100%, 0.55);
	}

	:global(.sm-btn-ghost) {
		background-image: none;
		background-color: transparent;
		box-shadow: none;
		-webkit-backdrop-filter: none;
		backdrop-filter: none;
		color: var(--sm-ink-dim);
	}

	:global(.sm-btn-ghost::before),
	:global(.sm-btn-ghost::after) {
		opacity: 0;
	}

	:global(.sm-btn-ghost:hover) {
		color: var(--sm-ink);
	}

	:global(.sm-btn:active) {
		transform: perspective(900px) translateZ(0) scale(0.97) !important;
	}
</style>
