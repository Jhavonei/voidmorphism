/**
 * site — showcase-only UI state (theme, perf tier) backed by the library's
 * config. Lives under routes/_site so it is never published in the package.
 */

import { setSpaceConfig, type PerfTier } from '$lib/index.js';

export type Theme = 'dark' | 'light';

export const ui = $state<{ theme: Theme; perf: PerfTier }>({
	theme: 'dark',
	perf: 'cinematic'
});

export function applyTheme(theme: Theme) {
	ui.theme = theme;
	if (typeof document !== 'undefined') document.documentElement.dataset.smTheme = theme;
}

export function toggleTheme() {
	applyTheme(ui.theme === 'dark' ? 'light' : 'dark');
}

export function applyPerf(perf: PerfTier) {
	ui.perf = perf;
	setSpaceConfig({ perf });
}

export const perfTiers: PerfTier[] = ['cinematic', 'balanced', 'eco'];
