# Changelog

All notable changes to **svelte-spacemorphism** are documented here. The format is
based on [Keep a Changelog](https://keepachangelog.com/), and this project adheres
to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Changed
- **Rebrand: Voidmorphism → Spacemorphism.** Package renamed to
  `svelte-spacemorphism`; components `Void*` → `Space*`; CSS prefix `vm-` → `sm-`;
  tokens `--vm-` → `--sm-`; style import `svelte-spacemorphism/styles`.
- **Monochrome palette.** Replaced the purple/gold theme with a grayscale ramp
  (OLED black → charcoal → silver → white) plus one cold star-glow accent
  (`hsl(212 90% 72%)`), neutralizable via `--sm-accent-chroma`.
- Refraction upgraded to a named profile family (`ripple`, `warp`, `dissipate`,
  `caustic`) selectable per surface via the `distortion` prop.
- `SpaceField` rebuilt monochrome with star dust, parallax star layers, and an
  accretion-disk vignette.
- Transitions renamed: `voidDissolve` → `dissolve`, `voidPulse` → `gravityPulse`.

### Added
- **Spacetime gravity engine** — one page-wide pointer-mass field; `gravityWell`
  and `resonance` refactored to consume it; `getPointer`/`registerBody` exposed.
- **Signature visuals** — hand-rolled WebGL `BlackHole` (gravitational lensing,
  accretion disk, photon ring, CSS fallback) and the gravity `CometCursor`.
- **Backgrounds** — `StarDust`, `Constellation`, `DotField`, `StarGrid`, `GravityRipple`.
- **Motion** — `SpaceBeam`, `BorderBeam`, `ShineBorder`, `OrbitingBodies`, `Marquee`, `ShimmerButton`.
- **Interactive** — `SpaceTabs`, `HoverButton`, `SpaceSubscribe` (dissipates into
  star dust), `SpaceFeatures`.
- **Transitions** — `dissipate`, `warp`, `seamless` (FLIP), plus cinematic easings
  (`easeInOutSine`, `easeOutCirc`, `anticipate`).
- **QOL core** — performance tiers (`data-sm-perf`), global config (`setSpaceConfig`,
  `autoConfig`), a shared rAF loop, and viewport gating.
- **Optional sound + haptics** — synthesized Web Audio SFX and `navigator.vibrate`,
  off by default, with a `SoundToggle`.
- **Showcase site** — landing, component gallery + per-component pages, transitions
  playground, the **Forge** token playground, a design/lore page, and the
  **Habitat Console** flagship demo.
- **CLI** — `npx svelte-spacemorphism add <name>` copies components + their
  dependency closure into any project, plus `list` and `init`.
- Documentation: `SPACE_PHASES.md`, a full `README.md` rewrite, this changelog.

### Notes
- Zero runtime dependencies maintained.
