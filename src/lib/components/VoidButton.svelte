<script lang="ts">
	import VoidSurface from './VoidSurface.svelte';

	/**
	 * VoidButton — a tactile control carved from void matter. It tilts toward the
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

<VoidSurface
	as="button"
	depth={1}
	radius="var(--vm-radius-pill)"
	padding={pad}
	interactive={!disabled}
	tilt={4}
	bloom={variant === 'primary'}
	{resonant}
	resonanceColor={variant === 'primary' ? '272 92% 67%' : ''}
	class="vm-btn vm-btn-{variant}"
	style={`font-size: ${fontSize}; --vm-btn-disabled: ${disabled ? 1 : 0};`}
	disabled={disabled || undefined}
	{...rest}
>
	{@render children?.()}
</VoidSurface>

<style>
	:global(.vm-btn) {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		font-weight: 650;
		line-height: 1;
		border: none;
		color: var(--vm-ink);
		white-space: nowrap;
		user-select: none;
		-webkit-tap-highlight-color: transparent;
	}

	:global(.vm-btn[disabled]) {
		opacity: 0.4;
		pointer-events: none;
	}

	/* Primary: the brightest manifestation of the substance — violet core, gold edge. */
	:global(.vm-btn-primary) {
		background-image: linear-gradient(
			135deg,
			hsla(272, 92%, 70%, 0.95) 0%,
			hsla(286, 88%, 58%, 0.9) 55%,
			hsla(45, 96%, 60%, 0.9) 160%
		);
		color: hsl(280 50% 98%);
		text-shadow: 0 1px 12px hsla(272, 92%, 25%, 0.7);
	}

	:global(.vm-btn-ghost) {
		background-image: none;
		background-color: transparent;
		box-shadow: none;
		-webkit-backdrop-filter: none;
		backdrop-filter: none;
		color: var(--vm-ink-dim);
	}

	:global(.vm-btn-ghost::before),
	:global(.vm-btn-ghost::after) {
		opacity: 0;
	}

	:global(.vm-btn-ghost:hover) {
		color: var(--vm-ink);
	}

	:global(.vm-btn:active) {
		transform: perspective(900px) translateZ(0) scale(0.97) !important;
	}
</style>
