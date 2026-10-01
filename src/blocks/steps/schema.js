export default {
  type: 'steps', name: 'Steps (process)',
  settings: [
    { id: 'label', type: 'text', label: 'Bracketed label', default: '' },
    { id: 'heading', type: 'text', label: 'Heading', default: '' },
    { id: 'items', type: 'item_list', label: 'Steps: { title, text }' },
  ],
};
