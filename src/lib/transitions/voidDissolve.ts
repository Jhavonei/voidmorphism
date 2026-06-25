/**
 * Void Dissolve — dissolves the element into particles as it enters/exits.
 * Creates a "dissolving into the void" effect with blur and opacity.
 */

import type { TransitionConfig } from 'svelte/transition';
import { linear } from './easing.js';

export interface VoidDissolveOptions {
	/** Duration in milliseconds. Default: 800 */
	duration?: number;
	/** Easing function. Default: linear */
	easing?: (t: number) => number;
	/** Maximum blur in pixels. Default: 20 */
	blur?: number;
	/** Scale at peak dissolution. Default: 1.1 */
	scale?: number;
	/** Background color for the void effect (RGB). Default: '0, 0, 0' */
	voidColor?: string;
}

export function voidDissolve(
	node: Element,
	options: VoidDissolveOptions = {}
): TransitionConfig {
	const {
		duration = 800,
		easing = linear,
		blur = 20,
		scale = 1.1,
		voidColor = '0, 0, 0'
	} = options;

	const originalFilter = (node as HTMLElement).style.filter || '';

	return {
		duration,
		easing,
		css: (t: number) => {
			const opacity = t;
			const currentBlur = (1 - t) * blur;
			const currentScale = lerpScale(scale, t);
			return `
				opacity: ${opacity};
				filter: ${originalFilter} blur(${currentBlur}px);
				transform: scale(${currentScale});
				box-shadow: 0 0 ${(1 - t) * 60}px rgba(${voidColor}, ${(1 - t) * 0.8});
			`;
		}
	};
}

function lerpScale(target: number, t: number): number {
	// Peak at t=0.5, return to 1 at t=0 and t=1
	if (t < 0.5) {
		return 1 + (target - 1) * (t * 2);
	}
	return 1 + (target - 1) * ((1 - t) * 2);
}
