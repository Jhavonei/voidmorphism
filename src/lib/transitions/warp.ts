/**
 * warp — a gravitational-lens transition. The element stretches and shears as
 * if passing an event horizon, brightening and blurring at the extreme, then
 * snaps back to its resting geometry. The "space element" transition.
 */

import type { TransitionConfig } from 'svelte/transition';
import { easeOutExpo } from './easing.js';

export interface WarpOptions {
	/** Duration in milliseconds. Default: 650 */
	duration?: number;
	/** Easing function. Default: easeOutExpo */
	easing?: (t: number) => number;
	/** Peak stretch factor along the warp axis. Default: 1.4 */
	stretch?: number;
	/** Axis to stretch along. Default: 'x' */
	axis?: 'x' | 'y';
	/** Peak skew in degrees. Default: 10 */
	skew?: number;
	/** Peak blur in px. Default: 6 */
	blur?: number;
}

export function warp(node: Element, options: WarpOptions = {}): TransitionConfig {
	const {
		duration = 650,
		easing = easeOutExpo,
		stretch = 1.4,
		axis = 'x',
		skew = 10,
		blur = 6
	} = options;

	return {
		duration,
		easing,
		css: (t: number) => {
			const k = 1 - t; // 1 = fully warped
			const along = 1 + k * (stretch - 1);
			const across = 1 - k * 0.5;
			const sx = axis === 'x' ? along : across;
			const sy = axis === 'x' ? across : along;
			const sk = k * skew;
			const skewFn = axis === 'x' ? `skewX(${sk}deg)` : `skewY(${sk}deg)`;
			return `
				opacity: ${t};
				transform: perspective(800px) scale(${sx.toFixed(3)}, ${sy.toFixed(3)}) ${skewFn};
				filter: blur(${(k * blur).toFixed(2)}px) brightness(${(1 + k * 0.6).toFixed(2)});
			`;
		}
	};
}
