import { describe, it, expect } from 'vitest';
import { toneParams, isSoundEnabled, setSoundEnabled } from './sound.js';

describe('sound', () => {
	it('maps each sound name to distinct synthesis params', () => {
		const names = ['hover', 'press', 'success', 'warp'] as const;
		const freqs = names.map((n) => toneParams(n).freq);
		// all defined and positive
		for (const f of freqs) expect(f).toBeGreaterThan(0);
		// distinct frequencies
		expect(new Set(freqs).size).toBe(names.length);
		// sweeps where expected
		expect(toneParams('warp').sweepTo).toBeDefined();
		expect(toneParams('hover').sweepTo).toBeUndefined();
	});

	it('is disabled by default and can be toggled', () => {
		expect(isSoundEnabled()).toBe(false);
		setSoundEnabled(true);
		expect(isSoundEnabled()).toBe(true);
		setSoundEnabled(false);
		expect(isSoundEnabled()).toBe(false);
	});
});
