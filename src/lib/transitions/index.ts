// Transitions barrel export
export { dissolve, type DissolveOptions } from './dissolve.js';
export { dissipate, type DissipateOptions } from './dissipate.js';
export { warp, type WarpOptions } from './warp.js';
export { gravityPulse, type GravityPulseOptions } from './gravityPulse.js';
export { seamless, createSeamless, type SeamlessOptions } from './seamless.js';
export { glitch, type GlitchOptions } from './glitch.js';
export { morph, type MorphOptions } from './morph.js';
export { phaseShift, type PhaseShiftOptions } from './phaseShift.js';
export { pixelate, type PixelateOptions } from './pixelate.js';
export { shatter, type ShatterOptions } from './shatter.js';

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
	easeInOutSine,
	easeOutCirc,
	anticipate,
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
