document.getElementById('year').textContent = new Date().getFullYear();



const footer = document.querySelector('.site-footer');

window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;

    // If user is near the bottom (50px threshold)
    if (scrollTop + windowHeight >= docHeight - 50) {
        footer.classList.add('show');
    } else {
        footer.classList.remove('show');
    }
});

// Mobile menu toggle
const toggleBtn = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
const navLinks = document.querySelectorAll('.site-nav a');
const toggleBtnColse = document.querySelector('.menu-toggle-colse')
const navRemove = document.querySelector('.menu-toggle-colse')

toggleBtn.addEventListener('click', () => {
    nav.classList.toggle('open');
});

toggleBtnColse.addEventListener('click',() => {
    nav.classList.remove('open');
    navRemove 
    
});



//  CLOSE menu when any link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('open');
    });
});

