/**
 * Morph — smooth morphing transition that scales, rotates, and skews.
 * The element appears to "morph" in from a distorted state.
 */

import type { TransitionConfig } from 'svelte/transition';
import { easeInOutCubic } from './easing.js';

export interface MorphOptions {
	/** Duration in milliseconds. Default: 700 */
	duration?: number;
	/** Easing function. Default: easeInOutCubic */
	easing?: (t: number) => number;
	/** Starting scale. Default: 0.3 */
	startScale?: number;
	/** Starting rotation in degrees. Default: -15 */
	rotation?: number;
	/** Starting skew. Default: 0.2 */
	skew?: number;
	/** Whether to add a blur during morph. Default: true */
	blur?: boolean;
	/** Max blur in pixels. Default: 10 */
	blurAmount?: number;
}

export function morph(
	node: Element,
	options: MorphOptions = {}
): TransitionConfig {
	const {
		duration = 700,
		easing = easeInOutCubic,
		startScale = 0.3,
		rotation = -15,
		skew = 0.2,
		blur = true,
		blurAmount = 10
	} = options;

	const originalFilter = (node as HTMLElement).style.filter || '';

	return {
		duration,
		easing,
		css: (t: number) => {
			const scale = lerp(startScale, 1, t);
			const rotate = lerp(rotation, 0, t);
			const skewVal = lerp(skew, 0, t);
			const currentBlur = blur ? (1 - t) * blurAmount : 0;
			const opacity = t;

			return `
				opacity: ${opacity};
				transform: scale(${scale}) rotate(${rotate}deg) skew(${skewVal}rad);
				filter: ${originalFilter} blur(${currentBlur}px);
			`;
		}
	};
}

function lerp(start: number, end: number, t: number): number {
	return start + (end - start) * t;
}
