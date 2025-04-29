/**
 * Haricane Consultancy Services
 * Services Page JavaScript
 *
 * This file contains custom scripts for the Services page elements
 * including pricing toggles, countdowns, and other interactive components.
 */

(function() {
    'use strict';

    // Execute when DOM is fully loaded
    document.addEventListener('DOMContentLoaded', initializeServicesPage);

    /**
     * Main initialization function for Services page
     */
    function initializeServicesPage() {
        // Initialize all base components (from main.js)
        initAOS();
        setupNavbar();
        updateCopyrightYear();
        setupScrollSpy();
        setupContactForm();
        
        // Initialize Services-specific components
        setupPackageSelector();
        initOfferCountdown();
        setupServicesTabbing();
        setupIndustriesTabbing();
        animateServiceCards();
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
     * Setup package selector toggle (Monthly/Quarterly/Annual)
     */
    function setupPackageSelector() {
        const selectorButtons = document.querySelectorAll('.btn-selector');
        if (selectorButtons.length === 0) return;
        
        selectorButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                selectorButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Get selected package type
                const packageType = this.dataset.package;
                
                // Show selected package prices
                const priceElements = document.querySelectorAll('.price-value');
                priceElements.forEach(element => {
                    // Hide all price elements
                    element.style.display = 'none';
                    
                    // Show only the selected package type price
                    if (element.classList.contains(packageType)) {
                        element.style.display = 'inline';
                    }
                });
                
                // Show/hide original price display
                const originalPrices = document.querySelectorAll('.price-original span');
                originalPrices.forEach(element => {
                    element.style.display = 'none';
                    if (element.classList.contains(packageType)) {
                        element.style.display = 'inline';
                    }
                });
            });
        });
    }

    /**
     * Initialize countdown timer for special offer
     */
    function initOfferCountdown() {
        const countdownElement = document.getElementById('offerCountdown');
        if (!countdownElement) return;
        
        // Set the target date (e.g., May 31, 2025)
        const targetDate = new Date('May 31, 2025 23:59:59').getTime();
        
        // Update countdown every second
        const countdownTimer = setInterval(function() {
            // Get current date and time
            const now = new Date().getTime();
            
            // Calculate the remaining time
            const distance = targetDate - now;
            
            // Time calculations
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            // Display the result
            countdownElement.querySelector('.days').textContent = days;
            countdownElement.querySelector('.hours').textContent = hours;
            countdownElement.querySelector('.minutes').textContent = minutes;
            countdownElement.querySelector('.seconds').textContent = seconds;
            
            // If the countdown is finished, display expiry message
            if (distance < 0) {
                clearInterval(countdownTimer);
                const offerBanner = document.getElementById('special-offers');
                if (offerBanner) {
                    offerBanner.innerHTML = `
                        <div class="container">
                            <div class="special-offers-banner" data-aos="fade-up">
                                <h3>Offer Expired</h3>
                                <p>Our special promotion has ended. Contact us to learn about our current offers!</p>
                                <div class="text-center mt-3">
                                    <a href="#contact" class="btn btn-light-outline">Contact Us</a>
                                </div>
                            </div>
                        </div>
                    `;
                }
            }
        }, 1000);
    }

    /**
     * Set up services tab navigation
     */
    function setupServicesTabbing() {
        // Bootstrap handles the basic tab functionality
        // This function adds extra features and animations
        
        const tabLinks = document.querySelectorAll('#serviceTabs .nav-link');
        if (tabLinks.length === 0) return;
        
        tabLinks.forEach(link => {
            link.addEventListener('click', function() {
                // Scroll to the tab content if on mobile
                if (window.innerWidth < 768) {
                    const tabContent = document.getElementById('serviceTabsContent');
                    if (tabContent) {
                        setTimeout(() => {
                            tabContent.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                        }, 300);
                    }
                }
                
                // Re-trigger AOS animations on tab change
                setTimeout(() => {
                    AOS.refresh();
                }, 300);
            });
        });
    }

    /**
     * Set up industries tab navigation
     */
    function setupIndustriesTabbing() {
        // Similar to services tabbing, but for industries section
        const tabLinks = document.querySelectorAll('#industryTabs .nav-link');
        if (tabLinks.length === 0) return;
        
        tabLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth < 768) {
                    const tabContent = document.getElementById('industryTabsContent');
                    if (tabContent) {
                        setTimeout(() => {
                            tabContent.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                        }, 300);
                    }
                }
                
                setTimeout(() => {
                    AOS.refresh();
                }, 300);
            });
        });
    }

    /**
     * Animate service cards on hover/scroll
     */
    function animateServiceCards() {
        const serviceCards = document.querySelectorAll('.service-card');
        if (serviceCards.length === 0) return;
        
        // Add hover effect for smoother transition
        serviceCards.forEach(card => {
            // Animation on hover
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px)';
                card.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.12)';
                
                // Animate icon background
                const iconBg = card.querySelector('.service-icon-bg');
                if (iconBg) {
                    iconBg.style.backgroundColor = 'var(--primary-color)';
                    
                    const icon = iconBg.querySelector('i');
                    if (icon) {
                        icon.style.color = '#fff';
                    }
                }
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.08)';
                
                // Reset icon background
                const iconBg = card.querySelector('.service-icon-bg');
                if (iconBg) {
                    iconBg.style.backgroundColor = 'var(--light-bg)';
                    
                    const icon = iconBg.querySelector('i');
                    if (icon) {
                        icon.style.color = 'var(--primary-color)';
                    }
                }
            });
        });
        
        // Animate cards when they come into view (for those without AOS)
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        serviceCards.forEach(card => {
            if (!card.hasAttribute('data-aos')) {
                observer.observe(card);
            }
        });
    }
})();