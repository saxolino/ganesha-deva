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
