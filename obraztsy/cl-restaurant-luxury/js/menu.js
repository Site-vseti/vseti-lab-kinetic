/* ==========================================================================
   MENU.JS - Interactive Explorer (Filtered Grid, Favorites, Focus Trapped Lightbox)
   ========================================================================== */

// 1. Menu Dataset
const MENU_DATA = [
    {
        id: 1,
        title: "Imperial Osetra Caviar",
        category: "dinner",
        price: 140,
        calories: 220,
        prepTime: 10,
        rating: 5,
        reviews: 48,
        description: "Exquisite chilled Imperial Osetra Caviar served on mother-of-pearl spoons with warm house blinis, traditional accoutrements, and a glass of vintage Dom Pérignon.",
        ingredients: "Imperial Osetra Caviar, Organic egg whites, Chives, Red onion, Crème fraîche, Buckwheat blinis",
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
        tags: ["seafood", "bestseller", "seasonal"],
        spiceLevel: 0,
        chefRecommended: true,
        bestseller: true
    },
    {
        id: 2,
        title: "A5 Kagoshima Wagyu",
        category: "dinner",
        price: 180,
        calories: 720,
        prepTime: 25,
        rating: 5,
        reviews: 124,
        description: "Genuine Kagoshima A5 Wagyu beef sear-crusted to perfection, paired with absolute black winter truffles, roasted sunchoke purée, and a delicate veal bone jus reduction.",
        ingredients: "Kagoshima A5 Wagyu Beef, Black winter truffles, Sunchokes, Aged balsamic vinegar, Fresh microgreens",
        image: "../assets/images/dish_wagyu.jpg",
        tags: ["bestseller"],
        spiceLevel: 0,
        chefRecommended: true,
        bestseller: true
    },
    {
        id: 3,
        title: "White Truffle Tagliolini",
        category: "dinner",
        price: 95,
        calories: 580,
        prepTime: 15,
        rating: 4.9,
        reviews: 96,
        description: "House-rolled organic egg pasta tossed in a luxurious alpine butter emulsion and finished with fresh, hand-shaved white Alba truffles.",
        ingredients: "Semolina egg pasta, Alpine grass-fed butter, Shaved white Alba truffles, 36-month Parmigiano-Reggiano",
        image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80",
        tags: ["vegetarian"],
        spiceLevel: 0,
        chefRecommended: true,
        bestseller: false
    },
    {
        id: 4,
        title: "Grand Marnier Soufflé",
        category: "desserts",
        price: 32,
        calories: 450,
        prepTime: 20,
        rating: 4.8,
        reviews: 62,
        description: "Light, airy traditional French soufflé flavored with Grand Marnier liqueur, served warm with rich Madagascar vanilla bean crème anglaise.",
        ingredients: "Free-range egg whites, Grand Marnier liqueur, Organic cane sugar, Madagascar vanilla bean pod, Citrus zest",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",
        tags: ["vegetarian", "bestseller"],
        spiceLevel: 0,
        chefRecommended: false,
        bestseller: true
    },
    {
        id: 5,
        title: "Brittany Blue Lobster",
        category: "lunch",
        price: 145,
        calories: 510,
        prepTime: 18,
        rating: 5,
        reviews: 32,
        description: "Butter-poached blue lobster claw served with compressed honeydew melon, wild sea beans, and an aromatic lemon verbena emulsion.",
        ingredients: "Brittany blue lobster, Salted butter, Honeydew melon, Sea beans, Lemon verbena, Micro herbs",
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
        tags: ["seafood", "seasonal", "new"],
        spiceLevel: 0,
        chefRecommended: true,
        bestseller: false
    },
    {
        id: 6,
        title: "Avocado Toast Royale",
        category: "breakfast",
        price: 42,
        calories: 410,
        prepTime: 12,
        rating: 4.7,
        reviews: 81,
        description: "Toasted house-made artisanal sourdough bread topped with crushed Hass avocado, Scottish smoked salmon, organic poached egg, and gold leaf.",
        ingredients: "Artisanal sourdough, Hass avocados, Scottish smoked salmon, Free-range egg, Edible gold flakes",
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
        tags: ["seafood", "bestseller"],
        spiceLevel: 0,
        chefRecommended: false,
        bestseller: true
    },
    {
        id: 7,
        title: "Truffle Burrata Salad",
        category: "breakfast",
        price: 38,
        calories: 390,
        prepTime: 8,
        rating: 4.8,
        reviews: 55,
        description: "Creamy Italian burrata cheese served with heirloom cherry tomatoes, fresh arugula, cold-pressed olive oil, and shaved black winter truffles.",
        ingredients: "Puglian burrata, Heirloom tomatoes, Wild arugula, Shaved truffles, 25-year-old aged balsamic, Virgin olive oil",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
        tags: ["vegetarian", "gluten-free"],
        spiceLevel: 0,
        chefRecommended: false,
        bestseller: false
    },
    {
        id: 8,
        title: "Organic Wild Mushroom Medley",
        category: "lunch",
        price: 45,
        calories: 310,
        prepTime: 15,
        rating: 4.6,
        reviews: 41,
        description: "Pan-roasted local organic wild mushrooms tossed with red quinoa, roasted baby root vegetables, and a vegan herbal green goddess dressing.",
        ingredients: "Chanterelle and Oyster mushrooms, Organic quinoa, Parsnips, Baby carrots, Fresh herbs, Cashew emulsion",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
        tags: ["vegetarian", "vegan", "gluten-free"],
        spiceLevel: 1,
        chefRecommended: false,
        bestseller: false
    },
    {
        id: 9,
        title: "Golden Saffron Risotto",
        category: "dinner",
        price: 65,
        calories: 610,
        prepTime: 22,
        rating: 4.9,
        reviews: 67,
        description: "Creamy Acquerello Carnaroli rice cooked with Spanish saffron filaments, organic vegetable stock, and 24k gold leaf embellishment.",
        ingredients: "Acquerello rice, Spanish saffron, Shallots, White wine, Butter, Parmigiano-Reggiano, 24k gold leaf",
        image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80",
        tags: ["vegetarian", "gluten-free", "new"],
        spiceLevel: 0,
        chefRecommended: true,
        bestseller: false
    },
    {
        id: 10,
        title: "Golden Opulence Mousse",
        category: "desserts",
        price: 50,
        calories: 520,
        prepTime: 15,
        rating: 5,
        reviews: 29,
        description: "Decadent dark chocolate mousse made with premium Valrhona chocolate, layered with salted caramel sauce, hazelnut praline, and gold dust.",
        ingredients: "Valrhona chocolate, Organic cream, Sea-salted caramel, Hazelnut paste, Praline crunch, Gold dust",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",
        tags: ["vegetarian", "new"],
        spiceLevel: 0,
        chefRecommended: false,
        bestseller: false
    },
    {
        id: 11,
        title: "Dom Pérignon Vintage Glass",
        category: "wine",
        price: 120,
        calories: 130,
        prepTime: 2,
        rating: 5,
        reviews: 93,
        description: "A prestigious glass of vintage Dom Pérignon Champagne. Crisp, elegant, and bubbling with subtle notes of toasted brioche and white flowers.",
        ingredients: "Vintage Champagne, Dom Pérignon curation",
        image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80",
        tags: ["vegan", "gluten-free", "bestseller"],
        spiceLevel: 0,
        chefRecommended: false,
        bestseller: true
    },
    {
        id: 12,
        title: "Chateau Margaux Glass",
        category: "wine",
        price: 150,
        calories: 140,
        prepTime: 2,
        rating: 4.9,
        reviews: 58,
        description: "A fine glass of 2015 Chateau Margaux Red Bordeaux. Deep, full-bodied, carrying complex dark fruit aromas and soft tannins.",
        ingredients: "Fine French Cabernet Sauvignon blend",
        image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80",
        tags: ["vegan", "gluten-free"],
        spiceLevel: 0,
        chefRecommended: true,
        bestseller: false
    },
    {
        id: 13,
        title: "Hibiscus Lavender Mocktail",
        category: "drinks",
        price: 22,
        calories: 90,
        prepTime: 5,
        rating: 4.6,
        reviews: 37,
        description: "Refreshing, cold-infused organic hibiscus flower tea blended with fresh lavender nectar, fresh lime juice, and botanical soda water.",
        ingredients: "Organic hibiscus flowers, Culinary lavender, Organic honey, Lime juice, Club soda",
        image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80",
        tags: ["vegetarian", "vegan", "gluten-free"],
        spiceLevel: 0,
        chefRecommended: false,
        bestseller: false
    },
    {
        id: 14,
        title: "Smoked Bourbon Old Fashioned",
        category: "drinks",
        price: 28,
        calories: 160,
        prepTime: 4,
        rating: 4.9,
        reviews: 79,
        description: "Kentucky single-barrel bourbon stirred with bitters and syrup, smoked with organic hickory wood chips inside an elegant glass cloche.",
        ingredients: "Single-barrel bourbon, Angostura bitters, Demerara sugar syrup, Hickory wood smoke, Orange peel twist",
        image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80",
        tags: ["bestseller"],
        spiceLevel: 0,
        chefRecommended: false,
        bestseller: true
    },
    {
        id: 15,
        title: "Hokkaido Sea Scallops",
        category: "dinner",
        price: 88,
        calories: 420,
        prepTime: 18,
        rating: 4.9,
        reviews: 64,
        description: "Sautéed premium Hokkaido sea scallops served over creamed sweet corn, parsnip crisps, and finished with a hot chili herb oil swirl.",
        ingredients: "Hokkaido scallops, Sweet organic corn, Cream, Parsnips, Chili infusion, Fresh coriander leaves",
        image: "https://images.unsplash.com/photo-1534080564583-6be75777b70a?auto=format&fit=crop&w=800&q=80",
        tags: ["seafood", "gluten-free"],
        spiceLevel: 2,
        chefRecommended: true,
        bestseller: false
    }
];

// 2. State Variables
let currentCategory = "all";
let searchQuery = "";
let activeFilters = [];
let currentSort = "recommended";
let favoriteDishes = localStorage.getItem("etoile_favorites") 
    ? JSON.parse(localStorage.getItem("etoile_favorites")) 
    : [];

let filteredDishesList = [...MENU_DATA];
let currentLightboxIndex = 0;
let lastFocusedElement = null; // Store focus for accessibility trap restore

// 3. Main Init on DOM Load
document.addEventListener('DOMContentLoaded', () => {
    // Initial Render
    renderMenuGrid();
    
    // Setup Controls Event Handlers
    initCategorySelection();
    initSearchInput();
    initFilterChips();
    initSorting();
    initGridInteractionDelegation();
    initLightboxController();
});

/**
 * Renders the filtered, searched, and sorted dishes to the cards grid.
 */
function renderMenuGrid() {
    const grid = document.getElementById('menu-grid');
    const emptyMsg = document.getElementById('empty-results');
    if (!grid) return;
    
    // Apply filters & search to dataset
    filteredDishesList = MENU_DATA.filter(dish => {
        // Category Filter
        const matchesCategory = currentCategory === "all" || 
                                dish.category === currentCategory || 
                                (currentCategory === "vegetarian" && dish.tags.includes("vegetarian")) ||
                                (currentCategory === "seafood" && dish.tags.includes("seafood"));
                                
        // Search query filter (checks title, description, and ingredients)
        const matchesSearch = searchQuery === "" || 
                              dish.title.toLowerCase().includes(searchQuery) ||
                              dish.description.toLowerCase().includes(searchQuery) ||
                              dish.ingredients.toLowerCase().includes(searchQuery) ||
                              dish.category.toLowerCase().includes(searchQuery);
                              
        // Advanced Filter Chips (must match ALL checked chips)
        const matchesChips = activeFilters.every(filter => {
            if (filter === "vegetarian") return dish.tags.includes("vegetarian");
            if (filter === "vegan") return dish.tags.includes("vegan");
            if (filter === "gluten-free") return dish.tags.includes("gluten-free");
            if (filter === "seafood") return dish.tags.includes("seafood");
            if (filter === "spicy") return dish.spiceLevel > 0;
            if (filter === "bestseller") return dish.bestseller;
            if (filter === "new") return dish.tags.includes("new");
            if (filter === "seasonal") return dish.tags.includes("seasonal");
            return true;
        });
        
        return matchesCategory && matchesSearch && matchesChips;
    });
    
    // Sort dataset
    sortDishes();
    
    // Remove existing cards
    const cards = grid.querySelectorAll('.menu-card');
    cards.forEach(card => card.remove());
    
    // Display "No dishes found" message if list is empty
    if (filteredDishesList.length === 0) {
        emptyMsg.style.display = "block";
        return;
    } else {
        emptyMsg.style.display = "none";
    }
    
    // Generate HTML for cards
    filteredDishesList.forEach(dish => {
        const isFavorite = favoriteDishes.includes(dish.id);
        const card = document.createElement('div');
        card.className = "menu-card gold-glow-hover";
        card.setAttribute('data-id', dish.id);
        
        // Badges
        let badgeHtml = '';
        if (dish.chefRecommended) {
            badgeHtml = `<span class="card-badge">Chef Choice</span>`;
        } else if (dish.tags.includes('new')) {
            badgeHtml = `<span class="card-badge badge-new">New</span>`;
        } else if (dish.bestseller) {
            badgeHtml = `<span class="card-badge">Bestseller</span>`;
        }
        
        // Spice indicator
        let spiceHtml = '';
        if (dish.spiceLevel > 0) {
            spiceHtml = `<span class="card-meta-item"><i class="fa-solid fa-pepper-hot" style="color: var(--accent-red);"></i>Spice ${dish.spiceLevel}</span>`;
        }
        
        // Star ratings
        let starHtml = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= Math.floor(dish.rating)) {
                starHtml += `<i class="fa-solid fa-star" aria-hidden="true"></i>`;
            } else if (i - 0.5 <= dish.rating) {
                starHtml += `<i class="fa-solid fa-star-half-stroke" aria-hidden="true"></i>`;
            } else {
                starHtml += `<i class="fa-regular fa-star" aria-hidden="true"></i>`;
            }
        }
        
        card.innerHTML = `
            ${badgeHtml}
            <button class="card-favorite-btn ${isFavorite ? 'active' : ''}" aria-label="Add ${dish.title} to Favorites" aria-pressed="${isFavorite}">
                <i class="fa-solid fa-heart" aria-hidden="true"></i>
            </button>
            <div class="menu-card-img-wrapper" tabindex="0" role="button" aria-label="View details of ${dish.title}">
                <img class="shimmer-placeholder" src="${dish.image}" alt="${dish.title}" loading="lazy">
            </div>
            <div class="menu-card-info">
                <div class="card-header-row">
                    <h3 class="card-title">${dish.title}</h3>
                    <span class="card-price font-numbers">$${dish.price}</span>
                </div>
                <p class="card-description">${dish.description}</p>
                
                <div style="display: flex; align-items: center; margin-bottom: 1.2rem;">
                    <div class="rating-stars" aria-label="Rating: ${dish.rating} out of 5 stars">${starHtml}</div>
                    <span style="font-size: 0.75rem; color: var(--text-muted);">(${dish.reviews} reviews)</span>
                </div>
                
                <div class="card-meta-row">
                    <span class="card-meta-item"><i class="fa-regular fa-clock" aria-hidden="true"></i>${dish.prepTime} Mins</span>
                    <span class="card-meta-item"><i class="fa-solid fa-fire" aria-hidden="true"></i>${dish.calories} Kcal</span>
                    ${spiceHtml}
                </div>
            </div>
        `;
        
        grid.appendChild(card);
    });
    
    // GSAP staggered cards entry animation
    if (typeof gsap !== 'undefined') {
        gsap.fromTo(grid.querySelectorAll('.menu-card'), 
            { opacity: 0, y: 30 },
            { 
                opacity: 1, 
                y: 0, 
                duration: 0.6, 
                stagger: 0.08, 
                ease: "power2.out",
                overwrite: "auto"
            }
        );
    }
}

/**
 * Sorts the filtered array in place
 */
function sortDishes() {
    switch (currentSort) {
        case "price-asc":
            filteredDishesList.sort((a, b) => a.price - b.price);
            break;
        case "price-desc":
            filteredDishesList.sort((a, b) => b.price - a.price);
            break;
        case "calories":
            filteredDishesList.sort((a, b) => a.calories - b.calories);
            break;
        case "prep-time":
            filteredDishesList.sort((a, b) => a.prepTime - b.prepTime);
            break;
        case "popularity":
            filteredDishesList.sort((a, b) => b.reviews - a.reviews);
            break;
        case "recommended":
        default:
            filteredDishesList.sort((a, b) => {
                if (a.chefRecommended && !b.chefRecommended) return -1;
                if (!a.chefRecommended && b.chefRecommended) return 1;
                return b.rating - a.rating;
            });
            break;
    }
}

/**
 * Event Delegation for dynamic grid (Removes inline onclick callbacks)
 */
function initGridInteractionDelegation() {
    const grid = document.getElementById('menu-grid');
    if (!grid) return;
    
    grid.addEventListener('click', (e) => {
        const card = e.target.closest('.menu-card');
        if (!card) return;
        const id = parseInt(card.getAttribute('data-id'), 10);
        
        // 1. Favorite Heart Button Click
        const favBtn = e.target.closest('.card-favorite-btn');
        if (favBtn) {
            e.stopPropagation();
            toggleFavoriteDish(id, favBtn);
            return;
        }
        
        // 2. Card Details / Lightbox Trigger
        const imgWrapper = e.target.closest('.menu-card-img-wrapper');
        const titleText = e.target.closest('.card-title');
        if (imgWrapper || titleText) {
            lastFocusedElement = imgWrapper || card.querySelector('.menu-card-img-wrapper') || e.target;
            triggerLightbox(id);
        }
    });

    // Support keyboard Enter key for image card details trigger
    grid.addEventListener('keydown', (e) => {
        const imgWrapper = e.target.closest('.menu-card-img-wrapper');
        if (imgWrapper && e.key === "Enter") {
            const card = imgWrapper.closest('.menu-card');
            const id = parseInt(card.getAttribute('data-id'), 10);
            lastFocusedElement = imgWrapper;
            triggerLightbox(id);
        }
    });
}

/**
 * Toggles favorites and updates localStorage
 */
function toggleFavoriteDish(id, button) {
    const index = favoriteDishes.indexOf(id);
    const isActive = index === -1;
    
    if (isActive) {
        favoriteDishes.push(id);
        button.classList.add('active');
        button.setAttribute('aria-pressed', 'true');
        button.classList.add('heart-pulse');
        setTimeout(() => button.classList.remove('heart-pulse'), 400);
    } else {
        favoriteDishes.splice(index, 1);
        button.classList.remove('active');
        button.setAttribute('aria-pressed', 'false');
    }
    
    localStorage.setItem("etoile_favorites", JSON.stringify(favoriteDishes));
}

/**
 * Binds categories select actions
 */
function initCategorySelection() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            categoryBtns.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            const clicked = e.currentTarget;
            clicked.classList.add('active');
            clicked.setAttribute('aria-selected', 'true');
            
            currentCategory = clicked.getAttribute('data-category');
            renderMenuGrid();
        });
    });
}

/**
 * Binds real-time search input box
 */
function initSearchInput() {
    const searchInput = document.getElementById('menu-search-input');
    const clearBtn = document.getElementById('clear-search-btn');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        clearBtn.style.display = searchQuery !== "" ? "block" : "none";
        renderMenuGrid();
    });
    
    clearBtn.addEventListener('click', () => {
        searchInput.value = "";
        searchQuery = "";
        clearBtn.style.display = "none";
        renderMenuGrid();
        searchInput.focus();
    });
}

/**
 * Configures filter chips selection toggles
 */
function initFilterChips() {
    const chips = document.querySelectorAll('.filter-chip');
    chips.forEach(chip => {
        chip.addEventListener('click', (e) => {
            const filterValue = e.currentTarget.getAttribute('data-filter');
            const isActive = e.currentTarget.classList.toggle('active');
            e.currentTarget.setAttribute('aria-pressed', isActive ? 'true' : 'false');
            
            if (isActive) {
                activeFilters.push(filterValue);
            } else {
                activeFilters = activeFilters.filter(f => f !== filterValue);
            }
            
            renderMenuGrid();
        });
    });
}

/**
 * Sorting drop-down change listener
 */
function initSorting() {
    const sortSelect = document.getElementById('menu-sort-select');
    if (!sortSelect) return;
    
    sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        renderMenuGrid();
    });
}

/**
 * Handles Lightbox dialog focus constraints and key captures
 */
function initLightboxController() {
    const lightbox = document.getElementById('menu-lightbox');
    const closeBtn = document.getElementById('lightbox-close-btn');
    const prevBtn = document.getElementById('lightbox-prev-btn');
    const nextBtn = document.getElementById('lightbox-next-btn');
    
    if (!lightbox) return;
    
    closeBtn.addEventListener('click', closeLightbox);
    
    // Close on background touch/click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    
    prevBtn.addEventListener('click', () => navigateLightbox(-1));
    nextBtn.addEventListener('click', () => navigateLightbox(1));
    
    // Keyboard navigation and Focus Trap listener
    window.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('open')) return;
        
        // Escape to close
        if (e.key === "Escape") {
            closeLightbox();
            return;
        }
        // Arrows
        if (e.key === "ArrowLeft") {
            navigateLightbox(-1);
            return;
        }
        if (e.key === "ArrowRight") {
            navigateLightbox(1);
            return;
        }
        
        // Focus Trap Logic
        if (e.key === "Tab") {
            const focusables = lightbox.querySelectorAll('button, [tabindex="0"]');
            const firstElement = focusables[0];
            const lastElement = focusables[focusables.length - 1];
            
            if (e.shiftKey) { // Back tab
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else { // Normal tab
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        }
    });
}

/**
 * Displays lightbox details based on selection index
 */
function triggerLightbox(id) {
    const index = filteredDishesList.findIndex(d => d.id === id);
    if (index === -1) return;
    
    currentLightboxIndex = index;
    updateLightboxContent();
    
    const lightbox = document.getElementById('menu-lightbox');
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    
    // Freeze scroll
    if (window.lenis) window.lenis.stop();
    
    // Focus first element inside the lightbox for accessibility
    setTimeout(() => {
        const closeBtn = document.getElementById('lightbox-close-btn');
        if (closeBtn) closeBtn.focus();
    }, 100);
}

function closeLightbox() {
    const lightbox = document.getElementById('menu-lightbox');
    if (!lightbox) return;
    
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    
    // Unfreeze scroll
    if (window.lenis) window.lenis.start();
    
    // Restore focus to calling element
    if (lastFocusedElement) {
        lastFocusedElement.focus();
    }
}

function navigateLightbox(direction) {
    let nextIndex = currentLightboxIndex + direction;
    if (nextIndex < 0) nextIndex = filteredDishesList.length - 1;
    if (nextIndex >= filteredDishesList.length) nextIndex = 0;
    
    currentLightboxIndex = nextIndex;
    updateLightboxContent();
}

function updateLightboxContent() {
    const dish = filteredDishesList[currentLightboxIndex];
    if (!dish) return;
    
    document.getElementById('lightbox-img').src = dish.image;
    document.getElementById('lightbox-img').alt = dish.title;
    document.getElementById('lightbox-category').innerText = dish.category;
    document.getElementById('lightbox-title').innerText = dish.title;
    document.getElementById('lightbox-price').innerText = `$${dish.price}`;
    document.getElementById('lightbox-description').innerText = dish.description;
    document.getElementById('lightbox-ingredients').innerText = dish.ingredients;
    document.getElementById('lightbox-time').innerText = `${dish.prepTime} Mins`;
    document.getElementById('lightbox-calories').innerText = `${dish.calories} Kcal`;
    document.getElementById('lightbox-reviews').innerText = `(${dish.reviews} critical reviews)`;
    
    // Rating star layout
    const starBox = document.getElementById('lightbox-stars');
    let starHtml = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(dish.rating)) {
            starHtml += `<i class="fa-solid fa-star" aria-hidden="true"></i>`;
        } else if (i - 0.5 <= dish.rating) {
            starHtml += `<i class="fa-solid fa-star-half-stroke" aria-hidden="true"></i>`;
        } else {
            starHtml += `<i class="fa-regular fa-star" aria-hidden="true"></i>`;
        }
    }
    starBox.innerHTML = starHtml;
    starBox.setAttribute('aria-label', `Rating: ${dish.rating} out of 5 stars`);
}
