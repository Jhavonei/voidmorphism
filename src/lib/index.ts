// Main library entry point
export * from './transitions/index.js';

// Spacemorphism material system — core
export { default as SpaceSurface } from './components/SpaceSurface.svelte';
export { default as SpaceFilters } from './components/SpaceFilters.svelte';
export { default as SpaceField } from './components/SpaceField.svelte';

// Spacemorphism material system — components
export { default as SpacePanel } from './components/SpacePanel.svelte';
export { default as SpaceCard } from './components/SpaceCard.svelte';
export { default as SpaceButton } from './components/SpaceButton.svelte';
export { default as SpaceInput } from './components/SpaceInput.svelte';
export { default as SpaceModal } from './components/SpaceModal.svelte';
export { default as SpaceNav } from './components/SpaceNav.svelte';

// Animation components
export { default as GlitchText } from './components/GlitchText.svelte';
export { default as MorphContainer } from './components/MorphContainer.svelte';

// Signature: the gravity comet cursor
export { default as CometCursor } from './components/CometCursor.svelte';

// Backgrounds & fields
export { default as StarDust } from './components/StarDust.svelte';
export { default as Constellation } from './components/Constellation.svelte';
export { default as DotField } from './components/DotField.svelte';
export { default as StarGrid } from './components/StarGrid.svelte';
export { default as GravityRipple } from './components/GravityRipple.svelte';

// Motion accents
export { default as SpaceBeam } from './components/SpaceBeam.svelte';
export { default as BorderBeam } from './components/BorderBeam.svelte';
export { default as ShineBorder } from './components/ShineBorder.svelte';
export { default as OrbitingBodies } from './components/OrbitingBodies.svelte';
export { default as Marquee } from './components/Marquee.svelte';
export { default as ShimmerButton } from './components/ShimmerButton.svelte';

// Interaction actions
export { gravityWell, type GravityWellOptions } from './actions/gravityWell.js';
export { resonance, type ResonanceOptions } from './actions/resonance.js';

// Core: quality-of-life systems (perf tiers, global config, shared rAF)
export {
	isBrowser,
	prefersReducedMotion,
	detectPerfTier,
	perfTierFromSignals,
	type PerfTier,
	type PerfSignals
} from './core/env.js';
export {
	getSpaceConfig,
	setSpaceConfig,
	autoConfig,
	onSpaceConfig,
	type SpaceConfig
} from './core/config.js';
export { onFrame, whenVisible } from './core/raf.js';

// Core: the shared spacetime gravity field
export {
	registerBody,
	getPointer,
	trackPointer,
	getMass,
	setMass,
	proximity,
	damp,
	tiltFor,
	type BodyOptions,
	type BodyHandle
} from './core/spacetime.js';
