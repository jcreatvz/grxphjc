export default {
  type: 'hero', name: 'Hero',
  settings: [
    { id: 'media', type: 'image', label: 'Background image or video URL', default: '' },
    { id: 'label', type: 'text', label: 'Bracketed label', default: '' },
    { id: 'headline', type: 'text', label: 'Headline' },
    { id: 'subhead', type: 'richtext', label: 'Subhead', default: '' },
    { id: 'variant', type: 'select', label: 'Variant', options: ['standard', 'split-wordmark'], default: 'standard' },
    { id: 'align', type: 'select', label: 'Alignment', options: ['left', 'center', 'right'], default: 'left' },
    { id: 'scrollCue', type: 'toggle', label: 'Show scroll cue', default: true },
  ],
};
