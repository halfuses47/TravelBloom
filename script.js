/**
 * TravelBloom Website Interactions & Search System
 */

// Recommendation Dataset (Beaches, Temples, Countries)
const destinations = [
    {
        id: "bora-bora",
        title: "Bora Bora Lagoon",
        location: "French Polynesia",
        category: "beach",
        image: "images/bora_bora.png",
        description: "Experience the ultimate tropical paradise with crystal-clear turquoise lagoons, serene overwater bungalows, and spectacular coral reefs filled with vibrant marine life.",
        link: "contact.html"
    },
    {
        id: "copacabana",
        title: "Copacabana Beach",
        location: "Rio de Janeiro, Brazil",
        category: "beach",
        image: "images/copacabana.png",
        description: "Feel the pulse of Brazil at this legendary crescent-shaped beach, renowned for its energetic vibe, golden sands, historic wavy mosaic boardwalk, and coastal views.",
        link: "contact.html"
    },
    {
        id: "angkor-wat",
        title: "Angkor Wat Temple",
        location: "Siem Reap, Cambodia",
        category: "temple",
        image: "images/angkor_wat.png",
        description: "Wander through the ancient spires of the world's largest religious monument. Watch the sunrise paint the stone architecture while reflecting beautifully on the lotus ponds.",
        link: "contact.html"
    },
    {
        id: "kinkaku-ji",
        title: "Kinkaku-ji (Golden Pavilion)",
        location: "Kyoto, Japan",
        category: "temple",
        image: "images/kinkaku_ji.png",
        description: "A breathtaking Zen Buddhist temple, completely covered in gold leaf, that sits elegantly above a serene reflecting mirror pond and is surrounded by meticulous classical gardens.",
        link: "contact.html"
    },
    {
        id: "japan-country",
        title: "Historic Pagodas & Mt. Fuji",
        location: "Japan",
        category: "country",
        image: "images/japan.png",
        description: "Explore the striking harmony of past and future, featuring majestic snow-capped Mount Fuji, traditional crimson pagodas, and delicate cherry blossoms in spring.",
        link: "contact.html"
    },
    {
        id: "switzerland-country",
        title: "Swiss Alps & Scenic Valleys",
        location: "Switzerland",
        category: "country",
        image: "images/switzerland.png",
        description: "Traverse high alpine passes by train, wander through meadows carpeted in wildflowers, and admire rustic wooden chalets set against towering, snow-crowned alpine peaks.",
        link: "contact.html"
    }
];

// DOM Elements
const recommendationsGrid = document.getElementById("recommendationsGrid");
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const clearButton = document.getElementById("clearButton");
const filterBanner = document.getElementById("filterBanner");
const filterText = document.getElementById("filterText");
const resultsTitle = document.getElementById("resultsTitle");
const navbar = document.getElementById("mainNavbar");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const navItems = document.querySelectorAll(".nav-item");
const contactForm = document.getElementById("contactForm");
const toast = document.getElementById("toast");

// Initialize Website
document.addEventListener("DOMContentLoaded", () => {
    highlightActiveNavLink();
    setupScrollEffects();
    setupMobileMenu();
    setupContactForm();
    
    // Check if on index page and render
    if (recommendationsGrid) {
        renderDestinations(destinations);
    }

    // Process search parameters from URL
    checkUrlSearchParams();
});

// Render cards dynamically (Only on Home Page)
function renderDestinations(data) {
    if (!recommendationsGrid) return;
    
    recommendationsGrid.innerHTML = "";
    
    if (data.length === 0) {
        recommendationsGrid.innerHTML = `
            <div class="no-results animate-fade-in">
                <i class="fa-regular fa-face-frown"></i>
                <h3>No Recommendations Found</h3>
                <p>We couldn't find matching places for your search. Try searching for <strong>"beach"</strong>, <strong>"temple"</strong>, or <strong>"country"</strong>!</p>
            </div>
        `;
        return;
    }

    data.forEach(dest => {
        const card = document.createElement("div");
        card.className = "rec-card";
        card.setAttribute("data-category", dest.category);
        
        card.innerHTML = `
            <div class="rec-image-container">
                <span class="rec-badge ${dest.category}">${dest.category}</span>
                <img src="${dest.image}" alt="${dest.title}" loading="lazy">
            </div>
            <div class="rec-content">
                <div class="rec-location">
                    <i class="fa-solid fa-location-dot"></i> ${dest.location}
                </div>
                <h3 class="rec-title">${dest.title}</h3>
                <p class="rec-description">${dest.description}</p>
                <div class="rec-footer">
                    <a href="${dest.link}" class="btn btn-primary btn-sm btn-block">Book Journey</a>
                </div>
            </div>
        `;
        recommendationsGrid.appendChild(card);
    });
}

// Search Form submit listener
if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        handleSearch();
    });
}

// Search Input key event
if (searchInput) {
    searchInput.addEventListener("input", () => {
        if (searchInput.value.trim() !== "") {
            clearButton.style.display = "block";
        } else {
            clearButton.style.display = "none";
        }
    });
}

// Clear Search button click
if (clearButton) {
    clearButton.addEventListener("click", () => {
        resetSearch();
    });
}

// Check search param on page load
function checkUrlSearchParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get("search");
    
    if (searchQuery && searchInput) {
        searchInput.value = searchQuery;
        if (clearButton) clearButton.style.display = "block";
        
        if (recommendationsGrid) {
            executeSearch(searchQuery);
            // Smooth scroll to recommendations section
            const recSection = document.getElementById("recommendations");
            if (recSection) {
                setTimeout(() => {
                    recSection.scrollIntoView({ behavior: "smooth" });
                }, 300);
            }
        }
    }
}

// Run the search query (Home Page only)
function executeSearch(query) {
    if (!recommendationsGrid) return;
    
    const cleanQuery = query.trim().toLowerCase();
    let filtered = [];

    // Specific category keywords mapping
    if (cleanQuery === "beach" || cleanQuery === "beaches") {
        filtered = destinations.filter(d => d.category === "beach");
    } else if (cleanQuery === "temple" || cleanQuery === "temples") {
        filtered = destinations.filter(d => d.category === "temple");
    } else if (cleanQuery === "country" || cleanQuery === "countries") {
        filtered = destinations.filter(d => d.category === "country");
    } else {
        // Fallback broad search
        filtered = destinations.filter(d => 
            d.title.toLowerCase().includes(cleanQuery) ||
            d.location.toLowerCase().includes(cleanQuery) ||
            d.description.toLowerCase().includes(cleanQuery) ||
            d.category.toLowerCase().includes(cleanQuery)
        );
    }

    // Update Filter UI elements
    if (filterText) filterText.textContent = query;
    if (filterBanner) filterBanner.classList.remove("hidden");
    if (resultsTitle) resultsTitle.textContent = `Search Results`;
    
    renderDestinations(filtered);
}

// Main handler for submitting searches
function handleSearch() {
    const query = searchInput.value.trim();
    
    if (query === "") {
        resetSearch();
        return;
    }

    // If we are NOT on index.html, redirect to index.html with the search query
    const isHomePage = window.location.pathname.endsWith("index.html") || 
                       window.location.pathname.endsWith("/") || 
                       window.location.pathname === "";
                       
    if (!isHomePage && !recommendationsGrid) {
        window.location.href = "index.html?search=" + encodeURIComponent(query);
    } else {
        executeSearch(query);
    }
}

// Quick Search from tags
function quickSearch(category) {
    if (searchInput) {
        searchInput.value = category;
        if (clearButton) clearButton.style.display = "block";
        handleSearch();
    }
}

// Reset search filter
function resetSearch() {
    if (searchInput) searchInput.value = "";
    if (clearButton) clearButton.style.display = "none";
    if (filterBanner) filterBanner.classList.add("hidden");
    if (resultsTitle) resultsTitle.textContent = "Featured Recommendations";
    
    if (recommendationsGrid) {
        // Clear query parameters in URL without page refresh
        const url = new URL(window.location);
        url.searchParams.delete('search');
        window.history.pushState({}, '', url);
        
        renderDestinations(destinations);
    }
}

// Highlight navbar links based on filename
function highlightActiveNavLink() {
    const path = window.location.pathname;
    const page = path.split("/").pop();
    
    navItems.forEach(item => {
        item.classList.remove("active");
        const href = item.getAttribute("href");
        
        if (page === href || (href === "index.html" && (page === "" || page === "index.html"))) {
            item.classList.add("active");
        }
    });
}

// Navbar scroll styles
function setupScrollEffects() {
    window.addEventListener("scroll", () => {
        // Only toggle transparent classes on the home page (where scroll begins at 0 header overlay)
        // Standalone inner pages are always 'scrolled' (solid background) to be legible.
        const isHomePage = window.location.pathname.endsWith("index.html") || 
                           window.location.pathname.endsWith("/") || 
                           window.location.pathname === "";
                           
        if (isHomePage) {
            if (window.scrollY > 50) {
                navbar.classList.add("scrolled");
            } else {
                navbar.classList.remove("scrolled");
            }
        }
    });
}

// Mobile Menu toggling
function setupMobileMenu() {
    if (!menuToggle || !navLinks) return;
    
    menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("open");
        const isOpen = navLinks.classList.contains("open");
        menuToggle.innerHTML = isOpen ? `<i class="fa-solid fa-xmark"></i>` : `<i class="fa-solid fa-bars"></i>`;
    });

    // Close mobile menu when a link is clicked
    navLinks.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("open");
            menuToggle.innerHTML = `<i class="fa-solid fa-bars"></i>`;
        });
    });
}

// Contact Form submission mockup
function setupContactForm() {
    if (!contactForm) return;
    
    contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const name = document.getElementById("formName").value.trim();
        const email = document.getElementById("formEmail").value.trim();
        const message = document.getElementById("formMessage").value.trim();
        
        if (name && email && message) {
            showToast(
                "Message Sent Successfully!", 
                `Thank you, ${name}. We've received your query and will reply to ${email} shortly.`
            );
            contactForm.reset();
        }
    });
}

// Toast notification handlers
function showToast(title, body) {
    if (!toast) return;
    
    document.getElementById("toastTitle").textContent = title;
    document.getElementById("toastBody").textContent = body;
    
    toast.classList.remove("hidden");
    setTimeout(() => {
        toast.classList.add("show");
    }, 50);

    // Auto close toast after 6 seconds
    window.toastTimeout = setTimeout(() => {
        closeToast();
    }, 6000);
}

function closeToast() {
    if (!toast) return;
    
    toast.classList.remove("show");
    setTimeout(() => {
        toast.classList.add("hidden");
    }, 400);
    if (window.toastTimeout) {
        clearTimeout(window.toastTimeout);
    }
}
