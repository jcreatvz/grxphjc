export default {
  type: 'project-meta', name: 'Project meta strip',
  settings: [
    { id: 'label', type: 'text', label: 'Bracketed label (optional)', default: '' },
    { id: 'items', type: 'item_list', label: 'Cells: { label, value }. value may use {client}, {year}, {category}, {title}; add a fallback with {client|[Client]}. Empty cells are hidden.' },
  ],
};
