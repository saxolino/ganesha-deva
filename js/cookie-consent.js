/* ==========================================================================
   GANESHA DEVA — Cookie Consent (GDPR)
   Banner + gestione consenso + blocco cookie analitici senza consenso
   ========================================================================== */

(function() {
  'use strict';

  var COOKIE_NAME = 'gd_cookie_consent';
  var COOKIE_DAYS = 365;

  function getCookie(name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }

  function setCookie(name, value, days) {
    var d = new Date();
    d.setTime(d.getTime() + days * 86400000);
    document.cookie = name + '=' + value + ';expires=' + d.toUTCString() + ';path=/;SameSite=Lax';
  }

  function deleteCookie(name) {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Lax';
  }

  // Check if consent already given
  var consent = getCookie(COOKIE_NAME);
  if (consent) {
    if (consent === 'all') loadAnalytics();
    return; // Don't show banner
  }

  // Build banner DOM
  var banner = document.createElement('div');
  banner.className = 'cookie-banner';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-label', 'Consenso cookie');

  var inner = document.createElement('div');
  inner.className = 'cookie-banner__inner';

  var text = document.createElement('div');
  text.className = 'cookie-banner__text';

  var title = document.createElement('p');
  title.className = 'cookie-banner__title';
  title.textContent = 'Rispettiamo la tua privacy';

  var desc = document.createElement('p');
  desc.className = 'cookie-banner__desc';
  desc.textContent = 'Utilizziamo cookie tecnici necessari al funzionamento del sito e, previo tuo consenso, cookie analitici per migliorare la tua esperienza. Non utilizziamo cookie di profilazione o marketing.';

  var link = document.createElement('a');
  link.href = 'privacy-policy.html';
  link.className = 'cookie-banner__link';
  link.textContent = 'Leggi la Privacy Policy';

  text.appendChild(title);
  text.appendChild(desc);
  text.appendChild(link);

  var actions = document.createElement('div');
  actions.className = 'cookie-banner__actions';

  var acceptAll = document.createElement('button');
  acceptAll.className = 'cookie-banner__btn cookie-banner__btn--accept';
  acceptAll.textContent = 'Accetta tutti';

  var acceptNecessary = document.createElement('button');
  acceptNecessary.className = 'cookie-banner__btn cookie-banner__btn--necessary';
  acceptNecessary.textContent = 'Solo necessari';

  var customize = document.createElement('button');
  customize.className = 'cookie-banner__btn cookie-banner__btn--customize';
  customize.textContent = 'Personalizza';

  actions.appendChild(acceptAll);
  actions.appendChild(acceptNecessary);
  actions.appendChild(customize);

  inner.appendChild(text);
  inner.appendChild(actions);

  // Customize panel (hidden by default)
  var panel = document.createElement('div');
  panel.className = 'cookie-banner__panel';
  panel.style.display = 'none';

  var panelTitle = document.createElement('p');
  panelTitle.className = 'cookie-banner__panel-title';
  panelTitle.textContent = 'Gestisci preferenze cookie';

  var row1 = document.createElement('label');
  row1.className = 'cookie-banner__option';
  var cb1 = document.createElement('input');
  cb1.type = 'checkbox';
  cb1.checked = true;
  cb1.disabled = true;
  var span1 = document.createElement('span');
  span1.textContent = 'Cookie tecnici (sempre attivi) -- Necessari per il funzionamento del sito.';
  row1.appendChild(cb1);
  row1.appendChild(span1);

  var row2 = document.createElement('label');
  row2.className = 'cookie-banner__option';
  var cb2 = document.createElement('input');
  cb2.type = 'checkbox';
  cb2.id = 'cookie-analytics';
  var span2 = document.createElement('span');
  span2.textContent = 'Cookie analitici -- Dati anonimi per migliorare il sito. Durata max 26 mesi.';
  row2.appendChild(cb2);
  row2.appendChild(span2);

  var saveBtn = document.createElement('button');
  saveBtn.className = 'cookie-banner__btn cookie-banner__btn--accept';
  saveBtn.textContent = 'Salva preferenze';

  panel.appendChild(panelTitle);
  panel.appendChild(row1);
  panel.appendChild(row2);
  panel.appendChild(saveBtn);

  inner.appendChild(panel);
  banner.appendChild(inner);
  document.body.appendChild(banner);

  // Show with slight delay for elegance
  setTimeout(function() { banner.classList.add('cookie-banner--visible'); }, 800);

  // Event handlers
  acceptAll.addEventListener('click', function() {
    setCookie(COOKIE_NAME, 'all', COOKIE_DAYS);
    loadAnalytics();
    closeBanner();
  });

  acceptNecessary.addEventListener('click', function() {
    setCookie(COOKIE_NAME, 'necessary', COOKIE_DAYS);
    closeBanner();
  });

  customize.addEventListener('click', function() {
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
  });

  saveBtn.addEventListener('click', function() {
    var analyticsChecked = document.getElementById('cookie-analytics').checked;
    setCookie(COOKIE_NAME, analyticsChecked ? 'all' : 'necessary', COOKIE_DAYS);
    if (analyticsChecked) loadAnalytics();
    closeBanner();
  });

  function closeBanner() {
    banner.classList.remove('cookie-banner--visible');
    setTimeout(function() { banner.remove(); }, 500);
  }

  // Placeholder: load analytics script only if consented
  function loadAnalytics() {
    // Uncomment and replace with actual GA4 ID when ready:
    // var script = document.createElement('script');
    // script.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX';
    // script.async = true;
    // document.head.appendChild(script);
    // window.dataLayer = window.dataLayer || [];
    // function gtag(){dataLayer.push(arguments);}
    // gtag('js', new Date());
    // gtag('config', 'G-XXXXXXXXXX', { anonymize_ip: true });
  }

})();
