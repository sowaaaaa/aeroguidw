function getParam(name) {
  const u = new URL(location.href);
  return u.searchParams.get(name);
}

function initAds() {
  if (!window.Ads) {
    window.Ads = { register: function(){}, refresh: function(){} };
  }
  const ph = '<div style="height:90px;border:1px dashed #2a84d6;border-radius:12px;display:flex;align-items:center;justify-content:center;color:#93d7ff;background:rgba(102,204,255,.05)">Баннер 728×90</div>';
  document.querySelectorAll('.ad-slot').forEach(el => {
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
  const embedded = document.getElementById('articles-data');
  if (embedded && embedded.textContent) {
    try { return JSON.parse(embedded.textContent); } catch {}
  }
  throw new Error('Не удалось загрузить статьи');
}

function setYear() {
  const y = document.getElementById('year');
  if (y) y.textContent = String(new Date().getFullYear());
}

function renderArticle(a) {
  document.title = `${a.title} — AeroGuide`;
  document.querySelector('meta[name="description"]')?.setAttribute('content', a.summary);
  document.getElementById('post-cat').textContent = a.category;
  document.getElementById('post-title').textContent = a.title;
  document.getElementById('post-meta').innerHTML =
    `<span>${a.readTime} мин</span><span>•</span><time datetime="${a.date}">${new Date(a.date).toLocaleDateString('ru-RU')}</time>`;

  const content = document.getElementById('post-content');
  content.innerHTML = a.content.map(p => `<p>${p}</p>`).join('');

  const ld = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": a.title,
    "datePublished": a.date,
    "articleSection": a.category,
    "description": a.summary
  };
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(ld);
  document.head.appendChild(script);
}

async function main() {
  setYear();
  initAds();
  const slug = getParam('slug');
  if (!slug) {
    document.getElementById('post-content').innerHTML = '<p style="color:#ff8080">Статья не найдена.</p>';
    return;
  }
  try {
    const list = await loadArticles();
    const a = list.find(x => x.slug === slug);
    if (!a) {
      document.getElementById('post-content').innerHTML = '<p style="color:#ff8080">Статья не найдена.</p>';
      return;
    }
    renderArticle(a);
    window.Ads?.refresh();
  } catch (e) {
    document.getElementById('post-content').innerHTML = '<p style="color:#ff8080">Ошибка загрузки статьи.</p>';
    console.error(e);
  }
}

document.addEventListener('DOMContentLoaded', main);
