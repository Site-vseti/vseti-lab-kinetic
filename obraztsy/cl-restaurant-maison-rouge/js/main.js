/* ============================================
   MAISON ROUGE - Premium Polished JavaScript
   ============================================ */

(function() {
  'use strict';

  // ============================================
  // Page Loader
  // ============================================
  const pageLoader = document.getElementById('pageLoader');

  function hideLoader() {
    if (pageLoader) {
      pageLoader.classList.add('hidden');
      setTimeout(() => {
        pageLoader.style.display = 'none';
      }, 800);
    }
  }

  window.addEventListener('load', () => {
    setTimeout(hideLoader, 600);
  });

  setTimeout(hideLoader, 4000);

  // ============================================
  // Lenis Smooth Scroll
  // ============================================
  let lenis;

  function initLenis() {
    if (typeof Lenis === 'undefined') return;

    lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }

  // ============================================
  // GSAP Animations
  // ============================================
  function initGSAP() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    // Header scroll behavior - hide on scroll down, show on scroll up
    const header = document.getElementById('header');
    let lastScroll = 0;

    if (header) {
      ScrollTrigger.create({
        start: 'top -100',
        end: 99999,
        onUpdate: (self) => {
          const currentScroll = self.scroll();
          if (currentScroll > 100) {
            header.classList.add('header-scrolled');
            if (currentScroll > lastScroll && currentScroll > 300) {
              header.classList.add('header-hidden');
            } else {
              header.classList.remove('header-hidden');
            }
          } else {
            header.classList.remove('header-scrolled');
            header.classList.remove('header-hidden');
          }
          lastScroll = currentScroll;
        }
      });
    }

    // Hero entrance animation
    const heroLabel = document.querySelector('.hero-label');
    const heroLines = document.querySelectorAll('.hero-title .line-inner');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroButtons = document.querySelector('.hero-buttons');
    const heroScroll = document.querySelector('.hero-scroll');

    if (heroLines.length > 0 && !sessionStorage.getItem('heroAnimated')) {
      const heroTl = gsap.timeline({ delay: 0.3 });

      heroTl
        .to(heroLabel, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
        .to(heroLines, { 
          y: '0%', 
          duration: 1.2, 
          ease: 'power3.out', 
          stagger: 0.12 
        }, '-=0.4')
        .to(heroSubtitle, { 
          opacity: 1, 
          y: 0, 
          duration: 0.9, 
          ease: 'power3.out' 
        }, '-=0.6')
        .to(heroButtons, { 
          opacity: 1, 
          y: 0, 
          duration: 0.9, 
          ease: 'power3.out' 
        }, '-=0.5')
        .to(heroScroll, { 
          opacity: 1, 
          duration: 0.8, 
          ease: 'power2.out' 
        }, '-=0.3');

      sessionStorage.setItem('heroAnimated', 'true');
    } else if (heroLines.length > 0) {
      // If already animated, just show everything
      gsap.set([heroLabel, heroSubtitle, heroButtons, heroScroll], { opacity: 1, y: 0 });
      gsap.set(heroLines, { y: '0%' });
    }

    // Fade up animations with smoother easing
    const fadeElements = document.querySelectorAll('.fade-up');
    fadeElements.forEach((el, i) => {
      gsap.fromTo(el, 
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // Parallax effect on images
    const parallaxImages = document.querySelectorAll('.parallax-wrap img, .img-wrap img');
    parallaxImages.forEach(img => {
      gsap.to(img, {
        yPercent: -8,
        ease: 'none',
        scrollTrigger: {
          trigger: img.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5
        }
      });
    });

    // Section header reveal
    const sectionHeaders = document.querySelectorAll('.section-header');
    sectionHeaders.forEach(header => {
      gsap.fromTo(header.children,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: header,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // Menu items stagger
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach((item, i) => {
      gsap.fromTo(item,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.7,
          ease: 'power3.out',
          delay: i * 0.05,
          scrollTrigger: {
            trigger: item,
            start: 'top 90%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // Cards stagger
    const cards = document.querySelectorAll('.grid-3 .card, .grid-2 .card');
    cards.forEach((card, i) => {
      gsap.fromTo(card,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          delay: i * 0.1,
          scrollTrigger: {
            trigger: card,
            start: 'top 88%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // Gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach((item, i) => {
      gsap.fromTo(item,
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'power3.out',
          delay: i * 0.05,
          scrollTrigger: {
            trigger: item,
            start: 'top 90%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // Award items
    const awardItems = document.querySelectorAll('.award-item');
    awardItems.forEach((item, i) => {
      gsap.fromTo(item,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          delay: i * 0.08,
          scrollTrigger: {
            trigger: item,
            start: 'top 88%',
            toggleActions: 'play none none none'
          }
        }
      );
    });
  }

  // ============================================
  // Mobile Navigation
  // ============================================
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      mainNav.classList.toggle('active');
      document.body.style.overflow = isExpanded ? '' : 'hidden';
      if (lenis) {
        isExpanded ? lenis.start() : lenis.stop();
      }
    });

    mainNav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.setAttribute('aria-expanded', 'false');
        mainNav.classList.remove('active');
        document.body.style.overflow = '';
        if (lenis) lenis.start();
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mainNav.classList.contains('active')) {
        menuToggle.setAttribute('aria-expanded', 'false');
        mainNav.classList.remove('active');
        document.body.style.overflow = '';
        if (lenis) lenis.start();
      }
    });
  }

  // ============================================
  // Menu Filtering
  // ============================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const menuCategories = document.querySelectorAll('.menu-category');

  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');

        filterBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        menuCategories.forEach(category => {
          const categoryType = category.getAttribute('data-category');
          if (filter === 'all' || categoryType === filter) {
            gsap.to(category, { 
              opacity: 1, 
              y: 0, 
              duration: 0.5, 
              ease: 'power3.out',
              display: 'block',
              pointerEvents: 'all'
            });
          } else {
            gsap.to(category, { 
              opacity: 0, 
              y: -20, 
              duration: 0.3, 
              ease: 'power3.in',
              display: 'none',
              pointerEvents: 'none'
            });
          }
        });
      });
    });
  }

  // ============================================
  // FAQ Accordion
  // ============================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      faqItems.forEach(i => {
        i.classList.remove('active');
        i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      if (!isActive) {
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ============================================
  // Gallery Lightbox
  // ============================================
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (lightbox && galleryItems.length > 0) {
    galleryItems.forEach(item => {
      const openLightbox = () => {
        const img = item.querySelector('img');
        if (img) {
          lightboxImg.src = img.src;
          lightboxImg.alt = img.alt;
          lightbox.classList.add('active');
          document.body.style.overflow = 'hidden';
          if (lenis) lenis.stop();
        }
      };

      item.addEventListener('click', openLightbox);
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox();
        }
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      if (lenis) lenis.start();
    };

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  // ============================================
  // Form Validation & Submission
  // ============================================
  function validateField(field, errorId, validator) {
    const errorEl = document.getElementById(errorId);
    const isValid = validator(field.value);

    if (!isValid) {
      field.style.borderColor = 'var(--color-rouge)';
      if (errorEl) errorEl.classList.add('visible');
      return false;
    } else {
      field.style.borderColor = '';
      if (errorEl) errorEl.classList.remove('visible');
      return true;
    }
  }

  // Reservation Form
  const reservationForm = document.getElementById('reservationForm');
  if (reservationForm) {
    const resFields = {
      firstName: { id: 'res-first-name', error: 'error-first-name', validator: v => v.trim().length >= 2 },
      lastName: { id: 'res-last-name', error: 'error-last-name', validator: v => v.trim().length >= 2 },
      email: { id: 'res-email', error: 'error-email', validator: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
      phone: { id: 'res-phone', error: 'error-phone', validator: v => v.trim().length >= 10 },
      date: { id: 'res-date', error: 'error-date', validator: v => v !== '' },
      time: { id: 'res-time', error: 'error-time', validator: v => v !== '' },
      guests: { id: 'res-guests', error: 'error-guests', validator: v => v !== '' }
    };

    Object.values(resFields).forEach(field => {
      const el = document.getElementById(field.id);
      if (el) {
        el.addEventListener('blur', () => validateField(el, field.error, field.validator));
        el.addEventListener('input', () => {
          if (el.style.borderColor) validateField(el, field.error, field.validator);
        });
      }
    });

    const dateInput = document.getElementById('res-date');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.setAttribute('min', today);
    }

    reservationForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      Object.values(resFields).forEach(field => {
        const el = document.getElementById(field.id);
        if (el && !validateField(el, field.error, field.validator)) {
          isValid = false;
        }
      });

      const msgEl = document.getElementById('reservation-message');
      const btn = document.getElementById('resSubmitBtn');

      if (isValid) {
        btn.disabled = true;
        btn.textContent = 'Sending...';

        setTimeout(() => {
          msgEl.textContent = 'Thank you! Your reservation request has been received. We will confirm shortly.';
          msgEl.style.color = 'var(--color-gold)';
          msgEl.style.display = 'block';
          btn.disabled = false;
          btn.textContent = 'Request Reservation';
          reservationForm.reset();
        }, 1500);
      } else {
        msgEl.textContent = 'Please correct the errors above.';
        msgEl.style.color = 'var(--color-rouge)';
        msgEl.style.display = 'block';
      }
    });
  }

  // Contact Form
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const contactFields = {
      name: { id: 'contact-name', error: 'error-contact-name', validator: v => v.trim().length >= 2 },
      email: { id: 'contact-email', error: 'error-contact-email', validator: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
      subject: { id: 'contact-subject', error: 'error-contact-subject', validator: v => v !== '' },
      message: { id: 'contact-message', error: 'error-contact-message', validator: v => v.trim().length >= 10 }
    };

    Object.values(contactFields).forEach(field => {
      const el = document.getElementById(field.id);
      if (el) {
        el.addEventListener('blur', () => validateField(el, field.error, field.validator));
        el.addEventListener('input', () => {
          if (el.style.borderColor) validateField(el, field.error, field.validator);
        });
      }
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      Object.values(contactFields).forEach(field => {
        const el = document.getElementById(field.id);
        if (el && !validateField(el, field.error, field.validator)) {
          isValid = false;
        }
      });

      const msgEl = document.getElementById('contact-message');
      const btn = document.getElementById('contactSubmitBtn');

      if (isValid) {
        btn.disabled = true;
        btn.textContent = 'Sending...';

        setTimeout(() => {
          msgEl.textContent = 'Thank you for your message! We will respond within 24 hours.';
          msgEl.style.color = 'var(--color-gold)';
          msgEl.style.display = 'block';
          btn.disabled = false;
          btn.textContent = 'Send Message';
          contactForm.reset();
        }, 1500);
      } else {
        msgEl.textContent = 'Please correct the errors above.';
        msgEl.style.color = 'var(--color-rouge)';
        msgEl.style.display = 'block';
      }
    });
  }

  // Newsletter Form
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('newsletter-email');
      const msgEl = document.getElementById('newsletter-message');

      if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        msgEl.textContent = 'Welcome to the inner circle! Check your inbox for a confirmation.';
        msgEl.style.color = 'var(--color-gold)';
        msgEl.style.display = 'block';
        newsletterForm.reset();
      } else {
        msgEl.textContent = 'Please enter a valid email address.';
        msgEl.style.color = 'var(--color-rouge)';
        msgEl.style.display = 'block';
      }
    });
  }

  // ============================================
  // Image Lazy Loading with Blur-up
  // ============================================
  function initLazyImages() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;

            if (img.dataset.src) {
              const tempImg = new Image();
              tempImg.src = img.dataset.src;
              tempImg.onload = () => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                requestAnimationFrame(() => {
                  img.classList.add('loaded');
                });
              };
            } else {
              requestAnimationFrame(() => {
                img.classList.add('loaded');
              });
            }

            imageObserver.unobserve(img);
          }
        });
      }, {
        rootMargin: '100px 0px',
        threshold: 0.01
      });

      document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        imageObserver.observe(img);
      });
    } else {
      // Fallback
      document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        if (img.dataset.src) img.src = img.dataset.src;
        img.classList.add('loaded');
      });
    }
  }

  // ============================================
  // Magnetic Button Effect
  // ============================================
  function initMagneticButtons() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const magneticElements = document.querySelectorAll('.btn, .nav-cta, .footer-social a');

    magneticElements.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(el, {
          x: x * 0.2,
          y: y * 0.2,
          duration: 0.4,
          ease: 'power2.out'
        });
      });

      el.addEventListener('mouseleave', () => {
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: 'elastic.out(1, 0.5)'
        });
      });
    });
  }

  // ============================================
  // Smooth Scroll for Anchor Links
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        if (lenis) {
          lenis.scrollTo(target, { offset: -80, duration: 1.5 });
        } else {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // ============================================
  // Initialize Everything
  // ============================================
  document.addEventListener('DOMContentLoaded', () => {
    initLenis();
    initGSAP();
    initLazyImages();
    initMagneticButtons();
  });

})();
