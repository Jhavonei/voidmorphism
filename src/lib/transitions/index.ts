// Transitions barrel export
export { voidDissolve, type VoidDissolveOptions } from './voidDissolve.js';
export { glitch, type GlitchOptions } from './glitch.js';
export { morph, type MorphOptions } from './morph.js';
export { phaseShift, type PhaseShiftOptions } from './phaseShift.js';
export { pixelate, type PixelateOptions } from './pixelate.js';
export { shatter, type ShatterOptions } from './shatter.js';
export { voidPulse, type VoidPulseOptions } from './voidPulse.js';

// Easing functions
export {
	linear,
	easeInOutCubic,
	easeOutExpo,
	easeInExpo,
	easeInOutExpo,
	easeOutBack,
	easeInBack,
	easeInOutBack,
	easeOutElastic,
	easeInElastic,
	easeInOutElastic,
	easeOutBounce,
	easeInBounce,
	easeInOutBounce,
	type EasingFunction
} from './easing.js';

// Utilities
export {
	clamp,
	lerp,
	mapRange,
	random,
	randomInt,
	cubicBezier,
	steps,
	sequenceEasing
} from './utils.js';
