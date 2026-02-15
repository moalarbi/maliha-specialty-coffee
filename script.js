/**
 * مَليحة | MALIHA Specialty Coffee
 * Main JavaScript File
 */

(function() {
    'use strict';

    // ============================================
    // DOM Elements
    // ============================================
    const header = document.getElementById('header');
    const langToggle = document.getElementById('langToggle');
    const langToggleFooter = document.getElementById('langToggleFooter');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const html = document.documentElement;
    
    // Reviews slider elements
    const reviewsTrack = document.getElementById('reviewsTrack');
    const prevReviewBtn = document.getElementById('prevReview');
    const nextReviewBtn = document.getElementById('nextReview');
    const reviewDots = document.querySelectorAll('.dot');

    // ============================================
    // State
    // ============================================
    let currentLang = 'ar';
    let currentReview = 0;
    let reviewInterval;

    // ============================================
    // Language Toggle
    // ============================================
    function toggleLanguage() {
        currentLang = currentLang === 'ar' ? 'en' : 'ar';
        
        // Update HTML attributes
        html.lang = currentLang;
        html.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
        
        // Update all elements with data attributes
        const translatableElements = document.querySelectorAll('[data-ar][data-en]');
        translatableElements.forEach(el => {
            const text = el.getAttribute(`data-${currentLang}`);
            if (text) {
                // For input elements, update placeholder or value
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    if (el.hasAttribute('placeholder')) {
                        el.placeholder = text;
                    } else {
                        el.value = text;
                    }
                } else {
                    el.textContent = text;
                }
            }
        });
        
        // Update language toggle buttons
        const langText = currentLang === 'ar' ? 'EN' : 'AR';
        const footerLangText = currentLang === 'ar' ? 'English' : 'العربية';
        
        if (langToggle) {
            langToggle.querySelector('.lang-text').textContent = langText;
        }
        if (langToggleFooter) {
            langToggleFooter.querySelector('.lang-text').textContent = footerLangText;
        }
        
        // Update document title
        document.title = currentLang === 'ar' 
            ? 'مَليحة | MALIHA Specialty Coffee'
            : 'MALIHA | Specialty Coffee - Riyadh';
        
        // Store preference
        localStorage.setItem('maliha-lang', currentLang);
    }

    // Initialize language from localStorage
    function initLanguage() {
        const savedLang = localStorage.getItem('maliha-lang');
        if (savedLang && savedLang !== currentLang) {
            toggleLanguage();
        }
    }

    // ============================================
    // Header Scroll Effect
    // ============================================
    function handleHeaderScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    // ============================================
    // Mobile Menu
    // ============================================
    function toggleMobileMenu() {
        mobileMenu.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
        
        const spans = mobileMenuToggle.querySelectorAll('span');
        if (mobileMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    }

    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        const spans = mobileMenuToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }

    // ============================================
    // Reviews Slider
    // ============================================
    function showReview(index) {
        const reviewCards = document.querySelectorAll('.review-card');
        
        // Hide all reviews
        reviewCards.forEach(card => {
            card.classList.remove('active');
        });
        
        // Update dots
        reviewDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        // Show current review with fade effect
        setTimeout(() => {
            reviewCards[index].classList.add('active');
        }, 50);
        
        currentReview = index;
    }

    function nextReview() {
        const reviewCards = document.querySelectorAll('.review-card');
        const nextIndex = (currentReview + 1) % reviewCards.length;
        showReview(nextIndex);
    }

    function prevReview() {
        const reviewCards = document.querySelectorAll('.review-card');
        const prevIndex = (currentReview - 1 + reviewCards.length) % reviewCards.length;
        showReview(prevIndex);
    }

    function startReviewAutoplay() {
        reviewInterval = setInterval(nextReview, 5000);
    }

    function stopReviewAutoplay() {
        clearInterval(reviewInterval);
    }

    // ============================================
    // Scroll Animations (Intersection Observer)
    // ============================================
    function initScrollAnimations() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements for fade-in animation
        const fadeElements = document.querySelectorAll('.menu-card, .event-card, .feature, .info-item');
        fadeElements.forEach(el => {
            el.classList.add('fade-in');
            observer.observe(el);
        });
    }

    // ============================================
    // Smooth Scroll for Anchor Links
    // ============================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerHeight = header.offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    if (mobileMenu.classList.contains('active')) {
                        closeMobileMenu();
                    }
                }
            });
        });
    }

    // ============================================
    // Parallax Effect (subtle)
    // ============================================
    function initParallax() {
        const heroBg = document.querySelector('.hero-bg');
        if (!heroBg) return;
        
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrolled = window.pageYOffset;
                    const rate = scrolled * 0.3;
                    heroBg.style.transform = `translateY(${rate}px)`;
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // ============================================
    // Event Listeners
    // ============================================
    function initEventListeners() {
        // Header scroll
        window.addEventListener('scroll', handleHeaderScroll, { passive: true });
        
        // Language toggles
        if (langToggle) {
            langToggle.addEventListener('click', toggleLanguage);
        }
        if (langToggleFooter) {
            langToggleFooter.addEventListener('click', toggleLanguage);
        }
        
        // Mobile menu
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', toggleMobileMenu);
        }
        
        // Reviews navigation
        if (prevReviewBtn) {
            prevReviewBtn.addEventListener('click', () => {
                stopReviewAutoplay();
                prevReview();
                startReviewAutoplay();
            });
        }
        
        if (nextReviewBtn) {
            nextReviewBtn.addEventListener('click', () => {
                stopReviewAutoplay();
                nextReview();
                startReviewAutoplay();
            });
        }
        
        // Review dots
        reviewDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                stopReviewAutoplay();
                showReview(index);
                startReviewAutoplay();
            });
        });
        
        // Pause autoplay on hover
        if (reviewsTrack) {
            reviewsTrack.addEventListener('mouseenter', stopReviewAutoplay);
            reviewsTrack.addEventListener('mouseleave', startReviewAutoplay);
        }
        
        // Keyboard navigation for reviews
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                stopReviewAutoplay();
                currentLang === 'ar' ? nextReview() : prevReview();
                startReviewAutoplay();
            } else if (e.key === 'ArrowRight') {
                stopReviewAutoplay();
                currentLang === 'ar' ? prevReview() : nextReview();
                startReviewAutoplay();
            }
        });
        
        // Close mobile menu on resize (if switching to desktop)
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && mobileMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    }

    // ============================================
    // Initialize
    // ============================================
    function init() {
        // Initialize language
        initLanguage();
        
        // Initialize header state
        handleHeaderScroll();
        
        // Initialize reviews slider
        const reviewCards = document.querySelectorAll('.review-card');
        if (reviewCards.length > 0) {
            reviewCards[0].classList.add('active');
            startReviewAutoplay();
        }
        
        // Initialize scroll animations
        initScrollAnimations();
        
        // Initialize smooth scroll
        initSmoothScroll();
        
        // Initialize parallax (optional)
        initParallax();
        
        // Initialize event listeners
        initEventListeners();
        
        // Add loaded class for initial animations
        document.body.classList.add('loaded');
    }

    // Run initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
