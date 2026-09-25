// Hero block — settings array is the single source of truth for
// what this block accepts. Modeled on Shopify {% schema %} shape so
// a form generator (tools/editor.html, phase 2) can build a UI from it.
export default {
  type: 'hero',
  name: 'Hero',
  settings: [
    { id: 'media',    type: 'image',    label: 'Background media (image or video URL)', default: '' },
    { id: 'headline', type: 'text',     label: 'Headline' },
    { id: 'subhead',  type: 'richtext', label: 'Subhead', default: '' },
    {
      id: 'align', type: 'select', label: 'Alignment',
      options: ['left', 'center', 'right'], default: 'left',
    },
    {
      id: 'behavior', type: 'select', label: 'Entrance motion',
      options: ['none', 'fade', 'reveal', 'parallax'], default: 'fade',
    },
  ],
};
