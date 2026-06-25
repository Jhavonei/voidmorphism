/**
 * Utility functions for voidmorphism transitions.
 */

import type { EasingFunction } from './easing.js';

/**
 * Clamps a value between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max);
}

/**
 * Linear interpolation between two values.
 */
export function lerp(start: number, end: number, t: number): number {
	return start + (end - start) * t;
}

/**
 * Maps a value from one range to another.
 */
export function mapRange(
	value: number,
	inMin: number,
	inMax: number,
	outMin: number,
	outMax: number
): number {
	return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

/**
 * Generates a random number between min and max.
 */
export function random(min: number, max: number): number {
	return Math.random() * (max - min) + min;
}

/**
 * Generates a random integer between min (inclusive) and max (inclusive).
 */
export function randomInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Creates a cubic-bezier easing function from control points.
 */
export function cubicBezier(
	x1: number,
	y1: number,
	x2: number,
	y2: number
): EasingFunction {
	return (t: number) => {
		// Use the control points to approximate the bezier curve
		const cx = 3 * x1;
		const bx = 3 * (x2 - x1) - cx;
		const ax = 1 - cx - bx;
		const cy = 3 * y1;
		const by = 3 * (y2 - y1) - cy;
		const ay = 1 - cy - by;

		// Solve for t given x (time), then return y (progress)
		let lo = 0;
		let hi = 1;
		let mid = t;

		for (let i = 0; i < 8; i++) {
			mid = (lo + hi) / 2;
			const x = ((ax * mid + bx) * mid + cx) * mid;
			if (x < t) lo = mid;
			else hi = mid;
		}

		return ((ay * mid + by) * mid + cy) * mid;
	};
}

/**
 * Creates a stepped easing function that jumps in discrete steps.
 */
export function steps(stepCount: number, start = false): EasingFunction {
	return (t: number) => {
		const step = 1 / stepCount;
		const result = Math.floor(t / step) * step;
		return start ? result + step : result;
	};
}

/**
 * Combines multiple easing functions sequentially.
 * Each easing applies to a segment of the total duration.
 */
export function sequenceEasing(
	...easings: Array<{ easing: EasingFunction; weight: number }>
): EasingFunction {
	const totalWeight = easings.reduce((sum, e) => sum + e.weight, 0);
	return (t: number) => {
		let accumulatedTime = 0;
		let accumulatedOutput = 0;
		for (const { easing, weight } of easings) {
			const segmentDuration = weight / totalWeight;
			if (t <= accumulatedTime + segmentDuration) {
				const localT = (t - accumulatedTime) / segmentDuration;
				return accumulatedOutput + easing(clamp(localT, 0, 1)) * segmentDuration;
			}
			accumulatedTime += segmentDuration;
			accumulatedOutput += segmentDuration;
		}
		return 1;
	};
}
