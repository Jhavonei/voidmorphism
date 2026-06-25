# svelte-spacemorphism

> **Spacemorphism** — a monochrome, gravity-driven, space sci-fi material system
> and animated-component suite for Svelte 5. The successor to glassmorphism and
> Apple's liquid glass: surfaces lens light, bend reality, and pull star dust
> toward your cursor. Built with runes. **Zero runtime dependencies.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Svelte 5](https://img.shields.io/badge/Svelte-5-FF3E00.svg)](https://svelte.dev)

> The interface language of a spacefaring, multi-planet civilization. The whole
> page is one region of spacetime — move through it and everything leans toward you.

## What makes it different

| | Glassmorphism | Liquid Glass | **Spacemorphism** |
| --- | --- | --- | --- |
| Background | blurs it | distorts it | **warps spacetime behind it** |
| Foundation | light/gray | translucent | **infinite OLED black** |
| Edges | borders | strokes | **event-horizon darkening** |
| Color | anything | anything | **monochrome + one cold glow** |
| Interaction | hover | hover | **one page-wide gravity field** |
| Signature | — | refraction | **a real WebGL black hole** |

## Features

- **Material system** — `SpaceSurface` → `SpaceCard`, `SpacePanel`, `SpaceButton`, `SpaceInput`, `SpaceModal`, `SpaceNav`.
- **Shared Spacetime gravity field** — one page-wide pointer-mass field every surface and particle reacts to.
- **Signature visuals** — a hand-rolled WebGL `BlackHole`, a gravity `CometCursor`.
- **Backgrounds** — `StarDust`, `Constellation`, `DotField`, `StarGrid`, `GravityRipple`.
- **Motion** — `SpaceBeam`, `BorderBeam`, `ShineBorder`, `OrbitingBodies`, `Marquee`, `ShimmerButton`.
- **Interactive** — `SpaceTabs`, `HoverButton`, `SpaceSubscribe`, `SpaceFeatures`.
- **Transitions** — `dissolve`, `dissipate`, `warp`, `gravityPulse`, `seamless`, plus glitch/morph/pixelate/shatter/phaseShift.
- **QOL** — performance tiers, global config, reduced-motion everywhere, SSR-safe, viewport-gated.
- **Monochrome by design** — grayscale + one cold `hsl(212 90% 72%)` star-glow you can dial to pure grayscale.
- **Svelte 5 runes** · **zero runtime dependencies** · **tree-shakeable** · **fully typed**.

## Installation

```bash
npm install svelte-spacemorphism
```

Or copy components straight into your project, shadcn-style:

```bash
npx svelte-spacemorphism add black-hole star-dust space-card
```

## Quick start

Import the stylesheet once, mount the field + filters + cursor at your app root,
then build with space surfaces.

```svelte
<!-- +layout.svelte -->
<script lang="ts">
  import 'svelte-spacemorphism/styles';
  import { SpaceFilters, SpaceField, CometCursor } from 'svelte-spacemorphism';
  let { children } = $props();
</script>

<SpaceFilters />  <!-- SVG refraction filters, mount once -->
<SpaceField />    <!-- the infinite space background -->
<CometCursor />   <!-- the gravity comet cursor -->

{@render children?.()}
```

```svelte
<script lang="ts">
  import { SpaceCard, SpaceButton, SpaceSubscribe } from 'svelte-spacemorphism';
</script>

<SpaceCard interactive resonant bloom>
  <h2>Carved from spacetime</h2>
  <SpaceSubscribe email onsubscribe={join} />
  <SpaceButton variant="primary">Enter the void</SpaceButton>
</SpaceCard>
```

## The Spacetime field

Every gravity-reactive component registers with one shared field — a single
pointer listener and a single animation loop for the whole page.

```svelte
<script>
  import { gravityWell, resonance } from 'svelte-spacemorphism';
</script>

<div class="sm-surface" use:gravityWell={{ tilt: 6, field: 140 }} use:resonance>…</div>
```

Star dust and the comet cursor read the same field, so the cursor is a moving
mass that everything leans toward.

## Theming & quality

Re-skin the whole substance from a few CSS variables on `:root` (or any container):

```css
:root {
  --sm-accent: hsl(212 90% 72%);  /* the one cold star-glow */
  --sm-accent-chroma: 1;          /* set to 0 for pure grayscale */
  --sm-blur: 11px;
  --sm-refract-scale: 18;
}
```

- **Themes:** `data-sm-theme="dark"` (default) or `"light"` (the "observatory").
- **Performance:** `data-sm-perf="cinematic | balanced | eco"` scales blur, particle
  counts, refraction, and frame caps — or call `autoConfig()` to detect it.

```ts
import { setSpaceConfig, autoConfig } from 'svelte-spacemorphism';
autoConfig();                  // detect tier from the device
setSpaceConfig({ chroma: 0 }); // go pure grayscale
```

> **Browser note:** gravitational-lensing refraction uses an SVG filter referenced
> from `backdrop-filter`, which renders in Chromium today. Elsewhere it degrades
> to a tasteful backdrop blur — the borderless edges, gravity, bloom, and all
> animations still apply. The WebGL `BlackHole` falls back to a CSS render.

## Transitions

```svelte
<script>
  import { dissipate, warp } from 'svelte-spacemorphism';
  let show = $state(true);
</script>

{#if show}
  <div transition:dissipate={{ duration: 700 }}>Matter</div>
{/if}
```

`dissolve` · `dissipate` (scatter into star dust) · `warp` (gravitational lens) ·
`gravityPulse` · `seamless` (FLIP shared-element morph) · plus glitch, morph,
pixelate, shatter, phaseShift, and a full set of easings.

## CLI

```bash
npx svelte-spacemorphism list                  # browse components
npx svelte-spacemorphism add black-hole         # copy a component + its deps
npx svelte-spacemorphism init                   # styles + field + filters + cursor
```

## Documentation & lore

See [SPACE_PHASES.md](./SPACE_PHASES.md) for the design language, palette, the full
phase roadmap, and the lore. Run the showcase locally with `npm run dev`.

## Contributing

Contributions welcome — see [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT
