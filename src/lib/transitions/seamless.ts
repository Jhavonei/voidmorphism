/**
 * seamless — shared-element (FLIP) morphing. An element in one place flies and
 * morphs to its counterpart elsewhere, so navigations feel like one continuous
 * object moving through space rather than two separate fades.
 *
 * Built on Svelte's crossfade. Pair matching elements with the same `key`:
 *
 *   const { send, receive } = createSeamless();
 *   ...
 *   <div in:receive={{ key: 'card-1' }} out:send={{ key: 'card-1' }}>
 *
 * `seamless` is a ready-made default pair; `createSeamless` makes a fresh,
 * independent pair (use one per group of matched elements).
 */

import { crossfade } from 'svelte/transition';
import { cubicOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';

export interface SeamlessOptions {
	/** Duration in milliseconds for the morph. Default: 500 */
	duration?: number;
	/** Easing function. Default: cubicOut */
	easing?: (t: number) => number;
	/** Fallback blur (px) when no matching element exists. Default: 6 */
	fallbackBlur?: number;
}

export function createSeamless(options: SeamlessOptions = {}) {
	const { duration = 500, easing = cubicOut, fallbackBlur = 6 } = options;

	const [send, receive] = crossfade({
		duration,
		easing,
		fallback(node: Element): TransitionConfig {
			const style = getComputedStyle(node as HTMLElement);
			const transform = style.transform === 'none' ? '' : style.transform;
			return {
				duration,
				easing,
				css: (t: number) => `
					opacity: ${t};
					transform: ${transform} scale(${(0.94 + 0.06 * t).toFixed(3)});
					filter: blur(${((1 - t) * fallbackBlur).toFixed(2)}px);
				`
			};
		}
	});

	return { send, receive };
}

/** A ready-made default seamless pair. */
export const seamless = createSeamless();
