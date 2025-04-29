/**
 * Haricane Consultancy Services
 * Case Studies Page JavaScript
 *
 * This file handles the interactive elements for the Case Studies page,
 * including filtering, animations, and scrolling functions.
 */

(function() {
    'use strict';
  
    // Execute when DOM is fully loaded
    document.addEventListener('DOMContentLoaded', initializeCaseStudiesPage);
  
    /**
     * Main initialization function for Case Studies page
     */
    function initializeCaseStudiesPage() {
      // Initialize base components (from main.js if available)
      if (typeof initAOS === 'function') {
        initAOS();
      } else {
        // Initialize AOS directly if main.js functions aren't available
        AOS.init({
          duration: 800,
          easing: 'ease-in-out',
          once: true,
          offset: 100
        });
      }
  
      // Initialize Case Studies specific functions
      setupIndustryFilter();
      setupScrollToCaseStudy();
      animateStatistics();
      
      // Call shared functions if they exist, otherwise define them here
      if (typeof setupNavbar === 'function') {
        setupNavbar();
      } else {
        setupNavbarFallback();
      }
      
      if (typeof updateCopyrightYear === 'function') {
        updateCopyrightYear();
      } else {
        updateCopyrightYearFallback();
      }
      
      if (typeof setupTestimonialCarousel === 'function') {
        setupTestimonialCarousel();
      }
    }
  
    /**
     * Set up industry filter functionality
     */
    function setupIndustryFilter() {
      const filterButtons = document.querySelectorAll('.filter-btn');
      const caseStudies = document.querySelectorAll('.case-study-card.detailed');
  
      if (!filterButtons.length || !caseStudies.length) return;
  
      filterButtons.forEach(button => {
        button.addEventListener('click', function() {
          // Update active button
          filterButtons.forEach(btn => btn.classList.remove('active'));
          this.classList.add('active');
  
          // Get selected category
          const selectedCategory = this.getAttribute('data-filter');
  
          // Filter case studies
          caseStudies.forEach(caseStudy => {
            const category = caseStudy.getAttribute('data-category');
            
            if (selectedCategory === 'all' || selectedCategory === category) {
              caseStudy.style.display = 'block';
              
              // Add fade-in animation
              caseStudy.style.opacity = '0';
              caseStudy.style.transform = 'translateY(20px)';
              
              setTimeout(() => {
                caseStudy.style.opacity = '1';
                caseStudy.style.transform = 'translateY(0)';
                caseStudy.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
              }, 50);
            } else {
              // Fade out before hiding
              caseStudy.style.opacity = '0';
              caseStudy.style.transform = 'translateY(20px)';
              caseStudy.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
              
              setTimeout(() => {
                caseStudy.style.display = 'none';
              }, 500);
            }
          });
        });
      });
    }
  
    /**
     * Set up smooth scrolling to case studies from links
     */
    function setupScrollToCaseStudy() {
      // Handle links to case studies for smooth scrolling
      const caseStudyLinks = document.querySelectorAll('a[href^="#"]');
      
      caseStudyLinks.forEach(link => {
        link.addEventListener('click', function(e) {
          const targetId = this.getAttribute('href');
          
          // Only process if it's a case study link
          if (targetId.startsWith('#') && targetId.length > 1) {
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
              e.preventDefault();
              
              // Get the navbar height for offset
              const navbarHeight = document.querySelector('.navbar').offsetHeight;
              const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
              
              // Smooth scroll to target with navbar offset
              window.scrollTo({
                top: targetPosition - navbarHeight - 20, // 20px extra padding
                behavior: 'smooth'
              });
              
              // Highlight the target case study
              targetElement.classList.add('highlight-case-study');
              setTimeout(() => {
                targetElement.classList.remove('highlight-case-study');
              }, 2000);
            }
          }
        });
      });
    }
  
    /**
     * Animate statistics numbers when they come into view
     */
    function animateStatistics() {
      const statElements = document.querySelectorAll('.result-number, .metric-value, .overview-card h3');
      
      if (!statElements.length) return;
      
      // Helper function to animate a counter
      function animateCounter(element) {
        // Get the target number, handling percentage signs and plus symbols
        let targetText = element.innerText;
        let suffix = '';
        
        // Extract suffixes like %, +, x
        if (targetText.includes('%')) {
          suffix = '%';
          targetText = targetText.replace('%', '');
        } else if (targetText.includes('x')) {
          suffix = 'x';
          targetText = targetText.replace('x', '');
        } else if (targetText.includes('+')) {
          suffix = '+';
          targetText = targetText.replace('+', '');
        }
        
        const targetNumber = parseFloat(targetText);
        
        if (isNaN(targetNumber)) return;
        
        // Animation settings
        const duration = 2000; // 2 seconds
        const framesPerSecond = 60;
        const totalFrames = duration / 1000 * framesPerSecond;
        
        let currentNumber = 0;
        const increment = targetNumber / totalFrames;
        let currentFrame = 0;
        
        // Start animation from 0
        element.innerText = '0' + suffix;
        
        const counterId = setInterval(() => {
          currentFrame++;
          currentNumber += increment;
          
          if (currentFrame === totalFrames) {
            clearInterval(counterId);
            element.innerText = targetNumber + suffix;
          } else {
            // Handle decimal places for non-integer values
            if (Number.isInteger(targetNumber)) {
              element.innerText = Math.round(currentNumber) + suffix;
            } else {
              // For decimal values like 4.8
              element.innerText = currentNumber.toFixed(1) + suffix;
            }
          }
        }, 1000 / framesPerSecond);
      }
      
      // Use Intersection Observer to trigger animations when stats are visible
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            // Stop observing once animation is triggered
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });
      
      // Observe all stat elements
      statElements.forEach(element => {
        observer.observe(element);
      });
    }
  
    /**
     * Fallback navbar handler if main.js is not available
     */
    function setupNavbarFallback() {
      const navbar = document.querySelector('.navbar');
      if (!navbar) return;
  
      function handleNavbarScroll() {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
      }
  
      window.addEventListener('scroll', handleNavbarScroll);
      handleNavbarScroll(); // Initial check
    }
  
    /**
     * Fallback copyright year updater if main.js is not available
     */
    function updateCopyrightYearFallback() {
      const yearElement = document.getElementById('copyright-year');
      if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
      }
    }
  
  })();