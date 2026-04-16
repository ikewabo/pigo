/**
 * PIGO HONEYBEES - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initScrollAnimations();
    initParallax();
    initParticles();
    initHeroGifSequence();
});

/**
 * Handle Navbar behavior (sticky background, mobile menu)
 */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            if (navLinks) navLinks.classList.toggle('active');
        });
    }

    // Close menu when a link is clicked
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileToggle) mobileToggle.classList.remove('active');
            if (navLinks) navLinks.classList.remove('active');
        });
    });
}

/**
 * Intersection Observer for scroll reveal animations
 */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: stop observing once revealed
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Initial load animations
    setTimeout(() => {
        const heroElements = document.querySelectorAll('.hero .fade-up, .hero .fade-in');
        heroElements.forEach(el => el.classList.add('visible'));
    }, 100);

    // Watch other fade elements
    const fadeElements = document.querySelectorAll('.fade-up:not(.hero .fade-up), .fade-in:not(.hero .fade-in)');
    fadeElements.forEach(el => observer.observe(el));
}

/**
 * Simple Parallax Effect for Hero Elements
 */
function initParallax() {
    document.addEventListener('mousemove', (e) => {
        const elements = document.querySelectorAll('[data-speed]');
        const x = (window.innerWidth - e.pageX) / 100;
        const y = (window.innerHeight - e.pageY) / 100;

        elements.forEach(el => {
            const speed = parseFloat(el.getAttribute('data-speed'));
            // Request animation frame for performance
            requestAnimationFrame(() => {
                el.style.transform = `translateX(${x * speed}px) translateY(${y * speed}px)`;
            });
        });
    });
}

/**
 * Very lightweight particle system for the background honey-gold dust
 */
function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    const particleCount = window.innerWidth < 768 ? 20 : 40;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle(container);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    
    // Random properties
    const size = Math.random() * 4 + 1; // 1px to 5px
    const x = Math.random() * 100; // vw
    const y = Math.random() * 100; // vh
    const opacity = Math.random() * 0.5 + 0.1;
    const duration = Math.random() * 20 + 10; // 10s to 30s
    const delay = Math.random() * 10;
    
    // Styling
    particle.style.position = 'absolute';
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.background = 'rgba(212, 175, 55, ' + opacity + ')'; // Gold
    particle.style.borderRadius = '50%';
    particle.style.boxShadow = `0 0 ${size * 2}px rgba(212, 175, 55, 0.8)`;
    particle.style.left = `${x}vw`;
    particle.style.top = `${y}vh`;
    particle.style.pointerEvents = 'none';
    
    // Animation via Web Animations API
    particle.animate([
        { transform: `translate(0, 0) scale(1)`, opacity: opacity },
        { transform: `translate(${Math.random() * 100 - 50}px, -${Math.random() * 200 + 100}px) scale(0)`, opacity: 0 }
    ], {
        duration: duration * 1000,
        delay: delay * 1000,
        iterations: Infinity,
        easing: 'ease-in-out'
    });
    
    container.appendChild(particle);
}

/**
 * Hero Video Player Logic
 */
function initHeroGifSequence() {
    const bgImg = document.getElementById('hero-bg-anim');
    if (!bgImg) return;

    const totalFrames = 208; // 17.3 seconds * 12 fps = 208 frames
    const images = [];
    let loadedImages = 0;
    
    // We reveal after a few loops
    let loops = 0;
    let revealed = false;
    let currentFrame = 0;
    
    // Preload images
    for (let i = 1; i <= totalFrames; i++) {
        const img = new Image();
        const frameNumber = i.toString().padStart(4, '0');
        img.src = `images/frames/frame_${frameNumber}.webp`;
        images.push(img);
        
        img.onload = () => {
            loadedImages++;
            // Set initial frame when first image is loaded
            if (loadedImages === 1) {
                bgImg.src = images[0].src;
            }
        };
    }

    let lastTime = 0;
    const fps = 12;
    const interval = 1000 / fps;

    function playAnimation(timestamp) {
        if (!lastTime) lastTime = timestamp;
        
        // Start playing when we have some frames
        if (loadedImages > 5) {
            const deltaTime = timestamp - lastTime;
            
            if (deltaTime >= interval) {
                // Ensure the frame is loaded before swapping
                if (images[currentFrame].complete) {
                    bgImg.src = images[currentFrame].src;
                    
                    currentFrame++;
                    if (currentFrame >= totalFrames) {
                         currentFrame = 0;
                         loops++;
                         if (loops >= 1 && !revealed) { // Reveal earlier for 12fps
                             revealed = true;
                             const panel = document.querySelector('.hero-glass-panel');
                             if (panel) panel.classList.add('revealed');
                         }
                    }
                }
                lastTime = timestamp - (deltaTime % interval);
            }
        }
        
        requestAnimationFrame(playAnimation);
    }
    
    requestAnimationFrame(playAnimation);
}
