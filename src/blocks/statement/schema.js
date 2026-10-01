export default {
  type: 'statement', name: 'Statement',
  settings: [
    { id: 'label', type: 'text', label: 'Bracketed label', default: '' },
    { id: 'text', type: 'textarea', label: 'Statement (wrap words in *asterisks* to accent them)' },
    { id: 'size', type: 'select', label: 'Size', options: ['l', 'xl'], default: 'l' },
    { id: 'footnote', type: 'text', label: 'Small mono footnote', default: '' },
  ],
};
