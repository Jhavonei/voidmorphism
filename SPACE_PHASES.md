# SPACE_PHASES.md

> The living roadmap, design rationale, and lore for **Spacemorphism** — the
> successor to glassmorphism and Apple's liquid glass. (Renamed from the
> originally-requested `VOID_PHASES.md` to match the Spacemorphism brand.)

---

## ✦ Lore

In the era of multi-planet habitats, interfaces stopped pretending to be panes of
frosted glass. A civilization that lives among black holes and accretion disks
builds screens that behave like **spacetime itself**: surfaces are dense bodies
that bend the light passing behind them, edges fade into an event horizon rather
than a border, and matter — star dust — falls toward your cursor as if it had
mass.

Where **glassmorphism** *blurs* the background and **liquid glass** *distorts* it,
**Spacemorphism** *warps* it. The whole page is one gravitational field. Move
through it and everything leans toward you.

The palette is monochromatic — OLED black, charcoal, graphite, gray, silver,
white — lit by a single cold star-glow. No decoration. Just gravity, light, and
the dark between stars.

---

## ✦ The design language

| | Glassmorphism | Liquid glass | **Spacemorphism** |
| --- | --- | --- | --- |
| Background | blurs it | distorts it | **warps spacetime behind it** |
| Foundation | light / gray | translucent | **infinite OLED black** |
| Edges | borders | strokes | **event-horizon darkening** |
| Color | anything | anything | **monochrome + one cold glow** |
| Interaction | hover | hover | **one page-wide gravity field** |
| Signature | — | refraction | **a real WebGL black hole** |

### Principles
1. **Refractive lensing** — reality behind a surface is warped, not merely blurred.
2. **Borderless edges** — defined by light + an event horizon, never a stroke.
3. **One gravitational field** — every component is a body in one spacetime the cursor moves through.
4. **Monochrome + one cold glow** — grayscale, lit by a single `hsl(212 90% 72%)` star-glow.
5. **Gravity as metaphor** — surfaces have weight; star dust falls toward the cursor; light bends around mass.
6. **Cinematic, but cheap** — performance tiers + reduced-motion keep it 60fps from laptop to phone.

---

## ✦ Palette & tokens

```css
--sm-void:       #050609;   /* deepest space / OLED black */
--sm-charcoal:   #15171c;
--sm-graphite:   #22252d;
--sm-gray:       #595d68;
--sm-gray-light: #9598a4;
--sm-silver:     #c4c8d2;
--sm-white:      #f3f5fa;

--sm-accent: hsl(212 90% 72%);  /* the one cold star-glow */
--sm-accent-chroma: 1;          /* set to 0 for pure grayscale */

--sm-blur: 11px;                /* liquid translucency */
--sm-refract-scale: 18;         /* lensing displacement */
```

Re-skin the whole substance from these. Performance tiers live on the root as
`data-sm-perf="cinematic | balanced | eco"`; themes as `data-sm-theme="dark | light"`.

---

## ✦ Phases

- [x] **Phase 0 — Foundation.** Rebrand Void→Space; monochrome token + material
  system; named refraction profiles (ripple/warp/dissipate/caustic); QOL core
  (perf tiers, global config, shared rAF, viewport gating); monochrome `SpaceField`
  with star dust, parallax layers, accretion vignette.
- [x] **Phase 1 — Spacetime engine.** One page-wide gravity field; refactored
  `gravityWell`/`resonance` onto it; the gravity `CometCursor`.
- [x] **Phase 2 — Backgrounds.** `StarDust`, `Constellation`, `DotField`,
  `StarGrid`, `GravityRipple`.
- [x] **Phase 3 — Motion accents.** `SpaceBeam`, `BorderBeam`, `ShineBorder`,
  `OrbitingBodies`, `Marquee`, `ShimmerButton`.
- [x] **Phase 4 — Interactive.** `SpaceTabs`, `HoverButton`, `SpaceSubscribe`
  (dissipates into star dust), `SpaceFeatures`.
- [x] **Phase 5 — Transitions.** `dissolve`, `dissipate`, `warp`, `gravityPulse`,
  `seamless` (FLIP), plus cinematic easings.
- [x] **Phase 6 — WebGL black hole.** Hand-rolled gravitational-lensing hero with
  accretion disk + photon ring, perf scaling and a CSS fallback.
- [x] **Phase 7 — Sound & haptics.** Synthesized, opt-in UI sound + vibration.
- [x] **Phase 8 — Showcase.** Landing, component gallery + per-component pages,
  transitions playground, the **Forge** token playground, design/lore page, and
  the **Habitat Console** flagship dashboard.
- [x] **Phase 9 — CLI & registry.** `npx svelte-spacemorphism add <name>` copies
  components + their dependency closure into any project.
- [x] **Phase 10 — Docs & launch.** This file, the README rewrite, changelog, and
  the final verification gates.

### Future ideas (not yet scheduled)
- Hyperspace route transitions for SvelteKit.
- A Tailwind preset / framework-agnostic CSS layer (React/Vue/HTML).
- Audio-reactive star dust; scroll-velocity gravity.
- More habitat scenes (airlock, nav console, comms).

---

## ✦ Credits & inspiration

Component concepts are reinterpreted, monochrome + gravity-native, from the
open-source animation ecosystem (MagicUI / animation-svelte). The black hole,
spacetime field, comet cursor, Forge, CLI, and Habitat Console are original to
Spacemorphism. Built with Svelte 5 runes, zero runtime dependencies.
