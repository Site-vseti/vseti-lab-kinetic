/* ══════════════════════════════════════════════════════
   ORMECIA — Main JavaScript
   Luxury micro-interactions, scroll effects, timers
   ══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── NAVIGATION SCROLL BEHAVIOUR ────────────────────
  const nav = document.getElementById('main-nav');
  if (nav) {
    const onScroll = () => {
      if (window.scrollY > 60) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ── MOBILE MENU TOGGLE ──────────────────────────────
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      mobileMenu.setAttribute('aria-hidden', String(!isOpen));
    });
    // Close mobile menu on link click
    mobileMenu.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
      });
    });
  }

  // ── INTERSECTION OBSERVER — FADE-IN ─────────────────
  const fadeEls = document.querySelectorAll('.fade-in');
  if (fadeEls.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Staggered delay for siblings in same parent
            const siblings = entry.target.parentElement
              ? Array.from(entry.target.parentElement.querySelectorAll('.fade-in'))
              : [];
            const idx = siblings.indexOf(entry.target);
            entry.target.style.transitionDelay = `${idx * 0.12}s`;
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );
    fadeEls.forEach((el) => observer.observe(el));
  }

  // ── HERO PARALLAX ───────────────────────────────────
  const hero = document.querySelector('.hero');
  if (hero) {
    const heroBackdrop = hero.querySelector('.hero__backdrop');
    if (heroBackdrop) {
      window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        if (scrolled < window.innerHeight) {
          heroBackdrop.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
      }, { passive: true });
    }
  }

  // ── TAXONOMY FILTER ────────────────────────────────
  const taxonomyItems = document.querySelectorAll('.taxonomy__item');
  if (taxonomyItems.length > 0) {
    taxonomyItems.forEach((item) => {
      item.addEventListener('click', () => {
        taxonomyItems.forEach((i) => i.classList.remove('active'));
        item.classList.add('active');
        // Could trigger grid filter here
      });
    });
  }

  // ── TESTIMONIALS CAROUSEL ──────────────────────────
  const testimonials = document.querySelectorAll('.testimonial');
  const dots = document.querySelectorAll('.testimonials__dot');
  let currentTestimonial = 0;
  let testimonialInterval = null;

  function showTestimonial(idx) {
    testimonials.forEach((t, i) => {
      if (i === idx) {
        t.classList.add('active');
        t.removeAttribute('hidden');
      } else {
        t.classList.remove('active');
        t.setAttribute('hidden', '');
      }
    });
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === idx);
      d.setAttribute('aria-current', String(i === idx));
    });
    currentTestimonial = idx;
  }

  if (dots.length > 0) {
    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const idx = parseInt(dot.getAttribute('data-index') || '0', 10);
        showTestimonial(idx);
        clearInterval(testimonialInterval);
        testimonialInterval = setInterval(advanceTestimonial, 6000);
      });
    });
  }

  function advanceTestimonial() {
    const next = (currentTestimonial + 1) % testimonials.length;
    showTestimonial(next);
  }

  if (testimonials.length > 0) {
    testimonialInterval = setInterval(advanceTestimonial, 6000);
  }

  // ── COUNTDOWN TIMERS ───────────────────────────────
  function formatCountdown(ms) {
    if (ms <= 0) return 'Bidding Closed';
    const days    = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours   = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  function initTimers() {
    const timerEls = document.querySelectorAll('[id^="timer-"]');
    if (timerEls.length === 0) return;

    const update = () => {
      const now = Date.now();
      timerEls.forEach((el) => {
        const id = el.id.replace('timer-', '');
        const parentTimerEl = el.closest
          ? el.closest('[data-end]')
          : null;
        if (!parentTimerEl) return;
        const endStr = parentTimerEl.getAttribute('data-end');
        if (!endStr) return;
        const end = new Date(endStr).getTime();
        el.textContent = formatCountdown(end - now);
      });
    };

    update();
    setInterval(update, 1000);
  }

  // PDP timer
  function initPdpTimer() {
    const pdpTimer = document.getElementById('pdp-timer-0047');
    if (!pdpTimer) return;
    const endDate = new Date('2025-04-15T18:00:00Z').getTime();
    const update = () => {
      pdpTimer.textContent = formatCountdown(endDate - Date.now());
    };
    update();
    setInterval(update, 1000);
  }

  initTimers();
  initPdpTimer();

  // ── INVITE FORM ────────────────────────────────────
  const inviteForm = document.getElementById('invite-form');
  if (inviteForm) {
    inviteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('invite-submit');
      if (submitBtn) {
        const original = submitBtn.textContent;
        submitBtn.textContent = 'Inquiry Received';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
        setTimeout(() => {
          submitBtn.textContent = original;
          submitBtn.disabled = false;
          submitBtn.style.opacity = '';
          inviteForm.reset();
        }, 4000);
      }
    });
  }

  // ── PDP THUMBNAIL SWITCHER ─────────────────────────
  const thumbs = document.querySelectorAll('.pdp-thumb');
  if (thumbs.length > 0) {
    thumbs.forEach((thumb) => {
      thumb.addEventListener('click', () => {
        thumbs.forEach((t) => {
          t.classList.remove('active');
          t.setAttribute('aria-pressed', 'false');
        });
        thumb.classList.add('active');
        thumb.setAttribute('aria-pressed', 'true');
      });
    });
  }

  // ── GOLD CURSOR GLOW (subtle) ──────────────────────
  // Only for non-touch devices and if prefers-reduced-motion is not set
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

  if (!prefersReduced && !isTouchDevice) {
    const cursor = document.createElement('div');
    cursor.classList.add('cursor-glow');
    Object.assign(cursor.style, {
      position: 'fixed',
      width: '200px',
      height: '200px',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(184,149,74,0.04) 0%, transparent 70%)',
      pointerEvents: 'none',
      zIndex: '9999',
      transform: 'translate(-50%, -50%)',
      transition: 'left 0.3s ease-out, top 0.3s ease-out',
      left: '-300px',
      top: '-300px',
    });
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top  = `${e.clientY}px`;
    }, { passive: true });
  }

  // ── COLLECTION CARD HOVER GOLD LINE ───────────────
  // Illuminate bottom border of collection cards on hover
  document.querySelectorAll('.collection-card__link').forEach((card) => {
    card.addEventListener('mouseenter', () => {
      card.style.borderBottom = `2px solid ${getComputedStyle(document.documentElement).getPropertyValue('--gold-deep').trim()}`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.borderBottom = '';
    });
  });

  // ── SMOOTH ANCHOR SCROLL ───────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href') || '');
      if (target) {
        e.preventDefault();
        const navHeight = nav ? nav.offsetHeight : 80;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 24;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

})();
