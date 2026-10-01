export default {
  type: 'cta', name: 'Call to action',
  settings: [
    { id: 'label', type: 'text', label: 'Bracketed label', default: 'Contact' },
    { id: 'heading', type: 'text', label: 'Heading (use | for a line break)' },
    { id: 'text', type: 'text', label: 'Supporting line', default: '' },
    { id: 'email', type: 'text', label: 'Email (shown big, mailto link)', default: '' },
    { id: 'button', type: 'link', label: 'Button { label, href }' },
  ],
};
