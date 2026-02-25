const byId = (id) => document.getElementById(id);
const qs = (sel, el = document) => el.querySelector(sel);
const qsa = (sel, el = document) => Array.from(el.querySelectorAll(sel));

function initAds() {
  if (!window.Ads) {
    window.Ads = { register: function(){}, refresh: function(){} };
  }
  const ph = '<div style="height:90px;border:1px dashed #2a84d6;border-radius:12px;display:flex;align-items:center;justify-content:center;color:#93d7ff;background:rgba(102,204,255,.05)">Баннер 728×90</div>';
  qsa('.ad-slot').forEach(el => {
    if (el.hasAttribute('hidden')) return;
    if (!el.innerHTML.trim()) el.innerHTML = ph;
  });
}

async function loadArticles() {
  try {
    const res = await fetch('data/articles.json');
    if (res.ok) return res.json();
  } catch (e) {
    // ignore
  }
  const embedded = byId('articles-data');
  if (embedded && embedded.textContent) {
    try { return JSON.parse(embedded.textContent); } catch {}
  }
  throw new Error('Не удалось загрузить статьи');
}

function cardHtml(a) {
  return `
    <article class="card">
      <span class="eyebrow">${a.category}</span>
      <h3>${a.title}</h3>
      <p>${a.summary}</p>
      <div class="meta">
        <span>${a.readTime} мин</span>
        <span>•</span>
        <time datetime="${a.date}">${new Date(a.date).toLocaleDateString('ru-RU')}</time>
      </div>
      <a class="btn btn-ghost" href="article.html?slug=${encodeURIComponent(a.slug)}">Читать</a>
    </article>
  `;
}

function renderGrid(list, limit) {
  const grid = byId('articles-grid');
  const items = typeof limit === 'number' ? list.slice(0, limit) : list;
  grid.innerHTML = items.map(cardHtml).join('');
}

function enableShowAll(list) {
  const link = qs('[data-action="show-all"]');
  if (!link) return;
  let expanded = false;
  link.addEventListener('click', (e) => {
    e.preventDefault();
    expanded = !expanded;
    renderGrid(list, expanded ? undefined : 6);
    link.textContent = expanded ? 'Свернуть' : 'Показать все';
  });
}

function setYear() {
  const y = byId('year');
  if (y) y.textContent = String(new Date().getFullYear());
}

async function main() {
  setYear();
  initAds();
  try {
    const articles = await loadArticles();
    renderGrid(articles);
  } catch (e) {
    const grid = byId('articles-grid');
    if (grid) grid.innerHTML = `<p style="color:#ff8080">Ошибка загрузки статей.</p>`;
    console.error(e);
  }
}

document.addEventListener('DOMContentLoaded', main);
