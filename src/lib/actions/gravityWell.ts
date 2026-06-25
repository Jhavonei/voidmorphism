/**
 * gravityWell — a Svelte action that makes a surface feel massive.
 *
 * As the pointer approaches, the element:
 *   - attracts starlight toward the cursor (writes --sm-mx / --sm-my)
 *   - registers a gravitational "pull" (--sm-pull, 0 → 1)
 *   - tilts gently toward the cursor (--sm-tilt-x / --sm-tilt-y)
 *
 * These CSS variables are consumed by `.sm-surface` in spacemorphism.css.
 * The actual physics run in the shared spacetime field (one listener + one
 * rAF for the whole page) — this action just registers the node as a body.
 *
 * Usage:
 *   <div class="sm-surface" use:gravityWell={{ tilt: 6, pull: 1 }}>…</div>
 */

import { registerBody } from '../core/spacetime.js';

export interface GravityWellOptions {
	/** Max tilt in degrees toward the cursor. Default: 6. Set 0 to disable tilt. */
	tilt?: number;
	/** Strength of the light/pull response, 0–1. Default: 1. */
	pull?: number;
	/** Radius (px) beyond the element bounds where attraction begins. Default: 120. */
	field?: number;
	/** Disable the whole effect (e.g. for reduced motion). Default: false. */
	disabled?: boolean;
}

export function gravityWell(node: HTMLElement, options: GravityWellOptions = {}) {
	const handle = registerBody(node, options);
	return {
		update(next: GravityWellOptions = {}) {
			handle.update(next);
		},
		destroy() {
			handle.destroy();
		}
	};
}
