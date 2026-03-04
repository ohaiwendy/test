/* Project page shared JS */
(function () {
  'use strict';

  // Cursor
  const cursor = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursorDot');
  let mouseX = 0, mouseY = 0, cX = 0, cY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    if (cursorDot) { cursorDot.style.left = mouseX + 'px'; cursorDot.style.top = mouseY + 'px'; }
  });
  function animCursor() {
    cX += (mouseX - cX) * 0.12; cY += (mouseY - cY) * 0.12;
    if (cursor) { cursor.style.left = cX + 'px'; cursor.style.top = cY + 'px'; }
    requestAnimationFrame(animCursor);
  }
  animCursor();

  // Scroll progress
  const bar = document.getElementById('scrollProgress');
  function updateBar() {
    if (!bar) return;
    const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    bar.style.width = pct + '%';
  }

  // Scroll animations
  const els = document.querySelectorAll('[data-animate]');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => obs.observe(el));

  // Counter
  document.querySelectorAll('[data-count]').forEach(el => {
    const cobs = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      const target = parseInt(el.dataset.count, 10);
      const dur = 1400;
      const start = performance.now();
      function tick(now) {
        const p = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(ease * target);
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      }
      requestAnimationFrame(tick);
      cobs.unobserve(el);
    }, { threshold: 0.5 });
    cobs.observe(el);
  });

  window.addEventListener('scroll', updateBar, { passive: true });
  updateBar();

  // Page reveal
  document.body.style.opacity = '1';

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); window.scrollTo({ top: t.offsetTop - 70, behavior: 'smooth' }); }
    });
  });
})();
