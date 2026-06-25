import { describe, it, expect } from 'vitest';
import { resolutionScaleForTier, lensDeflection } from './blackhole-math.js';

describe('blackhole math', () => {
	it('scales render resolution down for cheaper tiers', () => {
		expect(resolutionScaleForTier('cinematic')).toBe(1);
		expect(resolutionScaleForTier('balanced')).toBeLessThan(1);
		expect(resolutionScaleForTier('eco')).toBeLessThan(resolutionScaleForTier('balanced'));
	});

	it('lens deflection is strong near the center and decays with distance', () => {
		const near = lensDeflection(0.05, 1);
		const far = lensDeflection(1.0, 1);
		expect(near).toBeGreaterThan(far);
		// mass scales the effect linearly
		expect(lensDeflection(0.2, 2)).toBeCloseTo(lensDeflection(0.2, 1) * 2);
	});
});
