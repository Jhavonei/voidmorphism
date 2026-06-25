/**
 * env — small, SSR-safe environment helpers shared across Spacemorphism.
 * Everything here is guarded so it can run during server rendering.
 */

export const isBrowser =
	typeof window !== 'undefined' && typeof document !== 'undefined';

/** Whether the user has asked for reduced motion. Safe on the server (→ false). */
export function prefersReducedMotion(): boolean {
	if (!isBrowser || typeof window.matchMedia !== 'function') return false;
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export type PerfTier = 'cinematic' | 'balanced' | 'eco';

export interface PerfSignals {
	/** navigator.hardwareConcurrency */
	cores?: number;
	/** navigator.deviceMemory (GB) */
	memory?: number;
	/** navigator.connection.saveData */
	saveData?: boolean;
	/** prefers-reduced-motion */
	reducedMotion?: boolean;
}

/**
 * Pure mapping from device signals → performance tier. Exported for testing.
 * - reduced-motion or save-data → eco
 * - plenty of cores + memory → cinematic
 * - constrained cores or memory → balanced
 */
export function perfTierFromSignals(s: PerfSignals): PerfTier {
	if (s.reducedMotion || s.saveData) return 'eco';
	const cores = s.cores ?? 4;
	const memory = s.memory ?? 4;
	if (cores >= 8 && memory >= 8) return 'cinematic';
	if (cores <= 4 || memory <= 4) return 'balanced';
	return 'balanced';
}

/** Detect the performance tier from the current device. SSR → 'balanced'. */
export function detectPerfTier(): PerfTier {
	if (!isBrowser) return 'balanced';
	const nav = navigator as Navigator & {
		deviceMemory?: number;
		connection?: { saveData?: boolean };
	};
	return perfTierFromSignals({
		cores: nav.hardwareConcurrency,
		memory: nav.deviceMemory,
		saveData: nav.connection?.saveData,
		reducedMotion: prefersReducedMotion()
	});
}
