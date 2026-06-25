/**
 * resonance — a Svelte action that makes components react to nearby elements,
 * as if they share one continuous energy field. Surfaces near the pointer (and
 * therefore near each other) glow in unison, creating a living, unified material.
 *
 * Internally all resonant nodes subscribe to a single global pointer tracker,
 * so they pulse together rather than independently — the "one substance" feel.
 *
 * Usage:
 *   <div class="vm-surface" use:resonance>…</div>
 *   <div class="vm-surface" use:resonance={{ radius: 320, color: '190 95% 60%' }}>…</div>
 */

export interface ResonanceOptions {
	/** Radius (px) of the resonance field around the pointer. Default: 280. */
	radius?: number;
	/** Glow color as HSL components, e.g. '248 92% 68%'. Defaults to the theme accent. */
	color?: string;
	/** Peak glow intensity, 0–1. Default: 1. */
	intensity?: number;
	/** Disable the effect. Default: false. */
	disabled?: boolean;
}

type Subscriber = (x: number, y: number) => void;

const subscribers = new Set<Subscriber>();
let pointerX = -9999;
let pointerY = -9999;
let listening = false;
let frame = 0;

function broadcast() {
	frame = 0;
	for (const fn of subscribers) fn(pointerX, pointerY);
}

function onPointer(e: PointerEvent) {
	pointerX = e.clientX;
	pointerY = e.clientY;
	if (!frame) frame = requestAnimationFrame(broadcast);
}

function ensureListening() {
	if (listening || typeof window === 'undefined') return;
	window.addEventListener('pointermove', onPointer, { passive: true });
	listening = true;
}

export function resonance(node: HTMLElement, options: ResonanceOptions = {}) {
	let { radius = 280, color = '', intensity = 1, disabled = false } = options;

	const prefersReduced =
		typeof window !== 'undefined' &&
		window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

	let current = 0;
	let target = 0;
	let raf = 0;

	function animate() {
		current += (target - current) * 0.1;
		const g = current * intensity;
		// Resonant bloom — shared field brightness driven by global pointer.
		node.style.setProperty(
			'--vm-resonance',
			color
				? `0 0 ${(20 + g * 60).toFixed(0)}px ${(-12 + g * 6).toFixed(0)}px hsla(${color}, ${(g * 0.6).toFixed(3)})`
				: `0 0 ${(20 + g * 60).toFixed(0)}px ${(-12 + g * 6).toFixed(0)}px hsla(248, 92%, 68%, ${(g * 0.5).toFixed(3)})`
		);
		raf = Math.abs(target - current) < 0.002 ? 0 : requestAnimationFrame(animate);
	}

	const onField: Subscriber = (px, py) => {
		if (disabled || prefersReduced) return;
		const r = node.getBoundingClientRect();
		const cx = r.left + r.width / 2;
		const cy = r.top + r.height / 2;
		const dist = Math.hypot(px - cx, py - cy);
		target = Math.max(0, 1 - dist / radius);
		if (!raf) raf = requestAnimationFrame(animate);
	};

	ensureListening();
	subscribers.add(onField);
	node.style.setProperty('--vm-resonance', '0 0 0 0 transparent');

	return {
		update(next: ResonanceOptions = {}) {
			({ radius = 280, color = '', intensity = 1, disabled = false } = next);
		},
		destroy() {
			subscribers.delete(onField);
			if (raf) cancelAnimationFrame(raf);
		}
	};
}
