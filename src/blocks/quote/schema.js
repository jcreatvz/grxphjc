export default {
  type: 'quote', name: 'Quote',
  settings: [
    { id: 'label', type: 'text', label: 'Bracketed label', default: '' },
    { id: 'quote', type: 'textarea', label: 'Quote (wrap one or several words in *asterisks* to accent them)' },
    { id: 'name', type: 'text', label: 'Name', default: '' },
    { id: 'role', type: 'text', label: 'Role / company', default: '' },
    { id: 'tone', type: 'select', label: 'Background', options: ['paper', 'accent', 'night'], default: 'paper' },
    { id: 'align', type: 'select', label: 'Alignment', options: ['left', 'center'], default: 'left' },
  ],
};
