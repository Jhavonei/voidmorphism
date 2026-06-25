# svelte-voidmorphism

> **Voidmorphism** — a cinematic, space-inspired material system for Svelte 5 where interfaces appear carved from refractive void matter rather than transparent glass. Plus a full set of morphing/glitch transitions, built with runes.

[![npm version](https://img.shields.io/npm/v/svelte-voidmorphism.svg)](https://www.npmjs.com/package/svelte-voidmorphism)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Svelte 5](https://img.shields.io/badge/Svelte-5-FF3E00.svg)](https://svelte.dev)

> Voidmorphism is a next-generation interface material that combines the depth of space, the refraction of liquid glass, the seamlessness of borderless design, and gravitational distortion to create interfaces that feel less like windows and more like dimensional anomalies suspended in an infinite void.

## What makes it different

| | Glassmorphism | Liquid Glass | **Voidmorphism** |
| --- | --- | --- | --- |
| Background | blurs it | distorts it | **warps reality beneath it** |
| Foundation | light/gray | translucent | **infinite OLED black** |
| Edges | borders | strokes | **borderless, light-defined** |
| Transparency | see-through | see-through | **see-into (dark water)** |
| Interaction | hover | hover | **gravity wells + resonance** |

## Features

- **Voidmorphism material system** — `VoidSurface`, `VoidPanel`, `VoidCard`, `VoidButton`, `VoidInput`, `VoidModal`, `VoidNav`, `VoidField`
- **Gravitational lensing** — real SVG refraction warps the content behind every surface
- **Borderless by design** — edges defined by light + event-horizon darkening, never strokes
- **Gravity wells & resonance** — surfaces lean toward the cursor and glow in unison
- **Themeable via CSS variables** — re-skin the whole substance from three tokens
- **7 unique transitions** — voidDissolve, glitch, morph, phaseShift, pixelate, shatter, voidPulse
- **Svelte 5 runes** — built natively with `$state`, `$props`, `$bindable`, and snippets
- **Zero runtime dependencies** · **Tree-shakeable** · **Fully typed**

## Installation

```bash
npm install svelte-voidmorphism
# or
pnpm add svelte-voidmorphism
# or
yarn add svelte-voidmorphism
```

## Quick Start — the material system

Import the stylesheet once, mount the filters + void field at your app root, then build with void surfaces.

```svelte
<!-- +layout.svelte -->
<script lang="ts">
  import 'svelte-voidmorphism/styles';
  import { VoidFilters, VoidField } from 'svelte-voidmorphism';
  let { children } = $props();
</script>

<VoidFilters />  <!-- SVG refraction filters, mount once -->
<VoidField />    <!-- the infinite void background -->

{@render children?.()}
```

```svelte
<!-- anywhere -->
<script lang="ts">
  import { VoidCard, VoidButton, VoidInput } from 'svelte-voidmorphism';
  let email = $state('');
</script>

<VoidCard interactive resonant bloom>
  <h2>Carved from refractive void matter</h2>
  <VoidInput label="Email" placeholder="you@galaxy.dev" bind:value={email} />
  <VoidButton variant="primary">Enter the void</VoidButton>
</VoidCard>
```

## Material System

### Setup requirements

1. `import 'svelte-voidmorphism/styles';` once (e.g. in your root layout).
2. Mount `<VoidFilters />` once — it injects the SVG lensing filters referenced by every surface.
3. Optionally mount `<VoidField />` for the infinite black + nebula + starfield foundation.

### Components

| Component | Purpose |
| --- | --- |
| `VoidSurface` | The base material primitive everything is built from. |
| `VoidPanel` | Large, calm substrate region for sections/sidebars. |
| `VoidCard` | Content card with a void-dissolve enter/exit transition. |
| `VoidButton` | Gravity-reactive control; `primary` / `surface` / `ghost`. |
| `VoidInput` | Borderless text field; focus raises a resonant bloom. |
| `VoidModal` | Foreground anomaly using the deep refractive lens. |
| `VoidNav` | Floating, resonant navigation bar. |
| `VoidField` | Fixed infinite-void background (nebula + parallax stars). |
| `VoidFilters` | SVG refraction/bloom filter defs (mount once). |

### `VoidSurface` props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `as` | `string` | `'div'` | Element tag to render. |
| `depth` | `1 \| 2 \| 3 \| 4` | `2` | Dimensional plane (blur + refraction strength). |
| `refract` | `boolean` | `true` | Apply SVG gravitational-lensing to the backdrop. |
| `deep` | `boolean` | `false` | Use the stronger lens (modals/foreground). |
| `interactive` | `boolean` | `false` | Gravity well: tilt + light attraction on cursor. |
| `tilt` | `number` | `6` | Max tilt in degrees when interactive. |
| `bloom` | `boolean` | `false` | Emit celestial void bloom. |
| `resonant` | `boolean` | `false` | Glow in unison with nearby elements. |
| `drift` | `boolean` | `false` | Weightless idle drift. |
| `radius` / `padding` | `string` | — | Geometry passthrough. |

### Actions

Use the interaction effects on any element:

```svelte
<script lang="ts">
  import { gravityWell, resonance } from 'svelte-voidmorphism';
</script>

<div class="vm-surface" use:gravityWell={{ tilt: 6, field: 140 }} use:resonance={{ radius: 300 }}>
  …
</div>
```

### Dark & light themes

Voidmorphism ships **dark by default** (deep violet + solar gold) and an **inverted light theme** ("the bright nebula"). Switch by setting `data-vm-theme` on `<html>`:

```html
<html data-vm-theme="dark">  <!-- default -->
<html data-vm-theme="light"> <!-- inverted, luminous glass -->
```

```ts
// toggle at runtime
document.documentElement.dataset.vmTheme =
  document.documentElement.dataset.vmTheme === 'light' ? 'dark' : 'light';
```

All components, the `VoidField` starfield, shadows, and bloom adapt automatically.

### Theming

The entire substance derives from a few CSS variables — override them on `:root`, `[data-vm-theme='…']`, or any container:

```css
:root {
  --vm-matter-h: 270;            /* hue of the cosmic material (purple) */
  --vm-matter-s: 60%;
  --vm-accent: hsl(272 92% 67%); /* electric violet */
  --vm-accent-2: hsl(45 96% 60%);/* solar gold */
  --vm-blur: 11px;               /* liquid-glass translucency */
  --vm-refract-scale: 18;
}
```

> **Browser note:** the gravitational-lensing refraction uses an SVG filter referenced from `backdrop-filter`, which currently renders in Chromium-based browsers. Everywhere else it degrades gracefully to a tasteful backdrop blur + saturation — the borderless, event-horizon, bloom, and gravity-well effects all still apply.

## Transitions

### voidDissolve

Dissolves the element into particles with blur and glow.

```svelte
<div transition:voidDissolve={{ duration: 800, blur: 20, scale: 1.1 }}>
  Content
</div>
```

**Options:** `duration`, `easing`, `blur`, `scale`, `voidColor`

### glitch

Digital glitch effect with RGB channel splitting and displacement.

```svelte
<div transition:glitch={{ duration: 600, split: 8, displacement: 20, intensity: 1 }}>
  Content
</div>
```

**Options:** `duration`, `easing`, `split`, `displacement`, `intensity`, `steps`

### morph

Smooth morphing with scale, rotation, and skew.

```svelte
<div transition:morph={{ duration: 700, startScale: 0.3, rotation: -15, skew: 0.2 }}>
  Content
</div>
```

**Options:** `duration`, `easing`, `startScale`, `rotation`, `skew`, `blur`, `blurAmount`

### phaseShift

Dimensional ripple with hue rotation and wave distortion.

```svelte
<div transition:phaseShift={{ duration: 900, frequency: 3, amplitude: 15, hueShift: 120 }}>
  Content
</div>
```

**Options:** `duration`, `easing`, `frequency`, `amplitude`, `startScale`, `hueShift`

### pixelate

Retro digital materialization effect.

```svelte
<div transition:pixelate={{ duration: 600, maxPixelSize: 20 }}>
  Content
</div>
```

**Options:** `duration`, `easing`, `maxPixelSize`, `startScale`

### shatter

Shatters into fragments and reassembles.

```svelte
<div transition:shatter={{ duration: 700, shards: 4, displacement: 30, rotation: 45 }}>
  Content
</div>
```

**Options:** `duration`, `easing`, `shards`, `displacement`, `rotation`

### voidPulse

Pulsing energy wave with expanding glow.

```svelte
<div transition:voidPulse={{ duration: 800, pulses: 3, pulseScale: 1.5, glowColor: '100, 200, 255' }}>
  Content
</div>
```

**Options:** `duration`, `easing`, `pulses`, `pulseScale`, `startScale`, `glowColor`

## Components

### VoidCard

A card component that uses voidDissolve for enter/exit.

```svelte
<script lang="ts">
  import { VoidCard } from 'svelte-voidmorphism';
</script>

<VoidCard visible={true} duration={800} voidColor="100, 100, 255">
  <h2>Title</h2>
  <p>Card content</p>
</VoidCard>
```

### GlitchText

Text with glitch transition and optional continuous CSS animation.

```svelte
<script lang="ts">
  import { GlitchText } from 'svelte-voidmorphism';
</script>

<GlitchText text="SYSTEM ERROR" continuous={true} color="#00ff88" />
```

### MorphContainer

A container that morphs in with scale, rotation, and skew.

```svelte
<script lang="ts">
  import { MorphContainer } from 'svelte-voidmorphism';
</script>

<MorphContainer visible={true} startScale={0.3} rotation={-15}>
  Content
</MorphContainer>
```

## Easing Functions

14 built-in easing functions:

`linear`, `easeInOutCubic`, `easeOutExpo`, `easeInExpo`, `easeInOutExpo`, `easeOutBack`, `easeInBack`, `easeInOutBack`, `easeOutElastic`, `easeInElastic`, `easeInOutElastic`, `easeOutBounce`, `easeInBounce`, `easeInOutBounce`

Plus utilities to create custom eases:

```ts
import { cubicBezier, steps, sequenceEasing } from 'svelte-voidmorphism/utils';

const customEase = cubicBezier(0.25, 0.1, 0.25, 1);
const stepped = steps(5);
const combined = sequenceEasing(
  { easing: easeOutExpo, weight: 1 },
  { easing: easeOutBounce, weight: 1 }
);
```

## Browser Support

All transitions use standard CSS `transform`, `filter`, `clip-path`, and `box-shadow` properties. Works in all modern browsers (Chrome, Firefox, Safari, Edge).

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT
