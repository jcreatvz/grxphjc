export default {
  type: 'fullbleed-image', name: 'Full-bleed image',
  settings: [
    { id: 'label', type: 'text', label: 'Bracketed label', default: '' },
    { id: 'src', type: 'image', label: 'Image' },
    { id: 'alt', type: 'text', label: 'Alt text (leave empty if purely decorative)', default: '' },
    { id: 'caption', type: 'text', label: 'Caption', default: '' },
    { id: 'height', type: 'select', label: 'Height: natural = the image\'s own shape · cinema = 21:9 (16:9 on phones) · screen = full viewport', options: ['natural', 'cinema', 'screen'], default: 'natural' },
    { id: 'lightbox', type: 'toggle', label: 'Open in popup on click', default: false },
  ],
};
