export default {
  type: 'gallery', name: 'Image Gallery',
  settings: [
    { id: 'label', type: 'text', label: 'Bracketed label', default: '' },
    { id: 'images', type: 'image_list', label: 'Images (string URLs or { src, title, note })' },
    { id: 'layout', type: 'select', label: 'Layout', options: ['grid', 'horizontal-scroll', 'masonry', 'sticky'], default: 'grid' },
    { id: 'behavior', type: 'select', label: 'Motion', options: ['none', 'drag'], default: 'none' },
    { id: 'lightbox', type: 'toggle', label: 'Open images in popup', default: true },
  ],
};
