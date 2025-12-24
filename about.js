/* ========================================
   ABOUT US PAGE JAVASCRIPT
   Animations & Interactions
   ======================================== */

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            easing: 'ease-out-cubic',
            once: true,
            offset: 100,
            delay: 100
        });
    }

    // Initialize custom cursor
    initializeCustomCursor();

    // Add parallax effect
    addParallaxEffect();

    // Animate expertise tags
    animateExpertiseTags();

    // Add card hover effects
    addCardHoverEffects();

    // Smooth scroll for anchor links
    smoothScrollLinks();
});

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

    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.3;
        cursorY += (mouseY - cursorY) * 0.3;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';

        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        cursorFollower.style.left = followerX + 'px';
        cursorFollower.style.top = followerY + 'px';

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Add hover effects
    const hoverElements = document.querySelectorAll('a, button, .cofounder-image, .social-link, .expertise-tag');
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

// Parallax Effect for Hero Section
function addParallaxEffect() {
    const heroSection = document.querySelector('.about-hero');
    
    if (!heroSection) return;

    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallax = scrolled * 0.5;
        heroSection.style.transform = `translateY(${parallax}px)`;
    });
}

// Animate Expertise Tags on Scroll
function animateExpertiseTags() {
    const tags = document.querySelectorAll('.expertise-tag');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        entry.target.style.transition = 'all 0.5s ease';
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, 50);
                }, index * 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    tags.forEach(tag => observer.observe(tag));
}

// Card Hover Effects
function addCardHoverEffects() {
    const cards = document.querySelectorAll('.cofounder-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Smooth Scroll for Links
function smoothScrollLinks() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').slice(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Typing Effect for Hero Title (Optional Enhancement)
function typeWriterEffect() {
    const titleElement = document.querySelector('.about-hero-title');
    if (!titleElement) return;

    const text = titleElement.textContent;
    titleElement.textContent = '';
    let i = 0;

    function type() {
        if (i < text.length) {
            titleElement.textContent += text.charAt(i);
            i++;
            setTimeout(type, 50);
        }
    }

    // Delay before starting
    setTimeout(type, 500);
}

// Image Load Animation
function animateImageLoad() {
    const images = document.querySelectorAll('.cofounder-image');
    
    images.forEach((img, index) => {
        // Performance hints
        try { img.loading = 'lazy'; img.decoding = 'async'; } catch {}

        // Prepare initial state
        img.style.transition = 'all 0.6s ease';
        img.style.opacity = '0';
        img.style.transform = 'scale(0.9)';

        const reveal = () => {
            img.style.opacity = '1';
            img.style.transform = 'scale(1)';
        };

        // Animate on load
        img.addEventListener('load', function() {
            setTimeout(reveal, index * 200);
        });

        // If image is already cached/loaded, reveal immediately
        if (img.complete && img.naturalWidth > 0) {
            setTimeout(reveal, index * 200);
        }
    });
}

// Call image animation
animateImageLoad();

// Floating Animation for Mission Icon
function floatingAnimation() {
    const icon = document.querySelector('.mission-icon');
    if (!icon) return;

    let position = 0;
    let direction = 1;

    setInterval(() => {
        position += direction * 0.5;
        if (position >= 15 || position <= -15) {
            direction *= -1;
        }
        icon.style.transform = `translateY(${position}px)`;
    }, 50);
}

// Add scroll reveal animation
function scrollRevealAnimation() {
    const reveals = document.querySelectorAll('.cofounder-card, .mission-section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    reveals.forEach(element => observer.observe(element));
}

scrollRevealAnimation();

// Page Load Animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// Performance: Debounce scroll events
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

// Optimized scroll handler
const optimizedScroll = debounce(function() {
    // Handle scroll events
}, 100);

window.addEventListener('scroll', optimizedScroll);

// Console message for developers
console.log('%c👋 Welcome to Craftweb Solutions About Page', 'font-size: 20px; font-weight: bold; color: #3b82f6;');
console.log('%cMeet our amazing co-founders!', 'font-size: 14px; color: #8b5cf6;');
