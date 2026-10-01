export default {
  type: 'list-rows', name: 'List Rows (services / capabilities)',
  settings: [
    { id: 'anchor', type: 'text', label: 'Anchor id', default: '' },
    { id: 'label', type: 'text', label: 'Bracketed label', default: '' },
    { id: 'heading', type: 'text', label: 'Heading', default: '' },
    { id: 'items', type: 'item_list', label: 'Rows: { title, detail, tags[] }' },
  ],
};
