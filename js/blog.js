/**
 * Haricane Consultancy Services
 * Blog Pages JavaScript
 *
 * This file contains custom scripts for blog pages including
 * table of contents functionality, code highlighting, reading time calculator,
 * smooth scrolling anchors, and other interactive components.
 */

(function() {
    'use strict';

    // Execute when DOM is fully loaded
    document.addEventListener('DOMContentLoaded', initializeBlogPage);

    /**
     * Main initialization function for blog pages
     */
    function initializeBlogPage() {
        // Initialize all base components (from main.js if available)
        if (typeof initAOS === 'function') initAOS();
        setupNavbar();
        updateCopyrightYear();
        setupSmoothScrolling();
        setupActiveHeadingTracking();
        
        // Initialize blog-specific components
        setupTableOfContents();
        calculateReadingTime();
        setupSyntaxHighlighting();
        setupCommentForm();
        setupShareLinks();
        handleImageLightbox();
        setupRelatedArticlesHover();
        initializeCopyCodeButtons();
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
     * Set up smooth scrolling for anchor links
     */
    function setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                // Skip links that aren't actually anchors
                if (this.getAttribute('href') === '#' || this.getAttribute('role') === 'button') return;
                
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Calculate offset for fixed header
                    const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = targetPosition - navbarHeight - 20;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update URL hash without scrolling
                    history.pushState(null, null, targetId);
                }
            });
        });
    }

    /**
     * Set up the table of contents functionality
     */
    function setupTableOfContents() {
        const toc = document.querySelector('.table-of-contents');
        if (!toc) return;
        
        // Initial opacity for all TOC links
        const tocLinks = toc.querySelectorAll('a');
        tocLinks.forEach(link => {
            link.style.opacity = '0.8';
        });
        
        // Find the first link and highlight it by default
        if (tocLinks.length > 0) {
            tocLinks[0].style.opacity = '1';
            tocLinks[0].style.color = 'var(--primary-color)';
        }
    }
    
    /**
     * Track active headings while scrolling and update TOC
     */
    function setupActiveHeadingTracking() {
        const toc = document.querySelector('.table-of-contents');
        if (!toc) return;
        
        const headings = document.querySelectorAll('.entry-content h2[id]');
        const tocLinks = toc.querySelectorAll('a');
        
        if (headings.length === 0 || tocLinks.length === 0) return;
        
        const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
        const headingTops = Array.from(headings).map(heading => {
            return {
                id: heading.id,
                top: heading.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 100
            };
        });
        
        function highlightCurrentHeading() {
            const scrollPosition = window.pageYOffset;
            
            // Find the current heading
            let currentHeadingIndex = headingTops.length - 1;
            for (let i = 0; i < headingTops.length; i++) {
                if (scrollPosition < headingTops[i].top) {
                    currentHeadingIndex = Math.max(0, i - 1);
                    break;
                }
            }
            
            // Update TOC links
            tocLinks.forEach(link => {
                link.style.opacity = '0.8';
                link.style.color = '';
                link.style.fontWeight = '';
            });
            
            // Highlight the current TOC link
            const currentId = headingTops[currentHeadingIndex]?.id;
            if (currentId) {
                const currentLink = toc.querySelector(`a[href="#${currentId}"]`);
                if (currentLink) {
                    currentLink.style.opacity = '1';
                    currentLink.style.color = 'var(--primary-color)';
                    currentLink.style.fontWeight = '600';
                }
            }
        }
        
        window.addEventListener('scroll', highlightCurrentHeading);
        // Initial check
        highlightCurrentHeading();
    }

    /**
     * Calculate and display estimated reading time
     */
    function calculateReadingTime() {
        const readingTimeElement = document.querySelector('.reading-time');
        const entryContent = document.querySelector('.entry-content');
        
        if (!readingTimeElement || !entryContent) return;
        
        // Get all text content from the article
        const content = entryContent.textContent;
        // Calculate words (average reading speed is 200-250 words per minute)
        const words = content.split(/\s+/).length;
        const readingTime = Math.ceil(words / 200);
        
        readingTimeElement.textContent = `${readingTime} min read`;
    }

    /**
     * Initialize syntax highlighting for code blocks
     */
    function setupSyntaxHighlighting() {
        // Check if Prism is available and if there are code blocks
        if (typeof Prism !== 'undefined' && document.querySelector('pre code')) {
            Prism.highlightAll();
        }
    }

    /**
     * Handle comment form submission
     */
    function setupCommentForm() {
        const form = document.querySelector('.comment-form');
        if (!form) return;
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simulate form submission with a loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Submitting...';
            submitBtn.disabled = true;
            
            // Simulate a successful submission after a short delay
            setTimeout(() => {
                // Create a new comment element
                const commentsSection = document.querySelector('.comments-section');
                const commentsList = commentsSection.querySelectorAll('.comment');
                const newComment = document.createElement('div');
                newComment.className = 'comment';
                
                const nameInput = form.querySelector('input[placeholder="Your Name"]');
                const commentText = form.querySelector('textarea');
                
                if (commentsList.length > 0 && nameInput && commentText) {
                    const avatarSrc = '../images/testimonials/person5.jpg'; // Default avatar
                    const currentDate = new Date().toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });
                    
                    newComment.innerHTML = `
                        <div class="comment-avatar">
                            <img src="${avatarSrc}" alt="${nameInput.value}">
                        </div>
                        <div class="comment-content">
                            <div class="comment-meta">
                                <h4>${nameInput.value}</h4>
                                <span class="comment-date">${currentDate}</span>
                            </div>
                            <p>${commentText.value}</p>
                            <div class="comment-actions">
                                <a href="#" class="reply-link">Reply</a>
                            </div>
                        </div>
                    `;
                    
                    // Insert the new comment before the comment form
                    const commentFormContainer = document.querySelector('.comment-form-container');
                    commentsSection.insertBefore(newComment, commentFormContainer);
                    
                    // Update the comment count
                    const commentsTitle = commentsSection.querySelector('h3');
                    if (commentsTitle) {
                        const commentCount = commentsSection.querySelectorAll('.comment').length;
                        commentsTitle.textContent = `Comments (${commentCount})`;
                    }
                    
                    // Show a success message
                    const successMessage = document.createElement('div');
                    successMessage.className = 'alert alert-success mt-3';
                    successMessage.innerHTML = '<i class="fas fa-check-circle me-2"></i> Your comment has been submitted and is awaiting moderation.';
                    form.parentNode.insertBefore(successMessage, form.nextSibling);
                    
                    // Hide the success message after 5 seconds
                    setTimeout(() => {
                        successMessage.style.transition = 'opacity 1s ease-out';
                        successMessage.style.opacity = '0';
                        setTimeout(() => successMessage.remove(), 1000);
                    }, 5000);
                    
                    // Reset the form
                    form.reset();
                }
                
                // Restore the submit button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }

    /**
     * Set up share links functionality
     */
    function setupShareLinks() {
        const shareLinks = document.querySelectorAll('.share-link');
        if (shareLinks.length === 0) return;
        
        shareLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const pageUrl = encodeURIComponent(window.location.href);
                const pageTitle = encodeURIComponent(document.title);
                let shareUrl;
                
                // Get the platform from the icon class
                const icon = this.querySelector('i');
                if (icon.classList.contains('fa-facebook-f')) {
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
                } else if (icon.classList.contains('fa-twitter')) {
                    shareUrl = `https://twitter.com/intent/tweet?url=${pageUrl}&text=${pageTitle}`;
                } else if (icon.classList.contains('fa-linkedin-in')) {
                    shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`;
                } else if (icon.classList.contains('fa-envelope')) {
                    shareUrl = `mailto:?subject=${pageTitle}&body=Check out this article: ${pageUrl}`;
                }
                
                if (shareUrl) {
                    // Open a share window
                    window.open(shareUrl, 'share-window', 'height=450, width=550, top=' + 
                      (window.innerHeight / 2 - 225) + ', left=' + (window.innerWidth / 2 - 275));
                }
            });
        });
    }

    /**
     * Handle image lightbox functionality
     */
    function handleImageLightbox() {
        // Get all content images except icons, avatars, etc.
        const contentImages = document.querySelectorAll('.entry-content img:not(.author-img):not(.icon):not(.avatar)');
        
        contentImages.forEach(img => {
            // Make images clickable
            img.style.cursor = 'pointer';
            
            img.addEventListener('click', function() {
                // Create lightbox overlay
                const lightbox = document.createElement('div');
                lightbox.className = 'lightbox-overlay';
                lightbox.style.position = 'fixed';
                lightbox.style.top = '0';
                lightbox.style.left = '0';
                lightbox.style.width = '100%';
                lightbox.style.height = '100%';
                lightbox.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
                lightbox.style.zIndex = '9999';
                lightbox.style.display = 'flex';
                lightbox.style.alignItems = 'center';
                lightbox.style.justifyContent = 'center';
                lightbox.style.opacity = '0';
                lightbox.style.transition = 'opacity 0.3s ease';
                
                // Create lightbox image
                const lightboxImg = document.createElement('img');
                lightboxImg.src = this.src;
                lightboxImg.style.maxWidth = '90%';
                lightboxImg.style.maxHeight = '90%';
                lightboxImg.style.border = '5px solid white';
                lightboxImg.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.3)';
                
                // Create close button
                const closeBtn = document.createElement('button');
                closeBtn.textContent = '×';
                closeBtn.style.position = 'absolute';
                closeBtn.style.top = '20px';
                closeBtn.style.right = '20px';
                closeBtn.style.backgroundColor = 'transparent';
                closeBtn.style.border = 'none';
                closeBtn.style.color = 'white';
                closeBtn.style.fontSize = '40px';
                closeBtn.style.cursor = 'pointer';
                
                // Add elements to the DOM
                lightbox.appendChild(lightboxImg);
                lightbox.appendChild(closeBtn);
                document.body.appendChild(lightbox);
                
                // Prevent page scrolling when lightbox is open
                document.body.style.overflow = 'hidden';
                
                // Fade in lightbox
                setTimeout(() => {
                    lightbox.style.opacity = '1';
                }, 10);
                
                // Close lightbox when clicking close button or outside the image
                closeBtn.addEventListener('click', closeLightbox);
                lightbox.addEventListener('click', function(e) {
                    if (e.target === lightbox) {
                        closeLightbox();
                    }
                });
                
                // Close lightbox with escape key
                document.addEventListener('keydown', function escapeHandler(e) {
                    if (e.key === 'Escape') {
                        closeLightbox();
                        document.removeEventListener('keydown', escapeHandler);
                    }
                });
                
                function closeLightbox() {
                    lightbox.style.opacity = '0';
                    setTimeout(() => {
                        document.body.removeChild(lightbox);
                        document.body.style.overflow = '';
                    }, 300);
                }
            });
        });
    }

    /**
     * Set up hover effects for related articles
     */
    function setupRelatedArticlesHover() {
        const blogCards = document.querySelectorAll('.related-articles .blog-card');
        
        blogCards.forEach(card => {
            const image = card.querySelector('img');
            const link = card.querySelector('.blog-link i');
            
            card.addEventListener('mouseenter', () => {
                if (image) image.style.transform = 'scale(1.1)';
                if (link) link.style.transform = 'translateX(5px)';
            });
            
            card.addEventListener('mouseleave', () => {
                if (image) image.style.transform = '';
                if (link) link.style.transform = '';
            });
        });
    }

    /**
     * Add copy buttons to code blocks
     */
    function initializeCopyCodeButtons() {
        const codeBlocks = document.querySelectorAll('.code-snippet pre');
        
        codeBlocks.forEach(block => {
            // Create copy button
            const copyButton = document.createElement('button');
            copyButton.className = 'copy-btn';
            copyButton.innerHTML = '<i class="fas fa-copy"></i>';
            copyButton.setAttribute('aria-label', 'Copy code');
            copyButton.style.position = 'absolute';
            copyButton.style.top = '10px';
            copyButton.style.right = '10px';
            copyButton.style.padding = '5px 10px';
            copyButton.style.background = 'rgba(255, 255, 255, 0.2)';
            copyButton.style.border = 'none';
            copyButton.style.borderRadius = '4px';
            copyButton.style.color = '#fff';
            copyButton.style.fontSize = '0.8rem';
            copyButton.style.cursor = 'pointer';
            copyButton.style.transition = 'background 0.3s ease';
            
            // Add position relative to the parent for absolute positioning
            block.style.position = 'relative';
            
            // Add button to the block
            block.appendChild(copyButton);
            
            // Add hover effect
            copyButton.addEventListener('mouseenter', () => {
                copyButton.style.background = 'rgba(255, 255, 255, 0.3)';
            });
            
            copyButton.addEventListener('mouseleave', () => {
                copyButton.style.background = 'rgba(255, 255, 255, 0.2)';
            });
            
            // Add click handler
            copyButton.addEventListener('click', () => {
                const code = block.querySelector('code').innerText;
                
                // Copy to clipboard
                navigator.clipboard.writeText(code).then(() => {
                    // Show success state
                    copyButton.innerHTML = '<i class="fas fa-check"></i>';
                    
                    // Reset after 2 seconds
                    setTimeout(() => {
                        copyButton.innerHTML = '<i class="fas fa-copy"></i>';
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy code: ', err);
                    
                    // Show error state
                    copyButton.innerHTML = '<i class="fas fa-times"></i>';
                    
                    // Reset after 2 seconds
                    setTimeout(() => {
                        copyButton.innerHTML = '<i class="fas fa-copy"></i>';
                    }, 2000);
                });
            });
        });
    }
})();