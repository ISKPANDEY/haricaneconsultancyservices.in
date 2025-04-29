/**
 * Haricane Consultancy Services
 * Legal Pages JavaScript
 *
 * This file contains shared functionality for all legal pages 
 * (Privacy Policy, Terms of Service, Sitemap, Cookie Policy)
 */

(function() {
    'use strict';

    // Execute when DOM is fully loaded
    document.addEventListener('DOMContentLoaded', initializeLegalPage);

    /**
     * Main initialization function for all legal pages
     */
    function initializeLegalPage() {
        // Initialize all base components
        initAOS();
        setupNavbar();
        updateCopyrightYear();
        
        // Initialize shared legal-specific components
        setupTableOfContents();
        setupSmoothScrolling();
        setupScrollSpy();
        setupBackToTop();
        setupReadProgressIndicator();
        
        // Initialize page-specific functions based on current page
        const currentPage = getCurrentPage();
        
        if (currentPage === 'privacy') {
            setupPrivacyPage();
        } else if (currentPage === 'terms') {
            setupTermsPage();
        } else if (currentPage === 'cookies') {
            setupCookiesPage();
        } else if (currentPage === 'sitemap') {
            setupSitemapPage();
        }
    }

    /**
     * Get the current page type based on URL
     * @returns {string} Page type ('privacy', 'terms', 'cookies', 'sitemap', or 'other')
     */
    function getCurrentPage() {
        const path = window.location.pathname.toLowerCase();
        
        if (path.includes('privacy')) {
            return 'privacy';
        } else if (path.includes('terms')) {
            return 'terms';
        } else if (path.includes('cookies')) {
            return 'cookies';
        } else if (path.includes('sitemap')) {
            return 'sitemap';
        } else {
            return 'other';
        }
    }

    /**
     * Initialize Animate on Scroll (AOS) library
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
     * Generate a table of contents for the page
     */
    function setupTableOfContents() {
        // Check if TOC already exists (might be added in HTML for some pages)
        if (document.querySelector('.table-of-contents')) return;
        
        const legalCard = document.querySelector('.legal-card');
        const sections = document.querySelectorAll('.legal-section');
        
        // Only create TOC if there are enough sections and we have a legal card
        if (legalCard && sections.length > 3) {
            // Create TOC container
            const tocContainer = document.createElement('div');
            tocContainer.className = 'table-of-contents';
            tocContainer.innerHTML = '<h3>Table of Contents</h3>';
            
            // Create list of links
            const tocList = document.createElement('ul');
            
            sections.forEach((section, index) => {
                // Get the section heading
                const heading = section.querySelector('h2');
                if (!heading) return;
                
                // Add ID to section if not exists
                if (!section.id) {
                    section.id = 'section-' + (index + 1);
                }
                
                // Create list item with link
                const listItem = document.createElement('li');
                const link = document.createElement('a');
                link.href = '#' + section.id;
                link.textContent = heading.textContent;
                link.setAttribute('data-section', section.id);
                
                listItem.appendChild(link);
                tocList.appendChild(listItem);
            });
            
            tocContainer.appendChild(tocList);
            
            // Insert at beginning of legal card
            const firstChild = legalCard.firstChild;
            legalCard.insertBefore(tocContainer, firstChild);
        }
    }

    /**
     * Set up smooth scrolling for anchor links
     */
    function setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                
                // Only process if target exists and it's not just "#"
                if (targetId !== '#' && document.querySelector(targetId)) {
                    e.preventDefault();
                    
                    const targetElement = document.querySelector(targetId);
                    const headerOffset = 100;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update URL hash without scrolling
                    window.history.pushState(null, null, targetId);
                    
                    // Update active state in TOC
                    updateTocActiveState(targetId.substring(1));
                }
            });
        });
    }

    /**
     * Set up scrollspy to highlight current section in TOC
     */
    function setupScrollSpy() {
        const sections = document.querySelectorAll('.legal-section');
        if (sections.length === 0) return;
        
        // Update active section on scroll
        window.addEventListener('scroll', function() {
            let currentSectionId = '';
            
            // Find the section that is currently in view
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                
                if (window.pageYOffset >= sectionTop - 150 && 
                    window.pageYOffset < sectionTop + sectionHeight - 150) {
                    currentSectionId = section.id;
                }
            });
            
            // Update TOC active state
            if (currentSectionId) {
                updateTocActiveState(currentSectionId);
            }
        });
    }

    /**
     * Update active state in table of contents
     * @param {string} sectionId - ID of the active section
     */
    function updateTocActiveState(sectionId) {
        const tocLinks = document.querySelectorAll('.table-of-contents a');
        
        tocLinks.forEach(link => {
            // Remove active class from all links
            link.classList.remove('active');
            
            // Add active class to current section link
            if (link.getAttribute('data-section') === sectionId || 
                link.getAttribute('href') === '#' + sectionId) {
                link.classList.add('active');
            }
        });
    }

    /**
     * Set up back to top button
     */
    function setupBackToTop() {
        const backToTopBtn = document.getElementById('backToTop');
        
        // Create button if it doesn't exist
        if (!backToTopBtn) {
            const btn = document.createElement('button');
            btn.id = 'backToTop';
            btn.className = 'back-to-top';
            btn.setAttribute('aria-label', 'Back to top');
            btn.innerHTML = '<i class="fas fa-chevron-up"></i>';
            document.body.appendChild(btn);
        }
        
        // Show/hide button based on scroll position
        window.addEventListener('scroll', function() {
            const backToTopBtn = document.getElementById('backToTop');
            if (backToTopBtn) {
                backToTopBtn.classList.toggle('visible', window.pageYOffset > 300);
            }
        });
        
        // Scroll to top when clicked
        document.addEventListener('click', function(e) {
            if (e.target.closest('#backToTop')) {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });
    }

    /**
     * Add a reading progress indicator
     */
    function setupReadProgressIndicator() {
        // Create progress indicator if it doesn't exist
        if (!document.querySelector('.reading-progress')) {
            const progressContainer = document.createElement('div');
            progressContainer.className = 'reading-progress';
            
            const progressBar = document.createElement('div');
            progressBar.className = 'reading-progress-bar';
            
            progressContainer.appendChild(progressBar);
            document.body.appendChild(progressContainer);
        }
        
        // Update progress on scroll
        window.addEventListener('scroll', function() {
            const progressBar = document.querySelector('.reading-progress-bar');
            if (!progressBar) return;
            
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            
            progressBar.style.width = scrolled + '%';
        });
    }

    /**
     * Set up Privacy Policy page specific functionality
     */
    function setupPrivacyPage() {
        // Make the quick navigation sticky if it exists
        const quickNav = document.getElementById('privacy-quick-nav');
        
        if (quickNav) {
            // Update active link in quick nav
            const quickNavLinks = quickNav.querySelectorAll('a');
            
            // Handle clicks on quick nav links
            quickNavLinks.forEach(link => {
                link.addEventListener('click', function() {
                    quickNavLinks.forEach(l => l.classList.remove('active'));
                    this.classList.add('active');
                });
            });
            
            // Update active link on scroll
            window.addEventListener('scroll', function() {
                const sections = document.querySelectorAll('.legal-section');
                
                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.offsetHeight;
                    
                    if (window.pageYOffset >= sectionTop - 150 && 
                        window.pageYOffset < sectionTop + sectionHeight - 150) {
                        
                        const sectionId = section.id;
                        quickNavLinks.forEach(link => {
                            link.classList.toggle('active', link.getAttribute('href') === '#' + sectionId);
                        });
                    }
                });
            });
        }
        
        // Initialize any expandable sections
        const expandableSections = document.querySelectorAll('.expandable-section');
        expandableSections.forEach(section => {
            const toggle = section.querySelector('.section-toggle');
            const content = section.querySelector('.expandable-content');
            
            if (toggle && content) {
                toggle.addEventListener('click', function() {
                    content.classList.toggle('expanded');
                    toggle.classList.toggle('expanded');
                    
                    // Update toggle icon and text
                    const icon = toggle.querySelector('i');
                    if (icon) {
                        icon.classList.toggle('fa-chevron-down');
                        icon.classList.toggle('fa-chevron-up');
                    }
                });
            }
        });
    }

    /**
     * Set up Terms of Service page specific functionality
     */
    function setupTermsPage() {
        // Initialize any expandable definition terms
        const definitionTerms = document.querySelectorAll('.definition-term');
        definitionTerms.forEach(term => {
            term.addEventListener('click', function() {
                this.classList.toggle('expanded');
                
                // Toggle visibility of definition
                const definition = this.nextElementSibling;
                if (definition && definition.classList.contains('definition-content')) {
                    definition.classList.toggle('visible');
                }
            });
        });
    }

    /**
     * Set up Cookie Policy page specific functionality
     */
    function setupCookiesPage() {
        // Show cookie banner if consent not given
        const cookieBanner = document.getElementById('cookieConsentBanner');
        
        if (cookieBanner) {
            // Only show if consent not stored
            if (!localStorage.getItem('cookieConsent')) {
                setTimeout(() => {
                    cookieBanner.classList.add('visible');
                }, 1000);
            }
            
            // Handle accept all button
            const acceptAllBtn = cookieBanner.querySelector('.btn-accept-all');
            if (acceptAllBtn) {
                acceptAllBtn.addEventListener('click', () => {
                    localStorage.setItem('cookieConsent', JSON.stringify({
                        essential: true,
                        analytics: true,
                        functional: true,
                        targeting: true,
                        timestamp: new Date().toISOString()
                    }));
                    cookieBanner.classList.remove('visible');
                });
            }
            
            // Handle accept necessary button
            const acceptNecessaryBtn = cookieBanner.querySelector('.btn-accept-necessary');
            if (acceptNecessaryBtn) {
                acceptNecessaryBtn.addEventListener('click', () => {
                    localStorage.setItem('cookieConsent', JSON.stringify({
                        essential: true,
                        analytics: false,
                        functional: false,
                        targeting: false,
                        timestamp: new Date().toISOString()
                    }));
                    cookieBanner.classList.remove('visible');
                });
            }
            
            // Handle customize button
            const customizeBtn = cookieBanner.querySelector('.btn-cookie-customize');
            if (customizeBtn) {
                customizeBtn.addEventListener('click', () => {
                    // Show cookie settings modal if it exists
                    const modal = document.querySelector('.cookie-settings-modal');
                    if (modal) {
                        modal.classList.add('visible');
                    }
                    cookieBanner.classList.remove('visible');
                });
            }
        }
        
        // Initialize cookie settings modal
        const settingsModal = document.querySelector('.cookie-settings-modal');
        if (settingsModal) {
            // Close button
            const closeBtn = settingsModal.querySelector('.cookie-settings-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    settingsModal.classList.remove('visible');
                });
            }
            
            // Close when clicking outside content
            settingsModal.addEventListener('click', (e) => {
                if (e.target === settingsModal) {
                    settingsModal.classList.remove('visible');
                }
            });
            
            // Save preferences button
            const saveBtn = settingsModal.querySelector('.btn-save-preferences');
            if (saveBtn) {
                saveBtn.addEventListener('click', () => {
                    // Get preferences from toggles
                    const analyticsToggle = document.getElementById('analytics-cookies');
                    const functionalToggle = document.getElementById('functional-cookies');
                    const targetingToggle = document.getElementById('targeting-cookies');
                    
                    // Save to localStorage
                    localStorage.setItem('cookieConsent', JSON.stringify({
                        essential: true, // Always required
                        analytics: analyticsToggle ? analyticsToggle.checked : false,
                        functional: functionalToggle ? functionalToggle.checked : false,
                        targeting: targetingToggle ? targetingToggle.checked : false,
                        timestamp: new Date().toISOString()
                    }));
                    
                    // Close modal
                    settingsModal.classList.remove('visible');
                    
                    // Show saved message
                    showMessage('Your cookie preferences have been saved.');
                });
            }
            
            // Set initial toggle states from saved preferences
            const savedConsent = localStorage.getItem('cookieConsent');
            if (savedConsent) {
                const consent = JSON.parse(savedConsent);
                
                const analyticsToggle = document.getElementById('analytics-cookies');
                if (analyticsToggle) {
                    analyticsToggle.checked = consent.analytics || false;
                }
                
                const functionalToggle = document.getElementById('functional-cookies');
                if (functionalToggle) {
                    functionalToggle.checked = consent.functional || false;
                }
                
                const targetingToggle = document.getElementById('targeting-cookies');
                if (targetingToggle) {
                    targetingToggle.checked = consent.targeting || false;
                }
            }
        }
        
        // Initialize accept buttons in content
        const acceptAllButtons = document.querySelectorAll('.btn-accept-all:not(.cookie-banner)');
        acceptAllButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                localStorage.setItem('cookieConsent', JSON.stringify({
                    essential: true,
                    analytics: true,
                    functional: true,
                    targeting: true,
                    timestamp: new Date().toISOString()
                }));
                
                showMessage('All cookies accepted.');
            });
        });
        
        const essentialOnlyButtons = document.querySelectorAll('.btn-essential-only');
        essentialOnlyButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                localStorage.setItem('cookieConsent', JSON.stringify({
                    essential: true,
                    analytics: false,
                    functional: false,
                    targeting: false,
                    timestamp: new Date().toISOString()
                }));
                
                showMessage('Only essential cookies accepted.');
            });
        });
    }

    /**
     * Set up Sitemap page specific functionality
     */
    function setupSitemapPage() {
        // Add search functionality
        const sitemapWrapper = document.querySelector('.sitemap-wrapper');
        if (!sitemapWrapper) return;
        
        // Create search input if it doesn't exist
        if (!document.querySelector('.sitemap-search')) {
            const searchContainer = document.createElement('div');
            searchContainer.className = 'sitemap-search';
            searchContainer.innerHTML = `
                <div class="search-input-group">
                    <input type="text" id="sitemapSearch" placeholder="Search pages...">
                    <i class="fas fa-search"></i>
                </div>
            `;
            
            // Insert before the first row in sitemap wrapper
            const firstRow = sitemapWrapper.querySelector('.row');
            if (firstRow) {
                sitemapWrapper.insertBefore(searchContainer, firstRow);
            } else {
                sitemapWrapper.prepend(searchContainer);
            }
        }
        
        // Initialize search functionality
        const searchInput = document.getElementById('sitemapSearch');
        if (searchInput) {
            const allLinks = sitemapWrapper.querySelectorAll('.sitemap-list li');
            
            searchInput.addEventListener('input', function() {
                const query = this.value.toLowerCase().trim();
                
                // If empty query, show all
                if (!query) {
                    allLinks.forEach(link => {
                        link.style.display = '';
                    });
                    return;
                }
                
                // Filter links based on query
                allLinks.forEach(link => {
                    const text = link.textContent.toLowerCase();
                    const isMatch = text.includes(query);
                    link.style.display = isMatch ? '' : 'none';
                });
            });
        }
        
        // Add collapsible functionality to sections
        const sitemapSections = document.querySelectorAll('.sitemap-section');
        sitemapSections.forEach(section => {
            const heading = section.querySelector('h2');
            if (!heading) return;
            
            // Add toggle icon if not present
            if (!heading.querySelector('.sitemap-toggle')) {
                heading.style.cursor = 'pointer';
                const toggleIcon = document.createElement('i');
                toggleIcon.className = 'fas fa-chevron-down sitemap-toggle';
                heading.appendChild(toggleIcon);
            }
            
            // Add click handler
            heading.addEventListener('click', function() {
                const list = section.querySelector('.sitemap-list');
                if (!list) return;
                
                const isCollapsed = list.style.display === 'none';
                
                // Toggle display
                list.style.display = isCollapsed ? '' : 'none';
                
                // Update icon
                const icon = heading.querySelector('.sitemap-toggle');
                if (icon) {
                    icon.classList.toggle('fa-chevron-down', isCollapsed);
                    icon.classList.toggle('fa-chevron-right', !isCollapsed);
                }
            });
        });
    }
    
    /**
     * Show a message to the user
     * @param {string} message - The message to display
     * @param {string} type - Type of message ('success', 'error', etc.)
     */
    function showMessage(message, type = 'success') {
        // Create message element
        let messageEl = document.querySelector('.message-notification');
        
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.className = 'message-notification';
            document.body.appendChild(messageEl);
        }
        
        // Set content and show
        messageEl.textContent = message;
        messageEl.className = `message-notification ${type}`;
        
        // Add visible class
        messageEl.classList.add('visible');
        
        // Hide after delay
        setTimeout(() => {
            messageEl.classList.remove('visible');
        }, 3000);
    }
})();