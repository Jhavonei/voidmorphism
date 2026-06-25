<script lang="ts">
	import { glitch } from '../transitions/glitch.js';
	import { type EasingFunction, linear } from '../transitions/easing.js';

	interface Props {
		/** Text content */
		text: string;
		/** Whether the text is visible */
		visible?: boolean;
		/** Transition duration in ms */
		duration?: number;
		/** Easing function */
		easing?: EasingFunction;
		/** RGB channel split in px */
		split?: number;
		/** Max displacement in px */
		displacement?: number;
		/** Glitch intensity 0-1 */
		intensity?: number;
		/** Number of glitch steps */
		steps?: number;
		/** Font size */
		fontSize?: string;
		/** Font weight */
		fontWeight?: string;
		/** Text color */
		color?: string;
		/** Whether to continuously glitch (CSS animation) */
		continuous?: boolean;
		/** Children content (overrides text) */
		children?: import('svelte').Snippet;
		[key: string]: any;
	}

	let {
		text,
		visible = true,
		duration = 600,
		easing = linear,
		split = 8,
		displacement = 20,
		intensity = 1,
		steps = 6,
		fontSize = '2rem',
		fontWeight = '700',
		color = '#00ff88',
		continuous = false,
		children,
		...restProps
	}: Props = $props();
</script>

{#if visible}
	<span
		transition:glitch={{ duration, easing, split, displacement, intensity, steps }}
		class="glitch-text"
		class:continuous
		style="font-size: {fontSize}; font-weight: {fontWeight}; color: {color};"
		{...restProps}
	>
		{#if children}
			{@render children()}
		{:else}
			{text}
		{/if}
	</span>
{/if}

<style>
	.glitch-text {
		display: inline-block;
		font-family: 'Courier New', monospace;
		position: relative;
	}

	.glitch-text.continuous {
		animation: sm-glitch-shift 3s infinite steps(10);
	}

	@keyframes sm-glitch-shift {
		0% { text-shadow: 2px 0 0 rgba(255, 0, 0, 0.8), -2px 0 0 rgba(0, 100, 255, 0.8); }
		10% { text-shadow: -2px 0 0 rgba(255, 0, 0, 0.8), 2px 0 0 rgba(0, 100, 255, 0.8); }
		20% { text-shadow: 2px 0 0 rgba(255, 0, 0, 0.8), -2px 0 0 rgba(0, 100, 255, 0.8); }
		30% { text-shadow: -1px 0 0 rgba(255, 0, 0, 0.8), 1px 0 0 rgba(0, 100, 255, 0.8); }
		40% { text-shadow: 1px 0 0 rgba(255, 0, 0, 0.8), -1px 0 0 rgba(0, 100, 255, 0.8); }
		50% { text-shadow: 0 0 0 transparent; }
		60% { text-shadow: 1px 0 0 rgba(255, 0, 0, 0.8), -1px 0 0 rgba(0, 100, 255, 0.8); }
		70% { text-shadow: -2px 0 0 rgba(255, 0, 0, 0.8), 2px 0 0 rgba(0, 100, 255, 0.8); }
		80% { text-shadow: 2px 0 0 rgba(255, 0, 0, 0.8), -2px 0 0 rgba(0, 100, 255, 0.8); }
		90% { text-shadow: -1px 0 0 rgba(255, 0, 0, 0.8), 1px 0 0 rgba(0, 100, 255, 0.8); }
		100% { text-shadow: 0 0 0 transparent; }
	}
</style>
