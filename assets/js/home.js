/* Homepage behaviour: nav state, scroll reveal, mobile menu. No dependencies. */
(function () {
  'use strict';

  var body = document.body;
  var nav = document.querySelector('.nav');
  var toggle = document.querySelector('.menu-toggle');
  var panel = document.getElementById('home-menu');

  /* Nav gains a hairline once the page moves. */
  function syncNav() {
    if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 8);
  }

  window.addEventListener('scroll', syncNav, { passive: true });
  syncNav();

  /* Let the hero transition run after the first paint. */
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      body.classList.add('loaded');
    });
  });

  /* Reveal sections once. */
  var items = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    items.forEach(function (el) { observer.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  /* Mobile menu. */
  if (!toggle || !panel) return;

  function closeMenu() {
    panel.setAttribute('hidden', '');
    toggle.setAttribute('aria-expanded', 'false');
    body.classList.remove('menu-open');
  }

  function openMenu() {
    panel.removeAttribute('hidden');
    toggle.setAttribute('aria-expanded', 'true');
    body.classList.add('menu-open');
    panel.focus();
  }

  toggle.addEventListener('click', function () {
    if (panel.hasAttribute('hidden')) {
      openMenu();
    } else {
      closeMenu();
      toggle.focus();
    }
  });

  panel.addEventListener('click', function (event) {
    if (event.target.closest('a')) closeMenu();
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && !panel.hasAttribute('hidden')) {
      closeMenu();
      toggle.focus();
    }
  });

  var desktop = window.matchMedia('(min-width: 901px)');
  function onBreakpoint(event) {
    if (event.matches) closeMenu();
  }
  if (desktop.addEventListener) {
    desktop.addEventListener('change', onBreakpoint);
  } else {
    desktop.addListener(onBreakpoint);
  }
})();
