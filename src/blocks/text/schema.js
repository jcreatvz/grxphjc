export default {
  type: 'text', name: 'Text',
  settings: [
    { id: 'label', type: 'text', label: 'Bracketed label', default: '' },
    { id: 'heading', type: 'text', label: 'Heading', default: '' },
    { id: 'body', type: 'richtext', label: 'Body (HTML)' },
    { id: 'layout', type: 'select', label: 'Layout', options: ['stack', 'split'], default: 'split' },
  ],
};
