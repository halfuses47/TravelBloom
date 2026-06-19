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
        link: "#contact"
    },
    {
        id: "copacabana",
        title: "Copacabana Beach",
        location: "Rio de Janeiro, Brazil",
        category: "beach",
        image: "images/copacabana.png",
        description: "Feel the pulse of Brazil at this legendary crescent-shaped beach, renowned for its energetic vibe, golden sands, historic wavy mosaic boardwalk, and coastal views.",
        link: "#contact"
    },
    {
        id: "angkor-wat",
        title: "Angkor Wat Temple",
        location: "Siem Reap, Cambodia",
        category: "temple",
        image: "images/angkor_wat.png",
        description: "Wander through the ancient spires of the world's largest religious monument. Watch the sunrise paint the stone architecture while reflecting beautifully on the lotus ponds.",
        link: "#contact"
    },
    {
        id: "kinkaku-ji",
        title: "Kinkaku-ji (Golden Pavilion)",
        location: "Kyoto, Japan",
        category: "temple",
        image: "images/kinkaku_ji.png",
        description: "A breathtaking Zen Buddhist temple, completely covered in gold leaf, that sits elegantly above a serene reflecting mirror pond and is surrounded by meticulous classical gardens.",
        link: "#contact"
    },
    {
        id: "japan-country",
        title: "Historic Pagodas & Mt. Fuji",
        location: "Japan",
        category: "country",
        image: "images/japan.png",
        description: "Explore the striking harmony of past and future, featuring majestic snow-capped Mount Fuji, traditional crimson pagodas, and delicate cherry blossoms in spring.",
        link: "#contact"
    },
    {
        id: "switzerland-country",
        title: "Swiss Alps & Scenic Valleys",
        location: "Switzerland",
        category: "country",
        image: "images/switzerland.png",
        description: "Traverse high alpine passes by train, wander through meadows carpeted in wildflowers, and admire rustic wooden chalets set against towering, snow-crowned alpine peaks.",
        link: "#contact"
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
    renderDestinations(destinations);
    setupScrollEffects();
    setupMobileMenu();
    setupContactForm();
});

// Render cards dynamically
function renderDestinations(data) {
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

// Search Logic
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    handleSearch();
});

searchInput.addEventListener("input", () => {
    if (searchInput.value.trim() !== "") {
        clearButton.style.display = "block";
    } else {
        clearButton.style.display = "none";
    }
});

clearButton.addEventListener("click", () => {
    resetSearch();
});

function handleSearch() {
    const query = searchInput.value.trim().toLowerCase();
    
    if (query === "") {
        resetSearch();
        return;
    }

    let filtered = [];

    // Specific category handling
    if (query === "beach" || query === "beaches") {
        filtered = destinations.filter(d => d.category === "beach");
    } else if (query === "temple" || query === "temples") {
        filtered = destinations.filter(d => d.category === "temple");
    } else if (query === "country" || query === "countries") {
        filtered = destinations.filter(d => d.category === "country");
    } else {
        // Broad search on details, title, and location
        filtered = destinations.filter(d => 
            d.title.toLowerCase().includes(query) ||
            d.location.toLowerCase().includes(query) ||
            d.description.toLowerCase().includes(query) ||
            d.category.toLowerCase().includes(query)
        );
    }

    // Update Banner
    filterText.textContent = query;
    filterBanner.classList.remove("hidden");
    resultsTitle.textContent = `Search Results`;
    
    renderDestinations(filtered);
    
    // Smooth scroll to recommendations section
    document.getElementById("recommendations").scrollIntoView({ behavior: "smooth" });
}

// Quick Search from tags
function quickSearch(category) {
    searchInput.value = category;
    clearButton.style.display = "block";
    handleSearch();
}

// Reset search filter
function resetSearch() {
    searchInput.value = "";
    clearButton.style.display = "none";
    filterBanner.classList.add("hidden");
    resultsTitle.textContent = "Featured Recommendations";
    renderDestinations(destinations);
}

// Navbar scroll effects & Nav active highlighting
function setupScrollEffects() {
    window.addEventListener("scroll", () => {
        // Change nav styling on scroll
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
        
        // Highlight active link based on scroll section
        const scrollPosition = window.scrollY + 120; // Offset for sticky nav
        const sections = ["home", "about", "contact"];
        
        sections.forEach(id => {
            const section = document.getElementById(id);
            if (!section) return;
            
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navItems.forEach(item => {
                    item.classList.remove("active");
                    if (item.getAttribute("href") === `#${id}`) {
                        item.classList.add("active");
                    }
                });
            }
        });
    });
}

// Mobile Menu toggling
function setupMobileMenu() {
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

// Contact Form Handler
function setupContactForm() {
    contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const name = document.getElementById("formName").value.trim();
        const email = document.getElementById("formEmail").value.trim();
        const message = document.getElementById("formMessage").value.trim();
        
        if (name && email && message) {
            // Simple visual response toast
            showToast(
                "Message Sent Successfully!", 
                `Thank you, ${name}. We've received your query and will reply to ${email} shortly.`
            );
            
            // Clear form
            contactForm.reset();
        }
    });
}

// Toast notification handlers
function showToast(title, body) {
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
    toast.classList.remove("show");
    setTimeout(() => {
        toast.classList.add("hidden");
    }, 400);
    if (window.toastTimeout) {
        clearTimeout(window.toastTimeout);
    }
}
