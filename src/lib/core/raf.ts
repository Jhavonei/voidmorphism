/**
 * raf — one shared requestAnimationFrame loop for the whole library, plus a
 * viewport-gating helper. Many animated components on a page should not each
 * spin their own rAF; they register here and are driven by a single loop.
 */

import { isBrowser } from './env.js';

type FrameCb = (time: number, dt: number) => void;

const callbacks = new Set<FrameCb>();
let running = false;
let last = 0;

function loop(time: number): void {
	const dt = last ? time - last : 16.7;
	last = time;
	for (const cb of callbacks) cb(time, dt);
	if (callbacks.size > 0) {
		requestAnimationFrame(loop);
	} else {
		running = false;
		last = 0;
	}
}

/**
 * Register a per-frame callback driven by the shared loop. Returns an
 * unsubscribe function. No-op driver on the server (callback never fires).
 */
export function onFrame(cb: FrameCb): () => void {
	callbacks.add(cb);
	if (isBrowser && !running && typeof requestAnimationFrame === 'function') {
		running = true;
		last = 0;
		requestAnimationFrame(loop);
	}
	return () => {
		callbacks.delete(cb);
	};
}

/** Number of active frame subscribers — exposed for testing. */
export function frameSubscriberCount(): number {
	return callbacks.size;
}

/**
 * Invoke `onChange(visible)` as `node` enters/leaves the viewport so heavy
 * loops can pause off-screen. Falls back to always-visible without IO/SSR.
 * Returns a cleanup function.
 */
export function whenVisible(
	node: Element,
	onChange: (visible: boolean) => void
): () => void {
	if (!isBrowser || typeof IntersectionObserver === 'undefined') {
		onChange(true);
		return () => {};
	}
	const io = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) onChange(entry.isIntersecting);
		},
		{ rootMargin: '160px' }
	);
	io.observe(node);
	return () => io.disconnect();
}
