/* Site behaviour: nav state, mobile menu, scroll reveal, TOC, progress, print. */
(function () {
  'use strict';

  var body = document.body;
  var nav = document.querySelector('.site-nav');
  var toggle = document.querySelector('.menu-toggle');
  var panel = document.getElementById('site-menu');

  function syncNav() {
    if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 8);
  }

  window.addEventListener('scroll', syncNav, { passive: true });
  syncNav();

  /* Mobile menu */
  function closeMenu() {
    if (!panel || !toggle) return;
    panel.setAttribute('hidden', '');
    toggle.setAttribute('aria-expanded', 'false');
    body.classList.remove('menu-open');
  }

  function openMenu() {
    if (!panel || !toggle) return;
    panel.removeAttribute('hidden');
    toggle.setAttribute('aria-expanded', 'true');
    body.classList.add('menu-open');
    panel.focus();
  }

  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      if (panel.hasAttribute('hidden')) openMenu();
      else { closeMenu(); toggle.focus(); }
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
    var onBreakpoint = function (event) { if (event.matches) closeMenu(); };
    if (desktop.addEventListener) desktop.addEventListener('change', onBreakpoint);
    else desktop.addListener(onBreakpoint);
  }

  /* Reveal sections once */
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

  /* Table of contents from h2/h3 */
  function slugify(text) {
    return text.trim().toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'section';
  }

  document.querySelectorAll('[data-toc]').forEach(function (toc) {
    var prose = document.querySelector('.prose');
    if (!prose) return;
    var heads = prose.querySelectorAll('h2, h3');
    if (heads.length < 2) { toc.hidden = true; return; }

    var label = document.createElement('h2');
    label.textContent = toc.getAttribute('data-toc-title') || 'On this page';
    toc.appendChild(label);

    heads.forEach(function (heading, index) {
      if (!heading.id) heading.id = slugify(heading.textContent) + (index ? '-' + index : '');
      var link = document.createElement('a');
      link.href = '#' + heading.id;
      link.textContent = heading.textContent;
      if (heading.tagName === 'H3') link.className = 'is-sub';
      toc.appendChild(link);
    });
  });

  /* Reading progress */
  var bar = document.getElementById('reading-progress');
  if (bar) {
    var updateProgress = function () {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  /* Back to top */
  var top = document.getElementById('back-to-top');
  if (top) {
    var toggleTop = function () {
      top.classList.toggle('visible', window.scrollY > 400);
    };
    window.addEventListener('scroll', toggleTop, { passive: true });
    toggleTop();
    top.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* Tag filter on archive pages */
  var chips = document.querySelectorAll('.tag-chip');
  if (chips.length) {
    var archiveItems = document.querySelectorAll('.archive-item');
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        chips.forEach(function (other) { other.classList.remove('is-active'); });
        chip.classList.add('is-active');
        var filter = chip.getAttribute('data-filter');
        archiveItems.forEach(function (item) {
          var tags = item.getAttribute('data-tags') || '';
          item.hidden = filter !== 'all' && tags.indexOf(filter) === -1;
        });
      });
    });
  }

  /* Print / PDF */
  document.querySelectorAll('[data-print]').forEach(function (button) {
    button.addEventListener('click', function () { window.print(); });
  });
})();
