// "{client|[Client]}" -> project.client if set, otherwise the fallback after the pipe.
// An empty result hides the item. Lets template pages carry placeholders that quietly
// switch to real data as soon as the project JSON gets that field.
export function fill(tpl: string, ctx: Record<string, unknown> = {}): string {
  return String(tpl ?? '').replace(/\{(\w+)(?:\|([^}]*))?\}/g, (_m, key: string, fb = '') => {
    const v = ctx?.[key];
    return v === undefined || v === null || v === '' ? fb : String(v);
  }).trim();
}
