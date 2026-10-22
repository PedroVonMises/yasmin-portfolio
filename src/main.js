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
  arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4l8 8-8 8" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',
};

const socialIcons = (keys = ['instagram', 'tiktok']) =>
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
          <a href="${home}#creator">creator</a>
          <a href="${home}#galeria">fotógrafa</a>
          <a href="${home}#diretora">diretora</a>
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
    <div class="wrap">© ${new Date().getFullYear()} ${esc(c.name)} — ${esc(c.role)}</div>
  </footer>`;

// ---------- section builders ----------

const videoCard = (p) => `
  <figure class="video-card reveal">
    <button class="thumb vertical" data-video="${esc(p.video || '')}" aria-label="Assistir ${esc(p.title)}">
      ${media(p.image, p.title)}
      <span class="play">${icons.play}</span>
    </button>
    <figcaption><strong>${esc(p.title)}</strong><small>${esc(p.tag)}</small></figcaption>
  </figure>`;

const galleryItem = (p) => `
  <button class="gallery-item reveal" data-image="${esc(p.image || '')}" aria-label="${esc(p.alt)}">${media(p.image, p.alt)}</button>`;

function heroSection() {
  return `
  <section class="hero wrap">
    <div class="hero-track">${c.hero.map((h) => `<div class="hero-slide">${media(h.image, h.alt)}</div>`).join('')}</div>
    <button class="hero-next" aria-label="Próxima foto">${icons.arrow}</button>
  </section>`;
}

function aboutSection() {
  const a = c.about;
  return `
  <section id="sobre" class="band band-grey">
    <div class="wrap about">
      <div class="about-text reveal">
        <h2 class="script">${esc(a.heading)}</h2>
        ${a.paragraphs.map((p) => `<p>${esc(p)}</p>`).join('')}
      </div>
      <div class="about-portrait reveal">${media(a.portrait, `Retrato de ${c.name}`)}</div>
    </div>
  </section>`;
}

function filmmakerSection(limit) {
  const f = c.filmmaker;
  const items = limit ? f.projects.slice(0, limit) : f.projects;
  return `
  <section id="filmmaker" class="section">
    <div class="wrap">
      <h2 class="title center reveal">${esc(f.title)}</h2>
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
        <div class="gallery-head reveal">
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

function creatorSection() {
  const cr = c.creator;
  const profile = (k, label) => `
    <a class="profile-card reveal" href="${esc(c.socials[k].url)}" target="_blank" rel="noopener">
      <span class="profile-label">${label}</span>
      <span class="profile-body">
        ${media(c.about.portrait, c.name, 'avatar')}
        <span><strong>${esc(c.socials[k].handle)}</strong><small>${esc(c.name)}</small></span>
      </span>
    </a>`;
  return `
  <section id="creator" class="section">
    <div class="wrap">
      <div class="creator-head reveal">
        <h2 class="title">${esc(cr.title)}</h2>
        <div class="creator-handle"><strong>${esc(c.socials.instagram.handle)}</strong><small>${esc(cr.tagline)}</small></div>
        <div class="creator-icons">${socialIcons(['instagram', 'tiktok', 'youtube'])}</div>
      </div>
      <div class="profiles">${profile('instagram', 'Instagram')}${profile('tiktok', 'TikTok')}</div>
      <h2 class="title center small reveal">${esc(cr.campaignsTitle)}</h2>
      <div class="grid-3 campaigns">
        ${cr.campaigns
          .map(
            (k) => `
          <${k.url ? `a href="${esc(k.url)}" target="_blank" rel="noopener"` : 'div'} class="campaign reveal">
            ${media(k.image, k.brand)}
            <span class="chip">${esc(k.brand)}</span>
          </${k.url ? 'a' : 'div'}>`,
          )
          .join('')}
      </div>
    </div>
  </section>`;
}

function directorSection() {
  const d = c.director;
  return `
  <section id="diretora" class="band band-pink">
    <div class="wrap">
      <div class="director-head reveal">
        <h2 class="title">${esc(d.title)}</h2>
        <p class="subtitle">${esc(d.subtitle)}</p>
      </div>
      <div class="grid-3">
        ${d.videos
          .map(
            (v) => `
          <figure class="mv-card reveal">
            <button class="thumb wide" data-video="${esc(v.url || '')}" aria-label="Assistir ${esc(v.title)}">${media(v.image, v.title)}</button>
            <figcaption><span>${esc(v.title)}</span><button class="watch" data-video="${esc(v.url || '')}">${icons.youtube}assistir agora</button></figcaption>
          </figure>`,
          )
          .join('')}
      </div>
    </div>
  </section>
  <section class="reel">
    ${
      d.reel
        ? `<video src="${esc(d.reel)}" autoplay muted loop playsinline></video>`
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
            const href = i.type === 'email' ? `mailto:${i.value}` : `tel:${i.value.replace(/[^\d+]/g, '')}`;
            return `<li>${icons[i.type]}<a href="${esc(href)}">${esc(i.label)}: ${esc(i.value)}</a></li>`;
          })
          .join('')}
      </ul>
      <div class="contact-social">${socialIcons(['instagram', 'tiktok', 'youtube'])}</div>
    </div>
  </section>`;
}

// ---------- pages ----------

const pages = {
  home: () => heroSection() + aboutSection() + filmmakerSection(5) + gallerySection(8) + creatorSection() + directorSection(),
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

  const track = $('.hero-track');
  $('.hero-next')?.addEventListener('click', () => {
    const step = track.firstElementChild.getBoundingClientRect().width + 4;
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
    track.scrollTo({ left: atEnd ? 0 : track.scrollLeft + step, behavior: 'smooth' });
  });

  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      }),
    { threshold: 0.12 },
  );
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
}

const page = document.body.dataset.page || 'home';
document.title = page === 'home' ? `${c.name} | ${c.role}` : `${page} | ${c.name}`;
$('meta[name="description"]')?.setAttribute('content', c.seoDescription);
$('#app').innerHTML = header() + `<main>${pages[page]()}</main>` + footer();
wire();
