/* ==========================================================================
   GALLERY.JS - Premium Gallery Filtering & Lightbox Functionality
   ========================================================================== */

// Gallery Data - 30+ items across categories
const galleryData = [
    // Signature Dishes
    { id: 1, category: 'signature', title: 'Wagyu Beef Tartare', description: 'Premium wagyu with quail egg and truffle oil', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80' },
    { id: 2, category: 'signature', title: 'Lobster Thermidor', description: 'Maine lobster with cognac cream sauce', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80' },
    { id: 3, category: 'signature', title: 'Seared Foie Gras', description: 'Pan-seared foie gras with fig compote', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80' },
    { id: 4, category: 'signature', title: 'Truffle Risotto', description: 'Arborio rice with black truffle and parmesan', image: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?auto=format&fit=crop&w=800&q=80' },
    { id: 5, category: 'signature', title: 'Duck Confit', description: 'Slow-cooked duck leg with orange glaze', image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80' },
    
    // Fine Dining
    { id: 6, category: 'dining', title: 'Elegant Table Setting', description: 'Impeccable presentation for fine dining', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80' },
    { id: 7, category: 'dining', title: 'Wine Service', description: 'Expert sommelier service at your table', image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80' },
    { id: 8, category: 'dining', title: 'Course Presentation', description: 'Artistic plating of signature dishes', image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80' },
    { id: 9, category: 'dining', title: 'Private Dining', description: 'Exclusive private dining experience', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80' },
    { id: 10, category: 'dining', title: 'Chef\'s Table', description: 'Intimate dining experience with the chef', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80' },
    
    // Interior
    { id: 11, category: 'interior', title: 'Main Dining Hall', description: 'Elegant main dining area with chandeliers', image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80' },
    { id: 12, category: 'interior', title: 'Bar Lounge', description: 'Sophisticated bar area for cocktails', image: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=800&q=80' },
    { id: 13, category: 'interior', title: 'Private Room', description: 'Intimate private dining space', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80' },
    { id: 14, category: 'interior', title: 'Terrace Garden', description: 'Outdoor dining with garden views', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80' },
    { id: 15, category: 'interior', title: 'Wine Cellar', description: 'Extensive wine collection display', image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80' },
    
    // Kitchen
    { id: 16, category: 'kitchen', title: 'Chef at Work', description: 'Executive Chef preparing signature dishes', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80' },
    { id: 17, category: 'kitchen', title: 'Kitchen Team', description: 'Dedicated culinary team in action', image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80' },
    { id: 18, category: 'kitchen', title: 'Plating Station', description: 'Meticulous plating of each course', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80' },
    { id: 19, category: 'kitchen', title: 'Fresh Ingredients', description: 'Premium ingredients ready for preparation', image: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?auto=format&fit=crop&w=800&q=80' },
    { id: 20, category: 'kitchen', title: 'Sauce Station', description: 'Crafting signature sauces with precision', image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80' },
    
    // Desserts
    { id: 21, category: 'desserts', title: 'Chocolate Soufflé', description: 'Light and airy chocolate soufflé', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80' },
    { id: 22, category: 'desserts', title: 'Crème Brûlée', description: 'Classic French dessert with caramelized top', image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80' },
    { id: 23, category: 'desserts', title: 'Tasting Platter', description: 'Assortment of artisanal desserts', image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80' },
    { id: 24, category: 'desserts', title: 'Fruit Tart', description: 'Seasonal fruit tart with pastry cream', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80' },
    { id: 25, category: 'desserts', title: 'Ice Cream Sculpture', description: 'Artisanal ice cream presentation', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80' },
    
    // Drinks
    { id: 26, category: 'drinks', title: 'Signature Cocktail', description: 'House specialty cocktail creation', image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80' },
    { id: 27, category: 'drinks', title: 'Wine Pairing', description: 'Perfect wine for each course', image: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=800&q=80' },
    { id: 28, category: 'drinks', title: 'Champagne Toast', description: 'Celebratory champagne service', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80' },
    { id: 29, category: 'drinks', title: 'Whisky Selection', description: 'Premium whisky collection', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80' },
    { id: 30, category: 'drinks', title: 'Coffee Service', description: 'Artisanal coffee presentation', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80' },
    
    // Events
    { id: 31, category: 'events', title: 'Wedding Reception', description: 'Elegant wedding celebration', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80' },
    { id: 32, category: 'events', title: 'Corporate Event', description: 'Professional corporate gathering', image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80' },
    { id: 33, category: 'events', title: 'Anniversary Party', description: 'Special anniversary celebration', image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80' },
    { id: 34, category: 'events', title: 'Chef\'s Table Event', description: 'Exclusive dining event', image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80' },
    { id: 35, category: 'events', title: 'Wine Tasting', description: 'Curated wine tasting experience', image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80' }
];

let currentFilter = 'all';
let currentIndex = 0;
let filteredItems = [];

document.addEventListener('DOMContentLoaded', () => {
    initMasonryGallery();
    initCategoryFilter();
    initLightbox();
});

// Initialize Masonry Gallery
function initMasonryGallery() {
    const gallery = document.getElementById('masonry-gallery');
    filteredItems = [...galleryData];
    renderGallery(filteredItems);
}

function renderGallery(items) {
    const gallery = document.getElementById('masonry-gallery');
    gallery.innerHTML = '';
    
    items.forEach((item, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'masonry-item';
        galleryItem.setAttribute('data-category', item.category);
        galleryItem.setAttribute('data-index', index);
        
        galleryItem.innerHTML = `
            <div class="masonry-item-inner">
                <img src="${item.image}" alt="${item.title}" loading="lazy">
                <div class="masonry-overlay">
                    <span class="category-badge">${formatCategory(item.category)}</span>
                    <h4>${item.title}</h4>
                    <button class="view-btn" aria-label="View ${item.title}">
                        <i class="fa-solid fa-expand"></i>
                    </button>
                </div>
            </div>
        `;
        
        galleryItem.addEventListener('click', () => openLightbox(index));
        gallery.appendChild(galleryItem);
    });
    
    // Trigger GSAP animation for new items
    if (typeof gsap !== 'undefined') {
        gsap.fromTo('.masonry-item',
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.05,
                ease: 'power2.out'
            }
        );
    }
}

// Category Filter
function initCategoryFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter gallery
            const filter = btn.getAttribute('data-filter');
            currentFilter = filter;
            
            if (filter === 'all') {
                filteredItems = [...galleryData];
            } else {
                filteredItems = galleryData.filter(item => item.category === filter);
            }
            
            renderGallery(filteredItems);
        });
    });
}

// Lightbox Functionality
function initLightbox() {
    const lightbox = document.getElementById('gallery-lightbox');
    const closeBtn = document.getElementById('lightbox-close-btn');
    const prevBtn = document.getElementById('lightbox-prev-btn');
    const nextBtn = document.getElementById('lightbox-next-btn');
    
    closeBtn.addEventListener('click', closeLightbox);
    
    prevBtn.addEventListener('click', () => navigateLightbox(-1));
    nextBtn.addEventListener('click', () => navigateLightbox(1));
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    
    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('open')) return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
    });
}

function openLightbox(index) {
    const lightbox = document.getElementById('gallery-lightbox');
    const item = filteredItems[index];
    currentIndex = index;
    
    // Update lightbox content
    document.getElementById('lightbox-img').src = item.image;
    document.getElementById('lightbox-img').alt = item.title;
    document.getElementById('lightbox-category').textContent = formatCategory(item.category);
    document.getElementById('lightbox-title').textContent = item.title;
    document.getElementById('lightbox-description').textContent = item.description;
    
    // Show lightbox
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    
    // Stop Lenis scroll
    if (window.lenis) window.lenis.stop();
    
    // Focus close button
    document.getElementById('lightbox-close-btn').focus();
}

function closeLightbox() {
    const lightbox = document.getElementById('gallery-lightbox');
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    
    // Resume Lenis scroll
    if (window.lenis) window.lenis.start();
}

function navigateLightbox(direction) {
    currentIndex += direction;
    
    // Wrap around
    if (currentIndex < 0) currentIndex = filteredItems.length - 1;
    if (currentIndex >= filteredItems.length) currentIndex = 0;
    
    const item = filteredItems[currentIndex];
    
    // Animate transition
    const img = document.getElementById('lightbox-img');
    
    if (typeof gsap !== 'undefined') {
        gsap.to(img, {
            opacity: 0,
            duration: 0.2,
            onComplete: () => {
                img.src = item.image;
                img.alt = item.title;
                document.getElementById('lightbox-category').textContent = formatCategory(item.category);
                document.getElementById('lightbox-title').textContent = item.title;
                document.getElementById('lightbox-description').textContent = item.description;
                
                gsap.to(img, { opacity: 1, duration: 0.2 });
            }
        });
    } else {
        img.src = item.image;
        img.alt = item.title;
        document.getElementById('lightbox-category').textContent = formatCategory(item.category);
        document.getElementById('lightbox-title').textContent = item.title;
        document.getElementById('lightbox-description').textContent = item.description;
    }
}

function formatCategory(category) {
    const categoryNames = {
        'signature': 'Signature Dish',
        'dining': 'Fine Dining',
        'interior': 'Interior',
        'kitchen': 'Kitchen',
        'desserts': 'Desserts',
        'drinks': 'Drinks',
        'events': 'Events'
    };
    return categoryNames[category] || category;
}
