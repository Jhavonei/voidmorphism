# Spacemorphism Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan phase-by-phase. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the v0.1.0 purple/gold "Voidmorphism" library into **Spacemorphism** — a monochrome, gravity-driven, space-sci-fi Svelte 5 material system with a full animated-component suite, signature WebGL/gravity features, a showcase site, a CLI, and complete docs.

**Architecture:** A rebranded, token-driven CSS material system (`.sm-*`, `--sm-*`) sits at the base. A shared "Spacetime" gravity engine (`core/spacetime.ts`) provides one page-wide pointer-mass field that every interactive component and the star-dust consume. Effect components (canvas/SVG/CSS) build on the tokens and the engine. A SvelteKit showcase demonstrates everything; a dev-time CLI distributes components shadcn-style.

**Tech Stack:** Svelte 5 (runes), SvelteKit 2, TypeScript, Vite 5, Vitest, hand-rolled Canvas2D + WebGL (no runtime deps), `@sveltejs/package` for the library build.

## Global Constraints

- Svelte 5 runes only (`$state`, `$props`, `$derived`, `$effect`, `$bindable`, snippets). Floor: `svelte@^5`.
- **Zero runtime dependencies.** WebGL/canvas hand-rolled. CLI lives in `cli/` and is NOT a runtime dependency.
- Brand: **Spacemorphism**. Package `svelte-spacemorphism`. Components `Space*`. CSS class prefix `.sm-`. Tokens `--sm-`. Style import `svelte-spacemorphism/styles`.
- Palette: monochrome grayscale + ONE cold accent `hsl(212 90% 72%)` via `--sm-accent`; `--sm-accent-chroma` (0–1) neutralizes to grayscale. No purple/gold anywhere.
- Every animated component: honors `prefers-reduced-motion`, SSR-safe (guard `window`/`document`), decorative layers `aria-hidden`, viewport-gated if it runs a rAF/canvas loop, cleans up on unmount.
- Performance tiers: root `data-sm-perf="cinematic|balanced|eco"` scales blur/particle counts/octaves/frame caps.
- Commits: `type(scope): description` (lowercase, no trailing period), `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.
- Verification gates per phase: `npm run check` (svelte-check/types), `npm run test` (vitest), and `npm run build` must pass before a phase is considered done. `npm run package` + `publint` must pass before the docs phase closes.

---

## File Structure (target)

```
src/lib/
  styles/spacemorphism.css        # tokens + .sm-surface material + perf tiers + themes
  index.ts                        # barrel export
  core/
    env.ts                        # isBrowser, prefersReducedMotion(), perf detection
    config.ts                     # SpaceConfig: perf tier + accent chroma + density
    spacetime.ts                  # shared gravity field engine (singleton store)
    raf.ts                        # shared rAF scheduler + viewport gating helper
  actions/
    gravityWell.ts                # consumes spacetime
    resonance.ts                  # consumes spacetime
  components/
    SpaceSurface/Panel/Card/Button/Input/Modal/Nav.svelte
    SpaceField.svelte             # monochrome nebula + star dust + accretion vignette
    SpaceFilters.svelte           # refraction profile family
    StarDust/Constellation/DotField/StarGrid/GravityRipple.svelte
    SpaceBeam/BorderBeam/ShineBorder/OrbitingBodies/Marquee/ShimmerButton.svelte
    SpaceTabs/HoverButton/SpaceSubscribe/SpaceFeatures.svelte
    BlackHole.svelte              # WebGL gravitational-lensing hero
    CometCursor.svelte            # global comet cursor
    SoundProvider.svelte
    GlitchText/MorphContainer.svelte   # kept, de-branded
  sound/sound.ts                  # WebAudio synth SFX + haptics manager
  transitions/                    # dissolve, dissipate, warp, gravityPulse, seamless,
                                  # glitch, morph, pixelate, shatter, phaseShift,
                                  # easing.ts, utils.ts, index.ts
  registry/registry.json          # CLI manifest (Phase 9)
src/routes/                       # showcase (Phase 8)
cli/index.js                      # dev-time CLI (Phase 9)
SPACE_PHASES.md  README.md  CONTRIBUTING.md  CHANGELOG.md
```

---

## PHASE 0 — Foundation: rebrand + monochrome tokens + refraction + SpaceField + QOL core

**Outcome:** library builds and type-checks under `svelte-spacemorphism` with the monochrome material system; no `Void`/`vm-`/purple-gold references remain.

### Task 0.1: Package + config rebrand
**Files:** Modify `package.json`, `README.md` (name only for now), `src/app.html`, `svelte.config.js`, `vite.config.ts`.
- [ ] Set `package.json` name → `svelte-spacemorphism`, update description (monochrome/space/gravity), exports `./styles` → `./dist/styles/spacemorphism.css`, keywords (drop voidmorphism, add spacemorphism/space/gravity/webgl/cli), repo URLs `svelte-spacemorphism`.
- [ ] Rename `src/app.html` `vm-`/void copy; set `<html data-sm-theme="dark" data-sm-perf="cinematic">`.
- [ ] Verify: `git mv` style not needed (config files). Commit `chore(rebrand): rename package to svelte-spacemorphism`.

### Task 0.2: Token + material stylesheet
**Files:** Create `src/lib/styles/spacemorphism.css` (port from `voidmorphism.css`); delete `voidmorphism.css`.
- [ ] Rewrite `:root`/`[data-sm-theme='dark']` with the monochrome ramp + cold accent tokens from the spec §3.1 (grayscale `--sm-void/abyss/charcoal/graphite/gray/gray-light/silver/white`, `--sm-accent-*` with chroma switch, white/silver rim, neutral surface tints `--sm-surface-0..3` at hue 220 sat ~6%, `--sm-bloom` = accent).
- [ ] Port `.sm-surface`, `::before` (event horizon), `::after` (gravity highlight), `.sm-depth-1..4`, `.sm-bloom`, `.sm-title`, `.sm-drift`, reduced-motion block — renaming all `vm-`→`sm-`.
- [ ] Add perf-tier overrides: `[data-sm-perf='balanced']`/`[data-sm-perf='eco']` reduce `--sm-blur`, `--sm-saturate`, disable heavy shadows on `eco`.
- [ ] Rewrite `[data-sm-theme='light']` as the monochrome "observatory" theme (luminous silver glass on pale dawn, same cold accent).
- [ ] Verify: no `--vm-`/`vm-` left in file. Commit `feat(styles): monochrome spacemorphism token + material system`.

### Task 0.3: Rename components Void* → Space* + vm-→sm-
**Files:** `git mv` each `src/lib/components/Void*.svelte` → `Space*.svelte`; update class names, token refs, comments, and `data-vm-*`→`data-sm-*` inside each. Update `src/lib/index.ts` exports. Update `GlitchText.svelte`, `MorphContainer.svelte`, actions, `transitions/easing.ts`, `transitions/index.ts` (de-brand comments + the `voidDissolve`/`voidPulse` names handled in Phase 5; keep working exports for now via temporary alias or defer rename to Phase 5).
- [ ] `git mv` VoidSurface→SpaceSurface, VoidPanel→SpacePanel, VoidCard→SpaceCard, VoidButton→SpaceButton, VoidInput→SpaceInput, VoidModal→SpaceModal, VoidNav→SpaceNav, VoidField→SpaceField, VoidFilters→SpaceFilters.
- [ ] Replace `vm-`→`sm-`, `--vm-`→`--sm-`, `data-vm-`→`data-sm-` across all component/action/transition/route files (careful, literal). Update `index.ts` to export `Space*`.
- [ ] Update `gravityWell`/`resonance` to write `--sm-*` vars; rename `--vm-resonance`→`--sm-resonance`.
- [ ] Verify: `grep -ri "void\|vm-" src/lib` returns only intentional lore words (none in code). `npm run check` passes. Commit `refactor(components): rename Void* to Space* and vm- to sm-`.

### Task 0.4: Refraction profile family (SpaceFilters)
**Files:** Modify `SpaceFilters.svelte`.
- [ ] Replace the 3 filters with a named family: `sm-ripple` (default, soft radial), `sm-warp` (deep, directional stretch), `sm-dissipate` (high-octave fractal), `sm-caustic` (fine fast turbulence), plus `sm-bloom`. Each uses `feTurbulence`+`feDisplacementMap`; add a faint `feColorMatrix`/`feOffset` chromatic edge on `sm-warp` for "high definition." Keep ids referenced by `--sm-filter`.
- [ ] Update `SpaceSurface` `distortion?: 'ripple'|'warp'|'dissipate'|'caustic'` prop → maps to filter id; default `ripple`. Keep `@supports` fallback contract.
- [ ] Verify: `npm run check`. Commit `feat(filters): named refraction profile family`.

### Task 0.5: QOL core — env, config, raf
**Files:** Create `src/lib/core/env.ts`, `src/lib/core/config.ts`, `src/lib/core/raf.ts`. Test `src/lib/core/core.test.ts`.
- [ ] `env.ts`: `export const isBrowser`, `prefersReducedMotion()`, `detectPerfTier(): 'cinematic'|'balanced'|'eco'` (from `hardwareConcurrency`, `deviceMemory`, save-data, reduced-motion; SSR → 'balanced').
- [ ] `config.ts`: `getSpaceConfig()/setSpaceConfig()` writing `data-sm-perf` + `--sm-accent-chroma`/`--sm-density` on `document.documentElement`; reactive `$state` store.
- [ ] `raf.ts`: shared rAF scheduler (`onFrame(cb): () => void`, one global loop) and `whenVisible(node, cb)` IntersectionObserver gate.
- [ ] TDD: tests for `detectPerfTier` (mock navigator) and `onFrame` register/unregister, `clamp`-style determinism.
- [ ] Verify: `npm run test`. Commit `feat(core): perf tiers, config, shared rAF + viewport gating`.

### Task 0.6: SpaceField monochrome rebuild
**Files:** Modify `SpaceField.svelte`.
- [ ] Rebuild canvas: layered star-dust (fine, many, slow drift), 3 parallax star layers (near/mid/far) reacting to pointer, neutral silver/cold nebula gradients (no violet/gold), accretion-disk vignette. Colors from tokens; monochrome with optional cold-accent tint via `--sm-accent`.
- [ ] Use shared rAF + `whenVisible`; honor reduced-motion (static field) + perf tier (star counts).
- [ ] Props: `stars?`, `dust?`, `parallax?`, `intensity?`, `accent?: boolean`.
- [ ] Verify: `npm run check` + `npm run build`. Commit `feat(field): monochrome star-dust + parallax + accretion vignette`.

**Phase 0 gate:** `npm run check && npm run test && npm run build` all green.

---

## PHASE 1 — Spacetime gravity engine + comet cursor

### Task 1.1: Spacetime engine
**Files:** Create `src/lib/core/spacetime.ts`. Test `src/lib/core/spacetime.test.ts`.
- [ ] Singleton: tracks pointer `{x,y,vx,vy}`, a `mass`, registered bodies `register(node, opts)→unregister`. One pointer listener + shared rAF. Writes global `--sm-mx/--sm-my` on root and per-body `--sm-pull/--sm-tilt-x/--sm-tilt-y` using critically-damped easing (port math from `gravityWell`).
- [ ] Pure helpers exported + tested: `proximity(dist, field)`, `damp(cur,target,k)`, `tiltFor(dx,dy,field,max)`.
- [ ] SSR/reduced-motion guards.
- [ ] Verify: `npm run test`. Commit `feat(spacetime): shared page-wide gravity field engine`.

### Task 1.2: Refactor actions onto spacetime
**Files:** Modify `actions/gravityWell.ts`, `actions/resonance.ts`.
- [ ] `gravityWell` and `resonance` register with `spacetime` instead of each adding listeners/loops. Same public option types; behavior preserved.
- [ ] Verify: `npm run check && npm run test`. Commit `refactor(actions): consume shared spacetime field`.

### Task 1.3: Comet cursor
**Files:** Create `components/CometCursor.svelte`. Export in `index.ts`.
- [ ] Canvas-based global cursor: a light core + decaying trail following the pointer; registers as the spacetime "mass." Props: `size?`, `trail?`, `color?`, `hideNative?`. Reduced-motion → simple dot; SSR-safe; touch → disabled.
- [ ] Verify: `npm run check && npm run build`. Commit `feat(cursor): gravity comet cursor`.

**Phase 1 gate:** check + test + build green.

---

## PHASE 2 — Backgrounds & fields

Each component: own `.svelte` file, exported in `index.ts`, canvas/SVG, shared rAF + `whenVisible`, reduced-motion + perf aware, SSR-safe, typed props, `aria-hidden` wrapper.

- [ ] **Task 2.1 `StarDust`** — particle field; particles accelerate toward the spacetime pointer (gravity). Props: `count?`, `speed?`, `gravity?`, `color?`, `size?`. Commit `feat(stardust): cursor-reactive star-dust field`.
- [ ] **Task 2.2 `Constellation`** — grid of points/circles; nearest neighbors connect with lines; points near pointer brighten/link (constellation). Props: `gap?`, `dotSize?`, `linkDistance?`, `color?`. Commit `feat(constellation): constellation grid background`.
- [ ] **Task 2.3 `DotField`** — CSS/SVG dot pattern with optional radial glow mask following pointer. Props: `gap?`, `dotSize?`, `mask?`, `color?`. Commit `feat(dotfield): dot pattern background`.
- [ ] **Task 2.4 `StarGrid`** — grid cells flicker like stars; optional circular "black-hole dead zone" mask. Props: `squareSize?`, `gap?`, `flickerChance?`, `color?`, `deadZone?`. Commit `feat(stargrid): flickering star grid`.
- [ ] **Task 2.5 `GravityRipple`** — concentric expanding rings (spacetime ripples). Props: `rings?`, `interval?`, `maxRadius?`, `color?`. Commit `feat(ripple): gravitational ripple rings`.

**Phase 2 gate:** check + build green.

---

## PHASE 3 — Motion accents

- [ ] **Task 3.1 `SpaceBeam`** — SVG light beam between two referenced nodes (`fromRef`/`toRef` via bound elements or ids); animated gradient core in cold accent; curvature prop. Commit `feat(beam): animated beam between nodes`.
- [ ] **Task 3.2 `BorderBeam`** — element wrapper with a beam orbiting the border (CSS `offset-path`/conic). Props: `size?`, `duration?`, `color?`, `borderWidth?`. Commit `feat(borderbeam): orbiting border beam`.
- [ ] **Task 3.3 `ShineBorder`** — animated shine sweeping a border (masked gradient). Props: `borderWidth?`, `duration?`, `color?`, `radius?`. Commit `feat(shineborder): animated shine border`.
- [ ] **Task 3.4 `OrbitingBodies`** — children placed on circular orbits around a center slot; `radius?`, `duration?`, `reverse?`, `count`/per-child via snippet. Commit `feat(orbit): orbiting bodies`.
- [ ] **Task 3.5 `Marquee`** — infinite scroll of a children snippet with gradient fade edges; `speed?`, `direction?`, `pauseOnHover?`, `reverse?`. Commit `feat(marquee): infinite marquee`.
- [ ] **Task 3.6 `ShimmerButton`** — button with traveling shimmer; `as?`, `color?`, `shimmerDuration?`; built on `.sm-surface`. Commit `feat(shimmerbutton): shimmer button`.

**Phase 3 gate:** check + build green.

---

## PHASE 4 — Interactive components

- [ ] **Task 4.1 `SpaceTabs`** — tabs with a sliding/morphing indicator (FLIP via measured rects); `tabs: {id,label}[]`, `bind:active`, keyboard nav, `:focus-visible`. Commit `feat(tabs): animated tabs`.
- [ ] **Task 4.2 `HoverButton`** — interactive hover-reveal button (label slides, icon/arrow reveal, fill from accent). Props: `as?`, `icon?` snippet. Commit `feat(hoverbutton): interactive hover button`.
- [ ] **Task 4.3 `SpaceSubscribe`** — subscribe control with `idle→loading→subscribed` states; success state dissipates the label into star dust (uses `dissipate` transition from Phase 5). Props: `bind:state`, `onsubscribe`, labels; also a newsletter `email` variant. Commit `feat(subscribe): animated subscribe with dissipate`.
- [ ] **Task 4.4 `SpaceFeatures`** — bento feature grid built on `SpaceSurface`; `features: {title,body,icon?}[]` + layout spans. Commit `feat(features): bento feature grid`.

**Phase 4 gate:** check + build green. (4.3 depends on Phase 5's `dissipate`; build Phase 5 first or gate 4.3 after it.)

---

## PHASE 5 — Transitions & motion system

**Files:** `transitions/*.ts` + `index.ts` + `transitions.test.ts`.
- [ ] **Task 5.1** Rename `voidDissolve.ts`→`dissolve.ts` (export `dissolve`), `voidPulse.ts`→`gravityPulse.ts` (export `gravityPulse`); update `index.ts`, `SpaceCard` import, README later. De-brand `'0,0,0'`→token-driven default. Commit `refactor(transitions): rename to dissolve + gravityPulse`.
- [ ] **Task 5.2** Add `dissipate.ts` — element scatters into star-dust (many small box-shadow/clip particles drifting outward + blur + fade). TDD `TransitionConfig` shape. Commit `feat(transitions): dissipate`.
- [ ] **Task 5.3** Add `warp.ts` — gravitational lens stretch (scaleX/Y skew + blur + brightness) for the "space element" transition. TDD. Commit `feat(transitions): warp`.
- [ ] **Task 5.4** Add `seamless.ts` — shared-element/FLIP morph helper (`crossfade`-style send/receive keyed pair). TDD with mock rects. Commit `feat(transitions): seamless shared-element morph`.
- [ ] **Task 5.5** Add cinematic easings (`easeInOutSine`, `anticipate`, `easeOutCirc`) to `easing.ts`; export. TDD monotonicity/bounds. Commit `feat(easing): cinematic easings`.

**Phase 5 gate:** `npm run test` green (all transitions tested).

---

## PHASE 6 — WebGL black-hole hero

**Files:** Create `components/BlackHole.svelte` (+ inline GLSL strings). Test (math helpers) `components/blackhole.test.ts`.
- [ ] WebGL2 (fallback WebGL1) fragment shader: samples a background (gradient star scene or provided texture) and applies gravitational-lens displacement around a center mass + accretion-disk ring + photon ring glow, monochrome with cold-accent disk. Props: `mass?`, `radius?`, `disk?`, `spin?`, `accent?`, `quality?`.
- [ ] Perf: resolution scales with perf tier; `eco`/reduced-motion → static canvas fallback (CSS radial). Lose-context handling, cleanup, SSR guard, `whenVisible` gating.
- [ ] TDD pure helpers (`lensOffset`, resolution-for-tier). Commit `feat(blackhole): webgl gravitational-lensing hero`.

**Phase 6 gate:** check + build green.

---

## PHASE 7 — Sound & haptics (optional, off by default)

**Files:** Create `sound/sound.ts`, `components/SoundProvider.svelte`. Export.
- [ ] `sound.ts`: WebAudio synth (no assets) — `playTone(name)` for `hover/press/success/warp`; master enable flag (default off, persisted to `localStorage`); `vibrate(pattern)` via `navigator.vibrate` (guarded).
- [ ] `SoundProvider.svelte`: context provider + a toggle helper; opt-in wiring for `SpaceButton`/`ShimmerButton`/`HoverButton`/`SpaceSubscribe` via a `sound?` prop (no-op when disabled).
- [ ] TDD: enable/disable state + name→params mapping (mock AudioContext). Commit `feat(sound): optional sci-fi sfx + haptics`.

**Phase 7 gate:** check + test green.

---

## PHASE 8 — Showcase site + Habitat Console

**Files:** `src/routes/**`, `src/routes/+layout.svelte` (mount `SpaceFilters`,`SpaceField`,`CometCursor`, theme + perf toggles, import styles), components for showcase chrome under `src/routes/(showcase)/lib/`.
- [ ] **8.1** Showcase shell: nav, theme toggle, perf-tier toggle, sound toggle, footer. Commit `feat(showcase): app shell + global toggles`.
- [ ] **8.2** Landing `/`: black-hole hero + Spacetime field + comet cursor + positioning narrative + live demo strip. Commit `feat(showcase): cinematic landing`.
- [ ] **8.3** `/components` index grid + `/components/[slug]` detail: live preview, props table (from a typed metadata map), copy-paste code block w/ copy button. One metadata entry per component. Commit `feat(showcase): component gallery + detail pages`.
- [ ] **8.4** `/transitions` playground (trigger + option sliders). Commit `feat(showcase): transitions playground`.
- [ ] **8.5** `/forge` token playground: sliders for gravity/chroma/blur/refraction/perf, live preview, shareable URL (`?state=`), copy CSS tokens. Commit `feat(showcase): forge token playground`.
- [ ] **8.6** `/design`: design system + lore (renders from SPACE_PHASES content). Commit `feat(showcase): design + lore page`.
- [ ] **8.7** Habitat Console demo `/habitat`: mission-control dashboard (life-support gauges, orbital map via OrbitingBodies, comms Marquee, crew SpaceCards, StarGrid bg) composed from components. Commit `feat(showcase): habitat console flagship demo`.
- [ ] **8.8** Hosting: swap `@sveltejs/adapter-auto`→`@sveltejs/adapter-vercel` (devDep), add OG/meta + favicon. Commit `chore(showcase): vercel adapter + meta`.

**Phase 8 gate:** `npm run build` (app) green; manual sanity of routes via `npm run dev` smoke.

---

## PHASE 9 — CLI & registry

**Files:** `cli/index.js` (+ `cli/registry-build.js`), `src/lib/registry/registry.json`, `package.json` `bin`.
- [ ] **9.1** Registry build script: scans `src/lib/components` + transitions, emits `registry.json` (name, files, source, deps, category). Commit `feat(cli): registry build`.
- [ ] **9.2** CLI (`npx spacemorphism add <name>`, `list`, `init`): reads registry (from package or GitHub raw), copies sources into target `src/lib/spacemorphism/`, prints post-install notes. Node built-ins only (no deps). Add `bin` field. Commit `feat(cli): shadcn-style add command`.
- [ ] **9.3** Smoke test the CLI in a temp dir (`node cli/index.js list`). Commit `test(cli): cli smoke`.

**Phase 9 gate:** `node cli/index.js list` works; `npm run package` + `publint` clean.

---

## PHASE 10 — Docs & launch

- [ ] **10.1** `SPACE_PHASES.md` — living roadmap: vision/lore, the 11 phases with status checkboxes, design rationale, inspiration credits (MagicUI/animation-svelte), palette + token reference. Commit `docs(phases): add SPACE_PHASES roadmap + lore`.
- [ ] **10.2** `README.md` full rewrite — positioning (successor to glassmorphism/liquid glass), install, quick start, full component catalog table, transitions, theming + perf tiers, CLI usage, browser/refraction notes, contributing link. Commit `docs(readme): rewrite for spacemorphism`.
- [ ] **10.3** `CHANGELOG.md` (new) + `CONTRIBUTING.md` update for new structure/CLI. Commit `docs(changelog): add changelog + update contributing`.
- [ ] **10.4** Final gate: `npm run check && npm run test && npm run build && npm run package`. Fix any fallout. Commit `chore(release): verify build + package`.

**Phase 10 gate:** all four scripts green.

---

## Self-Review notes
- Spec coverage: every spec §3–§9 item maps to a phase/task above (tokens→0.2, refraction→0.4, field→0.6, spacetime→1.1, comet→1.3, all 15 components→2/3/4, transitions→5, black hole→6, sound→7, showcase+forge+habitat→8, CLI→9, docs→10, perf/a11y→0.5 + global constraints).
- SpaceSubscribe (4.3) depends on `dissipate` (5.2): build Phase 5 before finishing 4.3, or stub then wire. Noted in Task 4.3.
- Naming consistency: tokens `--sm-*`, classes `.sm-*`, components `Space*`/clean effect names, transitions `dissolve/dissipate/warp/gravityPulse/seamless`.
- Reduced-motion + SSR + perf gating are global constraints applied to every visual task, not repeated per task.
