// Motion toolkit (v0.12). Small, dependency-free primitives every block draws from, so motion
// feels like one system: the same easing, the same physics, the same damping.
//   spring  — stiffness/damping physics (footer v0.9 history, orbit explosion)
//   damp    — frame-rate-independent exponential follow (orbit v2 list, bokid's 0.09)
//   flip    — 2D FLIP morphs between boxes
//   morph3d — full 3D pose + camera tweens (orbit v2 sphere ⇄ list)
// Further modules migrate here as blocks are touched (scroll progress, reveal, scramble).
export * from './spring';
export * from './damp';
export * from './flip';
export * from './morph3d';
