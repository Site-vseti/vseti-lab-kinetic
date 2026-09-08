// Hamburger menu
document.addEventListener('DOMContentLoaded', function () {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('nav-mobile');

  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', function () {
    const isOpen = !mobileMenu.classList.contains('open');
    mobileMenu.classList.toggle('open', isOpen);
    hamburger.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
});
