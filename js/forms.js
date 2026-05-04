/* ==========================================================================
   GANESHA DEVA — Form submit handlers (newsletter + contact)
   - Submit AJAX a /api/<endpoint> senza ricaricare la pagina
   - Feedback inline via .form-status
   - Mappa Google Maps mount lazy on click (GDPR)
   ========================================================================== */

(function () {
  'use strict';

  function setStatus(form, type, msg) {
    var s = form.querySelector('.form-status');
    if (!s) return;
    s.textContent = msg;
    s.dataset.state = type;
  }

  async function submitForm(form) {
    var btn = form.querySelector('button[type="submit"]');
    if (btn) btn.disabled = true;
    setStatus(form, 'loading', 'Invio in corso…');

    var fd = new FormData(form);
    var payload = {};
    fd.forEach(function (v, k) { payload[k] = v; });

    try {
      var res = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        var err = await res.json().catch(function () { return {}; });
        throw new Error(err.error || 'Errore durante l\'invio');
      }

      var data = await res.json().catch(function () { return {}; });
      var kind = form.dataset.form;
      var msg = data.message || (kind === 'newsletter'
        ? 'Iscrizione completata. Controlla la tua email.'
        : 'Messaggio inviato. Ti risponderemo presto.');
      setStatus(form, 'success', msg);
      form.reset();
    } catch (e) {
      setStatus(form, 'error', e.message || 'Errore di rete. Riprova più tardi.');
    } finally {
      if (btn) btn.disabled = false;
    }
  }

  document.addEventListener('submit', function (e) {
    var form = e.target;
    if (!(form instanceof HTMLFormElement)) return;
    if (!form.dataset.form) return;
    e.preventDefault();
    submitForm(form);
  });

  /* ---------- Google Maps lazy mount (GDPR) ---------- */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-map-load]');
    if (!btn) return;
    var wrap = btn.closest('[data-map-mount]');
    if (!wrap) return;
    var src = wrap.dataset.mapSrc;
    if (!src) return;
    var iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.width = '100%';
    iframe.height = '280';
    iframe.style.border = '0';
    iframe.style.borderRadius = '16px';
    iframe.loading = 'lazy';
    iframe.referrerPolicy = 'no-referrer-when-downgrade';
    iframe.title = 'Mappa Ganesha Deva Studio';
    wrap.textContent = '';
    wrap.appendChild(iframe);
  });
})();
