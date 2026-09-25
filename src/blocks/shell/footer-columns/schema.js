export default {
  type: 'footer-columns',
  name: 'Footer Columns',
  settings: [
    {
      id: 'columns',
      type: 'group_list',
      label: 'Columns',
      // each column: { heading: string, links: [{ label, href }] }
    },
  ],
};
