/**
 * Haricane Consultancy Services
 * About Page JavaScript
 * 
 * This file contains custom scripts for the About page elements
 * including animations, interactive components, and other functionality.
 */

(function() {
    'use strict';

    // Execute when DOM is fully loaded
    document.addEventListener('DOMContentLoaded', initializeAboutPage);

    /**
     * Main initialization function for About page
     */
    function initializeAboutPage() {
        // Initialize all base components (from main.js)
        initAOS();
        setupNavbar();
        updateCopyrightYear();
        setupScrollSpy();
        setupContactForm();
        initTestimonialCarousel();

        // Initialize About-specific components
        setupImpactCounters();
        setupAdvisorHover();
        initVisionHighlights();
        setupTeamCards();
        initAwardsCarousel();
    }

    /**
     * Initialize Animate on Scroll (AOS) library
     */
    function initAOS() {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });
    }

    /**
     * Set up navbar scroll effect
     */
    function setupNavbar() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        // Handle navbar background on scroll
        function handleNavbarScroll() {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        }

        window.addEventListener('scroll', handleNavbarScroll);
        
        // Initial check in case page is loaded already scrolled
        handleNavbarScroll();
    }

    /**
     * Set current year in copyright notice
     */
    function updateCopyrightYear() {
        const yearElement = document.getElementById('copyright-year');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    }

    /**
     * Set up Bootstrap ScrollSpy for navigation highlighting
     */
    function setupScrollSpy() {
        const mainNav = document.getElementById('mainNav');
        if (mainNav) {
            new bootstrap.ScrollSpy(document.body, {
                target: '#mainNav',
                rootMargin: '0px 0px -40%'
            });
        }
    }

    /**
     * Handle contact form submission
     */
    function setupContactForm() {
        const form = document.getElementById('contactForm');
        const statusMessage = document.getElementById('formStatusMessage');

        if (!form || !statusMessage) return;

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(form);

            // In production, replace with actual form submission
            simulateFormSubmission(form, formData, statusMessage);
        });
    }

    /**
     * Simulate form submission
     * @param {HTMLFormElement} form - The form element
     * @param {FormData} formData - Form data to submit
     * @param {HTMLElement} statusElement - Element to show status message
     */
    function simulateFormSubmission(form, formData, statusElement) {
        // Log form data (for development only)
        console.log('Form submitted with data:', Object.fromEntries(formData));

        // Simulate loading state
        statusElement.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Sending...';
        statusElement.className = 'alert alert-info mt-4';
        statusElement.style.display = 'block';

        // Simulate successful submission after delay
        setTimeout(() => {
            form.style.display = 'none';
            statusElement.innerHTML = '<i class="fas fa-check-circle me-2"></i> Thank you! Your message has been sent. We will contact you soon.';
            statusElement.className = 'alert confirmation-message mt-4 alert-success';
            statusElement.style.display = 'block';
            form.reset();
        }, 1000);
    }

    /**
     * Initialize the testimonial carousel
     */
    function initTestimonialCarousel() {
        const items = document.querySelectorAll('.testimonial-item');
        const prevBtn = document.querySelector('.testimonial-prev');
        const nextBtn = document.querySelector('.testimonial-next');

        if (items.length === 0 || !prevBtn || !nextBtn) return;

        let currentIndex = 0;
        const autoRotateDelay = 5000; // 5 seconds
        let autoRotateTimer;

        // Add more testimonial content for rotation
        addMoreTestimonials();

        // Show specified testimonial
        function showTestimonial(index) {
            items.forEach(item => item.classList.remove('active'));
            items[index].classList.add('active');

            // Reset the auto-rotate timer
            clearTimeout(autoRotateTimer);
            autoRotateTimer = setTimeout(showNextTestimonial, autoRotateDelay);
        }

        // Show next testimonial
        function showNextTestimonial() {
            currentIndex = (currentIndex + 1) % items.length;
            showTestimonial(currentIndex);
        }

        // Show previous testimonial
        function showPreviousTestimonial() {
            currentIndex = (currentIndex - 1 + items.length) % items.length;
            showTestimonial(currentIndex);
        }

        // Set up event listeners
        prevBtn.addEventListener('click', showPreviousTestimonial);
        nextBtn.addEventListener('click', showNextTestimonial);

        // Show first testimonial and start auto-rotation
        showTestimonial(0);

        // Stop auto-rotation when user hovers over testimonial
        const carousel = document.querySelector('.testimonial-carousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', () => clearTimeout(autoRotateTimer));
            carousel.addEventListener('mouseleave', () => {
                autoRotateTimer = setTimeout(showNextTestimonial, autoRotateDelay);
            });
        }
    }

    /**
     * Add more testimonials to the carousel
     */
    function addMoreTestimonials() {
        const carousel = document.querySelector('.testimonial-carousel');
        if (!carousel) return;

        // Additional testimonials data
        const testimonials = [
            {
                text: "HCS's data-driven approach transformed our digital strategy. Their team delivered a 130% increase in qualified leads while significantly reducing our CPA. Their transparent reporting and strategic insights made all the difference.",
                name: "Rajesh Kumar",
                position: "Digital Manager, AtlasTech Solutions"
            },
            {
                text: "The website HCS designed for us has been a game-changer. Not only is it visually stunning, but the conversion-focused approach has resulted in a 65% increase in online inquiries. Their ongoing support and optimization are unmatched.",
                name: "Anita Sharma",
                position: "CEO, Bloom Retail"
            }
        ];

        // Only add if there's currently one testimonial
        const currentItems = carousel.querySelectorAll('.testimonial-item');
        if (currentItems.length === 1) {
            const template = currentItems[0];

            testimonials.forEach(testimonial => {
                // Clone the template
                const newItem = template.cloneNode(true);
                newItem.classList.remove('active');
                
                // Update content
                newItem.querySelector('.testimonial-text p').textContent = testimonial.text;
                newItem.querySelector('.author-info h5').textContent = testimonial.name;
                newItem.querySelector('.author-info p').textContent = testimonial.position;
                
                // Add to carousel
                carousel.appendChild(newItem);
            });
        }
    }

    /**
     * Set up animated counters for impact section
     */
    function setupImpactCounters() {
        const impactSection = document.getElementById('impact');
        if (!impactSection) return;

        const counters = impactSection.querySelectorAll('.stat-value');
        
        // Setup IntersectionObserver to trigger counter animation when section is visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Start all counters
                    counters.forEach(counter => {
                        animateCounter(counter);
                    });
                    // Disconnect after triggering
                    observer.disconnect();
                }
            });
        }, { threshold: 0.3 });

        observer.observe(impactSection);
    }

    /**
     * Animate a single counter element
     * @param {HTMLElement} counterElement - The counter element to animate
     */
    function animateCounter(counterElement) {
        // Remove any non-numeric characters to get the target number
        const targetNumber = parseFloat(counterElement.textContent.replace(/[^\d.-]/g, ''));
        const suffix = counterElement.innerHTML.replace(/[\d.-]/g, '');
        const duration = 2000; // 2 seconds
        const framesPerSecond = 60;
        const totalFrames = duration / 1000 * framesPerSecond;
        
        let currentNumber = 0;
        const increment = targetNumber / totalFrames;
        let currentFrame = 0;

        // Reset to zero
        counterElement.textContent = '0' + suffix;

        const counterId = setInterval(() => {
            currentFrame++;
            currentNumber += increment;
            
            if (currentFrame === totalFrames) {
                clearInterval(counterId);
                counterElement.innerHTML = targetNumber + suffix;
            } else {
                counterElement.innerHTML = Math.round(currentNumber) + suffix;
            }
        }, 1000 / framesPerSecond);
    }

    /**
     * Set up special hover effects for advisor card
     */
    function setupAdvisorHover() {
        const advisorCard = document.querySelector('.advisor-card');
        if (!advisorCard) return;

        const advisorImage = advisorCard.querySelector('.advisor-image');
        
        advisorCard.addEventListener('mouseenter', () => {
            advisorImage.style.transform = 'scale(1.05)';
        });
        
        advisorCard.addEventListener('mouseleave', () => {
            advisorImage.style.transform = 'scale(1)';
        });
    }

    /**
     * Initialize and animate vision section highlights
     */
    function initVisionHighlights() {
        const visionSection = document.getElementById('vision');
        if (!visionSection) return;

        const highlights = visionSection.querySelectorAll('.vision-highlight-item');
        
        // Add staggered entrance animation
        highlights.forEach((highlight, index) => {
            highlight.style.opacity = '0';
            highlight.style.transform = 'translateY(20px)';
            
            // Setup IntersectionObserver for each highlight
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Staggered animation
                        setTimeout(() => {
                            highlight.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                            highlight.style.opacity = '1';
                            highlight.style.transform = 'translateY(0)';
                        }, 200 * index);
                        
                        // Disconnect after animating
                        observer.disconnect();
                    }
                });
            }, { threshold: 0.3 });
            
            observer.observe(visionSection);
        });
    }

    /**
     * Set up interactive team cards
     */
    function setupTeamCards() {
        const teamCards = document.querySelectorAll('.team-card');
        if (teamCards.length === 0) return;

        teamCards.forEach(card => {
            // Get card elements
            const image = card.querySelector('.team-image img');
            const social = card.querySelector('.team-social');
            
            // Add hover effect for smoother transition
            card.addEventListener('mouseenter', () => {
                image.style.transform = 'scale(1.05)';
                social.style.opacity = '1';
                social.style.transform = 'translateX(0)';
            });
            
            card.addEventListener('mouseleave', () => {
                image.style.transform = 'scale(1)';
                social.style.opacity = '0';
                social.style.transform = 'translateX(20px)';
            });
        });
    }

    /**
     * Initialize awards carousel for small screens
     */
    function initAwardsCarousel() {
        // Only initialize on mobile screens
        if (window.innerWidth > 767) return;
        
        const awardsContainer = document.querySelector('#recognition .row');
        if (!awardsContainer) return;
        
        // Add swipe functionality for mobile
        let startX, endX;
        const awards = awardsContainer.querySelectorAll('.col-6');
        
        awardsContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        }, { passive: true });
        
        awardsContainer.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            // Minimum distance for swipe
            const threshold = 50;
            const difference = startX - endX;
            
            if (Math.abs(difference) < threshold) return;
            
            if (difference > 0) {
                // Swipe left - next
                awardsContainer.scrollBy({
                    left: window.innerWidth * 0.6,
                    behavior: 'smooth'
                });
            } else {
                // Swipe right - previous
                awardsContainer.scrollBy({
                    left: -window.innerWidth * 0.6,
                    behavior: 'smooth'
                });
            }
        }
    }

    /**
     * Set up circle progress animations
     */
    function setupCircleAnimations() {
        // Not used on About page, but keeping for compatibility with main.js
    }

})();