export default {
  type: 'logo',
  name: 'Logo',
  settings: [
    { id: 'text', type: 'text', label: 'Wordmark text', default: '' },
    { id: 'svg',  type: 'code', label: 'Inline SVG markup (overrides text)', default: '' },
    { id: 'href', type: 'text', label: 'Link destination', default: '/' },
  ],
};
