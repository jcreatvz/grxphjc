export default {
  type: 'marquee', name: 'Marquee',
  settings: [
    { id: 'items', type: 'text_list', label: 'Phrases' },
    { id: 'separator', type: 'text', label: 'Separator glyph', default: '+' },
    { id: 'speed', type: 'range', label: 'Seconds per loop', min: 10, max: 80, step: 1, default: 32 },
    { id: 'tone', type: 'select', label: 'Tone', options: ['accent', 'ink', 'paper'], default: 'accent' },
  ],
};
