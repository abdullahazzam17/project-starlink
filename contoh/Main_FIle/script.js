/* =========================================================
   TRIAKSES — Interactions & Animations
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  // 1) Render Lucide icons
  if (window.lucide) window.lucide.createIcons();

  // 2) Navbar shadow on scroll
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (window.scrollY > 8) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // 3) Reveal-on-scroll using IntersectionObserver
  const reveals = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach((el) => io.observe(el));

  // 4) Smooth-scroll for in-page anchors (offset for fixed navbar)
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length <= 1) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 88;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // 5) Subtle parallax on hero grid background
  const grid = document.querySelector('.hero-bg-grid');
  if (grid) {
    window.addEventListener('scroll', () => {
      const y = Math.min(window.scrollY, 400);
      grid.style.transform = `translateY(${y * 0.15}px)`;
    }, { passive: true });
  }

  // 6) Button ripple-ish press feedback
  document.querySelectorAll('.btn').forEach((btn) => {
    btn.addEventListener('pointerdown', () => {
      btn.style.transform = 'translateY(0) scale(0.98)';
    });
    btn.addEventListener('pointerup', () => {
      btn.style.transform = '';
    });
    btn.addEventListener('pointerleave', () => {
      btn.style.transform = '';
    });
  });

  // 7) Animated counter for hero stats (runs once when hero is visible)
  const stats = document.querySelectorAll('.hero-stats .stat strong');
  const animateCount = (el) => {
    const raw = el.textContent.trim();
    const match = raw.match(/^([\d.]+)(.*)$/);
    if (!match) return;
    const target = parseFloat(match[1]);
    const suffix = match[2];
    const isFloat = match[1].includes('.');
    const duration = 1200;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = target * eased;
      el.textContent = (isFloat ? val.toFixed(1) : Math.floor(val)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = match[1] + suffix;
    };
    requestAnimationFrame(tick);
  };
  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) {
    const sio = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          stats.forEach(animateCount);
          sio.disconnect();
        }
      });
    }, { threshold: 0.4 });
    sio.observe(heroStats);
  }
});
