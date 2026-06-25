/**
 * blackhole-math — pure helpers for the WebGL black hole, kept separate so the
 * physics-ish math is unit-testable without a GL context.
 */

import type { PerfTier } from '../core/env.js';

/** Render-resolution multiplier per performance tier (device-pixel cap aside). */
export function resolutionScaleForTier(tier: PerfTier): number {
	switch (tier) {
		case 'cinematic':
			return 1;
		case 'balanced':
			return 0.75;
		case 'eco':
			return 0.5;
	}
}

/**
 * Screen-space gravitational deflection magnitude at normalized radius `r`
 * from the hole for a given mass. Mirrors the shader's lensing term so tests
 * can assert its shape: strong near the center, decaying with distance.
 */
export function lensDeflection(r: number, mass: number): number {
	return (mass * 0.15) / (r * r + 0.02);
}
