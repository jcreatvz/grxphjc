export default {
  type: 'marquee-tbx', name: 'Marquee tube (3D text)',
  settings: [
    { id: 'label', type: 'text', label: 'Bracketed label (optional)', default: '' },
    { id: 'words', type: 'text_list', label: 'Words riding the tube', default: ['Motion', 'Identity', 'Type', 'Campaign', 'Experimental'] },
    { id: 'ariaLabel', type: 'text', label: 'Describe the list for screen readers', default: 'Studio disciplines' },
    { id: 'preset', type: 'select', label: 'Preset: marquee = drifts on its own, wraps onto the tube · tube = scroll-driven only, flat words', options: ['marquee', 'tube'], default: 'marquee' },
    { id: 'height', type: 'select', label: 'Section height: band = a strip like the old marquee · full = a full screen', options: ['band', 'full'], default: 'band' },
    { id: 'tone', type: 'select', label: 'Colours: auto = same as the sections around it (flips with light/dark mode) · contrast = a band that stands out · accent · ink (always dark) · paper', options: ['auto', 'contrast', 'accent', 'ink', 'paper'], default: 'auto' },
    { id: 'divider', type: 'select', label: 'Between words', options: ['text', 'svg', 'none'], default: 'text' },
    { id: 'dividerText', type: 'text', label: 'Divider character (divider = text)', default: '+' },
    { id: 'dividerSvg', type: 'textarea', label: 'Inline SVG (divider = svg; blank uses a bundled sample)', default: '' },
    { id: 'idleSpin', type: 'range', label: 'Drift speed with no scrolling (0 = scroll-driven only)', min: 0, max: 20, step: 1, default: 7 },
    { id: 'tilt', type: 'range', label: 'Tube tilt (degrees)', min: 0, max: 45, step: 1, default: 20 },
    { id: 'radius', type: 'range', label: 'Tube radius (× the smaller viewport side)', min: 0.2, max: 0.7, step: 0.01, default: 0.51 },
    { id: 'turns', type: 'range', label: 'Rotations across the scroll', min: 0.25, max: 4, step: 0.25, default: 1 },
    { id: 'repeat', type: 'range', label: 'Times the word list repeats around the tube', min: 1, max: 4, step: 1, default: 1 },
  ],
};
