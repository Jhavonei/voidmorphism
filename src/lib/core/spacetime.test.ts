import { describe, it, expect, vi, afterEach } from 'vitest';
import { proximity, damp, tiltFor, registerBody, bodyCount } from './spacetime.js';

describe('spacetime pure helpers', () => {
	it('proximity is 1 at the edge and 0 at/after the field radius', () => {
		expect(proximity(0, 100)).toBe(1);
		expect(proximity(50, 100)).toBeCloseTo(0.5);
		expect(proximity(100, 100)).toBe(0);
		expect(proximity(10, 0)).toBe(0);
	});

	it('damp eases toward the target and settles exactly', () => {
		expect(damp(0, 10, 0.1)).toBeCloseTo(1);
		expect(damp(10, 10)).toBe(10);
	});

	it('tiltFor leans into the cursor', () => {
		// pointer to the right of center → positive rotateY (ty), no rotateX
		const right = tiltFor(50, 0, 50, 50, 100, 6);
		expect(right.ty).toBeGreaterThan(0);
		expect(right.tx).toBeCloseTo(0);
		// pointer below center → negative rotateX (tx)
		const below = tiltFor(0, 50, 50, 50, 100, 6);
		expect(below.tx).toBeLessThan(0);
	});
});

describe('registerBody', () => {
	afterEach(() => vi.restoreAllMocks());

	it('adds and removes gravitational bodies', () => {
		vi.stubGlobal('requestAnimationFrame', vi.fn(() => 1));
		const node = document.createElement('div');
		const before = bodyCount();
		const handle = registerBody(node, { tilt: 4 });
		expect(bodyCount()).toBe(before + 1);
		handle.destroy();
		expect(bodyCount()).toBe(before);
		vi.unstubAllGlobals();
	});
});
