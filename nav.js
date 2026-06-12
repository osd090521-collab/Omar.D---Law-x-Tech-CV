/* ── SHARED NAV + CURSOR + PAGE TRANSITIONS ── */
(function () {
  const isMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ── CUSTOM CURSOR ── */
  if (isMouse) {
    const dot  = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      gsap.set(dot, { x: mx, y: my });
    }, { passive: true });

    (function tickRing() {
      rx += (mx - rx) * 0.11;
      ry += (my - ry) * 0.11;
      gsap.set(ring, { x: rx, y: ry });
      requestAnimationFrame(tickRing);
    })();

    /* Expand ring on interactive elements */
    document.querySelectorAll('a, button, .btn, .r-card, .edu-card, .bring-card').forEach(el => {
      el.addEventListener('mouseenter', () => {
        gsap.to(ring, { width: 48, height: 48, borderColor: 'rgba(99,102,241,.9)', duration: .2 });
      });
      el.addEventListener('mouseleave', () => {
        gsap.to(ring, { width: 30, height: 30, borderColor: 'rgba(99,102,241,.55)', duration: .2 });
      });
    });
  }

  /* ── SCROLL PROGRESS BAR ── */
  const bar = document.getElementById('progress-bar');
  if (bar) {
    window.addEventListener('scroll', () => {
      const pct = scrollY / (document.body.scrollHeight - innerHeight) * 100;
      bar.style.width = pct + '%';
    }, { passive: true });
  }

  /* ── NAV SCROLL STATE ── */
  const nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 50), { passive: true });
  }

  /* ── MOBILE NAV ── */
  const hamburger = document.getElementById('hamburger');
  const mobNav    = document.getElementById('mobNav');
  const mobClose  = document.getElementById('mobClose');
  if (hamburger && mobNav) {
    hamburger.addEventListener('click', () => mobNav.classList.add('open'));
    if (mobClose) mobClose.addEventListener('click', () => mobNav.classList.remove('open'));
    mobNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => mobNav.classList.remove('open'));
    });
  }

  /* ── ACTIVE NAV LINK ── */
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mob-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (!href) return;
    const hPage = href.split('#')[0] || 'index.html';
    if (hPage === page || (page === '' && hPage === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* ── PAGE EXIT TRANSITION ── */
  document.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href.startsWith('#') || href.startsWith('mailto') ||
        href.startsWith('tel') || href.startsWith('http') ||
        href.includes('dissertation') || a.target === '_blank') return;
    a.addEventListener('click', e => {
      e.preventDefault();
      const dest = href;
      gsap.to('body', {
        opacity: 0, y: -12, duration: .3, ease: 'power2.in',
        onComplete: () => { location.href = dest; }
      });
    });
  });

  /* ── HERO MOUSE PARALLAX (index only) ── */
  const heroBg = document.getElementById('heroBg');
  if (heroBg && isMouse) {
    document.addEventListener('mousemove', e => {
      gsap.to(heroBg, {
        x: (e.clientX / innerWidth  - .5) * 30,
        y: (e.clientY / innerHeight - .5) * 30,
        duration: 1.4, ease: 'power1.out'
      });
    }, { passive: true });
  }

  /* ── 3D CARD TILT ── */
  if (isMouse) {
    document.querySelectorAll('.r-card, .edu-card, .bring-card').forEach(card => {
      const setX = gsap.quickSetter(card, 'rotateX', 'deg');
      const setY = gsap.quickSetter(card, 'rotateY', 'deg');
      card.style.transformStyle = 'preserve-3d';
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        setY( ((e.clientX - r.left) / r.width  - .5) * 10);
        setX(-((e.clientY - r.top)  / r.height - .5) * 10);
      }, { passive: true });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { rotateX: 0, rotateY: 0, duration: .6, ease: 'elastic.out(1,.5)' });
      });
    });
  }

  /* ── MAGNETIC BUTTONS ── */
  if (isMouse) {
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * .25;
        const y = (e.clientY - r.top  - r.height / 2) * .25;
        gsap.to(btn, { x, y, duration: .3, ease: 'power2.out' });
      }, { passive: true });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: .4, ease: 'elastic.out(1,.5)' });
      });
    });
  }
})();
