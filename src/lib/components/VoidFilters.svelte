<script lang="ts">
	/**
	 * VoidFilters — injects the SVG filter definitions that power Voidmorphism's
	 * gravitational lensing / refraction. Mount this ONCE near the root of your app
	 * (e.g. in your root layout). Surfaces reference these filters by id via
	 * `backdrop-filter: url(#vm-refract)`.
	 *
	 * The displacement maps warp the content *behind* a surface — the hallmark
	 * "see-into the void" distortion rather than a flat blur.
	 */

	interface Props {
		/** Base displacement strength for the standard refraction filter. */
		scale?: number;
		/** Turbulence frequency — lower = broad gravitational bending, higher = ripples. */
		frequency?: number;
		/** Number of turbulence octaves (detail of the distortion). */
		octaves?: number;
	}

	let { scale = 14, frequency = 0.008, octaves = 2 }: Props = $props();
</script>

<svg class="vm-filters" aria-hidden="true" focusable="false">
	<defs>
		<!-- Standard refractive void lensing. Broad, slow turbulence reads as
		     gravitational bending rather than frosted noise. -->
		<filter id="vm-refract" x="-20%" y="-20%" width="140%" height="140%">
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

		<!-- Deep lens: stronger pull for modals / foreground anomalies. -->
		<filter id="vm-refract-deep" x="-30%" y="-30%" width="160%" height="160%">
			<feTurbulence
				type="fractalNoise"
				baseFrequency={frequency * 0.7}
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
			/>
		</filter>

		<!-- Subtle lens: depth-1 surfaces, inputs, small chips. -->
		<filter id="vm-refract-soft" x="-15%" y="-15%" width="130%" height="130%">
			<feTurbulence
				type="fractalNoise"
				baseFrequency={frequency * 1.4}
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

		<!-- Void bloom: soft celestial diffusion for bright accents. -->
		<filter id="vm-bloom" x="-50%" y="-50%" width="200%" height="200%">
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
	.vm-filters {
		position: absolute;
		width: 0;
		height: 0;
		pointer-events: none;
		overflow: hidden;
	}
</style>
