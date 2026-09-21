# Theomachy — Full-Body Pose-Set Spec

The fighters are full-body painted sprites (sliced from the lineup art). One
**idle** frame per god ships and drives everything via code motion. Optional
**pose frames** drop into `art/sprites/` and the engine cross-fades to them, with
code motion layered on as secondary (bob, flash, small sway). Missing frames
fall back to idle + full code motion. Do these to make each pose read from real
art instead of code alone.

## Poses (7 per god)
`idle`, `attack_windup`, `attack_strike`, `block`, `hurt`, `ko`, `victory`.

## Files
`art/sprites/{god}_{pose}.png` for `god` ∈ {zeus, poseidon, athena, hades}.
(Current `*_{pose}.png` files are auto-generated placeholders — replace them.)

## Style
Match the lineup / `heroes.jpg`: painterly, cel-shaded, bold outline, rim light
from upper-right, each god's palette + motifs (Zeus lightning, Poseidon water,
Athena plume/owl/aegis, Hades violet flame). Keep the weapon and effects in-frame.

## Framing, scale, background (identical across ALL files of ALL gods)
- **Canvas:** 320 × 512 px (author larger and downscale; keep the ratio).
- **Facing:** right. The engine mirrors for left-facing fighters.
- **Feet baseline:** soles sit at **y = 486**; character fills ~460px tall so
  every god is the same in-game height.
- **Pivot:** feet center at **x = 160, y = 486** — same point in every frame, so
  poses don't jump when they swap. Keep the body horizontally centered on it.
- **Background:** fully transparent, straight alpha, no matte/halo, no baked
  ground shadow (the game draws the shadow + a hit-flash + eye glow).
- **Consistency:** same god, same scale and pivot in every pose, so cross-fades
  and code motion line up.

## Pose intent (what each frame should show; code adds motion on top)
- `idle` — relaxed fighting stance (already shipped).
- `attack_windup` — coiled back, weight loaded.
- `attack_strike` — full commit forward, weapon extended.
- `block` — braced, guard up, slight crouch.
- `hurt` — recoiling, head back.
- `ko` — collapsing / down.
- `victory` — standing tall, triumphant.

_Delivery: transparent PNGs at the framing above. Drop them in `art/sprites/`;
no code change needed._
