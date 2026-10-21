import orbit from '../orbit/schema.js';
// v1's settings, with the start view offering 'vertical' instead of 'grid', plus the list's own.
const base = orbit.settings.map((s) => (s.id === 'startView' ? { ...s, options: ['sphere', 'vertical'], default: 'sphere' } : s));
export default {
  type: 'orbit-v2', name: 'Orbit v2 (sphere + vertical list)',
  settings: [
    ...base,
    { id: 'loops', type: 'range', label: 'List: passes through the projects before the page moves on', min: 1, max: 4, step: 1, default: 2 },
    { id: 'travel', type: 'range', label: 'List: speed (list px per scroll px; higher = shorter section)', min: 0.5, max: 3, step: 0.1, default: 1 },
    { id: 'snap', type: 'toggle', label: 'List: snap the nearest project to the centre when scrolling stops', default: true },
  ],
};
