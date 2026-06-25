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

// Interaction actions
export { gravityWell, type GravityWellOptions } from './actions/gravityWell.js';
export { resonance, type ResonanceOptions } from './actions/resonance.js';
