export default {
  type: 'gallery', name: 'Image Gallery',
  settings: [
    { id: 'label', type: 'text', label: 'Bracketed label', default: '' },
    { id: 'images', type: 'image_list', label: 'Images (string URLs or { src, title, note })' },
    { id: 'layout', type: 'select', label: 'Layout', options: ['grid', 'horizontal-scroll', 'pinned-scroll', 'masonry', 'sticky'], default: 'grid' },
    { id: 'pinDistance', type: 'range', label: 'pinned-scroll: vertical scroll per horizontal pixel (higher = slower)', min: 0.5, max: 2.5, step: 0.1, default: 1 },
    { id: 'behavior', type: 'select', label: 'Motion (horizontal-scroll only)', options: ['none', 'drag'], default: 'none' },
    { id: 'lightbox', type: 'toggle', label: 'Open images in popup', default: true },
  ],
};
