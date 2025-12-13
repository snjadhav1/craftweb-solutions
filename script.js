/* ========================================
   ULTRA-ENHANCED CRAFTWEB SOLUTIONS
   Premium JavaScript Animations
   ======================================== */

// ========================================
// INTRO VIDEO - BULLETPROOF VERSION
// ========================================
window.addEventListener('DOMContentLoaded', function() {
    const introScreen = document.querySelector('.intro-video-screen');
    const video = document.getElementById('introVideo');
    const skipBtn = document.querySelector('.skip-intro');
    let hasShown = false;
    
    console.log('Intro video script loaded', {introScreen, video});
    
    function showWebsite() {
        if (hasShown) {
            console.log('Already shown, skipping');
            return;
        }
        hasShown = true;
        console.log('🚀 SHOWING WEBSITE NOW!');
        
        // Make sure body is scrollable
        document.body.classList.add('loaded');
        document.body.style.overflow = '';
        document.body.style.overflowX = 'hidden';
        document.body.style.overflowY = 'auto';
        
        if (introScreen) {
            console.log('Starting fade out animation');
            // Trigger fade out
            introScreen.classList.add('fade-out');
            
            // Remove after fade completes
            setTimeout(() => {
                console.log('✅ Removing intro screen - PAGE IS NOW VISIBLE');
                introScreen.style.display = 'none';
                if (introScreen.parentNode) {
                    introScreen.parentNode.removeChild(introScreen);
                }
            }, 1600);
        } else {
            console.log('No intro screen found');
        }
    }
    
    // If no video or screen, show website immediately
    if (!video || !introScreen) {
        console.log('No video or intro screen, showing website');
        showWebsite();
        return;
    }
    
    // Skip button
    if (skipBtn) {
        skipBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Skip button clicked');
            if (video) {
                video.pause();
                video.currentTime = video.duration || 0;
            }
            showWebsite();
        });
    }
    
    // Video ended - MOST IMPORTANT
    video.addEventListener('ended', function() {
        console.log('📹 VIDEO ENDED!');
        showWebsite();
    });
    
    // Also try with onended
    video.onended = function() {
        console.log('📹 VIDEO ENDED (onended)!');
        showWebsite();
    };
    
    // Video error
    video.addEventListener('error', function(e) {
        console.log('Video error:', e);
        showWebsite();
    });
    
    // Click to skip
    introScreen.addEventListener('click', function() {
        console.log('Intro screen clicked');
        if (video) video.pause();
        showWebsite();
    });
    
    // Safety timeout - if nothing happens in 20 seconds, show website
    setTimeout(function() {
        console.log('Safety timeout triggered');
        showWebsite();
    }, 20000);
    
    // Monitor video progress
    video.addEventListener('timeupdate', function() {
        if (video.currentTime > 0 && video.duration > 0) {
            const progress = (video.currentTime / video.duration) * 100;
            if (progress > 99) {
                console.log('Video 99% complete, triggering end');
                showWebsite();
            }
        }
    });
    
    console.log('Video setup complete, duration:', video.duration);
});

// ========================================
// HERO VIDEO BACKGROUND
// ========================================
const heroVideo = document.getElementById('heroVideo');

if (heroVideo) {
    // Handle video loading
    heroVideo.addEventListener('loadeddata', () => {
        heroVideo.classList.add('loaded');
    });
    
    // Fallback if video fails to load
    heroVideo.addEventListener('error', () => {
        console.log('Video failed to load, using gradient background');
    });
    
    // Ensure video plays
    heroVideo.play().catch(err => {
        console.log('Video autoplay prevented:', err);
    });
}

// ========================================
// CUSTOM CURSOR (Premium)
// ========================================
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');
let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    cursor.classList.add('active');
    cursorFollower.classList.add('active');
});

// Smooth cursor animation
function animateCursor() {
    // Cursor
    const distX = mouseX - cursorX;
    const distY = mouseY - cursorY;
    cursorX += distX * 0.3;
    cursorY += distY * 0.3;
    
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    
    // Follower
    const distFollowerX = mouseX - followerX;
    const distFollowerY = mouseY - followerY;
    followerX += distFollowerX * 0.15;
    followerY += distFollowerY * 0.15;
    
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top = followerY + 'px';
    
    requestAnimationFrame(animateCursor);
}

animateCursor();

// Interactive elements cursor effect
const interactiveElements = document.querySelectorAll('a, button, .service-card, .portfolio-item, input, textarea');
interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(2)';
        cursor.style.borderColor = '#ec4899';
        cursorFollower.style.transform = 'translate(-50%, -50%) scale(1.5)';
        cursorFollower.style.background = '#ec4899';
    });
    
    el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        cursor.style.borderColor = '#6366f1';
        cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorFollower.style.background = '#6366f1';
    });
});

// ========================================
// MAGNETIC BUTTONS (Premium Effect)
// ========================================
const magneticButtons = document.querySelectorAll('.magnetic-btn');

magneticButtons.forEach(button => {
    button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        button.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translate(0, 0)';
    });
});

// ========================================
// MOBILE NAVIGATION
// ========================================
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
});

// Close menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('active') && 
        !navMenu.contains(e.target) && 
        !hamburger.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// ========================================
// NAVBAR SCROLL EFFECT (Apple-style)
// ========================================
const navbar = document.querySelector('.navbar');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScrollY = window.scrollY;
});

// ========================================
// SCROLL REVEAL ANIMATIONS
// ========================================
const revealElements = document.querySelectorAll('.reveal-text, .service-card, .portfolio-item, .stat-item, .about-text, .about-image, .info-item, .feature-card');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            
            // Stagger animation for service cards
            if (entry.target.classList.contains('service-card')) {
                const index = Array.from(entry.target.parentElement.children).indexOf(entry.target);
                entry.target.style.transitionDelay = `${index * 0.08}s`;
            }
            
            // Stagger animation for feature cards
            if (entry.target.classList.contains('feature-card')) {
                const index = Array.from(entry.target.parentElement.children).indexOf(entry.target);
                entry.target.style.transitionDelay = `${index * 0.1}s`;
            }
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// ========================================
// SPLIT TEXT ANIMATION
// ========================================
function splitText() {
    const splitChars = document.querySelectorAll('.split-chars');
    
    splitChars.forEach(element => {
        const text = element.textContent;
        element.innerHTML = '';
        
        text.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.opacity = '0';
            span.style.transform = 'translateY(20px)';
            span.style.display = 'inline-block';
            span.style.animation = `fadeInUp 0.5s ease ${index * 0.03}s forwards`;
            element.appendChild(span);
        });
    });
}

// ========================================
// COUNTER ANIMATION
// ========================================
const counters = document.querySelectorAll('.counter');
let counterAnimated = false;

const animateCounter = (counter) => {
    const target = +counter.getAttribute('data-target');
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const updateCounter = () => {
        current += increment;
        if (current < target) {
            counter.textContent = Math.floor(current) + '+';
            requestAnimationFrame(updateCounter);
        } else {
            counter.textContent = target + '+';
        }
    };
    
    updateCounter();
};

const statsSection = document.querySelector('.stats');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !counterAnimated) {
            counters.forEach(counter => animateCounter(counter));
            counterAnimated = true;
        }
    });
}, { threshold: 0.5 });

if (statsSection) {
    statsObserver.observe(statsSection);
}

// ========================================
// PARTICLES BACKGROUND (Enhanced)
// ========================================
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.color = Math.random() > 0.5 ? '#6366f1' : '#8b5cf6';
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x > canvas.width || this.x < 0) {
            this.speedX = -this.speedX;
        }
        
        if (this.y > canvas.height || this.y < 0) {
            this.speedY = -this.speedY;
        }
    }
    
    draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

let particlesArray = [];
const numberOfParticles = 80;

function initParticles() {
    particlesArray = [];
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}

function connectParticles() {
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            const dx = particlesArray[a].x - particlesArray[b].x;
            const dy = particlesArray[a].y - particlesArray[b].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
                const opacity = 1 - (distance / 150);
                ctx.strokeStyle = `rgba(99, 102, 241, ${opacity * 0.15})`;
                ctx.globalAlpha = opacity * 0.3;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particlesArray.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    connectParticles();
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

// ========================================
// 3D TILT EFFECT (Premium)
// ========================================
const tiltElements = document.querySelectorAll('[data-tilt]');

tiltElements.forEach(element => {
    element.addEventListener('mousemove', handleTilt);
    element.addEventListener('mouseleave', resetTilt);
});

function handleTilt(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 15;
    const rotateY = (centerX - x) / 15;
    
    this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    this.style.transition = 'transform 0.1s ease';
}

function resetTilt() {
    this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    this.style.transition = 'transform 0.5s ease';
}

// ========================================
// SMOOTH SCROLL
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offset = 80;
            const targetPosition = target.offsetTop - offset;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// PARALLAX EFFECT (Smooth)
// ========================================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    // Video background parallax
    const videoBackground = document.querySelector('.video-background');
    if (videoBackground) {
        videoBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
    
    // Geometric shapes parallax
    const shapes = document.querySelectorAll('.shape');
    shapes.forEach((shape, index) => {
        const speed = 0.3 + (index * 0.1);
        shape.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
    });
    
    // Floating elements parallax
    const floatingElements = document.querySelectorAll('.float-item');
    floatingElements.forEach((element, index) => {
        const speed = 0.2 + (index * 0.05);
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// ========================================
// FORM SUBMISSION (Enhanced)
// ========================================
const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const submitButton = contactForm.querySelector('.btn-primary');
        const originalText = submitButton.querySelector('.btn-text').textContent;
        
        // Animate button
        submitButton.querySelector('.btn-text').textContent = 'Sending...';
        submitButton.style.pointerEvents = 'none';
        
        // Simulate sending (replace with actual form submission)
        setTimeout(() => {
            submitButton.querySelector('.btn-text').textContent = 'Sent Successfully! ✓';
            submitButton.style.background = 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)';
            
            setTimeout(() => {
                submitButton.querySelector('.btn-text').textContent = originalText;
                submitButton.style.background = '';
                submitButton.style.pointerEvents = '';
                contactForm.reset();
            }, 3000);
        }, 1500);
    });
}

// ========================================
// PORTFOLIO FILTER (Optional Enhancement)
// ========================================
const portfolioItems = document.querySelectorAll('.portfolio-item');

portfolioItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(40px)';
    
    setTimeout(() => {
        item.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
    }, index * 100);
});

// ========================================
// RESIZE HANDLER
// ========================================
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    }, 250);
});

// ========================================
// INITIALIZATION FUNCTION
// ========================================
function initAnimations() {
    splitText();
    
    // Animate hero elements
    const heroElements = document.querySelectorAll('.hero-text > *');
    heroElements.forEach((el, index) => {
        el.style.opacity = '0';
        setTimeout(() => {
            el.style.transition = 'opacity 1s ease, transform 1s ease';
            el.style.opacity = '1';
        }, index * 200);
    });
}

// ========================================
// MOUSE TRAIL EFFECT
// ========================================
let mouseTrail = [];
const trailLength = 15;

document.addEventListener('mousemove', (e) => {
    mouseTrail.push({
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now()
    });
    
    // Keep only recent trail points
    mouseTrail = mouseTrail.filter(point => 
        Date.now() - point.timestamp < 500
    );
});

// ========================================
// VIDEO BACKGROUND CONTROLS (Additional)
// ========================================
// Note: heroVideo already declared at line 118
if (heroVideo) {
    // Ensure video plays
    heroVideo.play().catch(error => {
        console.log('Video autoplay prevented:', error);
    });
    
    // Pause video when not in viewport (performance optimization)
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                heroVideo.play();
            } else {
                heroVideo.pause();
            }
        });
    }, { threshold: 0.1 });
    
    videoObserver.observe(heroVideo);
}

// ========================================
// SCROLL PROGRESS INDICATOR (Optional)
// ========================================
function updateScrollProgress() {
    const winScroll = document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    
    // You can create a progress bar element if needed
    // For now, we'll use it for other effects
}

window.addEventListener('scroll', updateScrollProgress);

// ========================================
// PAGE VISIBILITY (Performance)
// ========================================
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when page is not visible
        if (heroVideo) heroVideo.pause();
    } else {
        // Resume animations when page becomes visible
        if (heroVideo) heroVideo.play();
    }
});

// ========================================
// EASTER EGG - Console Message
// ========================================
console.log(
    '%c✨ Crafted with Love by Craftweb Solutions ✨',
    'color: #6366f1; font-size: 24px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);'
);

console.log(
    '%c🚀 Want to work with us? Let\'s create something amazing!',
    'color: #8b5cf6; font-size: 16px; font-weight: bold;'
);

console.log(
    '%c💼 Email: hello@craftwebsolutions.com',
    'color: #ec4899; font-size: 14px;'
);

// ========================================
// PERFORMANCE OPTIMIZATION
// ========================================
// Debounce function for better performance
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

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Use throttle for scroll events
window.addEventListener('scroll', throttle(() => {
    updateScrollProgress();
}, 100));

// ========================================
// ACCESSIBILITY ENHANCEMENTS
// ========================================
// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close mobile menu if open
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Focus visible for keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});

// ========================================
// MOBILE OPTIMIZATIONS
// ========================================
// Disable animations on low-end devices
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if (prefersReducedMotion.matches) {
    document.body.classList.add('reduce-motion');
}

// Optimize for touch devices
if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');
}

// Prevent zoom on double tap for better UX
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// ========================================
// INITIAL PAGE LOAD
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Preload critical images
    const criticalImages = document.querySelectorAll('img[data-preload]');
    criticalImages.forEach(img => {
        const tempImg = new Image();
        tempImg.src = img.src;
    });
});

console.log('%c🎉 All systems initialized! Enjoy the experience! 🎉', 'color: #43e97b; font-size: 14px; font-weight: bold;');
