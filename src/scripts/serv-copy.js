// ── COPY-TO-CLIPBOARD (progressive enhancement) ─────────────────
// Buttons marked [data-copy] copy the text of the <pre><code> block that
// shares their [data-copyblock] wrapper. No-JS: buttons are harmless but
// hidden by default in CSS ([data-copy] { display:none }) and revealed by
// adding .js to <html> below — so nothing shows unless JS actually works.
document.documentElement.classList.add('js');

async function copyText(str) {
  try {
    await navigator.clipboard.writeText(str);
    return true;
  } catch {
    // Clipboard API unavailable (http non-secure context) — fallback.
    const ta = document.createElement('textarea');
    ta.value = str;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch { /* noop */ }
    ta.remove();
    return ok;
  }
}

document.querySelectorAll('[data-copy]').forEach((btn) => {
  const wrapper = btn.closest('[data-copyblock]');
  btn.addEventListener('click', async () => {
    const codeEl = wrapper ? wrapper.querySelector('pre code, code') : null;
    const text = (codeEl?.textContent ?? btn.dataset.copy ?? '').trim();
    if (!text) return;
    const label = btn.dataset.copyLabel ?? '$ copy';
    btn.disabled = true;
    const ok = await copyText(text);
    btn.textContent = ok ? '✓ copied' : '$ error';
    btn.classList.add(ok ? 'is-copied' : 'is-error');
    setTimeout(() => {
      btn.textContent = label;
      btn.classList.remove('is-copied', 'is-error');
      btn.disabled = false;
    }, 1600);
  });
});
