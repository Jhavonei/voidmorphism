/**
 * resonance — a Svelte action that makes components react to nearby elements,
 * as if they share one continuous energy field. Surfaces near the pointer (and
 * therefore near each other) glow in unison, creating a living, unified material.
 *
 * It reads the pointer from the shared spacetime field and updates on the shared
 * rAF loop, so every resonant node pulses together rather than independently —
 * the "one substance" feel — with no per-node listeners.
 *
 * Usage:
 *   <div class="sm-surface" use:resonance>…</div>
 *   <div class="sm-surface" use:resonance={{ radius: 320, color: '212 90% 72%' }}>…</div>
 */

import { trackPointer, getPointer } from '../core/spacetime.js';
import { onFrame } from '../core/raf.js';
import { prefersReducedMotion } from '../core/env.js';

export interface ResonanceOptions {
	/** Radius (px) of the resonance field around the pointer. Default: 280. */
	radius?: number;
	/** Glow color as HSL components, e.g. '212 90% 72%'. Defaults to the cold accent. */
	color?: string;
	/** Peak glow intensity, 0–1. Default: 1. */
	intensity?: number;
	/** Disable the effect. Default: false. */
	disabled?: boolean;
}

export function resonance(node: HTMLElement, options: ResonanceOptions = {}) {
	let { radius = 280, color = '', intensity = 1, disabled = false } = options;
	const reduced = prefersReducedMotion();

	let current = 0;

	node.style.setProperty('--sm-resonance', '0 0 0 0 transparent');
	trackPointer();

	const stop = onFrame(() => {
		let target = 0;
		if (!disabled && !reduced) {
			const { x, y } = getPointer();
			const r = node.getBoundingClientRect();
			const cx = r.left + r.width / 2;
			const cy = r.top + r.height / 2;
			const dist = Math.hypot(x - cx, y - cy);
			target = Math.max(0, 1 - dist / radius);
		}
		current += (target - current) * 0.1;
		const g = current * intensity;
		const hsl = color || '212 90% 72%';
		node.style.setProperty(
			'--sm-resonance',
			`0 0 ${(20 + g * 60).toFixed(0)}px ${(-12 + g * 6).toFixed(0)}px hsla(${hsl}, ${(g * 0.55).toFixed(3)})`
		);
	});

	return {
		update(next: ResonanceOptions = {}) {
			({ radius = 280, color = '', intensity = 1, disabled = false } = next);
		},
		destroy() {
			stop();
		}
	};
}
