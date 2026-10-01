// A page "bleeds" under the top frame when its first block is full-screen media.
export function isBleed(blocks: Array<{ type: string; settings?: Record<string, any> }> = []) {
  const b = blocks[0];
  return !!b && (b.type === 'orbit' || (b.type === 'hero' && !!b.settings?.media));
}
