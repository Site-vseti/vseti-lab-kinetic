/* ==========================================================================
   ANIMATIONS.JS - GSAP & ScrollTrigger Animations (FOUC-Free)
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {
    // Check if GSAP libraries are loaded
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('GSAP or ScrollTrigger libraries not loaded.');
        return;
    }
    
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    // 1. Initial Page/Hero Load Animations - Coordinated with Global Loader
    let heroAnimated = false;
    const runHeroAnim = () => {
        if (heroAnimated) return;
        heroAnimated = true;
        initHeroAnimations();
    };

    document.addEventListener('loaderComplete', runHeroAnim);
    
    // Fallback to trigger hero animations if loader takes too long
    setTimeout(runHeroAnim, 2500);
    
    // 2. Scroll Triggered Reveals (Fades, Slides, Staggers)
    initScrollReveals();
    
    // 3. Image Parallax Effects
    initParallaxImages();
    
    // 4. About Page Specific: Timeline and Stats
    initTimelineAnimations();
    initCounterAnimations();
    
    // 5. Reservation Page Specific: Form and Cards
    initReservationAnimations();
    
    // 6. Gallery Page Specific: Masonry and Lightbox
    initGalleryAnimations();
});

/**
 * Animates the main Hero elements. Handles FOUC removal.
 */
function initHeroAnimations() {
    const heroContent = document.querySelector('.hero-content');
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroCTA = document.querySelector('.hero-cta');
    const heroScroll = document.querySelector('.scroll-indicator');
    
    if (!heroContent) return;
    
    // Create timeline
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    
    // Make wrapper visible before animating elements
    gsap.set([heroContent, heroScroll], { autoAlpha: 1 });
    
    // Smooth reveal sequence
    tl.fromTo(heroTitle, 
        { y: 80, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1.4 }
    )
    .fromTo(heroSubtitle, 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1.0 }, 
        '-=1.0'
    )
    .fromTo(heroCTA, 
        { scale: 0.95, opacity: 0 }, 
        { scale: 1, opacity: 1, duration: 0.8 }, 
        '-=0.7'
    )
    .fromTo(heroScroll, 
        { y: -10, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8 }, 
        '-=0.5'
    );
}

/**
 * ScrollTrigger reveals for headers, grids, and individual fade elements
 */
function initScrollReveals() {
    // 1. Section Title Staggers
    const titles = document.querySelectorAll('.section-title-wrapper');
    titles.forEach(title => {
        const subtitle = title.querySelector('.subtitle-gold');
        const heading = title.querySelector('.section-title');
        
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: title,
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });
        
        if (subtitle) {
            tl.fromTo(subtitle, 
                { opacity: 0, y: 15 },
                { opacity: 1, y: 0, duration: 0.7 }
            );
        }
        if (heading) {
            tl.fromTo(heading, 
                { opacity: 0, y: 25 },
                { opacity: 1, y: 0, duration: 0.9 },
                '-=0.4'
            );
        }
    });

    // 2. Fade In Up items
    const fadeIns = document.querySelectorAll('.gsap-fade-in');
    fadeIns.forEach(el => {
        gsap.fromTo(el,
            { opacity: 0, y: 35 },
            {
                opacity: 1,
                y: 0,
                duration: 1.0,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });

    // 3. Staggered grid items
    const staggerGrids = document.querySelectorAll('.gsap-stagger-grid');
    staggerGrids.forEach(grid => {
        const items = grid.children;
        gsap.fromTo(items, 
            { opacity: 0, y: 40 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.12,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: grid,
                    start: 'top 82%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });
}

/**
 * Parallax effects for images wrapped inside .parallax-img-wrapper
 */
function initParallaxImages() {
    const parallaxContainers = document.querySelectorAll('.parallax-img-wrapper');
    
    parallaxContainers.forEach(container => {
        const img = container.querySelector('img');
        if (!img) return;
        
        // Boost image height slightly to prevent edge revealing during transformation
        gsap.set(img, { scale: 1.15 });
        
        gsap.to(img, {
            yPercent: 12,
            ease: 'none',
            scrollTrigger: {
                trigger: container,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });
    });
}

/**
 * Dynamic Vertical Timeline scroll drawing and item activation (About page)
 */
function initTimelineAnimations() {
    const activeLine = document.querySelector('.timeline-line-active');
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    if (activeLine && timelineItems.length > 0) {
        gsap.to(activeLine, {
            height: '100%',
            ease: 'none',
            scrollTrigger: {
                trigger: '.timeline-container',
                start: 'top 20%',
                end: 'bottom 80%',
                scrub: true
            }
        });
        
        timelineItems.forEach(item => {
            const dot = item.querySelector('.timeline-dot');
            const card = item.querySelector('.timeline-card');
            
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: item,
                    start: 'top 70%',
                    toggleActions: 'play none none reverse'
                }
            });
            
            if (dot) {
                tl.to(dot, { 
                    backgroundColor: '#C9A227', 
                    borderColor: '#C9A227', 
                    scale: 1.25, 
                    duration: 0.3
                });
            }
            if (card) {
                tl.fromTo(card, 
                    { opacity: 0, y: 30 }, 
                    { opacity: 1, y: 0, duration: 0.6 }, 
                    '-=0.1'
                );
            }
        });
    }
}

/**
 * Animated statistics counter count-up (About page)
 */
function initCounterAnimations() {
    const statCards = document.querySelector('.stats-grid');
    const statNumbers = document.querySelectorAll('.stat-number');
    
    if (statCards && statNumbers.length > 0) {
        statNumbers.forEach(stat => {
            const targetVal = parseFloat(stat.getAttribute('data-target'));
            const isDecimal = stat.getAttribute('data-decimal') === 'true';
            const suffix = stat.getAttribute('data-suffix') || '';
            
            const counter = { val: 0 };
            gsap.to(counter, {
                val: targetVal,
                duration: 2.2,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: statCards,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                onUpdate: () => {
                    if (isDecimal) {
                        stat.innerText = counter.val.toFixed(1) + suffix;
                    } else {
                        stat.innerText = Math.floor(counter.val) + suffix;
                    }
                }
            });
        });
    }
}

/**
 * Reservation Page Specific Animations
 * Form reveal, card staggers, and summary card animation
 */
function initReservationAnimations() {
    // Only run if on reservation page
    if (!document.querySelector('.reservation-form')) return;
    
    // Form sections stagger reveal
    const formSections = document.querySelectorAll('.form-section');
    if (formSections.length > 0) {
        gsap.fromTo(formSections,
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.reservation-form',
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                }
            }
        );
    }
    
    // Guest selector animation
    const guestSelector = document.querySelector('.guest-selector');
    if (guestSelector) {
        gsap.fromTo(guestSelector,
            { opacity: 0, scale: 0.9 },
            {
                opacity: 1,
                scale: 1,
                duration: 0.6,
                ease: 'back.out(1.7)',
                scrollTrigger: {
                    trigger: guestSelector,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            }
        );
    }
    
    // Time slots stagger
    const timeSlots = document.querySelectorAll('.time-slot');
    if (timeSlots.length > 0) {
        gsap.fromTo(timeSlots,
            { opacity: 0, y: 20 },
            {
                opacity: 1,
                y: 0,
                duration: 0.5,
                stagger: 0.05,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '.time-slots-grid',
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            }
        );
    }
    
    // Preference cards stagger
    const preferenceCards = document.querySelectorAll('.preference-card');
    if (preferenceCards.length > 0) {
        gsap.fromTo(preferenceCards,
            { opacity: 0, y: 25 },
            {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.08,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '.preference-cards-grid',
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            }
        );
    }
    
    // Occasion cards stagger
    const occasionCards = document.querySelectorAll('.occasion-card');
    if (occasionCards.length > 0) {
        gsap.fromTo(occasionCards,
            { opacity: 0, y: 25 },
            {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.08,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '.occasion-cards-grid',
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            }
        );
    }
    
    // Info cards stagger
    const infoCards = document.querySelectorAll('.info-card');
    if (infoCards.length > 0) {
        gsap.fromTo(infoCards,
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 0.7,
                stagger: 0.1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '.info-grid',
                    start: 'top 82%',
                    toggleActions: 'play none none none'
                }
            }
        );
    }
    
    // FAQ accordion items stagger
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length > 0) {
        gsap.fromTo(faqItems,
            { opacity: 0, x: -20 },
            {
                opacity: 1,
                x: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '.faq-accordion',
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            }
        );
    }
    
    // Reservation summary card entrance
    const summaryCard = document.querySelector('.reservation-summary');
    if (summaryCard) {
        gsap.fromTo(summaryCard,
            { opacity: 0, x: 50, y: 50 },
            {
                opacity: 1,
                x: 0,
                y: 0,
                duration: 0.8,
                delay: 1,
                ease: 'power3.out'
            }
        );
    }
}

/**
 * Gallery Page Specific Animations
 * Masonry items, filter buttons, and lightbox transitions
 */
function initGalleryAnimations() {
    // Only run if on gallery page
    if (!document.querySelector('.masonry-gallery')) return;
    
    // Category filter buttons stagger
    const filterBtns = document.querySelectorAll('.filter-btn');
    if (filterBtns.length > 0) {
        gsap.fromTo(filterBtns,
            { opacity: 0, y: 20 },
            {
                opacity: 1,
                y: 0,
                duration: 0.5,
                stagger: 0.08,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '.category-filter-wrapper',
                    start: 'top 90%',
                    toggleActions: 'play none none none'
                }
            }
        );
    }
    
    // Featured experience split animation
    const featuredSplit = document.querySelector('.featured-experience-split');
    if (featuredSplit) {
        gsap.fromTo('.featured-img-col',
            { opacity: 0, x: -50 },
            {
                opacity: 1,
                x: 0,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: featuredSplit,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                }
            }
        );
        
        gsap.fromTo('.featured-text-col',
            { opacity: 0, x: 50 },
            {
                opacity: 1,
                x: 0,
                duration: 0.8,
                delay: 0.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: featuredSplit,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                }
            }
        );
    }
    
    // Instagram showcase stagger
    const instaItems = document.querySelectorAll('.insta-showcase-item');
    if (instaItems.length > 0) {
        gsap.fromTo(instaItems,
            { opacity: 0, scale: 0.9 },
            {
                opacity: 1,
                scale: 1,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '.insta-showcase-grid',
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            }
        );
    }
    
    // Customer moments stagger
    const customerMoments = document.querySelectorAll('.customer-moment-card');
    if (customerMoments.length > 0) {
        gsap.fromTo(customerMoments,
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '.customer-moments-grid',
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            }
        );
    }
    
    // Awards gallery stagger
    const awardCards = document.querySelectorAll('.award-photo-card');
    if (awardCards.length > 0) {
        gsap.fromTo(awardCards,
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '.awards-gallery-grid',
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            }
        );
    }
}
