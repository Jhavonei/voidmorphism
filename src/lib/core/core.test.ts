import { describe, it, expect, vi, afterEach } from 'vitest';
import { perfTierFromSignals } from './env.js';
import { onFrame, frameSubscriberCount } from './raf.js';

describe('perfTierFromSignals', () => {
	it('returns eco for reduced motion or save-data regardless of hardware', () => {
		expect(perfTierFromSignals({ cores: 16, memory: 16, reducedMotion: true })).toBe('eco');
		expect(perfTierFromSignals({ cores: 16, memory: 16, saveData: true })).toBe('eco');
	});

	it('returns cinematic only for high-end cores and memory', () => {
		expect(perfTierFromSignals({ cores: 8, memory: 8 })).toBe('cinematic');
		expect(perfTierFromSignals({ cores: 12, memory: 16 })).toBe('cinematic');
	});

	it('returns balanced for constrained cores or memory', () => {
		expect(perfTierFromSignals({ cores: 4, memory: 16 })).toBe('balanced');
		expect(perfTierFromSignals({ cores: 16, memory: 4 })).toBe('balanced');
	});

	it('defaults to balanced when signals are unknown', () => {
		expect(perfTierFromSignals({})).toBe('balanced');
	});
});

describe('onFrame', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('registers and unregisters frame subscribers', () => {
		// Stub rAF so the loop schedules but does not actually run in jsdom.
		vi.stubGlobal('requestAnimationFrame', vi.fn(() => 1));
		const before = frameSubscriberCount();
		const stop = onFrame(() => {});
		expect(frameSubscriberCount()).toBe(before + 1);
		stop();
		expect(frameSubscriberCount()).toBe(before);
		vi.unstubAllGlobals();
	});
});
