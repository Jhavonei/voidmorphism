/**
 * Shatter — element shatters into fragments as it enters/exits.
 * Creates a "breaking glass" effect with clip-path shards.
 */

import type { TransitionConfig } from 'svelte/transition';
import { easeInOutCubic } from './easing.js';

export interface ShatterOptions {
	/** Duration in milliseconds. Default: 700 */
	duration?: number;
	/** Easing function. Default: easeInOutCubic */
	easing?: (t: number) => number;
	/** Number of shard columns. Default: 4 */
	shards?: number;
	/** Maximum shard displacement in pixels. Default: 30 */
	displacement?: number;
	/** Maximum rotation in degrees. Default: 45 */
	rotation?: number;
}

export function shatter(
	node: Element,
	options: ShatterOptions = {}
): TransitionConfig {
	return {
		duration: options.duration ?? 700,
		easing: options.easing ?? easeInOutCubic,
		css: (t: number) => {
			const shards = options.shards ?? 4;
			const displacement = options.displacement ?? 30;
			const rotation = options.rotation ?? 45;
			const opacity = t;
			const offset = (1 - t) * displacement;
			const rotate = (1 - t) * rotation;
			const scale = 0.8 + t * 0.2;

			// Create a shard-like clip path that assembles
			const shardWidth = 100 / shards;
			const clipParts: string[] = [];
			for (let i = 0; i < shards; i++) {
				const left = i * shardWidth;
				const right = (i + 1) * shardWidth;
				const stagger = Math.sin(i * 1.7) * offset;
				clipParts.push(
					`polygon(${left}% ${stagger * 0.3}%, ${right}% ${stagger * -0.3}%, ${right}% 100%, ${left}% 100%)`
				);
			}

			return `
				opacity: ${opacity};
				transform: scale(${scale}) rotate(${rotate * (1 - t) * 0.1}deg);
				clip-path: ${clipParts[0]};
			`;
		}
	};
}
