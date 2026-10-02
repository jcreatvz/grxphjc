export default {
  type: 'embed', name: 'Embed (YouTube / Vimeo)',
  settings: [
    { id: 'label', type: 'text', label: 'Bracketed label', default: '' },
    { id: 'url', type: 'text', label: 'YouTube or Vimeo link (any normal share URL)', default: '' },
    { id: 'poster', type: 'image', label: 'Poster image (shown until play — nothing from YouTube/Vimeo loads before the click)', default: '' },
    { id: 'title', type: 'text', label: 'Accessible title', default: 'Video' },
    { id: 'ratio', type: 'select', label: 'Aspect ratio', options: ['16:9', '21:9', '4:3'], default: '16:9' },
    { id: 'width', type: 'select', label: 'Width', options: ['contained', 'full'], default: 'contained' },
    { id: 'caption', type: 'text', label: 'Caption', default: '' },
  ],
};
