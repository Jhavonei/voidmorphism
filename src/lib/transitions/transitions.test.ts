import { describe, it, expect } from 'vitest';
import { clamp, lerp, mapRange, randomInt, cubicBezier, steps, sequenceEasing } from './utils.js';
import {
	linear,
	easeInOutCubic,
	easeOutExpo,
	easeOutBack,
	easeOutElastic,
	easeOutBounce
} from './easing.js';

describe('Utils', () => {
	describe('clamp', () => {
		it('clamps values within range', () => {
			expect(clamp(5, 0, 10)).toBe(5);
			expect(clamp(-1, 0, 10)).toBe(0);
			expect(clamp(11, 0, 10)).toBe(10);
		});
	});

	describe('lerp', () => {
		it('interpolates between two values', () => {
			expect(lerp(0, 10, 0)).toBe(0);
			expect(lerp(0, 10, 1)).toBe(10);
			expect(lerp(0, 10, 0.5)).toBe(5);
		});
	});

	describe('mapRange', () => {
		it('maps a value from one range to another', () => {
			expect(mapRange(5, 0, 10, 0, 100)).toBe(50);
			expect(mapRange(0, 0, 10, 0, 100)).toBe(0);
			expect(mapRange(10, 0, 10, 0, 100)).toBe(100);
		});
	});

	describe('randomInt', () => {
		it('returns integers within range', () => {
			for (let i = 0; i < 100; i++) {
				const result = randomInt(1, 10);
				expect(result).toBeGreaterThanOrEqual(1);
				expect(result).toBeLessThanOrEqual(10);
				expect(Number.isInteger(result)).toBe(true);
			}
		});
	});

	describe('cubicBezier', () => {
		it('returns a function', () => {
			const ease = cubicBezier(0.25, 0.1, 0.25, 1);
			expect(typeof ease).toBe('function');
		});

		it('returns 0 at t=0 and 1 at t=1', () => {
			const ease = cubicBezier(0.25, 0.1, 0.25, 1);
			expect(ease(0)).toBeCloseTo(0, 2);
			expect(ease(1)).toBeCloseTo(1, 2);
		});
	});

	describe('steps', () => {
		it('creates stepped easing', () => {
			const stepEase = steps(4);
			expect(stepEase(0)).toBe(0);
			expect(stepEase(0.24)).toBe(0);
			expect(stepEase(0.25)).toBe(0.25);
			expect(stepEase(0.5)).toBe(0.5);
			expect(stepEase(0.9)).toBe(0.75);
		});
	});

	describe('sequenceEasing', () => {
		it('combines easing functions', () => {
			const seq = sequenceEasing(
				{ easing: linear, weight: 1 },
				{ easing: linear, weight: 1 }
			);
			expect(seq(0)).toBe(0);
			expect(seq(1)).toBe(1);
			expect(seq(0.5)).toBe(0.5);
		});
	});
});

describe('Easing Functions', () => {
	it('linear returns input', () => {
		expect(linear(0)).toBe(0);
		expect(linear(0.5)).toBe(0.5);
		expect(linear(1)).toBe(1);
	});

	it('easeInOutCubic returns 0 at t=0 and 1 at t=1', () => {
		expect(easeInOutCubic(0)).toBe(0);
		expect(easeInOutCubic(1)).toBe(1);
	});

	it('easeOutExpo returns 0 at t=0 and 1 at t=1', () => {
		expect(easeOutExpo(0)).toBe(0);
		expect(easeOutExpo(1)).toBe(1);
	});

	it('easeOutBack returns 1 at t=1', () => {
		expect(easeOutBack(1)).toBe(1);
	});

	it('easeOutElastic returns 0 at t=0 and 1 at t=1', () => {
		expect(easeOutElastic(0)).toBe(0);
		expect(easeOutElastic(1)).toBe(1);
	});

	it('easeOutBounce returns 0 at t=0 and 1 at t=1', () => {
		expect(easeOutBounce(0)).toBe(0);
		expect(easeOutBounce(1)).toBe(1);
	});

	it('all easings return values between -1 and 2 for t in [0,1]', () => {
		const easings = [linear, easeInOutCubic, easeOutExpo, easeOutBack, easeOutElastic, easeOutBounce];
		for (const easing of easings) {
			for (let i = 0; i <= 100; i++) {
				const t = i / 100;
				const result = easing(t);
				expect(result).toBeGreaterThanOrEqual(-1);
				expect(result).toBeLessThanOrEqual(2);
			}
		}
	});
});
