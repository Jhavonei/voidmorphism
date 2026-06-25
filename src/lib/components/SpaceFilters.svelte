<script lang="ts">
	/**
	 * SpaceFilters — injects the SVG filter definitions that power Spacemorphism's
	 * gravitational lensing / refraction. Mount this ONCE near the root of your app
	 * (e.g. in your root layout). Surfaces reference these filters by id via
	 * `backdrop-filter: url(#sm-ripple)`.
	 *
	 * The displacement maps warp the content *behind* a surface — the hallmark
	 * "see-into spacetime" distortion rather than a flat blur. Each named profile
	 * morphs the background differently:
	 *
	 *   sm-ripple   — soft radial ripples (default surfaces)
	 *   sm-warp     — directional gravitational stretch + chromatic edge (modals)
	 *   sm-dissipate— high-octave fractal scatter (dissolving / energetic edges)
	 *   sm-caustic  — fine, fast turbulence (highlights, small chips)
	 *   sm-bloom    — soft cold diffusion for bright accents
	 */

	interface Props {
		/** Base displacement strength for the standard refraction filter. */
		scale?: number;
		/** Turbulence frequency — lower = broad gravitational bending, higher = ripples. */
		frequency?: number;
		/** Number of turbulence octaves (detail of the distortion). */
		octaves?: number;
	}

	let { scale = 16, frequency = 0.008, octaves = 2 }: Props = $props();
</script>

<svg class="sm-filters" aria-hidden="true" focusable="false">
	<defs>
		<!-- RIPPLE — standard refractive lensing. Broad, slow turbulence reads as
		     gravitational bending rather than frosted noise. -->
		<filter id="sm-ripple" x="-20%" y="-20%" width="140%" height="140%">
			<feTurbulence
				type="fractalNoise"
				baseFrequency={frequency}
				numOctaves={octaves}
				seed="7"
				stitchTiles="stitch"
				result="warp"
			/>
			<feGaussianBlur in="warp" stdDeviation="1.4" result="warpSoft" />
			<feDisplacementMap
				in="SourceGraphic"
				in2="warpSoft"
				scale={scale}
				xChannelSelector="R"
				yChannelSelector="G"
			/>
		</filter>

		<!-- WARP — deep directional lens for modals / foreground anomalies. A faint
		     chromatic edge offset gives the high-definition "liquid spacetime" feel. -->
		<filter id="sm-warp" x="-30%" y="-30%" width="160%" height="160%">
			<feTurbulence
				type="fractalNoise"
				baseFrequency={`${frequency * 0.6} ${frequency * 0.9}`}
				numOctaves={octaves}
				seed="13"
				stitchTiles="stitch"
				result="warp"
			/>
			<feGaussianBlur in="warp" stdDeviation="2" result="warpSoft" />
			<feDisplacementMap
				in="SourceGraphic"
				in2="warpSoft"
				scale={scale * 2.2}
				xChannelSelector="R"
				yChannelSelector="G"
				result="lensed"
			/>
			<!-- Chromatic edge: nudge a faint cyan copy for spectral dispersion. -->
			<feOffset in="lensed" dx="0.6" dy="0" result="disp" />
			<feColorMatrix
				in="disp"
				type="matrix"
				values="0 0 0 0 0  0 0.6 0 0 0  0 0 1 0 0  0 0 0 0.25 0"
				result="chroma"
			/>
			<feMerge>
				<feMergeNode in="lensed" />
				<feMergeNode in="chroma" />
			</feMerge>
		</filter>

		<!-- DISSIPATE — high-octave fractal scatter for dissolving / unstable matter. -->
		<filter id="sm-dissipate" x="-30%" y="-30%" width="160%" height="160%">
			<feTurbulence
				type="fractalNoise"
				baseFrequency={frequency * 3.2}
				numOctaves={Math.max(octaves + 1, 3)}
				seed="29"
				stitchTiles="stitch"
				result="warp"
			/>
			<feDisplacementMap
				in="SourceGraphic"
				in2="warp"
				scale={scale * 1.4}
				xChannelSelector="R"
				yChannelSelector="G"
			/>
		</filter>

		<!-- CAUSTIC — fine, fast turbulence for highlights, inputs, small chips. -->
		<filter id="sm-caustic" x="-15%" y="-15%" width="130%" height="130%">
			<feTurbulence
				type="fractalNoise"
				baseFrequency={frequency * 1.6}
				numOctaves="1"
				seed="3"
				stitchTiles="stitch"
				result="warp"
			/>
			<feDisplacementMap
				in="SourceGraphic"
				in2="warp"
				scale={scale * 0.55}
				xChannelSelector="R"
				yChannelSelector="G"
			/>
		</filter>

		<!-- BLOOM — soft cold diffusion for bright accents. -->
		<filter id="sm-bloom" x="-50%" y="-50%" width="200%" height="200%">
			<feGaussianBlur in="SourceGraphic" stdDeviation="6" result="b" />
			<feColorMatrix
				in="b"
				type="matrix"
				values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1.4 0"
				result="bloom"
			/>
			<feMerge>
				<feMergeNode in="bloom" />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
		</filter>
	</defs>
</svg>

<style>
	.sm-filters {
		position: absolute;
		width: 0;
		height: 0;
		pointer-events: none;
		overflow: hidden;
	}
</style>
