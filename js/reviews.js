// Supabase Configuration - Reviews Module
// Check if already declared to avoid conflicts
if (typeof window.SUPABASE_BASE_URL === 'undefined') {
    window.SUPABASE_BASE_URL = "https://grksptxhbdlbdrlabaew.supabase.co/rest/v1";
}
if (typeof window.SUPABASE_ANON_KEY === 'undefined') {
    window.SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdya3NwdHhoYmRsYmRybGFiYWV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyOTI2MDgsImV4cCI6MjA4Mjg2ODYwOH0.TpiilrTDb4ZNbETvl0h4E_LFHZGpcx91_6Nx_dDPbew";
}

// Use window properties directly (no redeclaration to avoid conflicts)
// Access via window.SUPABASE_BASE_URL and window.SUPABASE_ANON_KEY

// Customer Reviews Data - Will be loaded from Supabase
let reviewsData = [];
let isUpdatingStatistics = false; // Prevent multiple simultaneous updates

// Pagination settings
const reviewsPerPage = 10;
let currentPage = 1;

// Function to create star rating display
function createStarRating(rating) {
    const starsDiv = document.createElement("div");
    starsDiv.className = "review-stars";
    const numRating = Number(rating) || 0;
    
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement("i");
        if (i <= numRating) {
            star.className = "fas fa-star";
        } else {
            star.className = "far fa-star";
        }
        starsDiv.appendChild(star);
    }
    
    return starsDiv;
}

// Function to render reviews
function renderReviews() {
    const reviewsList = document.getElementById("reviewsList");
    if (!reviewsList) return;
    
    reviewsList.innerHTML = "";
    
    if (reviewsData.length === 0) {
        reviewsList.innerHTML = '<div class="no-reviews-message"><p>No reviews yet. Be the first to review!</p></div>';
        renderPagination();
        return;
    }
    
    const startIndex = (currentPage - 1) * reviewsPerPage;
    const endIndex = startIndex + reviewsPerPage;
    const reviewsToShow = reviewsData.slice(startIndex, endIndex);
    
    reviewsToShow.forEach(review => {
        const reviewItem = document.createElement("div");
        reviewItem.className = "review-item";
        
        reviewItem.innerHTML = `
            <div class="review-header">
                <div class="reviewer-info">
                    <div class="reviewer-avatar">
                        ${review.name.charAt(0)}
                    </div>
                    <div class="reviewer-details">
                        <h4 class="reviewer-name">${review.name}</h4>
                        <div class="review-meta">
                            ${createStarRating(review.rating).outerHTML}
                            <span class="review-date">${review.date}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="review-content">
                <p>${review.review}</p>
            </div>
        `;
        
        reviewsList.appendChild(reviewItem);
    });
    
    renderPagination();
}

// Function to render pagination
function renderPagination() {
    const pagination = document.getElementById("pagination");
    if (!pagination) return;
    
    const totalPages = Math.ceil(reviewsData.length / reviewsPerPage);
    pagination.innerHTML = "";
    
    if (totalPages <= 1) return;
    
    // Previous button
    const prevBtn = document.createElement("button");
    prevBtn.className = "pagination-btn";
    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            renderReviews();
            window.scrollTo({ top: document.getElementById("reviewsSection").offsetTop - 100, behavior: 'smooth' });
        }
    };
    pagination.appendChild(prevBtn);
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement("button");
        pageBtn.className = "pagination-btn";
        if (i === currentPage) {
            pageBtn.classList.add("active");
        }
        pageBtn.textContent = i;
        pageBtn.onclick = () => {
            currentPage = i;
            renderReviews();
            window.scrollTo({ top: document.getElementById("reviewsSection").offsetTop - 100, behavior: 'smooth' });
        };
        pagination.appendChild(pageBtn);
    }
    
    // Next button
    const nextBtn = document.createElement("button");
    nextBtn.className = "pagination-btn";
    nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderReviews();
            window.scrollTo({ top: document.getElementById("reviewsSection").offsetTop - 100, behavior: 'smooth' });
        }
    };
    pagination.appendChild(nextBtn);
}

// Function to format date to relative time
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return Math.floor(diffInSeconds / 60) + ' minutes ago';
    if (diffInSeconds < 86400) return Math.floor(diffInSeconds / 3600) + ' hours ago';
    if (diffInSeconds < 604800) return Math.floor(diffInSeconds / 86400) + ' days ago';
    if (diffInSeconds < 2592000) return Math.floor(diffInSeconds / 604800) + ' weeks ago';
    if (diffInSeconds < 31536000) return Math.floor(diffInSeconds / 2592000) + ' months ago';
    return Math.floor(diffInSeconds / 31536000) + ' years ago';
}

// Function to fetch website reviews from Supabase
function fetchWebsiteReviews() {
    // Using the same format as admin site
    const selectParam = encodeURIComponent('*');
    const url = `${window.SUPABASE_BASE_URL}/website_reviews?select=${selectParam}&order=review_date.desc`;
    
    const httpRequest = new XMLHttpRequest();
    
    httpRequest.onreadystatechange = function() {
        if (this.readyState === 4) {
            if (this.status === 200) {
                try {
                    const reviews = JSON.parse(this.responseText);
                    
                    // Use data directly from Supabase (EXACT same as productReviews.js line 65-66)
                    // Store raw reviews for statistics calculation
                    window.rawWebsiteReviews = reviews;
                    
                    // Transform only for display format (name, date formatting)
                    reviewsData = reviews.map(review => ({
                        name: review.user_name || 'Anonymous',
                        rating: review.rating, // Use directly - same as productReviews.js
                        review: review.review_text || '',
                        date: formatDate(review.review_date)
                    }));
                    
                    // Update statistics
                    updateReviewStatistics();
                    
                    // Render reviews
                    renderReviews();
                } catch (error) {
                    renderReviews();
                }
            } else {
                renderReviews();
            }
        }
    };
    
    httpRequest.onerror = function() {
        renderReviews();
    };
    
    httpRequest.open('GET', url, true);
    httpRequest.setRequestHeader('apikey', window.SUPABASE_ANON_KEY);
    httpRequest.setRequestHeader('Authorization', 'Bearer ' + window.SUPABASE_ANON_KEY);
    httpRequest.setRequestHeader('Content-Type', 'application/json');
    httpRequest.send();
}

// Function to create star display based on rating
function updateStarDisplay(rating) {
    const starsContainer = document.getElementById('overallRatingStars');
    if (!starsContainer) return;
    
    const numRating = Number(rating) || 0;
    const fullStars = Math.floor(numRating);
    const hasHalfStar = numRating % 1 >= 0.5;
    
    starsContainer.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('i');
        if (i <= fullStars) {
            star.className = 'fas fa-star';
        } else if (i === fullStars + 1 && hasHalfStar) {
            star.className = 'fas fa-star-half-alt';
        } else {
            star.className = 'far fa-star';
        }
        starsContainer.appendChild(star);
    }
}

// Function to update review statistics
function updateReviewStatistics() {
    // Prevent multiple simultaneous updates
    if (isUpdatingStatistics) {
        return;
    }
    isUpdatingStatistics = true;
    
    // Use raw reviews directly from Supabase (fallback to reviewsData if needed)
    const rawReviews = window.rawWebsiteReviews || reviewsData;
    
    // Don't reset if we don't have data - keep existing values
    if (!rawReviews || rawReviews.length === 0) {
        // Only show 0 if this is the first time (no existing value)
        const ratingNumber = document.querySelector('.rating-number');
        if (ratingNumber && ratingNumber.textContent === '0.0') {
            // Only reset if it's still at default value
            const totalReviewsEl = document.querySelector('.total-reviews');
            if (totalReviewsEl) totalReviewsEl.textContent = 'Based on 0 reviews';
            updateStarDisplay(0);
            
            const ratingBars = document.querySelectorAll('.rating-bar');
            ratingBars.forEach(bar => {
                const barFill = bar.querySelector('.bar-fill');
                const percentage = bar.querySelector('.percentage');
                if (barFill) barFill.style.width = '0%';
                if (percentage) percentage.textContent = '0%';
            });
        }
        isUpdatingStatistics = false;
        return;
    }
    
    // Filter and normalize ratings - ensure all are valid numbers
    const validReviews = rawReviews
        .map(r => {
            // Convert rating to number, handling string, number, or null
            let rating = r.rating;
            if (rating != null && rating !== '') {
                rating = typeof rating === 'string' ? parseInt(rating, 10) : Number(rating);
                if (isNaN(rating) || rating < 1 || rating > 5) {
                    return null;
                }
            } else {
                return null;
            }
            return { ...r, rating: rating };
        })
        .filter(r => r != null && r.rating >= 1 && r.rating <= 5);
    
    if (validReviews.length === 0) {
        // Show total count even if no valid ratings
        const ratingNumber = document.querySelector('.rating-number');
        const totalReviewsEl = document.querySelector('.total-reviews');
        if (ratingNumber) ratingNumber.textContent = '0.0';
        if (totalReviewsEl) totalReviewsEl.textContent = `Based on ${rawReviews.length} reviews`;
        updateStarDisplay(0);
        
        const ratingBars = document.querySelectorAll('.rating-bar');
        ratingBars.forEach(bar => {
            const barFill = bar.querySelector('.bar-fill');
            const percentage = bar.querySelector('.percentage');
            if (barFill) barFill.style.width = '0%';
            if (percentage) percentage.textContent = '0%';
        });
        return;
    }
    
    // Calculate statistics (same approach as productReviews.js)
    const totalReviews = validReviews.length;
    const avgRating = validReviews.reduce((sum, r) => sum + Number(r.rating), 0) / totalReviews;
    const ratingBreakdown = {
        5: validReviews.filter(r => Number(r.rating) === 5).length,
        4: validReviews.filter(r => Number(r.rating) === 4).length,
        3: validReviews.filter(r => Number(r.rating) === 3).length,
        2: validReviews.filter(r => Number(r.rating) === 2).length,
        1: validReviews.filter(r => Number(r.rating) === 1).length
    };
    
    // Update overall rating display - use more specific selector within reviews section
    const reviewsSection = document.getElementById('reviewsSection');
    const ratingNumber = reviewsSection ? reviewsSection.querySelector('.rating-number') : document.querySelector('.rating-number');
    const totalReviewsEl = reviewsSection ? reviewsSection.querySelector('.total-reviews') : document.querySelector('.total-reviews');
    
    // Update the DOM elements
    if (ratingNumber) {
        ratingNumber.textContent = avgRating.toFixed(1);
    }
    if (totalReviewsEl) {
        totalReviewsEl.textContent = `Based on ${totalReviews} reviews`;
    }
    
    // Update star display
    updateStarDisplay(avgRating);
    
    // Update rating bars
    const ratingBars = document.querySelectorAll('.rating-bar');
    ratingBars.forEach(bar => {
        const rating = parseInt(bar.getAttribute('data-rating'));
        const count = ratingBreakdown[rating] || 0;
        const percent = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
        const barFill = bar.querySelector('.bar-fill');
        const percentage = bar.querySelector('.percentage');
        
        if (barFill) barFill.style.width = percent + '%';
        if (percentage) percentage.textContent = percent + '%';
    });
    
    // Release the lock
    isUpdatingStatistics = false;
}

// Function to add "Write Review" button
function addWriteReviewButton() {
    const reviewsContainer = document.querySelector('.reviews-container');
    if (!reviewsContainer) return;
    
    // Check if button already exists
    if (document.getElementById('writeReviewBtn')) return;
    
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'write-review-button-container';
    buttonContainer.innerHTML = `
        <button id="writeReviewBtn" class="btn-write-review">
            <i class="fas fa-edit"></i> Write a Review
        </button>
    `;
    
    // Add click handler
    const button = buttonContainer.querySelector('#writeReviewBtn');
    button.onclick = async function() {
        // Prevent multiple clicks
        if (button.disabled) return;
        
        // Show loader
        const originalHTML = button.innerHTML;
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Opening...';
        button.style.opacity = '0.7';
        button.style.cursor = 'not-allowed';
        
        try {
            let formContainer = document.getElementById('websiteReviewFormContainer');
            
            // Create form if it doesn't exist
            if (!formContainer) {
                if (typeof createWebsiteReviewForm === 'function') {
                    await createWebsiteReviewForm();
                    // Wait a moment for form to be inserted into DOM
                    await new Promise(resolve => setTimeout(resolve, 100));
                    formContainer = document.getElementById('websiteReviewFormContainer');
                } else {
                    button.disabled = false;
                    button.innerHTML = originalHTML;
                    button.style.opacity = '1';
                    button.style.cursor = 'pointer';
                    return;
                }
            }
            
            // Show the form immediately
            if (formContainer) {
                formContainer.style.display = 'block';
                formContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else if (typeof showReviewForm === 'function') {
                showReviewForm('websiteReviewFormContainer');
            }
        } catch (error) {
        } finally {
            // Remove loader and restore button
            button.disabled = false;
            button.innerHTML = originalHTML;
            button.style.opacity = '1';
            button.style.cursor = 'pointer';
        }
    };
    
    // Insert button after the h2 title
    const h2 = reviewsContainer.querySelector('h2');
    if (h2 && h2.nextSibling) {
        reviewsContainer.insertBefore(buttonContainer, h2.nextSibling);
    } else {
        reviewsContainer.insertBefore(buttonContainer, reviewsContainer.querySelector('.reviews-stats'));
    }
}

// =====================================================
// VIDEO TESTIMONIALS SECTION
// =====================================================

// Video Testimonials Configuration
// Add your YouTube video URLs here
// You can use full YouTube URLs or just the video ID
const VIDEO_TESTIMONIALS = [
    // Example format - replace with your actual YouTube URLs
     "https://www.youtube.com/watch?v=74PtEIoObrU",
     "https://www.youtube.com/watch?v=74PtEIoObrU",
     "https://www.youtube.com/watch?v=74PtEIoObrU",
     "https://www.youtube.com/watch?v=74PtEIoObrU",
     "https://www.youtube.com/watch?v=74PtEIoObrU",
     "https://www.youtube.com/watch?v=74PtEIoObrU",
    
    // "VIDEO_ID", // or just the video ID
    // Add more videos here
];

// Convert YouTube URL to embed format
function getYouTubeEmbedUrl(url) {
    let videoId = '';
    
    // Clean the URL first
    url = url.trim();
    
    // Handle different YouTube URL formats
    if (url.includes('youtube.com/watch?v=')) {
        videoId = url.split('v=')[1].split('&')[0].split('#')[0];
    } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split('?')[0].split('&')[0].split('#')[0];
    } else if (url.includes('youtube.com/embed/')) {
        videoId = url.split('embed/')[1].split('?')[0].split('&')[0].split('#')[0];
    } else if (url.includes('youtube.com/v/')) {
        videoId = url.split('v/')[1].split('?')[0].split('&')[0].split('#')[0];
    } else {
        // Assume it's just the video ID - clean it
        videoId = url.replace(/[^a-zA-Z0-9_-]/g, '');
    }
    
    // Validate video ID (should be 11 characters for YouTube)
    if (!videoId || videoId.length < 10) {
        return '';
    }
    
    return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&enablejsapi=1`;
}

// Flag to prevent multiple initializations
let videoTestimonialsInitialized = false;

// Initialize video testimonials slider
function initializeVideoTestimonials() {
    // Prevent multiple initializations
    if (videoTestimonialsInitialized) {
        return;
    }
    
    const slider = document.getElementById('videoTestimonialsSlider');
    const prevBtn = document.getElementById('videoSliderPrev');
    const nextBtn = document.getElementById('videoSliderNext');
    const dotsContainer = document.getElementById('videoSliderDots');
    const section = document.getElementById('videoTestimonialsSection');
    
    if (!slider || !section) {
        // Retry if elements not found yet
        setTimeout(initializeVideoTestimonials, 200);
        return;
    }
    
    // Mark as initialized
    videoTestimonialsInitialized = true;
    
    // Make sure section is visible
    section.style.display = 'block';
    section.style.visibility = 'visible';
    
    if (VIDEO_TESTIMONIALS.length === 0) {
        // Show empty state message instead of hiding
        if (!slider.querySelector('.video-empty-message')) {
            const emptyMsg = document.createElement('div');
            emptyMsg.className = 'video-empty-message';
            emptyMsg.style.textAlign = 'center';
            emptyMsg.style.padding = '40px 20px';
            emptyMsg.style.color = '#666';
            emptyMsg.innerHTML = '<p>No video reviews available yet. Add YouTube video URLs in js/reviews.js to display customer video reviews.</p>';
            slider.appendChild(emptyMsg);
        }
        return;
    }
    
    // Clear any empty message
    const emptyMsg = slider.querySelector('.video-empty-message');
    if (emptyMsg) {
        emptyMsg.remove();
    }
    
    // Clear existing track to prevent duplicates
    const existingTrack = slider.querySelector('.video-slider-track');
    if (existingTrack) {
        existingTrack.remove();
    }
    
    // Clear existing dots
    dotsContainer.innerHTML = '';
    
    let currentSlide = 0;
    
    // Create slider track
    const track = document.createElement('div');
    track.className = 'video-slider-track';
    slider.appendChild(track);
    
    // Create slides
    VIDEO_TESTIMONIALS.forEach((videoUrl, index) => {
        // Skip invalid URLs
        const embedUrl = getYouTubeEmbedUrl(videoUrl);
        if (!embedUrl) {
            return;
        }
        
        const slide = document.createElement('div');
        slide.className = 'video-slide';
        
        const videoWrapper = document.createElement('div');
        videoWrapper.className = 'video-wrapper';
        
        const iframe = document.createElement('iframe');
        iframe.src = embedUrl;
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        iframe.loading = 'lazy';
        iframe.frameBorder = '0';
        iframe.title = `Customer Video Review ${index + 1}`;
        
        videoWrapper.appendChild(iframe);
        slide.appendChild(videoWrapper);
        track.appendChild(slide);
        
        // Create dot
        const dot = document.createElement('div');
        dot.className = 'video-slider-dot' + (index === 0 ? ' active' : '');
        dot.setAttribute('data-slide', index);
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
    
    // Detect if mobile (matches CSS breakpoint)
    function isMobile() {
        return window.innerWidth <= 767;
    }
    
    // Get number of videos visible at once
    function getVideosPerView() {
        return isMobile() ? 1 : 3;
    }
    
    // Calculate slide width based on screen size
    function getSlideWidthPercent() {
        return isMobile() ? 100 : (100 / 3);
    }
    
    // Update slider position - slide one at a time
    function updateSlider() {
        const slideWidth = getSlideWidthPercent();
        const translateX = -(currentSlide * slideWidth);
        track.style.transform = `translateX(${translateX}%)`;
        
        // Update dots
        const dots = dotsContainer.querySelectorAll('.video-slider-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
        
        // Update buttons - can slide until we can't show all visible videos
        const videosPerView = getVideosPerView();
        const maxSlides = Math.max(0, VIDEO_TESTIMONIALS.length - videosPerView);
        if (prevBtn) prevBtn.disabled = currentSlide === 0;
        if (nextBtn) nextBtn.disabled = currentSlide >= maxSlides;
    }
    
    // Go to specific slide
    function goToSlide(index) {
        const videosPerView = getVideosPerView();
        const maxSlides = Math.max(0, VIDEO_TESTIMONIALS.length - videosPerView);
        if (index >= 0 && index <= maxSlides) {
            currentSlide = index;
            updateSlider();
        }
    }
    
    // Next slide - move one video at a time
    function nextSlide() {
        const videosPerView = getVideosPerView();
        const maxSlides = Math.max(0, VIDEO_TESTIMONIALS.length - videosPerView);
        if (currentSlide < maxSlides) {
            currentSlide++;
            updateSlider();
        }
    }
    
    // Previous slide - move one video at a time
    function prevSlide() {
        if (currentSlide > 0) {
            currentSlide--;
            updateSlider();
        }
    }
    
    // Handle window resize to recalculate on orientation change
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            // Reset to first slide if current slide is out of bounds
            const videosPerView = getVideosPerView();
            const maxSlides = Math.max(0, VIDEO_TESTIMONIALS.length - videosPerView);
            if (currentSlide > maxSlides) {
                currentSlide = maxSlides;
            }
            updateSlider();
        }, 250);
    });
    
    // Event listeners
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (slider.getBoundingClientRect().top < window.innerHeight && 
            slider.getBoundingClientRect().bottom > 0) {
            if (e.key === 'ArrowLeft') {
                prevSlide();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
            }
        }
    });
    
    // Initialize
    updateSlider();
}

// Initialize reviews when DOM is ready
function initializeReviews() {
    // Check if reviews section exists
    const reviewsSection = document.getElementById('reviewsSection');
    const reviewsList = document.getElementById('reviewsList');
    
    if (!reviewsSection || !reviewsList) {
        setTimeout(initializeReviews, 300);
        return;
    }
    
    // Fetch reviews immediately since section exists
    fetchWebsiteReviews();
    
    // Add button after a short delay to ensure DOM is ready
    setTimeout(function() {
        addWriteReviewButton();
    }, 200);
}

// Export function for global access
window.initializeReviews = initializeReviews;

// Try multiple initialization strategies
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(initializeReviews, 200);
    });
} else {
    setTimeout(initializeReviews, 500);
}

// Also try after window load as backup
window.addEventListener('load', function() {
    // Check if reviews are already loaded
    const reviewsList = document.getElementById('reviewsList');
    if (reviewsList) {
        if (reviewsData.length === 0) {
            setTimeout(initializeReviews, 200);
        }
    } else {
        setTimeout(initializeReviews, 500);
    }
});
