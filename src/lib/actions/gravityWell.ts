/**
 * gravityWell — a Svelte action that makes a surface feel massive.
 *
 * As the pointer approaches, the element:
 *   - attracts light toward the cursor (writes --vm-mx / --vm-my)
 *   - registers a gravitational "pull" (--vm-pull, 0 → 1)
 *   - tilts gently toward the cursor (--vm-tilt-x / --vm-tilt-y)
 *
 * These CSS variables are consumed by `.vm-surface` in voidmorphism.css.
 *
 * Usage:
 *   <div class="vm-surface" use:gravityWell={{ tilt: 6, pull: 1 }}>…</div>
 */

export interface GravityWellOptions {
	/** Max tilt in degrees toward the cursor. Default: 6. Set 0 to disable tilt. */
	tilt?: number;
	/** Strength of the light/pull response, 0–1. Default: 1. */
	pull?: number;
	/** Radius (px) beyond the element bounds where attraction begins. Default: 120. */
	field?: number;
	/** Disable the whole effect (e.g. for reduced motion). Default: false. */
	disabled?: boolean;
}

export function gravityWell(node: HTMLElement, options: GravityWellOptions = {}) {
	let { tilt = 6, pull = 1, field = 120, disabled = false } = options;

	const prefersReduced =
		typeof window !== 'undefined' &&
		window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

	let raf = 0;
	let targetPull = 0;
	let targetTiltX = 0;
	let targetTiltY = 0;
	let curPull = 0;
	let curTiltX = 0;
	let curTiltY = 0;

	function apply() {
		// Critically-damped easing toward the target for that weighty, fluid feel.
		curPull += (targetPull - curPull) * 0.12;
		curTiltX += (targetTiltX - curTiltX) * 0.12;
		curTiltY += (targetTiltY - curTiltY) * 0.12;

		node.style.setProperty('--vm-pull', curPull.toFixed(3));
		node.style.setProperty('--vm-tilt-x', `${curTiltX.toFixed(2)}deg`);
		node.style.setProperty('--vm-tilt-y', `${curTiltY.toFixed(2)}deg`);

		const settled =
			Math.abs(targetPull - curPull) < 0.001 &&
			Math.abs(targetTiltX - curTiltX) < 0.01 &&
			Math.abs(targetTiltY - curTiltY) < 0.01;

		raf = settled ? 0 : requestAnimationFrame(apply);
	}

	function schedule() {
		if (!raf) raf = requestAnimationFrame(apply);
	}

	function onMove(e: PointerEvent) {
		if (disabled || prefersReduced) return;
		const r = node.getBoundingClientRect();
		const cx = r.left + r.width / 2;
		const cy = r.top + r.height / 2;

		// Pointer position relative to the element (for the light highlight).
		const localX = ((e.clientX - r.left) / r.width) * 100;
		const localY = ((e.clientY - r.top) / r.height) * 100;
		node.style.setProperty('--vm-mx', `${localX.toFixed(1)}%`);
		node.style.setProperty('--vm-my', `${localY.toFixed(1)}%`);

		// Distance from edge → normalized pull within the gravitational field.
		const dx = Math.max(Math.abs(e.clientX - cx) - r.width / 2, 0);
		const dy = Math.max(Math.abs(e.clientY - cy) - r.height / 2, 0);
		const dist = Math.hypot(dx, dy);
		const proximity = Math.max(0, 1 - dist / field);

		targetPull = proximity * pull;

		// Tilt toward the cursor (inverted so the surface leans into the pointer).
		const nx = (e.clientX - cx) / (r.width / 2 + field);
		const ny = (e.clientY - cy) / (r.height / 2 + field);
		targetTiltY = clamp(nx, -1, 1) * tilt;
		targetTiltX = clamp(-ny, -1, 1) * tilt;

		schedule();
	}

	function onLeave() {
		targetPull = 0;
		targetTiltX = 0;
		targetTiltY = 0;
		node.style.setProperty('--vm-mx', '50%');
		node.style.setProperty('--vm-my', '50%');
		schedule();
	}

	window.addEventListener('pointermove', onMove, { passive: true });
	node.addEventListener('pointerleave', onLeave);

	return {
		update(next: GravityWellOptions = {}) {
			({ tilt = 6, pull = 1, field = 120, disabled = false } = next);
			if (disabled) onLeave();
		},
		destroy() {
			window.removeEventListener('pointermove', onMove);
			node.removeEventListener('pointerleave', onLeave);
			if (raf) cancelAnimationFrame(raf);
		}
	};
}

function clamp(v: number, min: number, max: number): number {
	return Math.min(Math.max(v, min), max);
}
