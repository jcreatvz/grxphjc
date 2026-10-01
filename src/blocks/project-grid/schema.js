export default {
  type: 'project-grid', name: 'Project Grid',
  settings: [
    { id: 'anchor', type: 'text', label: 'Anchor id (e.g. work)', default: '' },
    { id: 'label', type: 'text', label: 'Bracketed label', default: 'Selected Work' },
    { id: 'heading', type: 'text', label: 'Heading', default: '' },
    { id: 'limit', type: 'range', label: 'Max projects', min: 1, max: 24, step: 1, default: 12 },
    { id: 'layout', type: 'select', label: 'Layout', options: ['grid', 'list'], default: 'grid' },
  ],
};
