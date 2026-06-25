<script lang="ts">
	import { onMount } from 'svelte';
	import { onFrame, whenVisible } from '../core/raf.js';
	import { prefersReducedMotion, detectPerfTier, type PerfTier } from '../core/env.js';
	import { resolutionScaleForTier } from './blackhole-math.js';

	/**
	 * BlackHole — a hand-rolled WebGL hero. A fragment shader gravitationally
	 * lenses a procedural starfield around an event horizon, with a rotating
	 * accretion disk and a bright photon ring. Monochrome with an adjustable
	 * cold-accent tint. Falls back to a CSS render on eco/reduced-motion or when
	 * WebGL is unavailable. Zero dependencies.
	 */

	interface Props {
		/** Block height (CSS length). Default: '480px'. */
		height?: string;
		/** Lensing strength. Default: 1. */
		mass?: number;
		/** Event-horizon radius (normalized to half-height). Default: 0.18. */
		eventRadius?: number;
		/** Render the accretion disk. Default: true. */
		disk?: boolean;
		/** Cold-accent tint of disk/ring, 0 (silver) → 1 (cold). Default: 1. */
		accent?: number;
		/** Animation speed multiplier. Default: 1. */
		speed?: number;
		/** Force a resolution scale (overrides perf tier). */
		quality?: number;
		/** Extra class. */
		class?: string;
	}

	let {
		height = '480px',
		mass = 1,
		eventRadius = 0.18,
		disk = true,
		accent = 1,
		speed = 1,
		quality,
		class: className = ''
	}: Props = $props();

	let canvas: HTMLCanvasElement;
	let wrap: HTMLDivElement;
	let usingFallback = $state(false);

	const VERT = `
		attribute vec2 a_pos;
		void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
	`;

	const FRAG = `
		precision highp float;
		uniform vec2 u_res;
		uniform float u_time;
		uniform float u_mass;
		uniform float u_radius;
		uniform float u_disk;
		uniform float u_accent;

		float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }

		float stars(vec2 uv){
			vec2 g = floor(uv); vec2 f = fract(uv);
			float m = 0.0;
			for (int y = -1; y <= 1; y++){
				for (int x = -1; x <= 1; x++){
					vec2 o = vec2(float(x), float(y));
					float h = hash(g + o);
					if (h > 0.90){
						vec2 c = o + vec2(hash(g + o + 1.0), hash(g + o + 2.0)) - f;
						float d = length(c);
						float b = smoothstep(0.06, 0.0, d);
						m += b * (0.5 + 0.5 * sin(u_time * 2.0 + h * 30.0));
					}
				}
			}
			return m;
		}

		void main(){
			vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;
			float r = length(uv);
			vec2 dir = uv / max(r, 1e-4);

			float deflect = u_mass * 0.15 / (r * r + 0.02);
			vec2 suv = uv - dir * deflect;

			vec3 col = vec3(stars(suv * 8.0 + 10.0));
			col += vec3(stars(suv * 16.0 - 5.0)) * 0.4;
			col += vec3(0.02, 0.025, 0.032) * (1.0 - clamp(r, 0.0, 1.0));

			if (u_disk > 0.5){
				float dr = abs(r - u_radius * 2.2);
				float ring = smoothstep(0.26, 0.0, dr);
				float ang = atan(uv.y, uv.x);
				float swirl = 0.5 + 0.5 * sin(ang * 3.0 - u_time * 1.5 * 1.0 + r * 20.0);
				vec3 diskCol = mix(vec3(0.82), vec3(0.45, 0.7, 1.0), u_accent);
				col += diskCol * ring * (0.55 + 0.45 * swirl);
			}

			float pr = abs(r - u_radius * 1.35);
			col += mix(vec3(1.0), vec3(0.72, 0.86, 1.0), u_accent) * smoothstep(0.02, 0.0, pr) * 0.9;

			float horizon = smoothstep(u_radius, u_radius * 0.96, r);
			col *= horizon;

			col *= smoothstep(1.5, 0.2, r);

			gl_FragColor = vec4(col, 1.0);
		}
	`;

	onMount(() => {
		const reduced = prefersReducedMotion();
		const tier: PerfTier = detectPerfTier();

		const gl = (canvas.getContext('webgl', { antialias: false, alpha: false }) ||
			canvas.getContext('experimental-webgl', { antialias: false })) as WebGLRenderingContext | null;

		if (!gl || (tier === 'eco' && !quality)) {
			usingFallback = true;
			return;
		}

		function compile(type: number, src: string): WebGLShader | null {
			const sh = gl!.createShader(type);
			if (!sh) return null;
			gl!.shaderSource(sh, src);
			gl!.compileShader(sh);
			if (!gl!.getShaderParameter(sh, gl!.COMPILE_STATUS)) {
				gl!.deleteShader(sh);
				return null;
			}
			return sh;
		}

		const vs = compile(gl.VERTEX_SHADER, VERT);
		const fs = compile(gl.FRAGMENT_SHADER, FRAG);
		const prog = gl.createProgram();
		if (!vs || !fs || !prog) {
			usingFallback = true;
			return;
		}
		gl.attachShader(prog, vs);
		gl.attachShader(prog, fs);
		gl.linkProgram(prog);
		if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
			usingFallback = true;
			return;
		}
		gl.useProgram(prog);

		// Fullscreen triangle.
		const buf = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buf);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
		const loc = gl.getAttribLocation(prog, 'a_pos');
		gl.enableVertexAttribArray(loc);
		gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

		const uRes = gl.getUniformLocation(prog, 'u_res');
		const uTime = gl.getUniformLocation(prog, 'u_time');
		const uMass = gl.getUniformLocation(prog, 'u_mass');
		const uRadius = gl.getUniformLocation(prog, 'u_radius');
		const uDisk = gl.getUniformLocation(prog, 'u_disk');
		const uAccent = gl.getUniformLocation(prog, 'u_accent');

		const scale = quality ?? resolutionScaleForTier(tier);

		function resize() {
			const dpr = Math.min(window.devicePixelRatio || 1, 2) * scale;
			const w = Math.max(1, Math.floor(wrap.clientWidth * dpr));
			const h = Math.max(1, Math.floor(wrap.clientHeight * dpr));
			canvas.width = w;
			canvas.height = h;
			gl!.viewport(0, 0, w, h);
		}
		resize();
		const ro = new ResizeObserver(resize);
		ro.observe(wrap);

		let lost = false;
		canvas.addEventListener('webglcontextlost', (e) => {
			e.preventDefault();
			lost = true;
			usingFallback = true;
		});

		function render(time: number) {
			if (lost) return;
			gl!.uniform2f(uRes, canvas.width, canvas.height);
			gl!.uniform1f(uTime, reduced ? 0 : (time / 1000) * speed);
			gl!.uniform1f(uMass, mass);
			gl!.uniform1f(uRadius, eventRadius);
			gl!.uniform1f(uDisk, disk ? 1 : 0);
			gl!.uniform1f(uAccent, accent);
			gl!.drawArrays(gl!.TRIANGLES, 0, 3);
		}

		render(0);

		let visible = true;
		const stopVisible = whenVisible(wrap, (v) => (visible = v));
		const stopFrame = reduced
			? () => {}
			: onFrame((time) => {
					if (visible) render(time);
				});

		return () => {
			stopFrame();
			stopVisible();
			ro.disconnect();
		};
	});
</script>

<div bind:this={wrap} class="sm-blackhole {className}" style="height: {height};" aria-hidden="true">
	<canvas bind:this={canvas} class:sm-hidden={usingFallback}></canvas>
	{#if usingFallback}
		<div class="sm-blackhole-fallback"></div>
	{/if}
</div>

<style>
	.sm-blackhole {
		position: relative;
		width: 100%;
		overflow: hidden;
		border-radius: var(--sm-radius-lg);
	}
	.sm-blackhole canvas {
		display: block;
		width: 100%;
		height: 100%;
	}
	.sm-hidden {
		display: none;
	}

	/* CSS fallback: a static lensed-ish black hole with a cold photon ring. */
	.sm-blackhole-fallback {
		position: absolute;
		inset: 0;
		background:
			radial-gradient(
				circle at 50% 50%,
				#000 0%,
				#000 16%,
				hsla(212, 90%, 80%, 0.55) 17.5%,
				hsla(212, 60%, 40%, 0.15) 22%,
				transparent 34%
			),
			radial-gradient(circle at 50% 50%, hsla(210, 16%, 30%, 0.4) 0%, #050609 70%);
	}
</style>
