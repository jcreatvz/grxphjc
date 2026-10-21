// A page "bleeds" under the top frame when its first block is full-screen media.
export function isBleed(blocks: Array<{ type: string; settings?: Record<string, any> }> = []) {
  const b = blocks[0];
  // full-screen first blocks: both orbit versions, and a hero with media
  return !!b && (b.type === 'orbit' || b.type === 'orbit-v2' || (b.type === 'hero' && !!b.settings?.media));
}
