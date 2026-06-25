<script lang="ts">
	import { morph } from '../transitions/morph.js';
	import { type EasingFunction, easeInOutCubic } from '../transitions/easing.js';

	interface Props {
		/** Whether the container is visible */
		visible?: boolean;
		/** Transition duration in ms */
		duration?: number;
		/** Easing function */
		easing?: EasingFunction;
		/** Starting scale */
		startScale?: number;
		/** Starting rotation in degrees */
		rotation?: number;
		/** Starting skew */
		skew?: number;
		/** Whether to blur during morph */
		blur?: boolean;
		/** Max blur in px */
		blurAmount?: number;
		/** Container padding */
		padding?: string;
		/** Container border radius */
		radius?: string;
		/** Children content */
		children?: import('svelte').Snippet;
		[key: string]: any;
	}

	let {
		visible = true,
		duration = 700,
		easing = easeInOutCubic,
		startScale = 0.3,
		rotation = -15,
		skew = 0.2,
		blur = true,
		blurAmount = 10,
		padding = '1.5rem',
		radius = '8px',
		children,
		...restProps
	}: Props = $props();
</script>

{#if visible}
	<div
		transition:morph={{ duration, easing, startScale, rotation, skew, blur, blurAmount }}
		style="padding: {padding}; border-radius: {radius};"
		{...restProps}
	>
		{@render children?.()}
	</div>
{/if}
