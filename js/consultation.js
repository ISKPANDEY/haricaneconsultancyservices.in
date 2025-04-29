/**
 * Haricane Consultancy Services
 * Consultation Page JavaScript
 *
 * This file handles all interactive functionality for the consultation page:
 * - Form handling and validation
 * - Date and time picker
 * - Type selection
 * - Expert selection
 * - AI assistant chat
 * - Calendar integration
 */

(function() {
    'use strict';
    
    // Cache DOM elements
    const elements = {};
    
    // Consultation types data
    const consultationTypes = {
        video: {
            name: 'Video Call',
            duration: '45 minutes',
            description: 'Face-to-face virtual meeting via your selected platform'
        },
        phone: {
            name: 'Phone Call',
            duration: '30 minutes',
            description: 'Direct call with our consultant'
        },
        'in-person': {
            name: 'In-Person Meeting',
            duration: '60 minutes',
            description: 'Meeting at our Kolkata office'
        }
    };
    
    // Expert data
    const experts = {
        'Om Prakash Bhardwaj': {
            specialty: 'Technical',
            image: 'images/team/om.jpeg'
        },
        'H S Raghaw': {
            specialty: 'Business',
            image: 'images/team/raghaw.png'
        },
        'S K Pandey': {
            specialty: 'AI & Web',
            image: 'images/team/satyam.jpeg'
        },
        'Darshan Raj': {
            specialty: 'Marketing',
            image: 'images/team/Darshan.jpeg'
        }
    };
    
    // AI Assistant predefined responses
    const aiResponses = {
        'Tell me about SEO services': 'Our SEO services include comprehensive keyword research, on-page optimization, technical SEO audits, and link building strategies. We focus on sustainable, white-hat techniques that improve your organic visibility and drive quality traffic to your website. Our clients typically see a 65-85% increase in organic traffic within 4-6 months of implementation.',
        
        'What\'s included in web development?': 'Our web development services cover everything from simple landing pages to complex e-commerce platforms. We develop responsive, user-friendly websites optimized for both performance and conversions. Every project includes:\n\n• Custom design tailored to your brand\n• Mobile-responsive layouts\n• SEO-friendly architecture\n• Integration with analytics and marketing tools\n• Content management system setup\n• Post-launch support and maintenance',
        
        'How can I improve my social media presence?': 'Improving your social media presence requires a strategic approach. Based on our experience, here are key recommendations:\n\n1. Define clear goals for each platform\n2. Create a consistent posting schedule\n3. Develop platform-specific content strategies\n4. Engage actively with your audience\n5. Use analytics to refine your approach\n6. Consider targeted paid campaigns\n\nOur social media team can develop a customized strategy based on your specific business goals and target audience.',
        
        'What are your pricing packages?': 'We offer three main pricing tiers:\n\n• Starter: ₹25,000/month - Includes basic SEO, PPC management, social media, and content marketing\n• Growth: ₹50,000/month - Comprehensive digital marketing with increased scope and frequency\n• Enterprise: ₹1,00,000/month - Full-scale digital marketing and development solutions\n\nEach package can be customized to your specific needs. Would you like to schedule a consultation to discuss which option might be best for your business?'
    };

    // Document ready event
    document.addEventListener('DOMContentLoaded', init);

    /**
     * Initialize all page functionality
     */
    function init() {
        // Cache DOM elements
        cacheElements();
        
        // Initialize libraries
        initAOS();
        initDatepicker();
        
        // Set up event listeners
        setupConsultationTypeSelection();
        setupExpertSelection();
        setupFormValidation();
        setupAIAssistant();
        
        // Initialize page based on URL parameters
        handleUrlParams();
        
        // Update copyright year in footer
        updateCopyrightYear();
        
        // Set up navbar scroll effect
        setupNavbar();
    }

    /**
     * Cache DOM elements for better performance
     */
    function cacheElements() {
        elements.navbar = document.querySelector('.navbar');
        elements.typeButtons = document.querySelectorAll('.btn-select-type');
        elements.expertButtons = document.querySelectorAll('.btn-book-expert');
        elements.consultationTypeSelect = document.getElementById('consultationType');
        elements.platformContainer = document.getElementById('platform-container');
        elements.expertSelect = document.getElementById('expertSelect');
        elements.bookingForm = document.getElementById('bookingForm');
        elements.datePickerInput = document.getElementById('consultationDate');
        elements.bookingResponse = document.getElementById('bookingResponse');
        elements.confirmDate = document.getElementById('confirmDate');
        elements.confirmTime = document.getElementById('confirmTime');
        elements.confirmType = document.getElementById('confirmType');
        elements.confirmExpert = document.getElementById('confirmExpert');
        elements.submitButton = document.querySelector('.btn-submit-booking');
        elements.googleCalendarLink = document.getElementById('googleCalendarLink');
        elements.outlookCalendarLink = document.getElementById('outlookCalendarLink');
        elements.aiChatForm = document.getElementById('aiChatForm');
        elements.aiConversation = document.getElementById('aiConversation');
        elements.userMessageInput = document.getElementById('userMessage');
        elements.quickOptions = document.querySelectorAll('.quick-option');
        elements.copyrightYear = document.getElementById('copyright-year');
    }

    /**
     * Initialize AOS animation library
     */
    function initAOS() {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-in-out',
                once: true,
                offset: 100
            });
        }
    }

    /**
     * Initialize date picker using Flatpickr
     */
    function initDatepicker() {
        if (typeof flatpickr === 'undefined' || !elements.datePickerInput) return;
        
        // Get today and max date (3 months from now)
        const today = new Date();
        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 3);
        
        // Create array of disabled dates (weekends)
        const disabledDates = [
            function(date) {
                // Disable weekends (0 is Sunday, 6 is Saturday)
                return date.getDay() === 0;
            }
        ];
        
        // Initialize flatpickr
        flatpickr(elements.datePickerInput, {
            minDate: 'today',
            maxDate: maxDate,
            disable: disabledDates,
            dateFormat: 'Y-m-d',
            altInput: true,
            altFormat: 'F j, Y',
            disableMobile: true
        });
    }

    /**
     * Set up consultation type selection
     */
    function setupConsultationTypeSelection() {
        // Handle type selection from cards
        if (elements.typeButtons) {
            elements.typeButtons.forEach(button => {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    const type = this.getAttribute('data-type');
                    
                    // Scroll to booking section
                    const bookingSection = document.getElementById('booking-section');
                    if (bookingSection) {
                        bookingSection.scrollIntoView({ behavior: 'smooth' });
                    }
                    
                    // Set selected type in dropdown
                    setTimeout(() => {
                        if (elements.consultationTypeSelect) {
                            setConsultationType(type);
                        }
                    }, 800);
                });
            });
        }
        
        // Show/hide platform selection based on consultation type
        if (elements.consultationTypeSelect) {
            elements.consultationTypeSelect.addEventListener('change', function() {
                updatePlatformVisibility(this.value);
            });
        }
    }

    /**
     * Set consultation type in the select dropdown
     * @param {string} type - The consultation type
     */
    function setConsultationType(type) {
        if (!elements.consultationTypeSelect) return;
        
        const options = elements.consultationTypeSelect.options;
        for (let i = 0; i < options.length; i++) {
            if (options[i].value === type) {
                elements.consultationTypeSelect.selectedIndex = i;
                
                // Trigger change event to update platform visibility
                const event = new Event('change');
                elements.consultationTypeSelect.dispatchEvent(event);
                break;
            }
        }
    }

    /**
     * Update platform selector visibility based on consultation type
     * @param {string} type - The consultation type
     */
    function updatePlatformVisibility(type) {
        if (!elements.platformContainer) return;
        
        if (type === 'video') {
            elements.platformContainer.style.display = 'block';
        } else {
            elements.platformContainer.style.display = 'none';
        }
    }

    /**
     * Set up expert selection
     */
    function setupExpertSelection() {
        if (elements.expertButtons) {
            elements.expertButtons.forEach(button => {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    const expert = this.getAttribute('data-expert');
                    const specialty = this.getAttribute('data-specialty');
                    
                    // Scroll to booking section
                    const bookingSection = document.getElementById('booking-section');
                    if (bookingSection) {
                        bookingSection.scrollIntoView({ behavior: 'smooth' });
                    }
                    
                    // Set selected expert in dropdown
                    setTimeout(() => {
                        if (elements.expertSelect) {
                            setExpertSelection(expert);
                        }
                    }, 800);
                });
            });
        }
    }

    /**
     * Set expert selection in the dropdown
     * @param {string} expert - The expert name
     */
    function setExpertSelection(expert) {
        if (!elements.expertSelect) return;
        
        const options = elements.expertSelect.options;
        for (let i = 0; i < options.length; i++) {
            if (options[i].value === expert) {
                elements.expertSelect.selectedIndex = i;
                break;
            }
        }
    }

    /**
     * Set up form validation and submission
     */
    function setupFormValidation() {
        if (!elements.bookingForm) return;
        
        elements.bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!validateForm(this)) {
                return false;
            }
            
            // Show loading state
            if (elements.submitButton) {
                elements.submitButton.classList.add('loading');
                elements.submitButton.disabled = true;
            }
            
            // Simulate form submission (replace with actual form submission in production)
            setTimeout(() => {
                showBookingConfirmation();
            }, 1500);
        });
        
        // Add validation to required fields
        const requiredFields = elements.bookingForm.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            field.addEventListener('blur', function() {
                validateField(this);
            });
            
            field.addEventListener('input', function() {
                // Remove error styling when user starts typing
                this.classList.remove('is-invalid');
            });
        });
    }

    /**
     * Validate the entire form
     * @param {HTMLFormElement} form - The form to validate
     * @returns {boolean} - Whether the form is valid
     */
    function validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    /**
     * Validate a single form field
     * @param {HTMLElement} field - The field to validate
     * @returns {boolean} - Whether the field is valid
     */
    function validateField(field) {
        // Skip non-visible fields
        if (field.offsetParent === null) return true;
        
        const value = field.value.trim();
        if (!value) {
            field.classList.add('is-invalid');
            return false;
        }
        
        // Validate email
        if (field.type === 'email') {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(value)) {
                field.classList.add('is-invalid');
                return false;
            }
        }
        
        // Validate phone
        if (field.id === 'phone') {
            const phonePattern = /^[\d\s\+\-\(\)]{7,20}$/;
            if (!phonePattern.test(value)) {
                field.classList.add('is-invalid');
                return false;
            }
        }
        
        field.classList.remove('is-invalid');
        return true;
    }

    /**
     * Show booking confirmation with details
     */
    function showBookingConfirmation() {
        if (!elements.bookingForm || !elements.bookingResponse) return;
        
        // Get form data
        const formData = new FormData(elements.bookingForm);
        const bookingData = {
            fullName: formData.get('fullName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            consultationType: formData.get('consultationType'),
            expertSelect: formData.get('expertSelect') || 'No preference (Best match)',
            serviceInterest: formData.get('serviceInterest'),
            consultationDate: formData.get('consultationDate'),
            consultationTime: formData.get('consultationTime')
        };
        
        // Format date and time for display
        const formattedDate = formatDate(bookingData.consultationDate);
        const formattedTime = formatTime(bookingData.consultationTime);
        
        // Get consultation type display name
        const consultationType = consultationTypes[bookingData.consultationType]?.name || bookingData.consultationType;
        
        // Update confirmation details
        if (elements.confirmDate) elements.confirmDate.textContent = formattedDate;
        if (elements.confirmTime) elements.confirmTime.textContent = formattedTime;
        if (elements.confirmType) elements.confirmType.textContent = consultationType;
        if (elements.confirmExpert) elements.confirmExpert.textContent = bookingData.expertSelect;
        
        // Update calendar links
        if (elements.googleCalendarLink) {
            elements.googleCalendarLink.href = createGoogleCalendarLink(bookingData);
        }
        
        if (elements.outlookCalendarLink) {
            elements.outlookCalendarLink.href = createOutlookCalendarLink(bookingData);
        }
        
        // Hide form and show confirmation
        elements.bookingForm.style.display = 'none';
        elements.bookingResponse.style.display = 'block';
        
        // Scroll to confirmation message
        elements.bookingResponse.scrollIntoView({ behavior: 'smooth' });
    }

    /**
     * Format date for display
     * @param {string} dateString - The date string
     * @returns {string} - Formatted date
     */
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }

    /**
     * Format time for display
     * @param {string} timeString - The time value from select
     * @returns {string} - Formatted time
     */
    function formatTime(timeString) {
        const timeMap = {
            '10:00': '10:00 AM - 10:45 AM',
            '11:00': '11:00 AM - 11:45 AM',
            '12:00': '12:00 PM - 12:45 PM',
            '14:00': '2:00 PM - 2:45 PM',
            '15:00': '3:00 PM - 3:45 PM',
            '16:00': '4:00 PM - 4:45 PM',
            '17:00': '5:00 PM - 5:45 PM'
        };
        
        return timeMap[timeString] || timeString;
    }

    /**
     * Create Google Calendar link
     * @param {Object} bookingData - The booking data
     * @returns {string} - Google Calendar URL
     */
    function createGoogleCalendarLink(bookingData) {
        const consultationType = consultationTypes[bookingData.consultationType]?.name || bookingData.consultationType;
        const startTime = getISODateTime(bookingData.consultationDate, bookingData.consultationTime);
        
        // Calculate end time based on consultation type duration
        const endTime = getEndTime(startTime, bookingData.consultationType);
        
        const title = `Haricane Consultancy - ${consultationType} with ${bookingData.expertSelect}`;
        const description = `Service: ${bookingData.serviceInterest}\nConsultant: ${bookingData.expertSelect}\nType: ${consultationType}\n\nHaricane Consultancy Services\nPhone: +91 70507 45124\nEmail: haricaneconsultancy@gmail.com`;
        const location = bookingData.consultationType === 'in-person' ? 'Haricane Tower, Kolkata, India' : 'Virtual Meeting';
        
        const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startTime}/${endTime}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}&sf=true&output=xml`;
        
        return url;
    }

    /**
     * Create Outlook Calendar link
     * @param {Object} bookingData - The booking data
     * @returns {string} - Outlook Calendar URL
     */
    function createOutlookCalendarLink(bookingData) {
        const consultationType = consultationTypes[bookingData.consultationType]?.name || bookingData.consultationType;
        const startTime = getISODateTime(bookingData.consultationDate, bookingData.consultationTime);
        
        // Calculate end time based on consultation type duration
        const endTime = getEndTime(startTime, bookingData.consultationType);
        
        const title = `Haricane Consultancy - ${consultationType} with ${bookingData.expertSelect}`;
        const description = `Service: ${bookingData.serviceInterest}\nConsultant: ${bookingData.expertSelect}\nType: ${consultationType}\n\nHaricane Consultancy Services\nPhone: +91 70507 45124\nEmail: haricaneconsultancy@gmail.com`;
        const location = bookingData.consultationType === 'in-person' ? 'Haricane Tower, Kolkata, India' : 'Virtual Meeting';
        
        const url = `data:text/calendar;charset=utf8,BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${startTime}
DTEND:${endTime}
SUMMARY:${title}
DESCRIPTION:${description}
LOCATION:${location}
END:VEVENT
END:VCALENDAR`;
        
        return url;
    }

    /**
     * Get ISO date-time string for calendar
     * @param {string} dateStr - The date string
     * @param {string} timeStr - The time string
     * @returns {string} - ISO date-time string
     */
    function getISODateTime(dateStr, timeStr) {
        const date = new Date(dateStr);
        const [hours, minutes] = timeStr.split(':');
        
        date.setHours(parseInt(hours, 10));
        date.setMinutes(parseInt(minutes, 10));
        date.setSeconds(0);
        
        // Format: 20230830T140000Z (for August 30, 2023, 2:00 PM UTC)
        return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    }

    /**
     * Calculate end time based on consultation type
     * @param {string} startTime - Start time in ISO format
     * @param {string} type - Consultation type
     * @returns {string} - End time in ISO format
     */
    function getEndTime(startTime, type) {
        // Create date from ISO string
        const dateStr = startTime.replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z/, '$1-$2-$3T$4:$5:$6Z');
        const date = new Date(dateStr);
        
        // Add duration based on consultation type
        switch(type) {
            case 'video':
                date.setMinutes(date.getMinutes() + 45);
                break;
            case 'phone':
                date.setMinutes(date.getMinutes() + 30);
                break;
            case 'in-person':
                date.setMinutes(date.getMinutes() + 60);
                break;
            default:
                date.setMinutes(date.getMinutes() + 45);
        }
        
        // Return in ISO format
        return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    }

    /**
     * Set up AI assistant chat functionality
     */
    function setupAIAssistant() {
        if (!elements.aiChatForm || !elements.aiConversation || !elements.userMessageInput) return;
        
        // Handle form submission
        elements.aiChatForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const message = elements.userMessageInput.value.trim();
            if (!message) return;
            
            // Add user message to conversation
            addUserMessage(message);
            
            // Clear input
            elements.userMessageInput.value = '';
            
            // Process and respond
            processUserMessage(message);
        });
        
        // Handle quick option clicks
        if (elements.quickOptions) {
            elements.quickOptions.forEach(option => {
                option.addEventListener('click', function() {
                    const query = this.getAttribute('data-query');
                    
                    // Add user message
                    addUserMessage(query);
                    
                    // Remove quick options after selection
                    const quickOptionsContainer = document.querySelector('.ai-quick-options');
                    if (quickOptionsContainer) {
                        quickOptionsContainer.style.display = 'none';
                    }
                    
                    // Process and respond
                    processUserMessage(query);
                });
            });
        }
    }

    /**
     * Add user message to conversation
     * @param {string} message - User message text
     */
    function addUserMessage(message) {
        if (!elements.aiConversation) return;
        
        const messageElem = document.createElement('div');
        messageElem.className = 'message user-message';
        
        // Format message content
        messageElem.innerHTML = `
            <div class="message-content">
                <p>${formatMessageText(message)}</p>
            </div>
            <div class="message-time">Just now</div>
        `;
        
        // Add to conversation
        elements.aiConversation.appendChild(messageElem);
        
        // Scroll to bottom
        elements.aiConversation.scrollTop = elements.aiConversation.scrollHeight;
    }

    /**
     * Process user message and generate AI response
     * @param {string} message - User message text
     */
    function processUserMessage(message) {
        if (!elements.aiConversation) return;
        
        // Show typing indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'message ai-message typing-indicator';
        typingIndicator.innerHTML = `
            <div class="message-content">
                <p>Typing<span class="dot">.</span><span class="dot">.</span><span class="dot">.</span></p>
            </div>
        `;
        elements.aiConversation.appendChild(typingIndicator);
        elements.aiConversation.scrollTop = elements.aiConversation.scrollHeight;
        
        // Animate typing dots
        let dotIndex = 0;
        const dots = typingIndicator.querySelectorAll('.dot');
        const typingAnimation = setInterval(() => {
            dots.forEach((dot, i) => {
                dot.style.opacity = i === dotIndex ? '1' : '0.3';
            });
            dotIndex = (dotIndex + 1) % dots.length;
        }, 300);
        
        // Generate response with delay for natural feel
        setTimeout(() => {
            // Clear typing indicator
            clearInterval(typingAnimation);
            typingIndicator.remove();
            
            // Get response
            const response = getAIResponse(message);
            
            // Add AI response
            addAIResponse(response);
        }, 1500);
    }

    /**
     * Get AI response based on user message
     * @param {string} message - User message
     * @returns {string} - AI response
     */
    function getAIResponse(message) {
        // Check for predefined responses
        const normalizedMessage = message.toLowerCase();
        
        // Check exact matches in predefined responses
        if (aiResponses[message]) {
            return aiResponses[message];
        }
        
        // Check for keywords in the message
        if (normalizedMessage.includes('seo') || normalizedMessage.includes('search engine')) {
            return aiResponses['Tell me about SEO services'];
        } else if (normalizedMessage.includes('web') || normalizedMessage.includes('website') || normalizedMessage.includes('development')) {
            return aiResponses["What's included in web development?"];
        } else if (normalizedMessage.includes('social') || normalizedMessage.includes('facebook') || normalizedMessage.includes('instagram')) {
            return aiResponses['How can I improve my social media presence?'];
        } else if (normalizedMessage.includes('price') || normalizedMessage.includes('cost') || normalizedMessage.includes('package') || normalizedMessage.includes('pricing')) {
            return aiResponses['What are your pricing packages?'];
        }
        
        // General response if no matches
        return "Thanks for your question! To provide you with the most accurate and personalized information, I recommend scheduling a free consultation with one of our experts. They will be able to address your specific needs and provide tailored solutions. Would you like to know more about a particular service, or would you prefer to schedule a consultation?";
    }

    /**
     * Add AI response to conversation
     * @param {string} response - Response text
     */
    function addAIResponse(response) {
        if (!elements.aiConversation) return;
        
        const messageElem = document.createElement('div');
        messageElem.className = 'message ai-message';
        
        // Format response with paragraphs
        const formattedResponse = formatMessageText(response);
        
        messageElem.innerHTML = `
            <div class="message-content">
                ${formattedResponse}
            </div>
            <div class="message-time">Just now</div>
        `;
        
        // Add to conversation
        elements.aiConversation.appendChild(messageElem);
        
        // Scroll to bottom
        elements.aiConversation.scrollTop = elements.aiConversation.scrollHeight;
    }

    /**
     * Format message text with paragraphs and lists
     * @param {string} text - Message text
     * @returns {string} - Formatted HTML
     */
    function formatMessageText(text) {
        // Handle line breaks and convert them to paragraphs
        let formatted = text.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>');
        
        // If no paragraph tags were added, wrap the entire text in a paragraph
        if (!formatted.includes('</p><p>')) {
            formatted = '<p>' + formatted + '</p>';
        } else {
            formatted = '<p>' + formatted + '</p>';
        }
        
        // Handle bullet points and numbered lists
        formatted = formatted.replace(/• (.*?)(<br>|<\/p>)/g, '<li>$1</li>$2');
        formatted = formatted.replace(/<p>(\d+\. )(.*?)(<br>|<\/p>)/g, '<ol><li>$2</li>$3');
        
        // If we opened a list, make sure we close it
        if (formatted.includes('<li>') && !formatted.includes('</ul>') && !formatted.includes('</ol>')) {
            formatted = formatted.replace(/<p>(.*)(<li>.*<\/li>)(.*?)(<\/p>)/g, '<p>$1</p><ul>$2</ul><p>$3</p>');
        }
        
        return formatted;
    }

    /**
     * Handle URL parameters to pre-fill form fields
     */
    function handleUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        
        // Check for service parameter
        const service = urlParams.get('service');
        if (service && elements.consultationTypeSelect) {
            const serviceSelect = document.getElementById('serviceInterest');
            if (serviceSelect) {
                // Find matching option
                const options = Array.from(serviceSelect.options);
                const matchingOption = options.find(option => 
                    option.value.toLowerCase() === service.toLowerCase());
                
                if (matchingOption) {
                    serviceSelect.value = matchingOption.value;
                }
            }
        }
        
        // Check for type parameter
        const type = urlParams.get('type');
        if (type && elements.consultationTypeSelect) {
            setConsultationType(type);
        }
        
        // Check for expert parameter
        const expert = urlParams.get('expert');
        if (expert && elements.expertSelect) {
            setExpertSelection(expert);
        }
    }

    /**
     * Update copyright year in footer
     */
    function updateCopyrightYear() {
        if (elements.copyrightYear) {
            elements.copyrightYear.textContent = new Date().getFullYear();
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
        
        // Initial check
        handleScroll();
    }
})();