import { supabase, SITE, configured } from './supabase.js';

const NAV = [['index.html', 'Home'], ['articles.html', 'Articles'], ['category.html?c=oncology', 'Oncology'], ['about.html', 'About'], ['contact.html', 'Contact']];
export const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const fmtDate = d => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
export { supabase, SITE, configured, NAV };
export const icon = n => `<i data-lucide="${n}" class="i" aria-hidden="true"></i>`;
export const state = msg => `<div class="state" role="status">${msg}</div>`;
export const cols = 'id,slug,title,summary,cover_url,cover_alt,published_at,reading_minutes,categories(name,slug)';

export function renderChrome() {
  const here = location.pathname.split('/').pop() || 'index.html';
  document.body.insertAdjacentHTML('afterbegin', `
  <a class="skip" href="#main">Skip to content</a>
  <header class="site-header"><div class="wrap">
    <a class="brand" href="index.html">${esc(SITE.name)}<small>${esc(SITE.title)}</small></a>
    <button class="menu-btn" aria-label="Toggle menu" aria-expanded="false" aria-controls="nav">${icon('menu')}</button>
    <nav class="nav" id="nav" aria-label="Main">${NAV.map(([h, t]) => `<a href="${h}" ${h === here ? 'aria-current="page"' : ''}>${t}</a>`).join('')}</nav>
  </div></header>`);
  document.body.insertAdjacentHTML('beforeend', `
  <footer class="site-footer"><div class="wrap">
    <div class="foot">
      <div><a class="brand" href="index.html">${esc(SITE.name)}<small>${esc(SITE.title)}</small></a>
        <p style="margin-top:12px;max-width:34ch">Clear, evidence-based health education on cancer and noncommunicable diseases.</p></div>
      <div><h3>Explore</h3><ul>${NAV.map(([h, t]) => `<li><a href="${h}">${t}</a></li>`).join('')}</ul></div>
      <div><h3>Topics</h3><ul id="foot-cats"></ul></div>
    </div>
    <p class="disclaimer">This website provides general health education and does not replace individualized medical advice. Always consult a qualified healthcare professional about your own health.</p>
  </div></footer>`);
  const btn = document.querySelector('.menu-btn'), nav = document.getElementById('nav');
  if (btn && nav) {
    btn.addEventListener('click', () => { const o = nav.classList.toggle('open'); btn.setAttribute('aria-expanded', o); });
  }
  // Populate categories in footer across all pages
  if (configured) {
    supabase.from('categories').select('name,slug').order('sort_order').then(({ data }) => {
      const footCats = document.getElementById('foot-cats');
      if (footCats && data) {
        footCats.innerHTML = data.map(x => `<li><a href="category.html?c=${x.slug}">${esc(x.name)}</a></li>`).join('');
      }
    });
  }
}

export const cardHTML = (a, cls = '') => `
  <a class="card ${cls}" href="article.html?slug=${encodeURIComponent(a.slug)}">
    <div class="cover-wrap">
      <div class="cover" ${a.cover_url ? `style="background-image:url('${esc(a.cover_url)}')" role="img" aria-label="${esc(a.cover_alt || a.title)}"` : 'aria-hidden="true"'}></div>
    </div>
    <div class="body">
      ${a.categories ? `<span class="tag">${esc(a.categories.name)}</span>` : ''}
      <h3>${esc(a.title)}</h3>
      <p>${esc(a.summary)}</p>
      <div class="meta">
        <span>${fmtDate(a.published_at)}</span>
        <span>${a.reading_minutes || 5} min read</span>
      </div>
    </div>
  </a>`;


async function loadHome() {
  const feat = document.getElementById('featured'); if (!feat) return;
  const latest = document.getElementById('latest'), onco = document.getElementById('onco'), cats = document.getElementById('cat-cards');
  if (!configured) {
    [feat, latest, onco].forEach(el => el.innerHTML = state('Add your Supabase URL and key in <code>assets/js/supabase.js</code> to show articles.'));
    return;
  }
  try {
    const pub = () => supabase.from('articles').select(cols).eq('status', 'published').order('published_at', { ascending: false });
    const [c, f, l, o] = await Promise.all([
      supabase.from('categories').select('name,slug,description,icon').order('sort_order'),
      pub().eq('is_featured', true).limit(3),
      pub().limit(6),
      supabase.from('articles').select(cols.replace('categories(', 'categories!inner(')).eq('status', 'published').eq('categories.slug', 'oncology').order('published_at', { ascending: false }).limit(3)
    ]);
    for (const r of [c, f, l, o]) if (r.error) throw r.error;
    cats.innerHTML = c.data.map(x => `<a class="cat" href="category.html?c=${x.slug}">${icon(x.icon || 'heart-pulse')}<h3>${esc(x.name)}</h3><span>${esc(x.description || '')}</span></a>`).join('');
    document.getElementById('foot-cats').innerHTML = c.data.map(x => `<li><a href="category.html?c=${x.slug}">${esc(x.name)}</a></li>`).join('');
    feat.innerHTML = f.data.length ? f.data.map((a, i) => cardHTML(a, i === 0 ? 'feature' : '')).join('') : state('No featured articles yet.');
    latest.innerHTML = l.data.length ? l.data.map(a => cardHTML(a)).join('') : state('No articles published yet. Check back soon.');
    onco.innerHTML = o.data.length ? o.data.map(a => cardHTML(a)).join('') : state('Oncology articles are coming soon.');
  } catch (e) {
    console.error(e);
    [feat, latest, onco].forEach(el => el.innerHTML = state('Articles could not be loaded. Refresh the page to try again.'));
  }
  window.lucide?.createIcons();
}

renderChrome();
document.getElementById('hero-search')?.addEventListener('submit', e => {
  e.preventDefault();
  const q = new FormData(e.target).get('q').trim();
  location.href = 'articles.html' + (q ? `?q=${encodeURIComponent(q)}` : '');
});
const bio = document.getElementById('bio-short'); if (bio) bio.textContent = SITE.bioShort;
const por = document.getElementById('portrait'); if (por && SITE.portrait) por.style.backgroundImage = `url('${SITE.portrait}')`;
loadHome();
window.lucide?.createIcons();
