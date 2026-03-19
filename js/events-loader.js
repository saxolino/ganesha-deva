// ========================================
// EVENTS & VIAGGI LOADER
// ========================================

(function() {
  'use strict';

  var MONTHS = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];

  function parseDate(dateStr) {
    var d = new Date(dateStr + 'T00:00:00');
    return { day: String(d.getDate()).padStart(2, '0'), month: MONTHS[d.getMonth()], year: d.getFullYear() };
  }

  // Safe text helper - escapes HTML entities
  function esc(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // Create an element with attributes and children
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function(k) { node.setAttribute(k, attrs[k]); });
    }
    if (typeof children === 'string') {
      node.textContent = children;
    } else if (Array.isArray(children)) {
      children.forEach(function(c) { if (c) node.appendChild(c); });
    }
    return node;
  }

  // Build SVG arrow element
  function arrowSvg() {
    var ns = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('width', '16');
    svg.setAttribute('height', '16');
    svg.setAttribute('viewBox', '0 0 16 16');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');
    var path = document.createElementNS(ns, 'path');
    path.setAttribute('d', 'M3 8h10M9 4l4 4-4 4');
    svg.appendChild(path);
    return svg;
  }

  // Homepage events list template (rows with date)
  function renderEventsList(events, containerId) {
    var container = document.getElementById(containerId);
    if (!container) return;

    var frag = document.createDocumentFragment();
    events.forEach(function(evt) {
      var date = parseDate(evt.data);

      var row = el('div', { 'class': 'evento-row' });

      var dateDiv = el('div', { 'class': 'evento-date' });
      dateDiv.appendChild(el('span', { 'class': 'evento-date__day' }, date.day));
      dateDiv.appendChild(el('span', { 'class': 'evento-date__month' }, date.month));

      var infoDiv = el('div', { 'class': 'evento-info' });
      infoDiv.appendChild(el('span', { 'class': 'evento-location' }, evt.luogo));
      infoDiv.appendChild(el('h3', { 'class': 'evento-info__title' }, evt.titolo));
      infoDiv.appendChild(el('p', { 'class': 'evento-info__desc' }, evt.descrizione));

      var arrow = el('span', { 'class': 'evento-arrow' });
      arrow.appendChild(arrowSvg());

      row.appendChild(dateDiv);
      row.appendChild(infoDiv);
      row.appendChild(arrow);
      frag.appendChild(row);
    });

    container.textContent = '';
    container.appendChild(frag);
  }

  // Events page grid template (cards with images)
  function renderEventsGrid(events, containerId) {
    var container = document.getElementById(containerId);
    if (!container) return;

    var frag = document.createDocumentFragment();
    events.forEach(function(evt) {
      var date = parseDate(evt.data);

      var card = el('div', { 'class': 'evento-card' });

      var imgWrap = el('div', { 'class': 'evento-card__image' });
      imgWrap.appendChild(el('img', { src: evt.immagine, alt: evt.titolo, loading: 'lazy', decoding: 'async' }));
      imgWrap.appendChild(el('span', { 'class': 'evento-card__badge' }, date.day + ' ' + date.month));

      var body = el('div', { 'class': 'evento-card__body' });
      body.appendChild(el('span', { 'class': 'evento-card__location' }, evt.luogo));
      body.appendChild(el('h3', null, evt.titolo));
      body.appendChild(el('p', null, evt.periodo));

      card.appendChild(imgWrap);
      card.appendChild(body);
      frag.appendChild(card);
    });

    container.textContent = '';
    container.appendChild(frag);
  }

  // Load and render
  window.loadEvents = function(containerId, jsonPath, template) {
    fetch(jsonPath)
      .then(function(res) { return res.json(); })
      .then(function(data) {
        var active = data.filter(function(item) { return item.attivo; });
        active.sort(function(a, b) { return new Date(a.data) - new Date(b.data); });

        if (template === 'list') {
          renderEventsList(active, containerId);
        } else if (template === 'grid') {
          renderEventsGrid(active, containerId);
        }
      })
      .catch(function(err) {
        console.warn('Could not load events:', err);
      });
  };

  // Viaggi loader
  window.loadViaggi = function(containerId, jsonPath) {
    fetch(jsonPath)
      .then(function(res) { return res.json(); })
      .then(function(data) {
        var active = data.filter(function(item) { return item.attivo; });
        var container = document.getElementById(containerId);
        if (!container) return;

        var frag = document.createDocumentFragment();
        active.forEach(function(v) {
          var card = el('div', { 'class': 'viaggio-card' });

          var imgWrap = el('div', { 'class': 'viaggio-card__image' });
          imgWrap.appendChild(el('img', { src: v.immagine, alt: v.titolo, loading: 'lazy', decoding: 'async' }));

          var body = el('div', { 'class': 'viaggio-card__body' });
          body.appendChild(el('h3', null, v.titolo));

          var loc = el('p', { 'class': 'viaggio-card__location' });
          loc.textContent = v.luogo + ' \u2014 ' + v.periodo;
          body.appendChild(loc);

          body.appendChild(el('p', null, v.descrizione));
          body.appendChild(el('a', { href: 'viaggi.html', 'class': 'btn-primary' }, 'Scopri'));

          card.appendChild(imgWrap);
          card.appendChild(body);
          frag.appendChild(card);
        });

        container.textContent = '';
        container.appendChild(frag);
      })
      .catch(function(err) {
        console.warn('Could not load viaggi:', err);
      });
  };
})();
