/**
 * config — global Spacemorphism configuration. A tiny reactive-friendly store
 * that writes to the document root so CSS and every component react together.
 *
 *   import { setSpaceConfig, autoConfig } from 'svelte-spacemorphism';
 *   autoConfig();                          // detect tier from the device
 *   setSpaceConfig({ chroma: 0 });         // go pure grayscale
 *   setSpaceConfig({ perf: 'eco' });       // force the cheapest tier
 */

import { isBrowser, detectPerfTier, type PerfTier } from './env.js';

export interface SpaceConfig {
	/** Performance tier — scales blur, particle counts, refraction, frame caps. */
	perf: PerfTier;
	/** Cold-accent chroma, 0 (pure grayscale) → 1 (full cold accent). */
	chroma: number;
	/** Density multiplier for particle/star counts and spacing, 0 → 1+. */
	density: number;
}

const config: SpaceConfig = {
	perf: 'cinematic',
	chroma: 1,
	density: 1
};

const listeners = new Set<(c: SpaceConfig) => void>();

/** Current configuration (a copy — mutate via setSpaceConfig). */
export function getSpaceConfig(): SpaceConfig {
	return { ...config };
}

/** Merge a partial config, apply it to the document, and notify listeners. */
export function setSpaceConfig(next: Partial<SpaceConfig>): SpaceConfig {
	if (next.chroma !== undefined) config.chroma = clamp01(next.chroma);
	if (next.density !== undefined) config.density = Math.max(0, next.density);
	if (next.perf !== undefined) config.perf = next.perf;
	apply();
	const snapshot = getSpaceConfig();
	for (const fn of listeners) fn(snapshot);
	return snapshot;
}

/** Detect the device tier and apply it. Call once at app start (client only). */
export function autoConfig(): SpaceConfig {
	return setSpaceConfig({ perf: detectPerfTier() });
}

/** Subscribe to config changes. Returns an unsubscribe function. */
export function onSpaceConfig(fn: (c: SpaceConfig) => void): () => void {
	listeners.add(fn);
	return () => listeners.delete(fn);
}

function apply(): void {
	if (!isBrowser) return;
	const root = document.documentElement;
	root.dataset.smPerf = config.perf;
	root.style.setProperty('--sm-accent-chroma', String(config.chroma));
	root.style.setProperty('--sm-density', String(config.density));
}

function clamp01(v: number): number {
	return Math.min(1, Math.max(0, v));
}
