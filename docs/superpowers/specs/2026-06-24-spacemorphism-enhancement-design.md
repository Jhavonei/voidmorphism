# Spacemorphism — Design Spec

> Status: **Approved direction, pending final spec review**
> Date: 2026-06-24
> Supersedes: the purple/gold "Voidmorphism" v0.1.0 aesthetic.

## 1. Positioning & vision

Spacemorphism is the successor to glassmorphism and Apple's liquid glass: the
interface language of a spacefaring, multi-planet civilization. Where
glassmorphism *blurs* the background and liquid glass *distorts* it,
spacemorphism treats the entire page as a single region of **spacetime** —
surfaces are dense bodies that lens light, bend reality, and pull matter (star
dust) toward the cursor. The palette is monochromatic (OLED black → charcoal →
silver → white) with one cold star-glow accent. The metaphor that organizes
every effect is **gravity**.

This is an open-source Svelte 5 library meant to be adopted widely. Success
target: 1,000 GitHub stars within a month of launch + advertisement. That target
shapes scope toward (a) one signature, screenshot-worthy effect, (b) frictionless
adoption via a CLI/registry, and (c) a landing page that *is* the product.

### Brand rename (locked)
Full clean rebrand from "Voidmorphism" to **Spacemorphism** at v0.1.0 (nothing is
published, so the break is free):
- Package: `svelte-voidmorphism` → **`svelte-spacemorphism`**
- Components: `Void*` → **`Space*`** (`SpaceSurface`, `SpaceCard`, `SpaceButton`,
  `SpaceInput`, `SpaceModal`, `SpaceNav`, `SpacePanel`, `SpaceField`,
  `SpaceFilters`)
- CSS class prefix: `.vm-*` → **`.sm-*`**
- CSS custom properties: `--vm-*` → **`--sm-*`**
- Style import: `'svelte-spacemorphism/styles'`
- "Void" survives only as lore language for the literal black (deep space), not as
  an API prefix.

## 2. Locked decisions

| Decision | Choice |
| --- | --- |
| Palette | Monochrome grayscale base + **one cold star-glow accent** `hsl(212 90% 72%)`, exposed via `--sm-accent`; a `--sm-accent-chroma` switch can neutralize it to pure grayscale. |
| Brand | Full clean rebrand to Spacemorphism (see §1). |
| Showcase | **Full showcase site** — landing + per-component routes (live preview, props table, copy-paste code) + transitions playground + Forge + design/lore. |
| Delivery | **Phased** ("Space Phases"), each phase independently reviewable; `SPACE_PHASES.md` is the living roadmap. |
| Signature FX | WebGL black-hole lensing hero · shared "Spacetime" gravity field · gravity comet cursor. |
| Distribution | shadcn-style CLI + registry · live "Forge" playground · optional sound + haptics. |
| Flagship demo | "Habitat Console" mission-control dashboard. |
| Dependencies | **Zero runtime dependencies** preserved; WebGL is hand-rolled; the CLI is a separate dev-time tool. |
| Out of scope | Hyperspace route transitions; Tailwind / framework-agnostic CSS layer. (A `warp` *transition* still ships.) |

### Non-goals
- React/Vue/HTML ports (Svelte 5 only).
- A runtime physics engine dependency (gravity is hand-rolled, lightweight).
- Backend / account features for the showcase.

## 3. Design system (Phase 0 foundation)

### 3.1 Tokens (`src/lib/styles/spacemorphism.css`)
Replace the purple/gold tokens with a neutral ramp + cold accent. Indicative
values (final values tuned during implementation):

```
--sm-void:        #050609;   /* deepest space / OLED black */
--sm-void-deep:   #000000;
--sm-abyss:       #0b0c11;
--sm-charcoal:    #15171c;
--sm-graphite:    #22252d;
--sm-gray:        #595d68;
--sm-gray-light:  #9598a4;
--sm-silver:      #c4c8d2;
--sm-white:       #f3f5fa;

--sm-accent-h: 212; --sm-accent-s: 90%; --sm-accent-l: 72%;
--sm-accent-chroma: 1;                 /* 0 → pure grayscale */
--sm-accent: hsl(var(--sm-accent-h) calc(var(--sm-accent-s) * var(--sm-accent-chroma)) var(--sm-accent-l));

--sm-rim:     hsla(0 0% 100% / 0.32);  /* white/silver rim-light, never violet */
--sm-horizon: hsla(220 30% 2% / 0.92); /* event-horizon darkening */

--sm-blur: 11px; --sm-saturate: 1.2;   /* lower saturate; neutral glass */
--sm-refract-scale: 18;

/* live gravity values written by the Spacetime engine */
--sm-mx: 50%; --sm-my: 50%; --sm-pull: 0; --sm-tilt-x: 0deg; --sm-tilt-y: 0deg;
```

Surface tints become **neutral charcoal-glass** (no hue), rim-light white/silver,
bloom = cold accent. Dark is the default theme; a `[data-sm-theme='light']`
"observatory" theme inverts to luminous silver glass on a pale dawn.

### 3.2 Refraction profiles ("nebulaism", `SpaceFilters`)
Today: a single `feDisplacementMap`. Upgrade to a **family of named SVG
distortion profiles**, each a tuned `feTurbulence` + `feDisplacementMap` (+ optional
chromatic edge offset for "higher definition"):
- `ripple` — soft radial ripples (default surfaces)
- `warp`   — directional gravitational stretch (modals/foreground)
- `dissipate` — high-octave fractal scatter (for the dissipate transition)
- `caustic` — fine, fast turbulence (energy/edge highlights)

Selected per surface via a `distortion` prop; intensity driven by CSS vars so it
reacts to gravity/scroll. `@supports` gate keeps the pure `backdrop-filter`
blur+saturate fallback for non-Chromium.

### 3.3 `SpaceField` upgrade
Monochrome rebuild of the background: layered **star dust** (fine drifting
particles), parallax **star layers** (near/mid/far), a faint **accretion-disk
vignette** (black-hole inspired), and a neutral silver/cold nebula. Driven by the
same tokens, gravity-reactive (consumes the Spacetime field), perf-tier aware,
reduced-motion aware, viewport-gated.

## 4. Spacetime gravity engine (Phase 1, the conceptual signature)

A single, page-wide gravitational field that unifies every component.

- `createSpacetime()` — a shared store/singleton holding pointer position,
  velocity, a "mass" value, and a list of registered bodies. One rAF loop.
- Writes global CSS vars (`--sm-mx/-my/-pull`) and per-registered-element vars so
  surfaces tilt/lens toward the cursor and star-dust accelerates toward it.
- `gravityWell` and `resonance` actions are refactored to **consume** the shared
  field instead of each running their own listeners (one loop, many consumers).
- Respects reduced-motion (field goes static), perf tiers (update rate/precision),
  and SSR (no-op until mounted).
- **Gravity comet cursor**: an optional global custom cursor rendered as a light
  source / comet with a decaying trail; it is the visible "mass" of the field and
  star-dust reacts to it. Toggleable; falls back to the native cursor.

## 5. Component catalog

Material primitives keep the `Space` prefix; effect components use clean,
copy-paste-friendly names. Every component: monochrome + cold accent,
reduced-motion aware, SSR-safe, viewport-gated if it runs a canvas, fully typed,
documented props.

### 5.1 Backgrounds & fields (Phase 2)
| Component | Source | Description |
| --- | --- | --- |
| `StarDust` | particles | Cursor-reactive star-dust particle field; particles pulled by the Spacetime field. |
| `Constellation` | bg-boxes (reimagined) | Background grid of **circles/points wired into constellations** that light up on hover. |
| `DotField` | dot-pattern | Dot-grid background with optional radial/glow mask. |
| `StarGrid` | flickering-grid | Grid cells twinkle like distant stars; optional black-hole "dead-zone" mask. |
| `GravityRipple` | ripple | Concentric spacetime ripples / gravitational-wave rings. |

### 5.2 Motion accents (Phase 3)
| Component | Source | Description |
| --- | --- | --- |
| `SpaceBeam` | animated-beam | Light beam traveling an SVG path between two referenced nodes. |
| `BorderBeam` | border-beam | A beam of light orbiting an element's border. |
| `ShineBorder` | shine-border | Shine sweeping around a border. |
| `OrbitingBodies` | orbiting-circles | Children orbiting a center on circular tracks (satellites/planets). |
| `Marquee` | marquee | Infinite-scroll row with gradient fade edges; pause-on-hover. |
| `ShimmerButton` | shimmer-button | Button with a traveling shimmer light. |

### 5.3 Interactive components (Phase 4)
| Component | Source | Description |
| --- | --- | --- |
| `SpaceTabs` | luxe animated-tabs | Sliding/morphing animated tab indicator. |
| `HoverButton` | interactive-hover | Hover-reveal interactive button. |
| `SpaceSubscribe` | animated-subscribe | Subscribe/newsletter control with idle→loading→subscribed states that **dissipate into star dust**; reusable for buttons and newsletter forms. |
| `SpaceFeatures` | features | Bento-style feature grid built on `SpaceSurface`. |

## 6. Transitions & motion (Phase 5)

Keep and de-brand existing `glitch`, `morph`, `pixelate`, `shatter`, `phaseShift`.
Refine/add the gravity-native set:
- `dissolve` — refined particle dissolve (renamed from `voidDissolve`).
- `dissipate` — element scatters into drifting star dust that fades outward.
- `warp` — gravitational-lens stretch (the "space element" transition).
- `gravityPulse` — expanding pulse wave (renamed/refined from `voidPulse`).
- `seamless` — shared-element / FLIP-style morph between two elements (the
  "seamless animations" ask).
- A few cinematic easings added to `easing.ts`.
All `css`-based where possible for performance; tested in `transitions.test.ts`.

## 7. QOL systems (Phase 0 core, extended throughout)
- **Performance tiers** — root `data-sm-perf="cinematic|balanced|eco"` scales
  blur, particle counts, refraction octaves, frame caps. Auto-detected from device
  hints (`hardwareConcurrency`, `deviceMemory`, `prefers-reduced-motion`,
  save-data), user-overridable.
- **Global config** — light context/CSS-var API for accent-chroma, density, motion.
- **Accessibility** — universal `prefers-reduced-motion` honoring; decorative
  layers `aria-hidden`; cold-accent `:focus-visible` rings; keyboard-operable
  interactive components.
- **Robustness** — SSR-safe guards; viewport gating via IntersectionObserver;
  shared rAF; cleanup on unmount.
- **Themes** — dark default + light "observatory" theme; runtime toggle helper.

## 8. Signature & launch features

### 8.1 WebGL black-hole hero (Phase 6)
Hand-rolled WebGL (no dependency): a fragment shader that **gravitationally
lenses** the page/scene behind it, with a glowing accretion disk and photon ring.
Perf-tier aware (resolution scaling, disabled on `eco`/reduced-motion), with a
static canvas/CSS fallback. This is the primary viral asset.

### 8.2 Sound & haptics (Phase 7, optional/off by default)
A tiny sound manager (WebAudio, synthesized — no asset deps) for subtle sci-fi UI
SFX, plus `navigator.vibrate` haptics on mobile. Global toggle; respects user
preference and starts disabled.

### 8.3 Showcase site (Phase 8)
SvelteKit routes:
- `/` — cinematic landing: black-hole hero, Spacetime field, comet cursor, live
  component demos, the positioning narrative.
- `/components` — gallery grid; `/components/[slug]` — live preview + props table +
  copy-paste code + variants.
- `/transitions` — playground to trigger each transition and tweak options.
- `/forge` — **live token playground**: sliders for gravity, chroma, blur,
  refraction, perf; shareable URL state; one-click copy of generated CSS tokens.
- `/design` — the Spacemorphism design system, palette, and lore.
- **Habitat Console** flagship demo — a futuristic multi-planet-habitat OS
  (life-support gauges, orbital map, comms feed, crew roster) composed entirely
  from the components, reachable from the landing page.
- Shared chrome: theme toggle, performance-tier toggle, copy buttons.
- Hosting: Vercel (`@sveltejs/adapter-vercel`), with OG/meta images.

### 8.4 CLI & registry (Phase 9)
shadcn-style copy-paste distribution: a registry (JSON manifest + bundled
component sources) and a dev-time CLI so `npx spacemorphism add black-hole` copies
a component and its deps into any project. Kept out of the runtime package's
dependency graph.

## 9. Documentation & launch (Phase 10)
- **`SPACE_PHASES.md`** — the living roadmap: every phase, design rationale,
  inspiration, lore, and status tracking. (This is the renamed `VOID_PHASES.md`
  the request asked for.)
- **`README.md`** — full rewrite for Spacemorphism: positioning, install, quick
  start, component catalog, theming, QOL, CLI, browser notes.
- **`CONTRIBUTING.md`** — updated for the new structure and CLI/registry.
- Launch checklist: meta/OG images, demo video script, hosting config.

## 10. File / module structure (target)

```
src/lib/
  styles/spacemorphism.css
  index.ts                      # barrel: Space* + effect components + actions
  core/
    spacetime.ts                # shared gravity engine
    config.ts                   # perf tiers + global config
    a11y.ts, raf.ts, env.ts     # shared QOL helpers
  actions/ gravityWell.ts resonance.ts   # refactored to consume spacetime
  components/
    SpaceSurface/Panel/Card/Button/Input/Modal/Nav/Field/Filters.svelte
    StarDust/Constellation/DotField/StarGrid/GravityRipple.svelte
    SpaceBeam/BorderBeam/ShineBorder/OrbitingBodies/Marquee/ShimmerButton.svelte
    SpaceTabs/HoverButton/SpaceSubscribe/SpaceFeatures.svelte
    BlackHole.svelte            # WebGL hero
    CometCursor.svelte
    SoundProvider.svelte / sound.ts
  transitions/                  # dissolve, dissipate, warp, gravityPulse,
                                # seamless, glitch, morph, pixelate, shatter,
                                # phaseShift, easing, utils
  registry/                     # CLI manifest + bundled sources (Phase 9)
src/routes/                     # showcase (Phase 8)
cli/                            # dev-time CLI (Phase 9, not shipped in runtime deps)
```

## 11. Phase plan (Space Phases) & dependencies

| Phase | Title | Depends on |
| --- | --- | --- |
| 0 | Foundation: rebrand + monochrome tokens + refraction profiles + SpaceField + QOL core | — |
| 1 | Spacetime gravity engine + comet cursor; refactor actions | 0 |
| 2 | Backgrounds: StarDust, Constellation, DotField, StarGrid, GravityRipple | 0,1 |
| 3 | Motion accents: SpaceBeam, BorderBeam, ShineBorder, OrbitingBodies, Marquee, ShimmerButton | 0 |
| 4 | Interactive: SpaceTabs, HoverButton, SpaceSubscribe, SpaceFeatures | 0,(5 for SpaceSubscribe) |
| 5 | Transitions & motion system | 0 |
| 6 | WebGL black-hole hero | 0,1 |
| 7 | Sound & haptics (optional) | 0 |
| 8 | Showcase site + Habitat Console flagship | 0–7 |
| 9 | CLI & registry | components exist (2–4,6) |
| 10 | Docs & launch (SPACE_PHASES, README, hosting) | all |

Phases 2/3/5 are largely parallelizable after 0–1.

## 12. Testing & quality strategy
- Unit tests (vitest) for transitions (existing pattern), easings, the spacetime
  math, perf-tier detection, and config.
- Component smoke tests where meaningful (render + key prop behavior) via jsdom.
- `svelte-check` (types) and `publint` (package) clean before each phase closes.
- Manual visual verification of canvas/WebGL components per phase (jsdom can't
  render them); document expected behavior.
- Every animated component verified to no-op under `prefers-reduced-motion`.

## 13. Success criteria
- `npm run check`, `npm run test`, and `npm run package` all pass.
- The library builds and exports cleanly under the new `svelte-spacemorphism` name.
- The showcase runs, demonstrates every component with copy-paste code, and ships
  the black-hole hero + Habitat Console.
- `SPACE_PHASES.md` + `README.md` fully document the system and its lore.
- Zero runtime dependencies maintained.

## 14. Risks & mitigations
- **WebGL complexity/perf** → perf-tier gating + static fallback; keep the shader
  self-contained and small.
- **Scope size** → strict phasing; each phase ships independently; YAGNI on extra
  components beyond the catalog.
- **Refraction browser support** → already Chromium-gated with graceful fallback;
  keep that contract.
- **Rebrand churn** → do the full rename mechanically in Phase 0 before new code
  lands, so nothing is built on old names.
