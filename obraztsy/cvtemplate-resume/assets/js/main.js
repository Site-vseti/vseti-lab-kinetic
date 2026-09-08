/* ========================================
   PERSONAL BRANDING — INTERACTIVE SCRIPTS
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- AOS Initialization ---------- */
  if (typeof AOS !== 'undefined') {
    AOS.init({
      once: true,
      offset: 100,
      duration: 700,
      easing: 'ease-out-cubic',
    });
  }

  /* ---------- Navbar Scroll Effect ---------- */
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');

  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
        if (backToTop) backToTop.classList.add('visible');
      } else {
        navbar.classList.remove('scrolled');
        if (backToTop) backToTop.classList.remove('visible');
      }
    });
  }

  /* ---------- Mobile Menu Toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = navToggle.querySelector('i');
      if (navMenu.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-xmark');
      } else {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
      }
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.querySelector('i').classList.remove('fa-xmark');
        navToggle.querySelector('i').classList.add('fa-bars');
      });
    });
  }

  /* ---------- Active Nav Link (for single page only) ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (sections.length > 0 && navLinks.length > 0) {
    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        if (window.scrollY >= sectionTop) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
          link.classList.add('active');
        }
      });
    });
  }

  /* ---------- Skill Bars Animation ---------- */
  const skillFills = document.querySelectorAll('.skill-fill');
  const skillsSection = document.getElementById('keahlian');
  let animated = false;

  const animateSkills = () => {
    if (!skillsSection) return;
    const sectionTop = skillsSection.offsetTop - window.innerHeight + 100;
    if (window.scrollY > sectionTop && !animated) {
      skillFills.forEach(fill => {
        fill.style.width = fill.style.getPropertyValue('--width');
      });
      animated = true;
    }
  };

  window.addEventListener('scroll', animateSkills);
  animateSkills();

  /* ---------- Back to Top ---------- */
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Current Year ---------- */
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  /* ---------- Simple Particles Hero ---------- */
  const particlesContainer = document.getElementById('particles');
  if (particlesContainer) {
    const particleCount = 30;
    for (let i = 0; i < particleCount; i++) {
      const dot = document.createElement('span');
      dot.classList.add('particle');
      const size = Math.random() * 3 + 1;
      dot.style.width = size + 'px';
      dot.style.height = size + 'px';
      dot.style.left = Math.random() * 100 + '%';
      dot.style.top = Math.random() * 100 + '%';
      dot.style.animationDuration = (Math.random() * 10 + 10) + 's';
      dot.style.animationDelay = (Math.random() * 5) + 's';
      particlesContainer.appendChild(dot);
    }
  }

});

/* ---------- Particle Styles (injected) ---------- */
const particleStyle = document.createElement('style');
particleStyle.textContent = `
  .particle {
    position: absolute;
    background: rgba(179, 75, 255, 0.35);
    border-radius: 50%;
    pointer-events: none;
    animation: floatParticle linear infinite;
  }
  @keyframes floatParticle {
    0% { transform: translateY(0) translateX(0); opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { transform: translateY(-100vh) translateX(20px); opacity: 0; }
  }
`;
document.head.appendChild(particleStyle);
