/**
 * dissipate — the element scatters into drifting star dust as it leaves, and
 * re-forms from dust as it enters. Sparks fly outward in random directions and
 * fade, while the body blurs and settles.
 */

import type { TransitionConfig } from 'svelte/transition';
import { easeOutExpo } from './easing.js';

export interface DissipateOptions {
	/** Duration in milliseconds. Default: 700 */
	duration?: number;
	/** Easing function. Default: easeOutExpo */
	easing?: (t: number) => number;
	/** Number of dust sparks. Default: 16 */
	particles?: number;
	/** How far sparks drift in px. Default: 44 */
	distance?: number;
	/** Body blur at full dissipation in px. Default: 12 */
	blur?: number;
	/** Spark color (RGB components). Default: cold star-white '150, 195, 255' */
	color?: string;
}

export function dissipate(node: Element, options: DissipateOptions = {}): TransitionConfig {
	const {
		duration = 700,
		easing = easeOutExpo,
		particles = 16,
		distance = 44,
		blur = 12,
		color = '150, 195, 255'
	} = options;

	// Pre-compute random spark directions so they stay stable across frames.
	const sparks = Array.from({ length: particles }, () => {
		const a = Math.random() * Math.PI * 2;
		return { x: Math.cos(a), y: Math.sin(a), d: 0.5 + Math.random() * 0.5 };
	});

	return {
		duration,
		easing,
		css: (t: number) => {
			const k = 1 - t; // 1 = fully dissipated, 0 = settled
			const shadows = sparks
				.map((p) => {
					const dist = k * distance * p.d;
					const ox = (p.x * dist).toFixed(1);
					const oy = (p.y * dist).toFixed(1);
					return `${ox}px ${oy}px ${(k * 6).toFixed(1)}px ${(-k * 3).toFixed(1)}px rgba(${color}, ${(k * 0.5).toFixed(3)})`;
				})
				.join(', ');
			return `
				opacity: ${t};
				filter: blur(${(k * blur).toFixed(1)}px);
				transform: scale(${(1 - k * 0.06).toFixed(3)});
				box-shadow: ${shadows};
			`;
		}
	};
}
