export default {
  type: 'credits', name: 'Credits',
  settings: [
    { id: 'label', type: 'text', label: 'Bracketed label', default: 'Credits' },
    { id: 'heading', type: 'text', label: 'Heading', default: '' },
    { id: 'items', type: 'item_list', label: 'People / roles: { role, name, href? }' },
    { id: 'toolsLabel', type: 'text', label: 'Label above the tools list', default: 'Tools' },
    { id: 'tools', type: 'text_list', label: 'Tools / software', default: [] },
  ],
};
