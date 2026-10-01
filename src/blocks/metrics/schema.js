export default {
  type: 'metrics', name: 'Metrics',
  settings: [
    { id: 'label', type: 'text', label: 'Bracketed label', default: '' },
    { id: 'items', type: 'item_list', label: 'Stats: { value, label }' },
  ],
};
