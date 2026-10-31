import orbit from '../orbit/schema.js';
// v1's settings, with the start view offering 'vertical' instead of 'grid', plus v2's own.
const base = orbit.settings.map((s) => (s.id === 'startView' ? { ...s, options: ['sphere', 'vertical'], default: 'sphere' } : s));
export default {
  type: 'orbit-v2', name: 'Orbit v2 (sphere + vertical list)',
  settings: [
    ...base,
    { id: 'showHeadline', type: 'toggle', label: 'Show the headline (it sits inside the sphere, behind the centre media)', default: true },
    { id: 'headlineGlow', type: 'toggle', label: 'Soft glow behind the headline letters (helps legibility over busy cards)', default: false },
    { id: 'media', type: 'select', label: 'Centre media inside the sphere: none · cube (sample wireframe placeholder) · image (jpg, png, gif, svg, webp) · video (mp4/webm, plays muted on loop)', options: ['none', 'cube', 'image', 'video'], default: 'cube' },
    { id: 'mediaSrc', type: 'text', label: 'Media file: a path like /media/logo.svg (put the file in public/media/) or a full https:// URL. Not needed for the cube.', default: '' },
    { id: 'mediaPoster', type: 'image', label: 'Video poster (shown before it plays and with reduced motion)', default: '' },
    { id: 'mediaAlt', type: 'text', label: 'Describe the media for screen readers (leave empty if decorative)', default: '' },
    { id: 'mediaSize', type: 'range', label: 'Media size (share of the sphere\'s width)', min: 0.15, max: 0.7, step: 0.01, default: 0.36 },
    { id: 'loops', type: 'range', label: 'Vertical: passes through the projects before the page moves on', min: 1, max: 4, step: 1, default: 2 },
    { id: 'travel', type: 'range', label: 'Vertical: speed (list px per scroll px; higher = shorter section)', min: 0.5, max: 3, step: 0.1, default: 1 },
    { id: 'snap', type: 'toggle', label: 'Vertical: snap the nearest project to the centre when scrolling stops', default: true },
  ],
};
