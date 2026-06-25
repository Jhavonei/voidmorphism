/**
 * Pixelate — element transitions through a pixelation effect.
 * Creates a retro digital "materialization" effect.
 */

import type { TransitionConfig } from 'svelte/transition';
import { easeInOutCubic } from './easing.js';

export interface PixelateOptions {
	/** Duration in milliseconds. Default: 600 */
	duration?: number;
	/** Easing function. Default: easeInOutCubic */
	easing?: (t: number) => number;
	/** Maximum pixelation size in pixels. Default: 20 */
	maxPixelSize?: number;
	/** Starting scale. Default: 0.9 */
	startScale?: number;
}

export function pixelate(
	node: Element,
	options: PixelateOptions = {}
): TransitionConfig {
	const {
		duration = 600,
		easing = easeInOutCubic,
		maxPixelSize = 20,
		startScale = 0.9
	} = options;

	return {
		duration,
		easing,
		css: (t: number) => {
			// Pixelation peaks at t=0.5, resolves at t=0 and t=1
			const pixelAmount = t < 0.5 ? (1 - t * 2) * maxPixelSize : ((t - 0.5) * 2) * maxPixelSize;
			const pixelSize = Math.max(1, maxPixelSize - pixelAmount);
			const scale = lerp(startScale, 1, t);
			const opacity = t;

			return `
				opacity: ${opacity};
				transform: scale(${scale});
				filter: contrast(${1 + (1 - t) * 0.5}) saturate(${1 + (1 - t) * 0.3});
				image-rendering: pixelated;
			`;
		}
	};
}

function lerp(start: number, end: number, t: number): number {
	return start + (end - start) * t;
}
