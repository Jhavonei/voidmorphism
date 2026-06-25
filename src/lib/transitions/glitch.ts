/**
 * Glitch — digital glitch effect with RGB channel splitting and displacement.
 * Creates a "digital corruption" aesthetic perfect for tech/horror UIs.
 */

import type { TransitionConfig } from 'svelte/transition';
import { linear } from './easing.js';
import { random } from './utils.js';

export interface GlitchOptions {
	/** Duration in milliseconds. Default: 600 */
	duration?: number;
	/** Easing function. Default: linear */
	easing?: (t: number) => number;
	/** Maximum RGB channel split in pixels. Default: 8 */
	split?: number;
	/** Maximum horizontal displacement in pixels. Default: 20 */
	displacement?: number;
	/** Glitch intensity 0-1. Default: 1 */
	intensity?: number;
	/** Number of glitch steps/stutters. Default: 6 */
	steps?: number;
}

export function glitch(
	node: Element,
	options: GlitchOptions = {}
): TransitionConfig {
	const {
		duration = 600,
		easing = linear,
		split = 8,
		displacement = 20,
		intensity = 1,
		steps = 6
	} = options;

	return {
		duration,
		easing,
		css: (t: number) => {
			// Calculate which glitch step we're in
			const stepProgress = t * steps;
			const currentStep = Math.floor(stepProgress);
			const stepT = stepProgress - currentStep;

			// Random-ish displacement based on step (deterministic per render)
			const seed = currentStep * 0.73;
			const dx = Math.sin(seed * 99) * displacement * intensity * (1 - t);
			const dy = Math.cos(seed * 77) * displacement * 0.5 * intensity * (1 - t);
			const rShift = Math.sin(seed * 55) * split * intensity * (1 - t);
			const bShift = Math.cos(seed * 33) * split * intensity * (1 - t);

			// Flicker opacity
			const flicker = currentStep % 2 === 0 ? 1 : 0.7 + stepT * 0.3;
			const opacity = t * flicker;

			// Clip-path glitch slice
			const sliceTop = random(0, 80);
			const sliceHeight = random(5, 20);

			return `
				opacity: ${opacity};
				transform: translate(${dx}px, ${dy}px) scale(${1 + (1 - t) * 0.02});
				filter:
					drop-shadow(${rShift}px 0 0 rgba(255, 0, 0, ${intensity * (1 - t)}))
					drop-shadow(${bShift * -1}px 0 0 rgba(0, 100, 255, ${intensity * (1 - t)}));
				clip-path: polygon(
					0 0, 100% 0, 100% ${sliceTop}%, 0 ${sliceTop}%,
					0 ${sliceTop + sliceHeight}%, 100% ${sliceTop + sliceHeight}%,
					100% 100%, 0 100%
				);
			`;
		}
	};
}
