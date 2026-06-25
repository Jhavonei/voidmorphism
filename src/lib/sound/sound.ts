/**
 * sound — optional, synthesized sci-fi UI sound + haptics. No audio assets:
 * tones are generated with the Web Audio API. Disabled by default and
 * remembered in localStorage, so nothing ever plays without opt-in.
 *
 *   import { setSoundEnabled, playSound, vibrate } from 'svelte-spacemorphism';
 *   setSoundEnabled(true);
 *   playSound('press');
 */

import { isBrowser } from '../core/env.js';

export type SoundName = 'hover' | 'press' | 'success' | 'warp';

export interface ToneParams {
	/** Base frequency in Hz. */
	freq: number;
	/** Oscillator type. */
	type: OscillatorType;
	/** Duration in seconds. */
	duration: number;
	/** Optional end frequency for a sweep. */
	sweepTo?: number;
}

/** Pure mapping from a sound name to its synthesis parameters (testable). */
export function toneParams(name: SoundName): ToneParams {
	switch (name) {
		case 'hover':
			return { freq: 880, type: 'sine', duration: 0.06 };
		case 'press':
			return { freq: 320, type: 'triangle', duration: 0.12, sweepTo: 180 };
		case 'success':
			return { freq: 520, type: 'sine', duration: 0.28, sweepTo: 880 };
		case 'warp':
			return { freq: 140, type: 'sawtooth', duration: 0.45, sweepTo: 40 };
	}
}

const STORAGE_KEY = 'sm-sound';

let enabled = false;
let ctx: AudioContext | null = null;
const listeners = new Set<(on: boolean) => void>();

if (isBrowser) {
	try {
		enabled = localStorage.getItem(STORAGE_KEY) === 'on';
	} catch {
		enabled = false;
	}
}

export function isSoundEnabled(): boolean {
	return enabled;
}

export function setSoundEnabled(on: boolean): void {
	enabled = on;
	if (isBrowser) {
		try {
			localStorage.setItem(STORAGE_KEY, on ? 'on' : 'off');
		} catch {
			/* ignore storage failures */
		}
	}
	for (const fn of listeners) fn(on);
}

export function onSoundChange(fn: (on: boolean) => void): () => void {
	listeners.add(fn);
	return () => listeners.delete(fn);
}

function audio(): AudioContext | null {
	if (!isBrowser) return null;
	if (!ctx) {
		const AC =
			window.AudioContext ||
			(window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
		if (!AC) return null;
		ctx = new AC();
	}
	return ctx;
}

/** Play a synthesized UI sound. No-op unless enabled and audio is available. */
export function playSound(name: SoundName): void {
	if (!enabled) return;
	const ac = audio();
	if (!ac) return;
	if (ac.state === 'suspended') ac.resume().catch(() => {});

	const { freq, type, duration, sweepTo } = toneParams(name);
	const osc = ac.createOscillator();
	const gain = ac.createGain();
	const now = ac.currentTime;

	osc.type = type;
	osc.frequency.setValueAtTime(freq, now);
	if (sweepTo !== undefined) osc.frequency.exponentialRampToValueAtTime(sweepTo, now + duration);

	gain.gain.setValueAtTime(0.0001, now);
	gain.gain.exponentialRampToValueAtTime(0.12, now + 0.01);
	gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

	osc.connect(gain).connect(ac.destination);
	osc.start(now);
	osc.stop(now + duration + 0.02);
}

/** Trigger device haptics if supported and sound is enabled. */
export function vibrate(pattern: number | number[] = 12): void {
	if (!enabled || !isBrowser) return;
	if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
		navigator.vibrate(pattern);
	}
}
