/**
 * Haricane Consultancy Services
 * Main JavaScript File
 * 
 * This file handles all interactive elements including animations,
 * form submissions, charts, and dynamic UI components.
 */

(function() {
    'use strict';
    
    // Execute when DOM is fully loaded
    document.addEventListener('DOMContentLoaded', initializeApp);
    
    /**
     * Main initialization function
     */
    function initializeApp() {
      // Initialize all components
      initAOS();
      setupNavbar();
      updateCopyrightYear();
      setupScrollSpy();
      setupContactForm();
      initTestimonialCarousel();
      initGrowthChart();
      setupCircleAnimations();
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
      
      /* 
      // Production code would use fetch API:
      fetch('your-endpoint', {
        method: 'POST',
        body: formData
      })
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => {
        form.style.display = 'none';
        statusElement.innerHTML = '<i class="fas fa-check-circle me-2"></i> Thank you! Your message has been sent.';
        statusElement.className = 'alert confirmation-message mt-4 alert-success';
        statusElement.style.display = 'block';
        form.reset();
      })
      .catch(error => {
        console.error('Error submitting form:', error);
        statusElement.innerHTML = '<i class="fas fa-exclamation-triangle me-2"></i> Sorry, there was a problem sending your message. Please try again or contact us directly.';
        statusElement.className = 'alert confirmation-message mt-4 alert-danger';
        statusElement.style.display = 'block';
      });
      */
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
     * Initialize growth chart with Chart.js
     */
    function initGrowthChart() {
      const chartElement = document.getElementById('growthChart');
      if (!chartElement) return;
      
      const ctx = chartElement.getContext('2d');
      
      // Create gradient for chart background
      const gradient = ctx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, 'rgba(65, 105, 225, 0.6)');
      gradient.addColorStop(1, 'rgba(65, 105, 225, 0.1)');
      
      // Chart data
      const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
      const clientData = [10, 25, 28, 45, 58, 75, 82, 90, 110];
      const industryData = [10, 15, 20, 25, 30, 35, 40, 45, 50];
      
      // Font configurations
      const titleFont = {
        family: "'Playfair Display', serif",
        size: 14,
        weight: 'bold'
      };
      
      const bodyFont = {
        family: "'Poppins', sans-serif",
        size: 13
      };
      
      const ticksFont = {
        family: "'Poppins', sans-serif",
        size: 12
      };
      
      // Create chart
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: monthLabels,
          datasets: [
            {
              label: 'Client Growth Trajectory',
              data: clientData,
              backgroundColor: gradient,
              borderColor: 'rgba(65, 105, 225, 1)',
              borderWidth: 3,
              pointBackgroundColor: '#fff',
              pointBorderColor: 'rgba(65, 105, 225, 1)',
              pointBorderWidth: 2,
              pointRadius: 6,
              pointHoverRadius: 8,
              tension: 0.4,
              fill: true
            },
            {
              label: 'Industry Average',
              data: industryData,
              backgroundColor: 'transparent',
              borderColor: 'rgba(228, 95, 43, 0.7)',
              borderWidth: 2,
              borderDash: [5, 5],
              pointBackgroundColor: '#fff',
              pointBorderColor: 'rgba(228, 95, 43, 0.7)',
              pointBorderWidth: 2,
              pointRadius: 4,
              pointHoverRadius: 6,
              tension: 0.4,
              fill: false
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                boxWidth: 12,
                font: ticksFont
              }
            },
            tooltip: {
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              titleColor: '#222',
              titleFont: titleFont,
              bodyColor: '#555',
              bodyFont: bodyFont,
              borderColor: '#ddd',
              borderWidth: 1,
              padding: 12,
              boxPadding: 6,
              usePointStyle: true,
              callbacks: {
                label: function(context) {
                  return context.dataset.label + ': ' + context.parsed.y + '%';
                }
              }
            }
          },
          scales: {
            x: {
              grid: {
                display: false
              },
              ticks: {
                font: ticksFont
              }
            },
            y: {
              beginAtZero: true,
              max: 120,
              ticks: {
                font: ticksFont,
                callback: function(value) {
                  return value + '%';
                }
              },
              grid: {
                borderDash: [3, 3],
                color: 'rgba(0, 0, 0, 0.05)'
              }
            }
          },
          elements: {
            line: {
              tension: 0.4
            }
          },
          animation: {
            duration: 2000,
            easing: 'easeOutQuart'
          }
        }
      });
    }
    
    /**
     * Set up circle progress animations
     */
    function setupCircleAnimations() {
      // Animate all circle progress elements when they become visible
      const animateCircles = () => {
        const circles = document.querySelectorAll('.circle');
        
        circles.forEach(circle => {
          const value = circle.getAttribute('stroke-dasharray').split(',')[0];
          // Start with 0 progress
          circle.setAttribute('stroke-dasharray', '0, 100');
          
          // Animate to full progress
          setTimeout(() => {
            circle.setAttribute('stroke-dasharray', `${value}, 100`);
          }, 100);
        });
      };
      
      // Use Intersection Observer to trigger animations when section is visible
      const processSection = document.getElementById('process');
      if (!processSection) return;
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              animateCircles();
              // Only trigger once
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.3 }
      );
      
      observer.observe(processSection);
    }
  })();