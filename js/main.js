// ========================================
// GANESHA EXPERIENCE -- Main JS
// ========================================

(function() {
  'use strict';

  // --- Header scroll behavior ---
  const header = document.querySelector('.site-header');
  if (header) {
    const scrollThreshold = 100;
    let ticking = false;

    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          if (window.scrollY > scrollThreshold) {
            header.classList.add('site-header--scrolled');
          } else {
            header.classList.remove('site-header--scrolled');
          }
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // Inner pages: header starts scrolled (no hero)
  if (header && !document.querySelector('.hero')) {
    header.classList.add('site-header--scrolled');
  }

  // --- Mobile menu toggle ---
  const hamburger = document.querySelector('.nav__hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function() {
      const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', !isOpen);
      mobileMenu.classList.toggle('mobile-menu--open');
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    // Close on link click
    mobileMenu.querySelectorAll('.mobile-menu__link').forEach(function(link) {
      link.addEventListener('click', function() {
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('mobile-menu--open');
        document.body.style.overflow = '';
      });
    });

    // Close on ESC
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('mobile-menu--open')) {
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('mobile-menu--open');
        document.body.style.overflow = '';
      }
    });
  }
})();

// ========================================
// GSAP ANIMATIONS
// ========================================

document.addEventListener('DOMContentLoaded', function() {
  // Only animate if GSAP is loaded and user allows motion
  if (typeof gsap === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  gsap.registerPlugin(ScrollTrigger);

  // --- Hero animations ---
  var heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  heroTl
    .from('.hero__eyebrow', { y: 20, opacity: 0, duration: 0.8 })
    .from('.hero__title', { y: 40, opacity: 0, duration: 1.2 }, '-=0.4')
    .from('.hero__cta', { y: 20, opacity: 0, duration: 0.8 }, '-=0.6');

  // Hero parallax
  gsap.to('.hero__bg img', {
    y: '20%',
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });

  // --- Intro Dayana animations ---
  // Clip-path reveal on image
  gsap.from('.intro__image-wrap', {
    clipPath: 'inset(50% 50% 50% 50%)',
    duration: 1.2,
    ease: 'power3.inOut',
    scrollTrigger: {
      trigger: '.intro',
      start: 'top 75%'
    }
  });

  // Offset border reveal
  gsap.from('.intro__image-wrap::after', {
    opacity: 0,
    delay: 0.4,
    duration: 0.8,
    scrollTrigger: {
      trigger: '.intro',
      start: 'top 75%'
    }
  });

  // Text stagger reveal
  gsap.from('.intro__text > *', {
    y: 30,
    opacity: 0,
    stagger: 0.2,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.intro__text',
      start: 'top 80%'
    }
  });

  // --- Generic section reveal (reusable) ---
  document.querySelectorAll('.section').forEach(function(section) {
    var children = section.querySelectorAll('.reveal');
    if (children.length) {
      gsap.from(children, {
        y: 30,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%'
        }
      });
    }
  });

  // --- Areas stagger ---
  gsap.from('.area-card', {
    y: 40,
    opacity: 0,
    stagger: 0.15,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.areas__grid',
      start: 'top 80%'
    }
  });

  // --- Lezioni stagger ---
  gsap.from('.lezione-card', {
    y: 40,
    opacity: 0,
    stagger: 0.1,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.lezioni__grid',
      start: 'top 80%'
    }
  });

  // --- Percorsi stagger ---
  gsap.from('.percorso-card', {
    y: 40,
    opacity: 0,
    stagger: 0.15,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.percorsi__grid',
      start: 'top 80%'
    }
  });

  // --- Eventi rows stagger ---
  // Note: events are loaded async, so use a setTimeout to wait for DOM population
  setTimeout(function() {
    gsap.from('.evento-row', {
      x: -30,
      opacity: 0,
      stagger: 0.1,
      duration: 0.6,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.eventi__list',
        start: 'top 85%'
      }
    });
  }, 500);

  // --- Viaggi ---
  gsap.from('.viaggi__header', {
    y: 30,
    opacity: 0,
    duration: 0.8,
    scrollTrigger: { trigger: '.viaggi', start: 'top 80%' }
  });

  // --- Contatti form ---
  gsap.from('.contatti__inner > *', {
    y: 30,
    opacity: 0,
    stagger: 0.2,
    duration: 0.8,
    scrollTrigger: { trigger: '.contatti', start: 'top 80%' }
  });

  // --- Newsletter ---
  gsap.from('.newsletter__inner > *', {
    y: 20,
    opacity: 0,
    stagger: 0.2,
    duration: 0.8,
    scrollTrigger: { trigger: '.newsletter', start: 'top 85%' }
  });

  // --- Magnetic cursor on buttons (desktop only) ---
  if (window.matchMedia('(hover: hover)').matches && typeof gsap !== 'undefined') {
    document.querySelectorAll('.btn-primary, .btn-secondary').forEach(function(btn) {
      var xTo = gsap.quickTo(btn, 'x', { duration: 0.4, ease: 'power3.out' });
      var yTo = gsap.quickTo(btn, 'y', { duration: 0.4, ease: 'power3.out' });

      btn.addEventListener('mousemove', function(e) {
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        xTo(x * 0.3);
        yTo(y * 0.3);
      });

      btn.addEventListener('mouseleave', function() {
        xTo(0);
        yTo(0);
      });
    });
  }

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(function(link) {
    link.addEventListener('click', function(e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});
