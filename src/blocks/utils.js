/**
 * Apply schema defaults to a settings object.
 * Works with both blockRegistry (content) and shellRegistry (chrome).
 */
export function applyDefaults(registry, type, settings = {}) {
  const entry = registry[type];
  if (!entry) return settings;
  const out = { ...settings };
  for (const field of entry.schema.settings) {
    if (out[field.id] === undefined && field.default !== undefined) {
      out[field.id] = field.default;
    }
  }
  return out;
}

/**
 * Whitelist merge — a page can override only the modifier keys listed.
 * Everything else (like the blocks array) stays from the site defaults.
 * This enforces the Phase 1 "Option A" contract: pages tweak chrome, not replace it.
 */
export function mergeAllowed(base, overrides = {}, allowedKeys = []) {
  const out = { ...base };
  for (const key of allowedKeys) {
    if (overrides[key] !== undefined) out[key] = overrides[key];
  }
  return out;
}
