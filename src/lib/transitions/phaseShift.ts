/**
 * Phase Shift — element phases in/out with a ripple/wave distortion.
 * Creates a "dimensional shift" effect with wave-based opacity and scale.
 */

import type { TransitionConfig } from 'svelte/transition';
import { easeOutExpo } from './easing.js';

export interface PhaseShiftOptions {
	/** Duration in milliseconds. Default: 900 */
	duration?: number;
	/** Easing function. Default: easeOutExpo */
	easing?: (t: number) => number;
	/** Wave frequency. Higher = more ripples. Default: 3 */
	frequency?: number;
	/** Wave amplitude in pixels. Default: 15 */
	amplitude?: number;
	/** Starting scale. Default: 0.8 */
	startScale?: number;
	/** Hue rotation in degrees at peak. Default: 120 */
	hueShift?: number;
}

export function phaseShift(
	node: Element,
	options: PhaseShiftOptions = {}
): TransitionConfig {
	const {
		duration = 900,
		easing = easeOutExpo,
		frequency = 3,
		amplitude = 15,
		startScale = 0.8,
		hueShift = 120
	} = options;

	const originalFilter = (node as HTMLElement).style.filter || '';

	return {
		duration,
		easing,
		css: (t: number) => {
			const wave = Math.sin(t * Math.PI * frequency) * (1 - t);
			const scale = lerp(startScale, 1, t);
			const opacity = t;
			const currentHue = (1 - t) * hueShift;
			const translateY = wave * amplitude;

			return `
				opacity: ${opacity};
				transform: scale(${scale}) translateY(${translateY}px);
				filter: ${originalFilter} hue-rotate(${currentHue}deg) brightness(${1 + (1 - t) * 0.3});
			`;
		}
	};
}

function lerp(start: number, end: number, t: number): number {
	return start + (end - start) * t;
}
