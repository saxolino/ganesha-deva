/* ==========================================================================
   GANESHA DEVA — Content Loader
   Carica eventi, viaggi, blog, percorsi da file JSON.
   Renderizza in caroselli o griglie.

   COME AGGIUNGERE CONTENUTI:
   1. Apri il file JSON nella cartella data/ (es. data/events.json)
   2. Aggiungi un nuovo oggetto all'array
   3. Push su GitHub — Vercel rideploya automaticamente
   ========================================================================== */

(function() {
  'use strict';

  var MONTHS = ['Gen','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic'];

  function parseDate(str) {
    var d = new Date(str + 'T00:00:00');
    return { day: String(d.getDate()).padStart(2,'0'), month: MONTHS[d.getMonth()], year: d.getFullYear() };
  }

  function mkEl(tag, cls) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    return n;
  }

  function mkText(tag, cls, text) {
    var n = mkEl(tag, cls);
    n.textContent = text;
    return n;
  }

  function mkImg(src, alt) {
    var i = document.createElement('img');
    i.src = src; i.alt = alt || '';
    return i;
  }

  function mkSvgArrow(dir) {
    var s = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">';
    s += dir === 'prev' ? '<path d="M10 4l-4 4 4 4"/>' : '<path d="M6 4l4 4-4 4"/>';
    s += '</svg>';
    var btn = document.createElement('button');
    btn.className = 'carousel-btn';
    btn.setAttribute('aria-label', dir === 'prev' ? 'Precedente' : 'Successivo');
    // SVG is static markup, not user content — safe to set
    var temp = document.createElement('div');
    temp.textContent = ''; // clear
    btn.appendChild(document.createRange().createContextualFragment(s));
    return btn;
  }

  /* ---------- Carousel wrapper ---------- */
  function wrapCarousel(cards) {
    var wrap = mkEl('div', 'carousel-wrap');
    var track = mkEl('div', 'carousel');
    track.setAttribute('data-carousel', '');
    cards.forEach(function(c) { track.appendChild(c); });
    wrap.appendChild(track);

    var nav = mkEl('div', 'carousel-nav');
    var prev = mkSvgArrow('prev');
    var next = mkSvgArrow('next');
    nav.appendChild(prev);
    nav.appendChild(next);
    wrap.appendChild(nav);

    var scrollAmt = function() {
      var f = track.children[0];
      return f ? f.offsetWidth + 20 : 340;
    };
    next.addEventListener('click', function() { track.scrollBy({ left: scrollAmt(), behavior: 'smooth' }); });
    prev.addEventListener('click', function() { track.scrollBy({ left: -scrollAmt(), behavior: 'smooth' }); });

    return wrap;
  }

  /* ==========================================================================
     CARD BUILDERS — all use safe DOM methods (textContent, no innerHTML)
     ========================================================================== */

  /* --- EVENTI carousel card --- */
  function buildEventCard(evt) {
    var date = parseDate(evt.data);
    var card = mkEl('div', 'evento-carousel-card');

    var imgW = mkEl('div', 'evento-carousel-card__image');
    imgW.appendChild(mkImg(evt.immagine, evt.titolo));
    imgW.appendChild(mkText('span', 'evento-carousel-card__badge', date.day + ' ' + date.month));

    var body = mkEl('div', 'evento-carousel-card__body');
    body.appendChild(mkText('span', 'evento-carousel-card__location', evt.luogo));
    body.appendChild(mkText('h3', null, evt.titolo));
    body.appendChild(mkText('p', 'evento-carousel-card__period', evt.periodo));
    body.appendChild(mkText('p', 'evento-carousel-card__desc', evt.descrizione));

    card.appendChild(imgW);
    card.appendChild(body);
    return card;
  }

  /* --- EVENTI grid card --- */
  function buildEventGridCard(evt) {
    var date = parseDate(evt.data);
    var card = document.createElement(evt.link ? 'a' : 'div');
    card.className = 'evento-card';
    if (evt.link) card.href = evt.link;

    var imgW = mkEl('div', 'evento-card__image');
    imgW.appendChild(mkImg(evt.immagine, evt.titolo));
    imgW.appendChild(mkText('span', 'evento-card__badge', date.day + ' ' + date.month));

    var body = mkEl('div', 'evento-card__body');
    body.appendChild(mkText('span', 'evento-card__location', evt.luogo));
    body.appendChild(mkText('h3', null, evt.titolo));
    body.appendChild(mkText('p', null, evt.periodo));

    card.appendChild(imgW);
    card.appendChild(body);
    return card;
  }

  /* --- PERCORSI card --- */
  function buildPercorsoCard(p) {
    var card = document.createElement('a');
    card.className = 'percorso-card';
    card.href = 'percorsi.html';

    var imgW = mkEl('div', 'percorso-card__image');
    imgW.appendChild(mkImg(p.immagine, p.titolo));

    var body = mkEl('div', 'percorso-card__body');
    body.appendChild(mkText('h3', null, p.titolo));
    body.appendChild(mkText('p', null, p.descrizione));
    var btn = mkText('span', 'btn btn--primary', 'Scopri');
    body.appendChild(btn);

    card.appendChild(imgW);
    card.appendChild(body);
    return card;
  }

  /* --- VIAGGI card --- */
  function buildViaggioCard(v) {
    var card = mkEl('div', 'viaggio-card');

    var imgW = mkEl('div', 'viaggio-card__image');
    imgW.appendChild(mkImg(v.immagine, v.titolo));

    var body = mkEl('div', 'viaggio-card__body');
    body.appendChild(mkText('h3', null, v.titolo));
    var loc = mkText('p', 'viaggio-card__location', v.luogo + ' \u2014 ' + v.periodo);
    body.appendChild(loc);
    body.appendChild(mkText('p', null, v.descrizione));
    var link = document.createElement('a');
    link.href = v.link || 'viaggi.html';
    link.className = 'btn btn--primary';
    link.textContent = 'Scopri';
    body.appendChild(link);

    card.appendChild(imgW);
    card.appendChild(body);
    return card;
  }

  /* --- BLOG card --- */
  function buildBlogCard(post) {
    var date = parseDate(post.data);
    var card = mkEl('article', 'blog-card');

    var imgW = mkEl('div', 'blog-card__image');
    imgW.appendChild(mkImg(post.immagine, post.titolo));

    var body = mkEl('div', 'blog-card__body');
    body.appendChild(mkText('span', 'blog-card__date', date.day + ' ' + date.month + ' ' + date.year));
    body.appendChild(mkText('h3', 'blog-card__title', post.titolo));
    body.appendChild(mkText('p', 'blog-card__excerpt', post.estratto));
    body.appendChild(mkText('span', 'btn btn--secondary', 'Leggi'));

    card.appendChild(imgW);
    card.appendChild(body);
    return card;
  }

  /* ==========================================================================
     FETCH + RENDER
     ========================================================================== */
  function loadAndRender(jsonPath, containerId, builder, options) {
    var container = document.getElementById(containerId);
    if (!container) return;

    fetch(jsonPath)
      .then(function(r) { return r.json(); })
      .then(function(data) {
        var items = data.filter(function(i) { return i.attivo; });
        if (items[0] && items[0].data) {
          items.sort(function(a, b) { return new Date(a.data) - new Date(b.data); });
        }

        var cards = items.map(builder);
        container.textContent = '';

        if (options && options.layout === 'carousel') {
          container.appendChild(wrapCarousel(cards));
        } else if (options && options.layout === 'grid') {
          var grid = mkEl('div', options.gridClass || '');
          cards.forEach(function(c) { grid.appendChild(c); });
          container.appendChild(grid);
        } else {
          cards.forEach(function(c) { container.appendChild(c); });
        }
      })
      .catch(function(e) { console.warn('Content load error:', e); });
  }

  /* ==========================================================================
     PUBLIC API
     ========================================================================== */
  window.loadEventi = function(id, layout) {
    loadAndRender('data/events.json', id, layout === 'grid' ? buildEventGridCard : buildEventCard, {
      layout: layout || 'carousel', gridClass: 'eventi-page__grid'
    });
  };

  window.loadPercorsi = function(id, layout) {
    loadAndRender('data/percorsi.json', id, buildPercorsoCard, { layout: layout || 'carousel' });
  };

  window.loadViaggi = function(id) {
    loadAndRender('data/viaggi.json', id, buildViaggioCard);
  };

  window.loadBlog = function(id, layout) {
    loadAndRender('data/blog.json', id, buildBlogCard, { layout: layout || 'carousel' });
  };

  // Backward compat
  window.loadEvents = function(id, path, tpl) {
    loadAndRender(path, id, tpl === 'grid' ? buildEventGridCard : buildEventCard, {
      layout: tpl === 'grid' ? 'grid' : 'carousel', gridClass: 'eventi-page__grid'
    });
  };

})();
