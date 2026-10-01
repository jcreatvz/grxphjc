export default {
  type: 'logo',
  name: 'Logo',
  settings: [
    { id: 'text', type: 'text', label: 'Wordmark text (fallback when no SVG)', default: '' },
    { id: 'svg',  type: 'code', label: 'Inline SVG markup (e.g. graffiti wordmark) — overrides text', default: '' },
    { id: 'href', type: 'text', label: 'Link destination', default: '/' },
  ],
};
