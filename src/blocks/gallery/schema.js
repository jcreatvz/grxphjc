export default {
  type: 'gallery',
  name: 'Image Gallery',
  settings: [
    { id: 'images', type: 'image_list', label: 'Images' },
    {
      id: 'layout', type: 'select', label: 'Layout',
      options: ['grid', 'horizontal-scroll', 'masonry', 'sticky'],
      default: 'grid',
    },
    {
      id: 'behavior', type: 'select', label: 'Motion',
      options: ['none', 'parallax', 'drag', 'magnetic-cursor'],
      default: 'none',
    },
    {
      id: 'speed', type: 'range', label: 'Motion speed',
      min: 0, max: 2, step: 0.1, default: 0.8,
    },
  ],
};
