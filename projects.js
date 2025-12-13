/* ========================================
   PROJECTS PAGE JAVASCRIPT
   Filter & Animation Logic
   ======================================== */

// Initialize AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS with custom settings
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 100,
            delay: 100
        });
    }

    // Initialize project filtering
    initializeProjectFilter();

    // Initialize mobile menu if on mobile
    initializeMobileMenu();

    // Initialize custom cursor
    initializeCustomCursor();

    // Add scroll animations
    addScrollAnimations();

    // Check URL parameters for category filtering
    checkURLCategory();
});

// Project Filter Functionality
function initializeProjectFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-filter');

            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Filter projects with animation
            filterProjects(filterValue, projectCards);

            // Update URL without reload
            updateURL(filterValue);
        });
    });
}

// Filter Projects Function
function filterProjects(category, projectCards) {
    projectCards.forEach((card, index) => {
        const cardCategories = card.getAttribute('data-category').split(' ');
        const shouldShow = category === 'all' || cardCategories.includes(category);

        if (shouldShow) {
            // Show card with animation
            setTimeout(() => {
                card.style.display = 'block';
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8)';
                
                setTimeout(() => {
                    card.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 50);
            }, index * 50);
        } else {
            // Hide card with animation
            card.style.transition = 'all 0.3s ease';
            card.style.opacity = '0';
            card.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });

    // Refresh AOS animations
    if (typeof AOS !== 'undefined') {
        setTimeout(() => {
            AOS.refresh();
        }, 600);
    }
}

// Update URL with category parameter
function updateURL(category) {
    const url = new URL(window.location);
    if (category === 'all') {
        url.searchParams.delete('category');
    } else {
        url.searchParams.set('category', category);
    }
    window.history.pushState({}, '', url);
}

// Check URL for category parameter on page load
function checkURLCategory() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');

    if (category) {
        const filterButton = document.querySelector(`[data-filter="${category}"]`);
        if (filterButton) {
            filterButton.click();
        }
    }
}

// Mobile Menu Functionality
function initializeMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideMenu = navMenu.contains(event.target);
            const isClickOnHamburger = hamburger.contains(event.target);

            if (!isClickInsideMenu && !isClickOnHamburger && navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }
}

// Custom Cursor Functionality
function initializeCustomCursor() {
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');

    if (!cursor || !cursorFollower) return;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let followerX = 0;
    let followerY = 0;

    // Update mouse position
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Animate cursor
    function animateCursor() {
        // Cursor position with smooth follow
        cursorX += (mouseX - cursorX) * 0.3;
        cursorY += (mouseY - cursorY) * 0.3;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';

        // Follower position with slower follow
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        cursorFollower.style.left = followerX + 'px';
        cursorFollower.style.top = followerY + 'px';

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Add hover effects
    const hoverElements = document.querySelectorAll('a, button, .project-card, .filter-btn');
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            cursor.classList.add('cursor-hover');
            cursorFollower.classList.add('cursor-hover');
        });

        element.addEventListener('mouseleave', function() {
            cursor.classList.remove('cursor-hover');
            cursorFollower.classList.remove('cursor-hover');
        });
    });
}

// Scroll Animations
function addScrollAnimations() {
    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Parallax effect for hero section
    const heroSection = document.querySelector('.projects-hero');
    if (heroSection) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;
            heroSection.style.transform = `translateY(${parallax}px)`;
        });
    }
}

// Smooth scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add scroll to top button (optional)
function addScrollToTopButton() {
    const scrollButton = document.createElement('button');
    scrollButton.className = 'scroll-to-top';
    scrollButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollButton.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollButton);

    scrollButton.addEventListener('click', scrollToTop);

    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            scrollButton.classList.add('visible');
        } else {
            scrollButton.classList.remove('visible');
        }
    });
}

// Initialize scroll to top button
document.addEventListener('DOMContentLoaded', function() {
    addScrollToTopButton();
});

// Project Card Click Analytics (Optional)
function trackProjectClick(projectName, projectURL) {
    console.log(`Project clicked: ${projectName}`);
    // Add analytics tracking here if needed
    // Example: gtag('event', 'project_click', { project_name: projectName });
}

// Add click tracking to project links
document.addEventListener('DOMContentLoaded', function() {
    const projectLinks = document.querySelectorAll('.project-link, .project-detail-btn');
    projectLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const projectCard = this.closest('.project-card');
            const projectName = projectCard.querySelector('h3').textContent;
            const projectURL = this.getAttribute('href');
            trackProjectClick(projectName, projectURL);
        });
    });
});

// Lazy loading for images
function initializeLazyLoading() {
    const images = document.querySelectorAll('.project-image img');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', function() {
    initializeLazyLoading();
});

// Search functionality (Optional enhancement)
function addProjectSearch() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search projects...';
    searchInput.className = 'project-search';
    
    const filterSection = document.querySelector('.project-filter');
    if (filterSection) {
        filterSection.insertBefore(searchInput, filterSection.firstChild);
    }

    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const projectCards = document.querySelectorAll('.project-card');

        projectCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('.project-description').textContent.toLowerCase();
            const tags = Array.from(card.querySelectorAll('.tech-tag'))
                .map(tag => tag.textContent.toLowerCase())
                .join(' ');

            const shouldShow = title.includes(searchTerm) || 
                             description.includes(searchTerm) || 
                             tags.includes(searchTerm);

            if (shouldShow) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 50);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    });
}

// Performance optimization: Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimize scroll events
const optimizedScrollHandler = debounce(function() {
    // Your scroll handling code here
}, 100);

window.addEventListener('scroll', optimizedScrollHandler);

// Console greeting for developers
console.log('%c👋 Hello Developer!', 'font-size: 20px; font-weight: bold; color: #3b82f6;');
console.log('%cWelcome to Craftweb Solutions Projects Page', 'font-size: 14px; color: #8b5cf6;');
console.log('%cInterested in our work? Check out our GitHub: https://github.com/swadeshj1', 'font-size: 12px; color: #10b981;');
