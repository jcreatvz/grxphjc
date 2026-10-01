export default {
  type: 'orbit',
  name: 'Orbit (3D image sphere)',
  settings: [
    { id: 'label',    type: 'text', label: 'Bracketed label', default: '' },
    { id: 'headline', type: 'text', label: 'Centre headline', default: '' },
    { id: 'source',   type: 'select', label: 'Items from', options: ['projects', 'manual', 'both'], default: 'both' },
    { id: 'projectAction', type: 'select', label: 'Project items open as', options: ['popup', 'page'], default: 'popup' },
    { id: 'items',    type: 'item_list', label: 'Manual items: { image, title, meta, note, action: popup|page|url, href, tall }' },
    { id: 'startView', type: 'select', label: 'Start view', options: ['sphere', 'grid'], default: 'sphere' },
    { id: 'maxItems', type: 'range', label: 'Max items', min: 4, max: 40, step: 1, default: 28 },
    { id: 'cue',      type: 'text', label: 'Interaction cue', default: 'Drag to rotate' },
  ],
};
