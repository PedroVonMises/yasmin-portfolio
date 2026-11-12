import './style.css';
import content from './content.json';

const c = content;
const $ = (sel, root = document) => root.querySelector(sel);
const esc = (s = '') =>
  String(s).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

// ---------- media helpers ----------

// An image slot: real <img> when a path is set, otherwise a labelled grey placeholder.
function media(image, label, cls = '') {
  if (image) return `<img class="media ${cls}" src="${esc(image)}" alt="${esc(label)}" loading="lazy">`;
  return `<div class="media placeholder ${cls}" role="img" aria-label="${esc(label)}"><span>${esc(label)}</span></div>`;
}

function embedUrl(url) {
  if (!url) return null;
  const yt = url.match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{11})/);
  if (yt) return { kind: 'iframe', src: `https://www.youtube-nocookie.com/embed/${yt[1]}?autoplay=1&rel=0` };
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return { kind: 'iframe', src: `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1` };
  return { kind: 'video', src: url };
}

const icons = {
  instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="17.3" cy="6.7" r="1.1" fill="currentColor"/></svg>',
  tiktok: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M16.6 3c.4 2.1 1.7 3.5 3.9 3.7v3a7.3 7.3 0 0 1-3.9-1.2v6.3a5.8 5.8 0 1 1-5.8-5.8c.3 0 .6 0 .9.1v3.1a2.8 2.8 0 1 0 1.9 2.6V3h3z"/></svg>',
  youtube: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M22 8.2a3 3 0 0 0-2.1-2.1C18 5.6 12 5.6 12 5.6s-6 0-7.9.5A3 3 0 0 0 2 8.2 31 31 0 0 0 1.6 12 31 31 0 0 0 2 15.8a3 3 0 0 0 2.1 2.1c1.9.5 7.9.5 7.9.5s6 0 7.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .4-3.8 31 31 0 0 0-.4-3.8zM10 15V9l5.2 3L10 15z"/></svg>',
  play: '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="22" fill="none" stroke="#fff" stroke-width="2"/><path d="M19 15v18l15-9z" fill="#fff"/></svg>',
  email: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M3 5l9 8 9-8M3 19l7-7M21 19l-7-7" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',
  phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 3.5l3 3.4-1.8 2.4a12 12 0 0 0 6.9 6.9l2.4-1.8 3.4 3-1.6 2.5C12 20.5 3.5 12 3.9 5.1z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
  whatsapp: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20l1.2-3.9A8.5 8.5 0 1 1 8 19z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M9.2 8.3c.3-.5.7-.5 1-.4l.8 1.8c.1.3 0 .5-.2.7l-.5.6c.6 1.2 1.6 2.2 2.8 2.8l.6-.5c.2-.2.4-.3.7-.2l1.8.8c.1.3.1.7-.4 1-1 .8-2.4.6-4.3-.8-1.6-1.2-2.7-2.6-3-3.8-.2-.8 0-1.5.7-2z" fill="currentColor"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4l8 8-8 8" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',
};

const socialIcons = (keys = ['instagram']) =>
  keys
    .filter((k) => c.socials[k])
    .map((k) => `<a class="social" href="${esc(c.socials[k].url)}" target="_blank" rel="noopener" aria-label="${k}">${icons[k]}</a>`)
    .join('');

// ---------- shared chrome ----------

function header() {
  const home = 'index.html';
  return `
  <header class="site-header">
    <div class="wrap header-inner">
      <a class="logo" href="${home}">${esc(c.logo)}</a>
      <button class="menu-toggle" aria-label="Abrir menu" aria-expanded="false"><span></span><span></span></button>
      <nav class="nav" aria-label="Principal">
        <div class="nav-main">
          <a href="${home}#filmmaker">filmmaker</a>
          <a href="${home}#servicos">serviços</a>
          <a href="${home}#creator">creator</a>
          <a href="${home}#podcasts">podcasts</a>
          <a href="${home}#edicao">edição</a>
        </div>
        <div class="nav-side">
          <a href="${home}#sobre">sobre</a>
          <a href="contato.html">contato</a>
          <span class="nav-social">${socialIcons()}</span>
        </div>
      </nav>
    </div>
  </header>`;
}

const footer = () => `
  <footer class="site-footer">
    <div class="wrap">© ${new Date().getFullYear()} ${esc(c.name)} — ${esc(c.footerTagline || c.role)}</div>
  </footer>`;

// ---------- section builders ----------

// Vertical card. Local .mp4 files get a muted preview that plays on hover.
const isFile = (u) => /\.(mp4|webm|mov)$/i.test(u || '');
const videoCard = (p) => `
  <figure class="video-card" data-category="${esc(p.category || '')}">
    <button class="thumb vertical" data-video="${esc(p.video || '')}" aria-label="Assistir ${esc(p.title)}">
      ${media(p.image, p.title)}
      ${isFile(p.video) ? `<video class="preview" data-src="${esc(p.video)}" muted loop playsinline preload="none" aria-hidden="true"></video>` : ''}
      <span class="play">${icons.play}</span>
    </button>
    <figcaption><strong>${esc(p.title)}</strong><small>${esc(p.tag)}</small></figcaption>
  </figure>`;

const galleryItem = (p) => `
  <button class="gallery-item" data-image="${esc(p.image || '')}" aria-label="${esc(p.alt)}">${media(p.image, p.alt)}</button>`;

// Hero slide: a looping muted video when one is set, otherwise the photo.
const heroMedia = (h) =>
  h.video
    ? `<video class="media" src="${esc(h.video)}" ${h.image ? `poster="${esc(h.image)}"` : ''} autoplay muted loop playsinline preload="metadata" aria-label="${esc(h.alt)}"></video>`
    : media(h.image, h.alt);

function heroSection() {
  return `
  <section class="hero wrap">
    <div class="hero-track" aria-roledescription="carrossel" aria-label="Destaques"><div class="hero-rail">${c.hero.map((h) => `<div class="hero-slide">${heroMedia(h)}</div>`).join('')}</div></div>
    <button class="hero-next" aria-label="Próximo destaque">${icons.arrow}</button>
  </section>`;
}

function aboutSection() {
  const a = c.about;
  return `
  <section id="sobre" class="band band-grey">
    <div class="wrap about">
      <div class="about-text">
        <h2 class="script">${esc(a.heading)}</h2>
        ${a.paragraphs.map((p) => `<p>${esc(p)}</p>`).join('')}
      </div>
      <div class="about-portrait">${media(a.portrait, `Retrato de ${c.name}`)}</div>
    </div>
  </section>`;
}

// Category chips that filter the cards below them (full pages only).
function filters(items) {
  const cats = [...new Set(items.map((p) => p.category).filter(Boolean))];
  if (cats.length < 2) return '';
  return `<div class="filters" role="group" aria-label="Filtrar por categoria">
    ${['Todos', ...cats].map((k, i) => `<button class="filter${i ? '' : ' active'}" data-filter="${i ? esc(k) : ''}" aria-pressed="${!i}">${esc(k)}</button>`).join('')}
  </div>`;
}

function filmmakerSection(limit) {
  const f = c.filmmaker;
  const all = limit ? [] : [...f.projects, ...c.director.projects];
  const items = limit ? f.projects.slice(0, limit) : all;
  return `
  <section id="filmmaker" class="section">
    <div class="wrap">
      <h2 class="title center">${esc(f.title)}</h2>
      ${f.subtitle ? `<p class="subtitle center lead">${esc(f.subtitle)}</p>` : ''}
      ${limit ? '' : filters(items)}
      <div class="grid-5">${items.map(videoCard).join('')}</div>
      ${limit ? '<div class="center"><a class="pill" href="filmmaker.html">ver mais</a></div>' : ''}
    </div>
  </section>`;
}

function gallerySection(limit) {
  const g = c.gallery;
  if (limit) {
    return `
    <section id="galeria" class="section">
      <div class="wrap gallery-preview">
        <div class="gallery-head">
          <h2 class="title">${esc(g.title)}</h2>
          <p class="subtitle">${esc(g.subtitle)}</p>
        </div>
        <div>
          <div class="grid-4 shadowed">${g.photos.slice(0, limit).map(galleryItem).join('')}</div>
          <div class="center"><a class="pill caps" href="galeria.html">ver mais</a></div>
        </div>
      </div>
    </section>`;
  }
  return `
  <section id="galeria" class="section">
    <div class="wrap">
      <h2 class="title center">${esc(g.title)}</h2>
      <p class="subtitle center">${esc(g.subtitle)}</p>
      <div class="masonry">${g.photos.map(galleryItem).join('')}</div>
    </div>
  </section>`;
}

// Serviços: two tabs ("Social Media" / "Storymaker") over a segmented switch with a sliding pill.
// Both panels share one grid cell, so the section keeps the height of the taller one and the swap
// is pure CSS class toggling: it can never get stuck waiting for an animation event.
function servicesSection() {
  const s = c.services;
  if (!s?.tabs?.length) return '';
  const card = (k, i) => `
    <article class="service-card" style="--i:${i}">
      <span class="service-index">${String(i + 1).padStart(2, '0')}</span>
      <h3>${esc(k.title)}</h3>
      <p>${esc(k.text)}</p>
      ${k.specs?.length ? `<dl class="service-specs">${k.specs.map((sp) => `<div><dt>${esc(sp.label)}</dt><dd>${esc(sp.value)}</dd></div>`).join('')}</dl>` : ''}
    </article>`;
  return `
  <section id="servicos" class="section services">
    <div class="wrap">
      <div class="services-head">
        <h2 class="title">${esc(s.title)}</h2>
        <div class="service-tabs" role="tablist" aria-label="${esc(s.title)}" style="--n:${s.tabs.length}">
          <span class="service-pill" aria-hidden="true"></span>
          ${s.tabs
            .map(
              (t, i) =>
                `<button class="service-tab" role="tab" id="tab-${esc(t.id)}" aria-controls="panel-${esc(t.id)}" aria-selected="${!i}" tabindex="${i ? -1 : 0}">${esc(t.label)}</button>`,
            )
            .join('')}
        </div>
      </div>
      <div class="service-stage">
        ${s.tabs
          .map(
            (t, i) => `
        <div class="service-panel${i ? '' : ' is-active'}" role="tabpanel" id="panel-${esc(t.id)}" aria-labelledby="tab-${esc(t.id)}"${i ? ' inert aria-hidden="true"' : ''}>
          ${t.cards.map(card).join('')}
        </div>`,
          )
          .join('')}
      </div>
    </div>
  </section>`;
}

function creatorSection() {
  const cr = c.creator;
  const profile = (k, label) => `
    <a class="profile-card" href="${esc(c.socials[k].url)}" target="_blank" rel="noopener">
      <span class="profile-label">${label}</span>
      <span class="profile-body">
        ${media(c.creator.avatar || c.about.portrait, c.name, 'avatar')}
        <span><strong>${esc(c.socials[k].handle)}</strong><small>${esc(c.name)}</small></span>
      </span>
    </a>`;
  return `
  <section id="creator" class="section">
    <div class="wrap">
      <div class="creator-head">
        <h2 class="title">${esc(cr.title)}</h2>
        <div class="creator-handle"><strong>${esc(c.socials.instagram.handle)}</strong><small>${esc(cr.tagline)}</small></div>
      </div>
      <div class="profiles">${profile('instagram', 'Instagram')}</div>
    </div>
  </section>`;
}

function editSection(limit = 5) {
  const d = c.director;
  return `
  <section id="edicao" class="band band-pink">
    <div class="wrap">
      <div class="director-head">
        <h2 class="title">${esc(d.title)}</h2>
        <p class="subtitle">${esc(d.subtitle)}</p>
      </div>
      <div class="grid-5">${d.projects.slice(0, limit).map(videoCard).join('')}</div>
      <div class="center"><a class="pill" href="filmmaker.html">ver todos</a></div>
    </div>
  </section>`;
}

// Podcasts, laid out like the reference's "Diretora" block: 16:9 YouTube thumbnails with the
// episode title and an "assistir agora" link. Each card opens the episode inside the playlist.
function podcastSection() {
  const p = c.podcasts;
  if (!p?.episodes?.length) return '';
  const watch = (e) => `https://www.youtube.com/watch?v=${encodeURIComponent(e.id)}&list=${encodeURIComponent(p.playlist)}`;
  return `
  <section id="podcasts" class="band band-pink podcasts">
    <div class="wrap">
      <div class="director-head">
        <h2 class="title">${esc(p.title)}</h2>
        <p class="subtitle">${esc(p.subtitle)}</p>
      </div>
      <div class="grid-3">
        ${p.episodes
          .map(
            (e) => `
          <figure class="mv-card">
            <a class="thumb wide" href="${esc(watch(e))}" target="_blank" rel="noopener" aria-label="Assistir ${esc(e.title)} no YouTube">
              <img class="media" src="https://i.ytimg.com/vi/${esc(e.id)}/hqdefault.jpg" alt="" loading="lazy" decoding="async">
              <span class="play">${icons.play}</span>
            </a>
            <figcaption><span>${esc(e.title)}</span><a class="watch" href="${esc(watch(e))}" target="_blank" rel="noopener">${icons.youtube}assistir agora</a></figcaption>
          </figure>`,
          )
          .join('')}
      </div>
      <div class="center"><a class="pill" href="https://www.youtube.com/playlist?list=${esc(p.playlist)}" target="_blank" rel="noopener">ver playlist completa</a></div>
    </div>
  </section>`;
}

// Full-width Tr/st reel, shown at the very end of the home page.
function reelSection() {
  const d = c.director;
  return `
  <section class="reel">
    ${
      d.reel
        ? `<video src="${esc(d.reelLoop || d.reel)}" ${d.reelPoster ? `poster="${esc(d.reelPoster)}"` : ''} autoplay muted loop playsinline preload="metadata"></video>
           <button class="reel-cta" data-video="${esc(d.reel)}">${icons.play}<span>${esc(d.reelTitle || 'assistir reel')} · com som</span></button>`
        : media(null, `Reel — ${c.name}`, 'reel-media')
    }
  </section>`;
}

function contactSection() {
  const ct = c.contact;
  return `
  <section class="section contact">
    <div class="wrap narrow">
      <h1 class="contact-title">${esc(ct.title)}</h1>
      <ul class="contact-list">
        ${ct.items
          .map((i) => {
            const href = i.href || (i.type === 'email' ? `mailto:${i.value}` : `tel:${i.value.replace(/[^\d+]/g, '')}`);
            const ext = /^https?:/.test(href) ? ' target="_blank" rel="noopener"' : '';
            return `<li>${icons[i.type] || ''}<a href="${esc(href)}"${ext}><span class="contact-label">${esc(i.label)}</span> ${esc(i.value)}</a></li>`;
          })
          .join('')}
      </ul>
    </div>
  </section>`;
}

// ---------- pages ----------

const pages = {
  home: () => heroSection() + aboutSection() + filmmakerSection(5) + editSection() + podcastSection() + servicesSection() + creatorSection() + reelSection(),
  filmmaker: () => filmmakerSection(),
  galeria: () => gallerySection(),
  contato: () => contactSection(),
};

// ---------- behaviour ----------

function lightbox(html) {
  const box = document.createElement('div');
  box.className = 'lightbox';
  box.innerHTML = `<div class="lightbox-inner">${html}</div><button class="lightbox-close" aria-label="Fechar">×</button>`;
  const close = () => {
    box.remove();
    document.removeEventListener('keydown', onKey);
  };
  const onKey = (e) => e.key === 'Escape' && close();
  box.addEventListener('click', (e) => (e.target === box || e.target.classList.contains('lightbox-close')) && close());
  document.addEventListener('keydown', onKey);
  document.body.appendChild(box);
}

function wire() {
  document.addEventListener('click', (e) => {
    const v = e.target.closest('[data-video]');
    if (v) {
      const em = embedUrl(v.dataset.video);
      if (!em) return;
      lightbox(
        em.kind === 'iframe'
          ? `<iframe src="${em.src}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`
          : `<video src="${esc(em.src)}" controls autoplay playsinline></video>`,
      );
      return;
    }
    const g = e.target.closest('[data-image]');
    if (g && g.dataset.image) lightbox(`<img src="${esc(g.dataset.image)}" alt="">`);
  });

  const toggle = $('.menu-toggle');
  toggle?.addEventListener('click', () => {
    const open = document.body.classList.toggle('menu-open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  document.querySelectorAll('.nav a').forEach((a) => a.addEventListener('click', () => document.body.classList.remove('menu-open')));

  heroAutoplay($('.hero-track'));
  hoverPreviews();
  document.querySelectorAll('.filters').forEach(wireFilters);
  document.querySelectorAll('.service-tabs').forEach(wireServiceTabs);
}

// Switch the Serviços tabs: moves the pill and swaps which panel is active. Arrow keys,
// Home/End and a horizontal swipe on the cards also switch. The motion itself lives in CSS
// (a softer crossfade when the OS asks for reduced motion), so the swap always happens.
function wireServiceTabs(list) {
  const tabs = [...list.querySelectorAll('[role="tab"]')];
  const panels = tabs.map((t) => document.getElementById(t.getAttribute('aria-controls')));
  let current = 0;
  const select = (i, focus = false) => {
    i = (i + tabs.length) % tabs.length;
    if (i === current) return;
    const dir = i > current ? 1 : -1;
    current = i;
    list.style.setProperty('--active', i);
    tabs.forEach((t, k) => {
      t.setAttribute('aria-selected', String(k === i));
      t.tabIndex = k === i ? 0 : -1;
    });
    panels.forEach((p, k) => {
      p.style.setProperty('--dir', k === i ? dir : -dir);
      p.classList.toggle('is-active', k === i);
      p.toggleAttribute('inert', k !== i);
      p.setAttribute('aria-hidden', String(k !== i));
    });
    if (focus) tabs[i].focus();
  };
  tabs.forEach((t, i) => t.addEventListener('click', () => select(i)));
  list.addEventListener('keydown', (e) => {
    const k = { ArrowRight: current + 1, ArrowLeft: current - 1, Home: 0, End: tabs.length - 1 }[e.key];
    if (k === undefined) return;
    e.preventDefault();
    select(k, true);
  });
  const stage = panels[0]?.parentElement;
  let start = null;
  stage?.addEventListener('pointerdown', (e) => (start = e.pointerType === 'mouse' ? null : { x: e.clientX, y: e.clientY }));
  stage?.addEventListener('pointerup', (e) => {
    if (!start) return;
    const dx = e.clientX - start.x;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(e.clientY - start.y)) select(current + (dx < 0 ? 1 : -1));
    start = null;
  });
}

// Play a muted preview while a card is hovered (desktop only); the file loads on first hover.
function hoverPreviews() {
  if (!matchMedia('(hover: hover)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelectorAll('.thumb .preview').forEach((v) => {
    const thumb = v.parentElement;
    thumb.addEventListener('pointerenter', () => {
      if (!v.src) v.src = v.dataset.src;
      v.currentTime = 0;
      v.play().then(() => thumb.classList.add('previewing')).catch(() => {});
    });
    thumb.addEventListener('pointerleave', () => {
      thumb.classList.remove('previewing');
      v.pause();
    });
  });
}

function wireFilters(group) {
  const grid = group.nextElementSibling;
  group.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-filter]');
    if (!btn) return;
    group.querySelectorAll('.filter').forEach((b) => {
      b.classList.toggle('active', b === btn);
      b.setAttribute('aria-pressed', String(b === btn));
    });
    grid.querySelectorAll('.video-card').forEach((card) => {
      card.hidden = !!btn.dataset.filter && card.dataset.category !== btn.dataset.filter;
    });
  });
}

// Slider like the reference: advances one slide at a time on a timer with an eased glide,
// loops forever (the slide set is cloned on both sides), and can be swiped or dragged.
// It keeps running under the mouse; it only waits while a finger or the mouse is dragging it.
// It also runs when the OS asks for reduced motion (Windows "Animation effects" off reports
// that), because the site owner wants the highlights to always advance.
const HERO_INTERVAL = 4000;
const HERO_GLIDE = 'transform 900ms cubic-bezier(0.65, 0, 0.35, 1)';

function heroAutoplay(track) {
  const rail = track?.querySelector('.hero-rail');
  if (!rail) return;
  const n = rail.children.length;
  const clone = () => [...rail.children].slice(0, n).map((el) => {
    const c2 = el.cloneNode(true);
    c2.setAttribute('aria-hidden', 'true');
    return c2;
  });
  rail.append(...clone());
  rail.prepend(...clone());

  const step = () => rail.children[0].getBoundingClientRect().width + parseFloat(getComputedStyle(rail).columnGap || 0);
  let index = n;
  let timer = 0;
  let drag = null;

  const place = (animate, offset = 0) => {
    rail.style.transition = animate ? HERO_GLIDE : 'none';
    rail.style.transform = `translate3d(${-index * step() + offset}px, 0, 0)`;
  };
  const go = (to) => {
    index = to;
    place(true);
    schedule();
  };
  // Once a glide ends inside a cloned set, jump back to the matching original without animation.
  rail.addEventListener('transitionend', (e) => {
    if (e.target !== rail) return;
    if (index >= 2 * n) index -= n;
    else if (index < n) index += n;
    else return;
    place(false);
  });
  const schedule = () => {
    clearTimeout(timer);
    if (!drag && !document.hidden) timer = setTimeout(() => go(index + 1), HERO_INTERVAL);
  };

  track.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    clearTimeout(timer);
    // Freeze wherever a running glide currently is, so grabbing it mid-move doesn't jump.
    const x = new DOMMatrix(getComputedStyle(rail).transform).m41;
    index = -x / step();
    place(false);
    drag = { x0: e.clientX, y0: e.clientY, dx: 0, id: e.pointerId, moved: false };
  });
  track.addEventListener('pointermove', (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    drag.dx = e.clientX - drag.x0;
    if (!drag.moved && Math.abs(drag.dx) > 6 && Math.abs(drag.dx) > Math.abs(e.clientY - drag.y0)) {
      drag.moved = true;
      track.setPointerCapture(e.pointerId);
    }
    if (drag.moved) place(false, drag.dx);
  });
  const release = (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const { dx, moved } = drag;
    drag = null;
    let to = index - dx / step();
    // A short flick still moves a whole slide in the flick's direction.
    to = Math.abs(dx) > 40 ? (dx < 0 ? Math.ceil(to) : Math.floor(to)) : Math.round(to);
    if (moved) track.addEventListener('click', (ev) => ev.stopPropagation(), { capture: true, once: true });
    go(to);
  };
  track.addEventListener('pointerup', release);
  track.addEventListener('pointercancel', release);
  track.addEventListener('dragstart', (e) => e.preventDefault());

  $('.hero-next')?.addEventListener('click', () => go(Math.round(index) + 1));
  document.addEventListener('visibilitychange', schedule);
  addEventListener('resize', () => place(false));
  place(false);
  schedule();
}

const page = document.body.dataset.page || 'home';
document.title = page === 'home' ? `${c.name} | ${c.role}` : `${page} | ${c.name}`;
$('meta[name="description"]')?.setAttribute('content', c.seoDescription);
$('#app').innerHTML = header() + `<main>${pages[page]()}</main>` + footer();
wire();
