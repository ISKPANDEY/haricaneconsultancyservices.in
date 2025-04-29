/**
 * Haricane Consultancy Services
 * Contact Page JavaScript
 *
 * This file handles all interactive elements on the contact page including:
 * - Form validation and submission
 * - Map initialization
 * - WhatsApp integration
 * - Dynamic content updates
 */

(function() {
    'use strict';
  
    // Configuration
    const config = {
      mapCoordinates: [22.5726, 88.3639], // Kolkata, India
      formSubmissionDelay: 1500, // ms to simulate form submission
      scrollOffset: 100
    };
  
    // DOM Elements (populated on init)
    let elements = {};
  
    // Execute when DOM is fully loaded
    document.addEventListener('DOMContentLoaded', init);
  
    /**
     * Initialize all contact page functionality
     */
    function init() {
      // Cache DOM elements
      cacheElements();
      
      // Initialize functionality
      initAOS();
      setupNavbar();
      setupFooter();
      setupContactForm();
      initMap();
      setupWhatsAppIntegration();
      setupServiceSelector();
      setupOfficeLocation();
      setupFaqAccordion();
    }
  
    /**
     * Cache DOM elements to minimize DOM queries
     */
    function cacheElements() {
      elements = {
        navbar: document.querySelector('.navbar'),
        contactForm: document.getElementById('contactForm'),
        statusMessage: document.getElementById('formStatusMessage'),
        mapContainer: document.getElementById('contactMap'),
        serviceSelect: document.getElementById('contactService'),
        subjectField: document.getElementById('contactSubject'),
        whatsappLinks: document.querySelectorAll('a[href^="https://wa.me/"]'),
        officeAddress: document.querySelector('.office-address'),
        faqItems: document.querySelectorAll('.accordion-item'),
        copyrightYear: document.getElementById('copyright-year')
      };
    }
  
    /**
     * Initialize Animate on Scroll library
     */
    function initAOS() {
      if (typeof AOS !== 'undefined') {
        AOS.init({
          duration: 800,
          easing: 'ease-in-out',
          once: true,
          offset: config.scrollOffset
        });
      }
    }
  
    /**
     * Set up navbar scroll effect
     */
    function setupNavbar() {
      if (!elements.navbar) return;
  
      // Handle navbar background on scroll
      function handleScroll() {
        elements.navbar.classList.toggle('scrolled', window.scrollY > 50);
      }
  
      window.addEventListener('scroll', handleScroll);
      handleScroll(); // Initial check
    }
  
    /**
     * Set up footer elements like year
     */
    function setupFooter() {
      if (elements.copyrightYear) {
        elements.copyrightYear.textContent = new Date().getFullYear();
      }
    }
  
    /**
     * Initialize and handle contact form
     */
    function setupContactForm() {
      if (!elements.contactForm || !elements.statusMessage) return;
  
      // Add form validation
      setupFormValidation();
  
      // Handle form submission
      elements.contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Check form validity
        if (!this.checkValidity()) {
          e.stopPropagation();
          this.classList.add('was-validated');
          highlightInvalidFields(this);
          return;
        }
  
        const formData = new FormData(this);
        submitForm(formData);
      });
    }
  
    /**
     * Set up form validation
     */
    function setupFormValidation() {
      if (!elements.contactForm) return;
  
      const inputs = elements.contactForm.querySelectorAll('input[required], textarea[required], select[required]');
      
      inputs.forEach(input => {
        // Validate on blur
        input.addEventListener('blur', function() {
          validateInput(this);
        });
        
        // Clear error state on input
        input.addEventListener('input', function() {
          this.classList.remove('is-invalid');
        });
      });
    }
  
    /**
     * Validate a single input field
     * @param {HTMLElement} input - The input element to validate
     */
    function validateInput(input) {
      if (!input.value.trim()) {
        input.classList.add('is-invalid');
        return false;
      }
      
      // Email validation
      if (input.type === 'email') {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(input.value)) {
          input.classList.add('is-invalid');
          return false;
        }
      }
      
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
      return true;
    }
  
    /**
     * Highlight all invalid fields in a form
     * @param {HTMLFormElement} form - The form to check
     */
    function highlightInvalidFields(form) {
      const requiredFields = form.querySelectorAll('[required]');
      
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          field.classList.add('is-invalid');
          
          // Scroll to first invalid field
          if (!form.querySelector('.is-invalid:first-of-type') !== field) {
            field.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      });
    }
  
    /**
     * Submit form data
     * @param {FormData} formData - The form data to submit
     */
    function submitForm(formData) {
      // Show loading state
      elements.statusMessage.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Sending your message...';
      elements.statusMessage.className = 'alert alert-info mt-4';
      elements.statusMessage.style.display = 'block';
  
      // Scroll to status message
      elements.statusMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  
      // For demo purposes - simulate form submission
      setTimeout(() => {
        showSuccessMessage();
      }, config.formSubmissionDelay);
  
      /*
      // Production code would use fetch API:
      fetch('your-form-endpoint', {
        method: 'POST',
        body: formData
      })
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => {
        showSuccessMessage();
      })
      .catch(error => {
        console.error('Error submitting form:', error);
        showErrorMessage();
      });
      */
    }
  
    /**
     * Show success message after form submission
     */
    function showSuccessMessage() {
      elements.contactForm.style.display = 'none';
      elements.statusMessage.innerHTML = '<i class="fas fa-check-circle me-2"></i> Thank you! Your message has been sent. We will contact you soon.';
      elements.statusMessage.className = 'alert confirmation-message mt-4 alert-success';
      elements.statusMessage.style.display = 'block';
      elements.contactForm.reset();
    }
  
    /**
     * Show error message if form submission fails
     */
    function showErrorMessage() {
      elements.statusMessage.innerHTML = '<i class="fas fa-exclamation-triangle me-2"></i> Sorry, there was a problem sending your message. Please try again or contact us directly.';
      elements.statusMessage.className = 'alert confirmation-message mt-4 alert-danger';
      elements.statusMessage.style.display = 'block';
    }
  
    /**
     * Initialize Leaflet map for office location
     */
    function initMap() {
      if (!elements.mapContainer || typeof L === 'undefined') return;
      
      // Initialize map
      const map = L.map(elements.mapContainer).setView(config.mapCoordinates, 13);
  
      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map);
  
      // Try to load custom marker icon
      const markerIcon = createCustomMarker();
  
      // Add marker
      const marker = L.marker(config.mapCoordinates, { 
        icon: markerIcon,
        title: 'Haricane Consultancy Services'
      }).addTo(map);
      
      // Add popup
      marker.bindPopup(`
        <div style="text-align: center;">
          <strong>Haricane Consultancy Services</strong><br>
          Haricane Tower, Kolkata
        </div>
      `).openPopup();
    }
  
    /**
     * Create custom marker icon for map
     * @returns {L.Icon|null} Leaflet icon or null for default
     */
    function createCustomMarker() {
      try {
        return L.icon({
          iconUrl: 'images/map-marker.svg',
          iconSize: [40, 40],
          iconAnchor: [20, 40],
          popupAnchor: [0, -40]
        });
      } catch (error) {
        console.warn('Could not load custom marker, using default', error);
        return null;
      }
    }
  
    /**
     * Set up WhatsApp integration features
     */
    function setupWhatsAppIntegration() {
      if (!elements.whatsappLinks || elements.whatsappLinks.length === 0) return;
      
      elements.whatsappLinks.forEach(link => {
        // Add default message if not present
        if (link.href.indexOf('?text=') === -1) {
          const phoneNumber = link.href.split('wa.me/')[1];
          const defaultMessage = 'Hello Haricane Consultancy, I would like to know more about your services.';
          link.href = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;
        }
        
        // Add tracking analytics event
        link.addEventListener('click', function(e) {
          // Track WhatsApp clicks (replace with actual analytics code)
          console.log('WhatsApp contact initiated:', this.href);
          
          // For production, use actual analytics:
          // if (typeof gtag !== 'undefined') {
          //   gtag('event', 'click', {
          //     'event_category': 'Contact',
          //     'event_label': 'WhatsApp'
          //   });
          // }
        });
      });
    }
  
    /**
     * Setup service selector functionality
     */
    function setupServiceSelector() {
      if (!elements.serviceSelect) return;
  
      // Check for service parameter in URL
      const urlParams = new URLSearchParams(window.location.search);
      const serviceParam = urlParams.get('service');
      
      if (serviceParam) {
        setSelectedService(serviceParam);
      }
  
      // Update subject field when service is selected
      elements.serviceSelect.addEventListener('change', function() {
        updateSubjectFromService(this.value, this.options[this.selectedIndex].text);
      });
    }
  
    /**
     * Set selected service based on URL parameter
     * @param {string} serviceParam - Service parameter from URL
     */
    function setSelectedService(serviceParam) {
      if (!elements.serviceSelect || !serviceParam) return;
  
      // Find matching option (case insensitive)
      const options = Array.from(elements.serviceSelect.options);
      const matchingOption = options.find(option => 
        option.value.toLowerCase() === serviceParam.toLowerCase());
  
      if (matchingOption) {
        matchingOption.selected = true;
        
        // Update subject field
        updateSubjectFromService(matchingOption.value, matchingOption.text);
        
        // Scroll to contact form after page loads
        setTimeout(() => {
          const contactSection = document.getElementById('contact-main');
          if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 800);
      }
    }
  
    /**
     * Update subject field based on selected service
     * @param {string} serviceValue - Value of selected service
     * @param {string} serviceText - Display text of selected service
     */
    function updateSubjectFromService(serviceValue, serviceText) {
      if (!elements.subjectField || !serviceValue || serviceValue === '') return;
      
      // Only update if subject is empty or contains default text
      if (!elements.subjectField.value || elements.subjectField.value.startsWith('Inquiry about')) {
        elements.subjectField.value = `Inquiry about ${serviceText}`;
      }
    }
  
    /**
     * Setup office location interactivity
     */
    function setupOfficeLocation() {
      if (!elements.officeAddress) return;
  
      // Make address clickable to open Google Maps
      elements.officeAddress.addEventListener('click', function() {
        window.open('https://www.google.com/maps/search/?api=1&query=Haricane+Tower+Kolkata+India', '_blank');
      });
  
      // Add visual cues that it's clickable
      elements.officeAddress.style.cursor = 'pointer';
      elements.officeAddress.title = 'Click to view on Google Maps';
      
      // Add hover effect
      elements.officeAddress.addEventListener('mouseenter', function() {
        this.style.opacity = '0.8';
        this.style.transform = 'translateY(-2px)';
      });
      
      elements.officeAddress.addEventListener('mouseleave', function() {
        this.style.opacity = '1';
        this.style.transform = 'translateY(0)';
      });
    }
  
    /**
     * Setup FAQ accordion functionality
     */
    function setupFaqAccordion() {
      if (!elements.faqItems || elements.faqItems.length === 0) return;
      
      // Ensure first item is open by default if none are
      let hasOpenItem = false;
      
      elements.faqItems.forEach(item => {
        const collapse = item.querySelector('.accordion-collapse');
        if (collapse && collapse.classList.contains('show')) {
          hasOpenItem = true;
        }
      });
      
      // If no open items, open the first one
      if (!hasOpenItem && elements.faqItems[0]) {
        const firstCollapse = elements.faqItems[0].querySelector('.accordion-collapse');
        const firstButton = elements.faqItems[0].querySelector('.accordion-button');
        
        if (firstCollapse && firstButton) {
          firstCollapse.classList.add('show');
          firstButton.classList.remove('collapsed');
          firstButton.setAttribute('aria-expanded', 'true');
        }
      }
    }
  })();