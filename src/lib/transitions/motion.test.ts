import { describe, it, expect } from 'vitest';
import { dissolve } from './dissolve.js';
import { dissipate } from './dissipate.js';
import { warp } from './warp.js';
import { gravityPulse } from './gravityPulse.js';
import { easeInOutSine, easeOutCirc, anticipate } from './easing.js';

// A minimal element stub good enough for css-based transitions.
function el(): Element {
	return { style: { filter: '' } } as unknown as Element;
}

describe('spacemorphism transitions', () => {
	it('dissolve returns a css transition with duration', () => {
		const cfg = dissolve(el(), { duration: 400 });
		expect(cfg.duration).toBe(400);
		expect(typeof cfg.css).toBe('function');
		const s = cfg.css!(0.5, 0.5);
		expect(s).toContain('opacity: 0.5');
		expect(s).toContain('blur(');
	});

	it('dissipate scatters sparks via box-shadow and fades them out when settled', () => {
		const cfg = dissipate(el(), { particles: 4, distance: 40 });
		const mid = cfg.css!(0.5, 0.5);
		expect(mid).toContain('box-shadow:');
		// At t=1 (settled) sparks have ~zero alpha.
		const end = cfg.css!(1, 1);
		expect(end).toContain('rgba(150, 195, 255, 0.000)');
		expect(end).toContain('opacity: 1');
	});

	it('warp stretches along the chosen axis', () => {
		const x = warp(el(), { axis: 'x', stretch: 1.4 }).css!(0, 0);
		// fully warped at t=0: scaleX > 1
		expect(x).toMatch(/scale\(1\.4/);
	});

	it('gravityPulse returns a css transition', () => {
		const cfg = gravityPulse(el(), { duration: 300 });
		expect(cfg.duration).toBe(300);
		expect(typeof cfg.css).toBe('function');
	});
});

describe('cinematic easings', () => {
	it('are bounded at 0 and 1', () => {
		for (const e of [easeInOutSine, easeOutCirc]) {
			expect(e(0)).toBeCloseTo(0);
			expect(e(1)).toBeCloseTo(1);
		}
		// anticipate dips below 0 before returning to 1
		expect(anticipate(0)).toBeCloseTo(0);
		expect(anticipate(1)).toBeCloseTo(1);
		expect(anticipate(0.2)).toBeLessThan(0);
	});

	it('easeInOutSine is symmetric around the midpoint', () => {
		expect(easeInOutSine(0.5)).toBeCloseTo(0.5);
	});
});
