// Main library entry point
export * from './transitions/index.js';

// Voidmorphism material system — core
export { default as VoidSurface } from './components/VoidSurface.svelte';
export { default as VoidFilters } from './components/VoidFilters.svelte';
export { default as VoidField } from './components/VoidField.svelte';

// Voidmorphism material system — components
export { default as VoidPanel } from './components/VoidPanel.svelte';
export { default as VoidCard } from './components/VoidCard.svelte';
export { default as VoidButton } from './components/VoidButton.svelte';
export { default as VoidInput } from './components/VoidInput.svelte';
export { default as VoidModal } from './components/VoidModal.svelte';
export { default as VoidNav } from './components/VoidNav.svelte';

// Animation components
export { default as GlitchText } from './components/GlitchText.svelte';
export { default as MorphContainer } from './components/MorphContainer.svelte';

// Interaction actions
export { gravityWell, type GravityWellOptions } from './actions/gravityWell.js';
export { resonance, type ResonanceOptions } from './actions/resonance.js';
