export default {
  type: 'video', name: 'Video',
  settings: [
    { id: 'label', type: 'text', label: 'Bracketed label', default: '' },
    { id: 'src', type: 'text', label: 'MP4 (H.264) path or URL — plays everywhere, including Safari', default: '' },
    { id: 'srcWebm', type: 'text', label: 'WebM (VP9) path or URL — optional, smaller in Chrome/Firefox', default: '' },
    { id: 'poster', type: 'image', label: 'Poster image shown before play (strongly recommended)', default: '' },
    { id: 'mode', type: 'select', label: 'Mode: loop = muted autoplay while on screen · click = poster + play button, with sound', options: ['loop', 'click'], default: 'loop' },
    { id: 'ratio', type: 'select', label: 'Aspect ratio', options: ['16:9', '21:9', '4:3', '1:1', '9:16'], default: '16:9' },
    { id: 'width', type: 'select', label: 'Width', options: ['contained', 'full'], default: 'contained' },
    { id: 'title', type: 'text', label: 'Accessible title', default: 'Video' },
    { id: 'caption', type: 'text', label: 'Caption', default: '' },
  ],
};
