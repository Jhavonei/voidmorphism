/**
 * spacetime — the shared, page-wide gravitational field.
 *
 * The conceptual signature of Spacemorphism: the whole page is one region of
 * spacetime. The pointer is a moving mass; every registered surface lenses and
 * tilts toward it, and star-dust accelerates toward it. Rather than each
 * component running its own pointer listener and rAF, they all register here so
 * there is exactly ONE listener and ONE loop driving the entire field.
 *
 *   import { registerBody, getPointer } from 'svelte-spacemorphism';
 */

import { isBrowser, prefersReducedMotion } from './env.js';
import { onFrame } from './raf.js';

/* ----------------------------- pure helpers ----------------------------- */

/** Normalized 0→1 attraction given distance from an edge and a field radius. */
export function proximity(dist: number, field: number): number {
	if (field <= 0) return 0;
	return Math.max(0, 1 - dist / field);
}

/** One step of critically-damped easing toward a target. */
export function damp(cur: number, target: number, k = 0.12): number {
	return cur + (target - cur) * k;
}

/** Tilt (deg) toward the pointer; surface leans INTO the cursor. */
export function tiltFor(
	dx: number,
	dy: number,
	halfW: number,
	halfH: number,
	field: number,
	max: number
): { tx: number; ty: number } {
	const nx = clamp(dx / (halfW + field), -1, 1);
	const ny = clamp(dy / (halfH + field), -1, 1);
	return { tx: -ny * max, ty: nx * max };
}

function clamp(v: number, min: number, max: number): number {
	return Math.min(Math.max(v, min), max);
}

/* ----------------------------- the field -------------------------------- */

export interface BodyOptions {
	/** Max tilt in degrees toward the cursor. Default: 6. */
	tilt?: number;
	/** Px beyond the element bounds where attraction begins. Default: 120. */
	field?: number;
	/** Strength of the response, 0–1. Default: 1. */
	pull?: number;
	/** Disable this body's response. Default: false. */
	disabled?: boolean;
}

export interface BodyHandle {
	update(options: BodyOptions): void;
	destroy(): void;
}

interface Body {
	node: HTMLElement;
	tilt: number;
	field: number;
	pull: number;
	disabled: boolean;
	curPull: number;
	curTiltX: number;
	curTiltY: number;
}

const bodies = new Set<Body>();

let pointerX = -99999;
let pointerY = -99999;
let velX = 0;
let velY = 0;
let lastMoveT = 0;
let mass = 1;

let pointerTracking = false;
let looping = false;
let reduced = false;
let stopFrame: (() => void) | null = null;

function onMove(e: PointerEvent): void {
	const now = performance.now();
	const dt = lastMoveT ? Math.max(now - lastMoveT, 1) : 16;
	velX = (e.clientX - pointerX) / dt;
	velY = (e.clientY - pointerY) / dt;
	lastMoveT = now;
	pointerX = e.clientX;
	pointerY = e.clientY;
	if (isBrowser) {
		const root = document.documentElement;
		root.style.setProperty('--sm-px', `${pointerX}px`);
		root.style.setProperty('--sm-py', `${pointerY}px`);
	}
}

function updateBody(b: Body): void {
	const r = b.node.getBoundingClientRect();
	const cx = r.left + r.width / 2;
	const cy = r.top + r.height / 2;

	let targetPull = 0;
	let targetTiltX = 0;
	let targetTiltY = 0;

	if (!b.disabled && !reduced) {
		const localX = ((pointerX - r.left) / r.width) * 100;
		const localY = ((pointerY - r.top) / r.height) * 100;
		b.node.style.setProperty('--sm-mx', `${localX.toFixed(1)}%`);
		b.node.style.setProperty('--sm-my', `${localY.toFixed(1)}%`);

		const dx = Math.max(Math.abs(pointerX - cx) - r.width / 2, 0);
		const dy = Math.max(Math.abs(pointerY - cy) - r.height / 2, 0);
		const dist = Math.hypot(dx, dy);
		targetPull = proximity(dist, b.field) * b.pull;

		const tilt = tiltFor(pointerX - cx, pointerY - cy, r.width / 2, r.height / 2, b.field, b.tilt);
		targetTiltX = tilt.tx;
		targetTiltY = tilt.ty;
	}

	b.curPull = damp(b.curPull, targetPull);
	b.curTiltX = damp(b.curTiltX, targetTiltX);
	b.curTiltY = damp(b.curTiltY, targetTiltY);

	b.node.style.setProperty('--sm-pull', b.curPull.toFixed(3));
	b.node.style.setProperty('--sm-tilt-x', `${b.curTiltX.toFixed(2)}deg`);
	b.node.style.setProperty('--sm-tilt-y', `${b.curTiltY.toFixed(2)}deg`);
}

function tick(): void {
	for (const b of bodies) updateBody(b);
}

/**
 * Start the single page-wide pointer listener (idempotent). Star-dust and the
 * comet cursor call this so the field's pointer is live even with no bodies.
 */
export function trackPointer(): void {
	if (pointerTracking || !isBrowser) return;
	pointerTracking = true;
	reduced = prefersReducedMotion();
	window.addEventListener('pointermove', onMove, { passive: true });
}

function startLoop(): void {
	if (looping || !isBrowser) return;
	looping = true;
	stopFrame = onFrame(tick);
}

function maybeStopLoop(): void {
	if (bodies.size === 0 && stopFrame) {
		stopFrame();
		stopFrame = null;
		looping = false;
	}
}

/** Register a DOM node as a gravitational body. Returns update/destroy. */
export function registerBody(node: HTMLElement, options: BodyOptions = {}): BodyHandle {
	const body: Body = {
		node,
		tilt: options.tilt ?? 6,
		field: options.field ?? 120,
		pull: options.pull ?? 1,
		disabled: options.disabled ?? false,
		curPull: 0,
		curTiltX: 0,
		curTiltY: 0
	};
	bodies.add(body);
	trackPointer();
	startLoop();
	return {
		update(next: BodyOptions) {
			if (next.tilt !== undefined) body.tilt = next.tilt;
			if (next.field !== undefined) body.field = next.field;
			if (next.pull !== undefined) body.pull = next.pull;
			if (next.disabled !== undefined) body.disabled = next.disabled;
		},
		destroy() {
			bodies.delete(body);
			// Reset the node so it doesn't freeze mid-pull.
			body.node.style.setProperty('--sm-pull', '0');
			body.node.style.setProperty('--sm-tilt-x', '0deg');
			body.node.style.setProperty('--sm-tilt-y', '0deg');
			maybeStopLoop();
		}
	};
}

/** Current pointer position + velocity (px, px/ms). For star-dust / cursor. */
export function getPointer(): { x: number; y: number; vx: number; vy: number } {
	return { x: pointerX, y: pointerY, vx: velX, vy: velY };
}

/** The mass of the field's moving body (the cursor). Scales gravity strength. */
export function getMass(): number {
	return mass;
}
export function setMass(m: number): void {
	mass = Math.max(0, m);
}

/** Number of registered bodies — exposed for testing. */
export function bodyCount(): number {
	return bodies.size;
}
