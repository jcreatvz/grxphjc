// "*word*" or "*several words*" -> accent flags per word. The asterisks are removed.
// Punctuation may sit inside or after the closing asterisk: "*self-initiated,*" or "*n*,".
export function parseAccent(text: string): Array<{ t: string; accent: boolean }> {
  let on = false;
  return String(text ?? '').split(/\s+/).filter(Boolean).map((w) => {
    if (w.startsWith('*')) on = true;
    const accent = on;
    if (on && /\*[.,;:!?]*$/.test(w)) on = false;
    return { t: w.replace(/\*/g, ''), accent };
  });
}
