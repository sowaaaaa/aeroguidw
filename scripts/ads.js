export function initAds() {
  const registry = {};
  function placeholder(el, label = 'Баннер') {
    el.innerHTML = `
      <div style="height:90px;border:1px dashed #2a84d6;border-radius:12px;
                  display:flex;align-items:center;justify-content:center;color:#93d7ff;
                  background:rgba(102,204,255,.05)">
        ${label}: 728×90 (плейсхолдер)
      </div>`;
  }
  function mountAll() {
    document.querySelectorAll('.ad-slot').forEach(el => {
      const name = el.getAttribute('data-slot');
      const label = el.getAttribute('data-label') || 'Баннер';
      if (name && registry[name]) {
        try { registry[name](el); } catch { placeholder(el, label); }
      } else {
        placeholder(el, label);
      }
    });
  }
  const api = {
    register(slotName, renderer) { registry[slotName] = renderer; },
    refresh() { mountAll(); }
  };
  window.Ads = api;
  mountAll();
  return api;
}

