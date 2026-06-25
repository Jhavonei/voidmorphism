/**
 * Easing functions for voidmorphism transitions.
 * Includes standard eases plus custom ones tuned for morphing effects.
 */

export type EasingFunction = (t: number) => number;

export const linear: EasingFunction = (t) => t;

export const easeInOutCubic: EasingFunction = (t) =>
	t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export const easeOutExpo: EasingFunction = (t) =>
	t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

export const easeInExpo: EasingFunction = (t) =>
	t === 0 ? 0 : Math.pow(2, 10 * t - 10);

export const easeInOutExpo: EasingFunction = (t) => {
	if (t === 0) return 0;
	if (t === 1) return 1;
	return t < 0.5
		? Math.pow(2, 20 * t - 10) / 2
		: (2 - Math.pow(2, -20 * t + 10)) / 2;
};

export const easeOutBack: EasingFunction = (t) => {
	const c1 = 1.70158;
	const c3 = c1 + 1;
	return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

export const easeInBack: EasingFunction = (t) => {
	const c1 = 1.70158;
	const c3 = c1 + 1;
	return c3 * t * t * t - c1 * t * t;
};

export const easeInOutBack: EasingFunction = (t) => {
	const c1 = 1.70158;
	const c2 = c1 * 1.525;
	return t < 0.5
		? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
		: (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
};

export const easeOutElastic: EasingFunction = (t) => {
	const c4 = (2 * Math.PI) / 3;
	return t === 0
		? 0
		: t === 1
			? 1
			: Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
};

export const easeInElastic: EasingFunction = (t) => {
	const c4 = (2 * Math.PI) / 3;
	return t === 0
		? 0
		: t === 1
			? 1
			: -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * c4);
};

export const easeInOutElastic: EasingFunction = (t) => {
	const c5 = (2 * Math.PI) / 4.5;
	return t === 0
		? 0
		: t === 1
			? 1
			: t < 0.5
				? -(Math.pow(2, 20 * t - 10) * Math.sin((20 * t - 11.125) * c5)) / 2
				: (Math.pow(2, -20 * t + 10) * Math.sin((20 * t - 11.125) * c5)) / 2 + 1;
};

export const easeOutBounce: EasingFunction = (t) => {
	const n1 = 7.5625;
	const d1 = 2.75;
	if (t < 1 / d1) return n1 * t * t;
	if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
	if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
	return n1 * (t -= 2.625 / d1) * t + 0.984375;
};

export const easeInBounce: EasingFunction = (t) =>
	1 - easeOutBounce(1 - t);

export const easeInOutBounce: EasingFunction = (t) =>
	t < 0.5
		? (1 - easeOutBounce(1 - 2 * t)) / 2
		: (1 + easeOutBounce(2 * t - 1)) / 2;
