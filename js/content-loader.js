/* ==========================================================================
   GANESHA DEVA — Content Loader
   Carica eventi, viaggi, percorsi da /data/_generated.json (build-time)
   e blog da /data/blog.json. Renderizza in caroselli o griglie.
   ========================================================================== */

(function () {
  'use strict';

  var MONTHS = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];

  function parseDate(str) {
    var d = new Date(str + 'T00:00:00');
    return { day: String(d.getDate()).padStart(2, '0'), month: MONTHS[d.getMonth()], year: d.getFullYear() };
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
    i.src = src;
    i.alt = alt || '';
    return i;
  }

  function mkArrow(dir) {
    var btn = document.createElement('button');
    btn.className = 'carousel-btn';
    btn.setAttribute('aria-label', dir === 'prev' ? 'Precedente' : 'Successivo');
    var path = dir === 'prev' ? 'M10 4l-4 4 4 4' : 'M6 4l4 4-4 4';
    btn.appendChild(document.createRange().createContextualFragment(
      '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="' + path + '"/></svg>'
    ));
    return btn;
  }

  function wrapCarousel(cards) {
    var wrap = mkEl('div', 'carousel-wrap');
    var track = mkEl('div', 'carousel');
    track.setAttribute('data-carousel', '');
    cards.forEach(function (c) { track.appendChild(c); });
    wrap.appendChild(track);

    var nav = mkEl('div', 'carousel-nav');
    var prev = mkArrow('prev');
    var next = mkArrow('next');
    nav.appendChild(prev);
    nav.appendChild(next);
    wrap.appendChild(nav);

    var scrollAmt = function () {
      var f = track.children[0];
      return f ? f.offsetWidth + 20 : 340;
    };
    next.addEventListener('click', function () { track.scrollBy({ left: scrollAmt(), behavior: 'smooth' }); });
    prev.addEventListener('click', function () { track.scrollBy({ left: -scrollAmt(), behavior: 'smooth' }); });

    return wrap;
  }

  /* ---------- Cards ---------- */
  function buildEventCard(evt) {
    var date = parseDate(evt.data);
    var card = document.createElement(evt.link ? 'a' : 'div');
    card.className = 'evento-carousel-card';
    if (evt.link) card.href = evt.link;

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

  function buildPercorsoCard(p) {
    var card = document.createElement('a');
    card.className = 'percorso-card';
    card.href = p.link || '/percorsi/';

    var imgW = mkEl('div', 'percorso-card__image');
    imgW.appendChild(mkImg(p.immagine, p.titolo));

    var body = mkEl('div', 'percorso-card__body');
    body.appendChild(mkText('h3', null, p.titolo));
    body.appendChild(mkText('p', null, p.descrizione));
    body.appendChild(mkText('span', 'btn btn--primary', 'Scopri'));

    card.appendChild(imgW);
    card.appendChild(body);
    return card;
  }

  function buildViaggioCard(v) {
    var card = mkEl('div', 'viaggio-card');

    var imgW = mkEl('div', 'viaggio-card__image');
    imgW.appendChild(mkImg(v.immagine, v.titolo));

    var body = mkEl('div', 'viaggio-card__body');
    body.appendChild(mkText('h3', null, v.titolo));
    body.appendChild(mkText('p', 'viaggio-card__location', v.luogo + ' — ' + v.periodo));
    body.appendChild(mkText('p', null, v.descrizione));
    var link = document.createElement('a');
    link.href = v.link || '/viaggi/';
    link.className = 'btn btn--primary';
    link.textContent = 'Scopri';
    body.appendChild(link);

    card.appendChild(imgW);
    card.appendChild(body);
    return card;
  }

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

  /* ---------- Fetch ---------- */
  var generatedPromise = null;
  function loadGenerated() {
    if (!generatedPromise) {
      generatedPromise = fetch('/data/_generated.json').then(function (r) { return r.json(); });
    }
    return generatedPromise;
  }

  function render(items, containerId, builder, layout, gridClass) {
    var container = document.getElementById(containerId);
    if (!container) return;
    var active = items.filter(function (i) { return i.attivo !== false; });
    if (active[0] && active[0].data) {
      active.sort(function (a, b) { return new Date(a.data) - new Date(b.data); });
    }
    var cards = active.map(builder);
    container.textContent = '';
    if (layout === 'carousel') {
      container.appendChild(wrapCarousel(cards));
    } else if (layout === 'grid') {
      var grid = mkEl('div', gridClass || '');
      cards.forEach(function (c) { grid.appendChild(c); });
      container.appendChild(grid);
    } else {
      cards.forEach(function (c) { container.appendChild(c); });
    }
  }

  /* ---------- Public API ---------- */
  window.loadEventi = function (id, layout) {
    loadGenerated().then(function (data) {
      render(data.eventi || [], id, layout === 'grid' ? buildEventGridCard : buildEventCard, layout || 'carousel', 'eventi-page__grid');
    }).catch(function (e) { console.warn('loadEventi:', e); });
  };

  window.loadPercorsi = function (id, layout) {
    loadGenerated().then(function (data) {
      render(data.percorsi || [], id, buildPercorsoCard, layout || 'carousel');
    }).catch(function (e) { console.warn('loadPercorsi:', e); });
  };

  window.loadViaggi = function (id) {
    loadGenerated().then(function (data) {
      render(data.viaggi || [], id, buildViaggioCard);
    }).catch(function (e) { console.warn('loadViaggi:', e); });
  };

  window.loadBlog = function (id, layout) {
    fetch('/data/blog.json')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        render(data, id, buildBlogCard, layout || 'carousel');
      })
      .catch(function (e) { console.warn('loadBlog:', e); });
  };
})();
