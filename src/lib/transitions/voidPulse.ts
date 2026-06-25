/**
 * Void Pulse — element enters/exits with a pulsing energy wave.
 * Creates a "shockwave" effect with expanding rings.
 */

import type { TransitionConfig } from 'svelte/transition';
import { easeOutExpo } from './easing.js';

export interface VoidPulseOptions {
	/** Duration in milliseconds. Default: 800 */
	duration?: number;
	/** Easing function. Default: easeOutExpo */
	easing?: (t: number) => number;
	/** Number of pulse rings. Default: 3 */
	pulses?: number;
	/** Maximum pulse scale. Default: 1.5 */
	pulseScale?: number;
	/** Base scale. Default: 0.5 */
	startScale?: number;
	/** Glow color (RGB). Default: '100, 200, 255' */
	glowColor?: string;
}

export function voidPulse(
	node: Element,
	options: VoidPulseOptions = {}
): TransitionConfig {
	const {
		duration = 800,
		easing = easeOutExpo,
		pulses = 3,
		pulseScale = 1.5,
		startScale = 0.5,
		glowColor = '100, 200, 255'
	} = options;

	return {
		duration,
		easing,
		css: (t: number) => {
			const baseScale = lerp(startScale, 1, t);
			const opacity = t;
			const glowIntensity = (1 - t) * 0.8;

			// Calculate pulse wave
			let pulseScale = 1;
			for (let i = 0; i < pulses; i++) {
				const phase = (t * pulses - i) % 1;
				if (phase > 0 && phase < 1) {
					pulseScale *= 1 + Math.sin(phase * Math.PI) * (pulseScale - 1) * 0.1;
				}
			}

			const shadowSpread = (1 - t) * 40;

			return `
				opacity: ${opacity};
				transform: scale(${baseScale * pulseScale});
				box-shadow:
					0 0 ${shadowSpread}px rgba(${glowColor}, ${glowIntensity}),
					0 0 ${shadowSpread * 2}px rgba(${glowColor}, ${glowIntensity * 0.5});
			`;
		}
	};
}

function lerp(start: number, end: number, t: number): number {
	return start + (end - start) * t;
}
