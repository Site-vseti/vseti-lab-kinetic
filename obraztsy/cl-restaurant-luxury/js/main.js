/* ==========================================================================
   MAIN.JS - Global Interactions, Accessibility, Theme Toggles, PWA, Loader
   ========================================================================== */

// Inject dynamic CSS early to avoid Flash of Unstyled Content (FOUC)
(function() {
    const style = document.createElement('style');
    style.innerHTML = `
        body:not(.loaded) { opacity: 0; }
        body.loading { opacity: 1 !important; overflow: hidden !important; }
        body.loaded { opacity: 1 !important; }
    `;
    document.head.appendChild(style);
})();

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Global Loading Screen
    runGlobalLoader();
    
    // 2. Initialize Browser Experience Meta Tags (PWA)
    initBrowserExperience();
    
    // 3. Initialize Lenis Smooth Scroll
    initSmoothScroll();
    
    // 4. Navigation bar scroll state (Throttled for performance)
    initStickyHeader();
    
    // 5. Accessible Mobile Navigation Menu
    initMobileMenu();
    
    // 6. Global Forms / Newsletter
    initCommonInteractions();
    
    // 7. Phase 7: Custom Cursor (Desktop only)
    initCustomCursor();
    
    // 8. Phase 7: Magnetic Element Interactions
    initMagneticInteractions();
    
    // 9. Phase 7: Dark / Light Theme System
    initThemeToggler();
    
    // 10. Phase 7: Cookie Consent Banner
    initCookieConsent();
    
    // 11. Phase 7: Floating Reservation and Back to Top CTAs
    initFloatingCTAs();
    
    // 12. Phase 7: Smooth Page Transition Links Interceptor
    initPageTransitions();
    
    // 13. Phase 7: Top Scroll Progress Indicator
    initScrollProgress();
});

/**
 * Prepends the loading screen, counts up from 0% to 100%, and dispatches completion event
 */
function runGlobalLoader() {
    const loaderHTML = `
    <div id="global-loader" role="progressbar" aria-label="Loading L'Étoile" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
        <div class="loader-content">
            <div class="loader-logo">L'ÉTOILE<span>.</span></div>
            <div class="loader-spinner-container">
                <div class="loader-spinner"></div>
            </div>
            <div class="loader-percentage">0%</div>
        </div>
    </div>`;
    
    document.body.insertAdjacentHTML('afterbegin', loaderHTML);
    document.body.classList.add('loading');
    
    const loader = document.getElementById('global-loader');
    const percentEl = loader.querySelector('.loader-percentage');
    
    if (window.lenis) window.lenis.stop();
    
    if (typeof gsap !== 'undefined') {
        const obj = { val: 0 };
        gsap.to(obj, {
            val: 100,
            duration: 1.6,
            ease: 'power2.inOut',
            onUpdate: () => {
                const percent = Math.floor(obj.val);
                percentEl.innerText = percent + '%';
                loader.setAttribute('aria-valuenow', percent);
            },
            onComplete: () => {
                // Animate loader fade out
                gsap.to(loader, {
                    opacity: 0,
                    y: -40,
                    duration: 0.7,
                    ease: 'power3.inOut',
                    onComplete: () => {
                        loader.remove();
                        document.body.classList.remove('loading');
                        document.body.classList.add('loaded');
                        if (window.lenis) window.lenis.start();
                        // Dispatch event for page-specific GSAP elements to animate
                        document.dispatchEvent(new CustomEvent('loaderComplete'));
                    }
                });
            }
        });
    } else {
        // Fallback if GSAP is missing
        let val = 0;
        const interval = setInterval(() => {
            val += 5;
            percentEl.innerText = val + '%';
            if (val >= 100) {
                clearInterval(interval);
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.remove();
                    document.body.classList.remove('loading');
                    document.body.classList.add('loaded');
                    if (window.lenis) window.lenis.start();
                    document.dispatchEvent(new CustomEvent('loaderComplete'));
                }, 500);
            }
        }, 50);
    }
}

/**
 * Initializes Lenis Smooth Scroll and integrates with GSAP ScrollTrigger
 */
function initSmoothScroll() {
    if (typeof Lenis === 'undefined') {
        console.warn('Lenis Smooth Scroll library not loaded.');
        return;
    }
    
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });
    
    window.lenis = lenis;

    // Sync Lenis with GSAP ScrollTrigger if available
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        lenis.on('scroll', ScrollTrigger.update);
        
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        
        gsap.ticker.lagSmoothing(0);
    } else {
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }
}

/**
 * Toggles sticky/scrolled state class on the header when page is scrolled
 */
function initStickyHeader() {
    const header = document.querySelector('header');
    if (!header) return;
    
    const scrollThreshold = 50;
    let ticking = false;
    
    const toggleHeaderClass = () => {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        ticking = false;
    };
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(toggleHeaderClass);
            ticking = true;
        }
    });
    
    toggleHeaderClass();
}

/**
 * Manages hamburger menu clicking and handles accessibility ARIA tags
 */
function initMobileMenu() {
    const header = document.querySelector('header');
    const toggleBtn = document.getElementById('mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav a');
    
    if (!toggleBtn || !mobileNav) return;
    
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.setAttribute('aria-controls', 'mobile-navigation-overlay');
    toggleBtn.setAttribute('aria-label', 'Toggle Navigation Menu');
    mobileNav.setAttribute('id', 'mobile-navigation-overlay');
    mobileNav.setAttribute('aria-hidden', 'true');
    
    const toggleMenu = () => {
        const isOpen = mobileNav.classList.toggle('open');
        header.classList.toggle('nav-open', isOpen);
        
        toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        mobileNav.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
        
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            if (window.lenis) window.lenis.stop();
            // Stagger reveal of links
            if (typeof gsap !== 'undefined') {
                gsap.fromTo('.mobile-nav a', 
                    { opacity: 0, x: 20 },
                    { opacity: 1, x: 0, stagger: 0.08, duration: 0.4, ease: 'power2.out', delay: 0.1 }
                );
            }
            const firstLink = mobileNav.querySelector('a');
            if (firstLink) firstLink.focus();
        } else {
            document.body.style.overflow = '';
            if (window.lenis) window.lenis.start();
            toggleBtn.focus();
        }
    };
    
    toggleBtn.addEventListener('click', toggleMenu);
    
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileNav.classList.contains('open')) {
                toggleMenu();
            }
        });
    });
    
    window.addEventListener('keydown', (e) => {
        if (e.key === "Escape" && mobileNav.classList.contains('open')) {
            toggleMenu();
        }
    });
}

/**
 * Handles basic newsletter form submission
 */
function initCommonInteractions() {
    const newsletterForm = document.querySelector('.newsletter-form');
    if (!newsletterForm) return;
    
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        if (emailInput && emailInput.value.trim() !== '') {
            alert(`Thank you for subscribing! Exquisite updates will be sent to ${emailInput.value}.`);
            emailInput.value = '';
        }
    });
}

/**
 * Installs smooth custom cursor (outer ring lags behind inner dot)
 */
function initCustomCursor() {
    const isTouch = window.matchMedia("(pointer: coarse)").matches || 'ontouchstart' in window;
    if (isTouch) return;
    
    const dot = document.createElement('div');
    dot.id = 'custom-cursor-dot';
    dot.className = 'custom-cursor';
    
    const ring = document.createElement('div');
    ring.id = 'custom-cursor-ring';
    ring.className = 'custom-cursor';
    
    document.body.appendChild(dot);
    document.body.appendChild(ring);
    
    if (typeof gsap !== 'undefined') {
        gsap.set([dot, ring], { xPercent: -50, yPercent: -50, x: window.innerWidth / 2, y: window.innerHeight / 2 });
        
        window.addEventListener('mousemove', (e) => {
            gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0.05, overwrite: 'auto' });
            gsap.to(ring, { x: e.clientX, y: e.clientY, duration: 0.15, overwrite: 'auto' });
        });
    }
    
    // Scale on link hovers
    const hoverTargets = 'a, button, select, input, textarea, .faq-question, .filter-btn, .gallery-item-trigger, .play-btn-circle';
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(hoverTargets)) {
            ring.classList.add('hover');
            dot.classList.add('hover');
        }
    });
    document.addEventListener('mouseout', (e) => {
        if (e.target.closest(hoverTargets)) {
            ring.classList.remove('hover');
            dot.classList.remove('hover');
        }
    });
}

/**
 * Adds subtle magnetic displacement effects to action buttons
 */
function initMagneticInteractions() {
    const isTouch = window.matchMedia("(pointer: coarse)").matches || 'ontouchstart' in window;
    if (isTouch || typeof gsap === 'undefined') return;
    
    const elements = document.querySelectorAll('.magnetic, .btn-gold, .theme-toggle-btn, .play-btn-circle, #back-to-top');
    
    elements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(el, { x: x * 0.35, y: y * 0.35, duration: 0.3, ease: 'power2.out' });
        });
        
        el.addEventListener('mouseleave', () => {
            gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1.1, 0.3)' });
        });
    });
}

/**
 * Dynamic Light/Dark mode switcher with caching and OS preferences detection
 */
function initThemeToggler() {
    // Inject Theme Toggle Button in Header & Mobile Nav
    const navActions = document.querySelector('.nav-actions');
    const mobileNav = document.querySelector('.mobile-nav');
    
    const themeBtnHTML = `<button class="theme-toggle-btn magnetic" aria-label="Toggle light/dark theme" type="button"><i class="fa-solid fa-moon"></i></button>`;
    
    if (navActions) {
        navActions.insertAdjacentHTML('afterbegin', themeBtnHTML);
    }
    if (mobileNav) {
        mobileNav.insertAdjacentHTML('afterbegin', `<div class="mobile-theme-wrapper" style="text-align: right; padding: 1.5rem 2rem 0 0;">${themeBtnHTML}</div>`);
    }
    
    const toggles = document.querySelectorAll('.theme-toggle-btn');
    
    const setTheme = (theme) => {
        if (theme === 'light') {
            document.documentElement.classList.add('light-theme');
            document.body.classList.add('light-theme');
            toggles.forEach(t => t.innerHTML = '<i class="fa-solid fa-sun"></i>');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.classList.remove('light-theme');
            document.body.classList.remove('light-theme');
            toggles.forEach(t => t.innerHTML = '<i class="fa-solid fa-moon"></i>');
            localStorage.setItem('theme', 'dark');
        }
    };
    
    // Check initial preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    
    if (savedTheme === 'light' || (!savedTheme && systemPrefersLight)) {
        setTheme('light');
    } else {
        setTheme('dark');
    }
    
    toggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const isLight = document.body.classList.contains('light-theme');
            setTheme(isLight ? 'dark' : 'light');
        });
    });
}

/**
 * Generates cookie notice banner dynamically and records consent
 */
function initCookieConsent() {
    const accepted = localStorage.getItem('cookie_consent_accepted');
    if (accepted) return;
    
    const consentHTML = `
    <div id="cookie-consent" class="glass-panel" role="alert" aria-live="polite">
        <p style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.5; margin: 0;">
            We use cookies to elevate your digital fine-dining experience. By continuing to browse, you agree to our policies.
        </p>
        <button id="accept-cookies" class="btn-gold btn-filled" style="padding: 0.5rem 1.2rem; font-size: 0.72rem; letter-spacing: 1px; min-width: 90px; border-radius: 4px;">Accept</button>
    </div>`;
    
    document.body.insertAdjacentHTML('beforeend', consentHTML);
    
    const banner = document.getElementById('cookie-consent');
    const btn = document.getElementById('accept-cookies');
    
    setTimeout(() => {
        banner.classList.add('visible');
    }, 2000);
    
    btn.addEventListener('click', () => {
        localStorage.setItem('cookie_consent_accepted', 'true');
        banner.classList.remove('visible');
        setTimeout(() => banner.remove(), 600);
    });
}

/**
 * Injects floating back to top CTA and persistent reservation buttons
 */
function initFloatingCTAs() {
    const isSubpage = window.location.pathname.includes('/pages/');
    const pathPrefix = isSubpage ? '' : 'pages/';
    
    const bttHTML = `<button id="back-to-top" class="magnetic" aria-label="Back to top" type="button"><i class="fa-solid fa-arrow-up"></i></button>`;
    const floatingReserveHTML = `<a href="${pathPrefix}reservation.html" id="floating-reserve-cta" class="btn-gold btn-filled magnetic">Book A Table</a>`;
    
    document.body.insertAdjacentHTML('beforeend', bttHTML);
    document.body.insertAdjacentHTML('beforeend', floatingReserveHTML);
    
    const btt = document.getElementById('back-to-top');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            btt.classList.add('visible');
        } else {
            btt.classList.remove('visible');
        }
    });
    
    btt.addEventListener('click', () => {
        if (window.lenis) {
            window.lenis.scrollTo(0);
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
}

/**
 * Intercepts internal links and plays clean exit animations
 */
function initPageTransitions() {
    if (typeof gsap === 'undefined') return;
    
    const localLinks = document.querySelectorAll('a');
    
    localLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        // Ensure link is a local link page path, not javascript/anchor/externals
        if (href && 
            !href.startsWith('#') && 
            !href.startsWith('javascript') && 
            !href.includes('tel:') && 
            !href.includes('mailto:') && 
            !link.target) {
            
            link.addEventListener('click', (e) => {
                // Permit open in new tab / meta clicks
                if (e.metaKey || e.ctrlKey || e.shiftKey) return;
                
                e.preventDefault();
                const targetUrl = link.href;
                
                // Play exit transition overlay animation
                const overlay = document.createElement('div');
                overlay.id = 'page-transition-overlay';
                document.body.appendChild(overlay);
                
                gsap.fromTo(overlay, 
                    { opacity: 0, filter: 'blur(15px)', scale: 1.08 },
                    { 
                        opacity: 1, 
                        filter: 'blur(0px)', 
                        scale: 1, 
                        duration: 0.5, 
                        ease: 'power2.inOut', 
                        onComplete: () => {
                            window.location.href = targetUrl;
                        } 
                    }
                );
            });
        }
    });
}

/**
 * Renders scroll percentage indicator bar on the page top
 */
function initScrollProgress() {
    const progressHTML = `<div id="scroll-progress" aria-hidden="true"></div>`;
    document.body.insertAdjacentHTML('afterbegin', progressHTML);
    
    const bar = document.getElementById('scroll-progress');
    
    window.addEventListener('scroll', () => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (scrollHeight > 0) {
            const percentage = (window.scrollY / scrollHeight) * 100;
            bar.style.width = percentage + '%';
        }
    });
}

/**
 * Dynamically registers PWA manifest configurations and Touch Icons
 */
function initBrowserExperience() {
    const isSubpage = window.location.pathname.includes('/pages/');
    const pathPrefix = isSubpage ? '../' : '';
    
    // 1. Theme Color
    const metaTheme = document.createElement('meta');
    metaTheme.name = "theme-color";
    metaTheme.content = "#111111";
    document.head.appendChild(metaTheme);
    
    // 2. Apple Touch Icon
    const appleIcon = document.createElement('link');
    appleIcon.rel = "apple-touch-icon";
    appleIcon.href = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23111111'/><text y='.75em' x='5' font-size='80' fill='%23C9A227'>★</text></svg>";
    document.head.appendChild(appleIcon);
    
    // 3. Web PWA Manifest
    const manifestLink = document.createElement('link');
    manifestLink.rel = "manifest";
    manifestLink.href = pathPrefix + "manifest.json";
    document.head.appendChild(manifestLink);
}
