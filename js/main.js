/* ==========================================================================
   GANESHA DEVA — Main JS
   Zero GSAP .from() — uses IntersectionObserver + CSS for scroll reveals
   GSAP only for parallax and magnetic buttons (safe, no opacity traps)
   ========================================================================== */

(function() {
  'use strict';

  /* ---------- Header scroll ---------- */
  var header = document.querySelector('.site-header');
  if (header) {
    if (!document.querySelector('.hero')) {
      header.classList.add('site-header--scrolled');
    }
    var ticking = false;
    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          header.classList.toggle('site-header--scrolled', window.scrollY > 80);
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  /* ---------- Mobile menu ---------- */
  var hamburger = document.querySelector('.nav__hamburger');
  var mobileMenu = document.querySelector('.mobile-menu');
  if (hamburger && mobileMenu) {
    function closeMenu() {
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.remove('mobile-menu--open');
      document.body.style.overflow = '';
    }
    hamburger.addEventListener('click', function() {
      var isOpen = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', String(!isOpen));
      mobileMenu.classList.toggle('mobile-menu--open');
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });
    mobileMenu.querySelectorAll('a').forEach(function(a) { a.addEventListener('click', closeMenu); });
    document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeMenu(); });
  }

  /* ---------- Carousels ---------- */
  document.querySelectorAll('.carousel-wrap').forEach(function(wrap) {
    var carousel = wrap.querySelector('[data-carousel]');
    var prevBtn = wrap.querySelector('[data-carousel-prev]');
    var nextBtn = wrap.querySelector('[data-carousel-next]');
    if (!carousel) return;

    var scrollAmount = function() {
      var firstChild = carousel.children[0];
      return firstChild ? firstChild.offsetWidth + 20 : 300; // card width + gap
    };

    if (nextBtn) nextBtn.addEventListener('click', function() {
      carousel.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
    });
    if (prevBtn) prevBtn.addEventListener('click', function() {
      carousel.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
    });
  });

  /* ---------- Smooth scroll ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function(link) {
    link.addEventListener('click', function(e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  /* ---------- Scroll reveal (IntersectionObserver + CSS) ---------- */
  // Reveal elements — EXCLUDE items inside carousels (they handle their own visibility)
  var revealElements = document.querySelectorAll(
    '.area-card, .evento-row, .viaggio-card, .blog-card, ' +
    '.intro__image-wrap, .intro__text, ' +
    '.areas__header, .lezioni__header, .percorsi__header, .eventi__header, .viaggi__header, .blog__header, ' +
    '.contatti__inner, .newsletter__inner, ' +
    '.carousel-wrap, ' +
    '.alternating-item'
  );

  // Add reveal-ready class (sets initial hidden state via CSS)
  revealElements.forEach(function(el) { el.classList.add('reveal'); });

  // Observe and reveal
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          // Stagger siblings
          var parent = entry.target.parentElement;
          var siblings = parent.querySelectorAll('.reveal:not(.is-visible)');
          var delay = 0;
          siblings.forEach(function(sib) {
            if (sib.getBoundingClientRect().top < window.innerHeight * 1.1) {
              sib.style.transitionDelay = delay + 'ms';
              sib.classList.add('is-visible');
              delay += 80;
            }
          });
          // Always reveal the target itself
          if (!entry.target.classList.contains('is-visible')) {
            entry.target.classList.add('is-visible');
          }
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(function(el) { observer.observe(el); });
  } else {
    // Fallback: show everything
    revealElements.forEach(function(el) { el.classList.add('is-visible'); });
  }

})();

/* ==========================================================================
   GSAP — ONLY parallax + magnetic (no .from(), no opacity manipulation)
   ========================================================================== */

(function() {
  if (typeof gsap === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Hero parallax ---------- */
  if (document.querySelector('.hero__bg img')) {
    gsap.to('.hero__bg img', {
      y: '15%', ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
  }

  /* ---------- Magnetic buttons (desktop) ---------- */
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.btn').forEach(function(btn) {
      var xTo = gsap.quickTo(btn, 'x', { duration: 0.5, ease: 'power3.out' });
      var yTo = gsap.quickTo(btn, 'y', { duration: 0.5, ease: 'power3.out' });
      btn.addEventListener('mousemove', function(e) {
        var r = btn.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * 0.2);
        yTo((e.clientY - r.top - r.height / 2) * 0.2);
      });
      btn.addEventListener('mouseleave', function() { xTo(0); yTo(0); });
    });
  }
})();
