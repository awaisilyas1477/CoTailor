// Review Form Handler for Guest Reviews
// This file handles both website reviews and product reviews submission

// Supabase Configuration (only declare if not already declared)
if (typeof window.SUPABASE_BASE_URL === 'undefined') {
    window.SUPABASE_BASE_URL = "https://grksptxhbdlbdrlabaew.supabase.co/rest/v1";
}
if (typeof window.SUPABASE_ANON_KEY === 'undefined') {
    window.SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdya3NwdHhoYmRsYmRybGFiYWV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyOTI2MDgsImV4cCI6MjA4Mjg2ODYwOH0.TpiilrTDb4ZNbETvl0h4E_LFHZGpcx91_6Nx_dDPbew";
}

// Use window properties directly (no redeclaration to avoid conflicts)
// Access via window.SUPABASE_BASE_URL and window.SUPABASE_ANON_KEY

// Function to create star rating input
function createStarRatingInput(containerId, initialRating = 0) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    const starsDiv = document.createElement('div');
    starsDiv.className = 'rating-input-stars';
    starsDiv.setAttribute('data-rating', initialRating);
    
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('i');
        star.className = i <= initialRating ? 'fas fa-star' : 'far fa-star';
        star.setAttribute('data-rating', i);
        star.onclick = function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            starsDiv.setAttribute('data-rating', rating);
            updateFormStarDisplay(starsDiv, rating);
        };
        star.onmouseenter = function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            updateFormStarDisplay(starsDiv, rating, true);
        };
        starsDiv.appendChild(star);
    }
    
    starsDiv.onmouseleave = function() {
        const currentRating = parseInt(this.getAttribute('data-rating'));
        updateFormStarDisplay(this, currentRating);
    };
    
    container.appendChild(starsDiv);
}

// Function to update star display for form inputs (renamed to avoid conflict with reviews.js)
function updateFormStarDisplay(container, rating, isHover = false) {
    const stars = container.querySelectorAll('i');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.className = 'fas fa-star';
        } else {
            star.className = 'far fa-star';
        }
    });
}

// Function to create website review form
async function createWebsiteReviewForm() {
    const reviewsSection = document.getElementById('reviewsSection');
    if (!reviewsSection) return;
    
    const formContainer = document.createElement('div');
    formContainer.className = 'review-form-container';
    formContainer.id = 'websiteReviewFormContainer';
    
    // Check if user is logged in
    let userName = '';
    let userEmail = '';
    let isLoggedIn = false;
    
    if (window.auth && typeof window.auth.getCurrentUser === 'function') {
        const { user } = await window.auth.getCurrentUser();
        if (user) {
            isLoggedIn = true;
            // Get user profile
            if (window.auth && typeof window.auth.getUserProfile === 'function') {
                const { profile } = await window.auth.getUserProfile(user.id);
                if (profile) {
                    userName = profile.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || '';
                    userEmail = profile.email || user.email || '';
                } else {
                    userName = user.user_metadata?.full_name || user.email?.split('@')[0] || '';
                    userEmail = user.email || '';
                }
            } else {
                userName = user.user_metadata?.full_name || user.email?.split('@')[0] || '';
                userEmail = user.email || '';
            }
        }
    }
    
    // Build form HTML
    const nameFieldHtml = isLoggedIn 
        ? `<div class="form-group" style="display: none;">
                <input type="hidden" id="reviewerName" name="name" value="${userName}">
                <input type="hidden" id="reviewerEmail" name="email" value="${userEmail}">
           </div>`
        : `<div class="form-group">
                <label for="reviewerName">Your Name *</label>
                <input type="text" id="reviewerName" name="name" required 
                       placeholder="Enter your name" maxlength="100">
            </div>
            <div class="form-group">
                <label for="reviewerEmail">Your Email *</label>
                <input type="email" id="reviewerEmail" name="email" required 
                       placeholder="Enter your email" maxlength="255">
            </div>`;
    
    formContainer.innerHTML = `
        <div class="review-form-header">
            <h3>Write a Review</h3>
            <p>Share your experience with us</p>
            ${isLoggedIn ? `<p style="font-size: 12px; color: #666; margin-top: 5px;">Reviewing as: ${userName} (${userEmail})</p>` : ''}
        </div>
        <form id="websiteReviewForm" class="review-form">
            ${nameFieldHtml}
            <div class="form-group">
                <label>Rating *</label>
                <div id="websiteRatingInput" class="rating-input-container"></div>
            </div>
            <div class="form-group">
                <label for="reviewText">Your Review *</label>
                <textarea id="reviewText" name="review" required 
                          placeholder="Write your review here (minimum 10 characters)" 
                          minlength="10" maxlength="1000" rows="5"></textarea>
                <span class="char-count"><span id="charCount">0</span>/1000</span>
            </div>
            <div class="form-actions">
                <button type="submit" class="btn-submit-review">
                    <i class="fas fa-paper-plane"></i> Submit Review
                </button>
                <button type="button" class="btn-cancel-review" onclick="closeReviewForm('websiteReviewFormContainer')">
                    Cancel
                </button>
            </div>
        </form>
    `;
    
    // Insert form at the beginning of reviews section
    const reviewsContainer = reviewsSection.querySelector('.reviews-container');
    if (reviewsContainer) {
        reviewsContainer.insertBefore(formContainer, reviewsContainer.firstChild);
    }
    
    // Initialize star rating (ALWAYS visible - not hidden)
    createStarRatingInput('websiteRatingInput', 0);
    
    // Character count for textarea
    const textarea = document.getElementById('reviewText');
    const charCount = document.getElementById('charCount');
    if (textarea && charCount) {
        textarea.addEventListener('input', function() {
            charCount.textContent = this.value.length;
        });
    }
    
    // Handle form submission
    const form = document.getElementById('websiteReviewForm');
    if (form) {
        form.addEventListener('submit', handleWebsiteReviewSubmit);
    }
}

// Function to create product review form
async function createProductReviewForm(productId) {
    // Check if form already exists
    if (document.getElementById('productReviewFormContainer')) {
        return; // Form already exists
    }
    
    const reviewsSection = document.getElementById('productReviewsSection');
    if (!reviewsSection) {
        return;
    }
    
    const formContainer = document.createElement('div');
    formContainer.className = 'review-form-container';
    formContainer.id = 'productReviewFormContainer';
    formContainer.style.display = 'none'; // Hidden by default
    
    // Check if user is logged in
    let userName = '';
    let userEmail = '';
    let isLoggedIn = false;
    
    if (window.auth && typeof window.auth.getCurrentUser === 'function') {
        const { user } = await window.auth.getCurrentUser();
        if (user) {
            isLoggedIn = true;
            // Get user profile
            if (window.auth && typeof window.auth.getUserProfile === 'function') {
                const { profile } = await window.auth.getUserProfile(user.id);
                if (profile) {
                    userName = profile.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || '';
                    userEmail = profile.email || user.email || '';
                } else {
                    userName = user.user_metadata?.full_name || user.email?.split('@')[0] || '';
                    userEmail = user.email || '';
                }
            } else {
                userName = user.user_metadata?.full_name || user.email?.split('@')[0] || '';
                userEmail = user.email || '';
            }
        }
    }
    
    // Build form HTML
    const nameFieldHtml = isLoggedIn 
        ? `<div class="form-group" style="display: none;">
                <input type="hidden" id="productReviewerName" name="name" value="${userName}">
                <input type="hidden" id="productReviewerEmail" name="email" value="${userEmail}">
           </div>`
        : `<div class="form-group">
                <label for="productReviewerName">Your Name *</label>
                <input type="text" id="productReviewerName" name="name" required 
                       placeholder="Enter your name" maxlength="100">
            </div>
            <div class="form-group">
                <label for="productReviewerEmail">Your Email *</label>
                <input type="email" id="productReviewerEmail" name="email" required 
                       placeholder="Enter your email" maxlength="255">
            </div>`;
    
    formContainer.innerHTML = `
        <div class="review-form-header">
            <h3>Write a Review</h3>
            <p>Share your experience with this product</p>
            ${isLoggedIn ? `<p style="font-size: 12px; color: #666; margin-top: 5px;">Reviewing as: ${userName} (${userEmail})</p>` : ''}
        </div>
        <form id="productReviewForm" class="review-form">
            <input type="hidden" id="productId" name="product_id" value="${productId}">
            ${nameFieldHtml}
            <div class="form-group">
                <label>Rating *</label>
                <div id="productRatingInput" class="rating-input-container"></div>
            </div>
            <div class="form-group">
                <label for="productReviewText">Your Review *</label>
                <textarea id="productReviewText" name="review" required 
                          placeholder="Write your review here (minimum 10 characters)" 
                          minlength="10" maxlength="1000" rows="5"></textarea>
                <span class="char-count"><span id="productCharCount">0</span>/1000</span>
            </div>
            <div class="form-actions">
                <button type="submit" class="btn-submit-review">
                    <i class="fas fa-paper-plane"></i> Submit Review
                </button>
                <button type="button" class="btn-cancel-review" onclick="closeReviewForm('productReviewFormContainer')">
                    Cancel
                </button>
            </div>
        </form>
    `;
    
    // Insert form at the beginning of reviews container
    const reviewsContainer = reviewsSection.querySelector('.product-reviews-container');
    if (reviewsContainer) {
        reviewsContainer.insertBefore(formContainer, reviewsContainer.firstChild);
    }
    
    // Initialize star rating (ALWAYS visible - not hidden)
    createStarRatingInput('productRatingInput', 0);
    
    // Character count for textarea
    const textarea = document.getElementById('productReviewText');
    const charCount = document.getElementById('productCharCount');
    if (textarea && charCount) {
        textarea.addEventListener('input', function() {
            charCount.textContent = this.value.length;
        });
    }
    
    // Handle form submission
    const form = document.getElementById('productReviewForm');
    if (form) {
        form.addEventListener('submit', handleProductReviewSubmit);
    }
}

// Function to handle website review submission
async function handleWebsiteReviewSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('.btn-submit-review');
    const nameField = document.getElementById('reviewerName');
    const emailField = document.getElementById('reviewerEmail');
    let name = nameField ? nameField.value.trim() : '';
    let email = emailField ? emailField.value.trim() : '';
    const ratingInput = document.getElementById('websiteRatingInput');
    // Get the starsDiv inside the container (where data-rating is actually set)
    const starsDiv = ratingInput ? ratingInput.querySelector('.rating-input-stars') : null;
    const rating = starsDiv ? parseInt(starsDiv.getAttribute('data-rating')) || 0 : 0;
    const reviewText = document.getElementById('reviewText').value.trim();
    
    // Validation - if fields are hidden, they should have values from profile
    if (!name || !email) {
        // Try to get from auth if fields are hidden
        if (window.auth && typeof window.auth.getCurrentUser === 'function') {
            const { user } = await window.auth.getCurrentUser();
            if (user) {
                if (!name) {
                    const { profile } = await window.auth.getUserProfile(user.id);
                    name = profile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || '';
                }
                if (!email) {
                    email = user.email || '';
                }
            }
        }
    }
    
    if (!name || !email || rating === 0 || !reviewText) {
        showFormError('Please fill in all required fields and select a rating.');
        return;
    }
    
    if (reviewText.length < 10) {
        showFormError('Review must be at least 10 characters long.');
        return;
    }
    
    if (reviewText.length > 1000) {
        showFormError('Review must not exceed 1000 characters.');
        return;
    }
    
    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    
    // Prepare data
    const reviewData = {
        user_name: name,
        rating: rating,
        review_text: reviewText
    };
    
    // Submit to Supabase
    const url = `${window.SUPABASE_BASE_URL}/website_reviews`;
    const httpRequest = new XMLHttpRequest();
    httpRequest.open('POST', url, true);
    httpRequest.setRequestHeader('apikey', window.SUPABASE_ANON_KEY);
    httpRequest.setRequestHeader('Authorization', 'Bearer ' + window.SUPABASE_ANON_KEY);
    httpRequest.setRequestHeader('Content-Type', 'application/json');
    httpRequest.setRequestHeader('Prefer', 'return=representation');
    
    httpRequest.onreadystatechange = function() {
        if (this.readyState === 4) {
            if (this.status === 201) {
                showFormSuccess('Thank you! Your review has been submitted successfully.');
                form.reset();
                document.getElementById('charCount').textContent = '0';
                createStarRatingInput('websiteRatingInput', 0);
                closeReviewForm('websiteReviewFormContainer');
                
                // Reload reviews
                if (typeof fetchWebsiteReviews === 'function') {
                    setTimeout(() => {
                        fetchWebsiteReviews();
                    }, 1000);
                }
            } else {
                showFormError('Failed to submit review. Please try again.');
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Review';
            }
        }
    };
    
    httpRequest.onerror = function() {
        showFormError('Network error. Please check your connection and try again.');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Review';
    };
    
    httpRequest.send(JSON.stringify(reviewData));
}

// Function to handle product review submission
async function handleProductReviewSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('.btn-submit-review');
    const productId = document.getElementById('productId').value;
    const nameField = document.getElementById('productReviewerName');
    const emailField = document.getElementById('productReviewerEmail');
    let name = nameField ? nameField.value.trim() : '';
    let email = emailField ? emailField.value.trim() : '';
    const ratingInput = document.getElementById('productRatingInput');
    // Get the starsDiv inside the container (where data-rating is actually set)
    const starsDiv = ratingInput ? ratingInput.querySelector('.rating-input-stars') : null;
    const rating = starsDiv ? parseInt(starsDiv.getAttribute('data-rating')) || 0 : 0;
    const reviewText = document.getElementById('productReviewText').value.trim();
    
    // Validation - if fields are hidden, they should have values from profile
    if (!name || !email) {
        // Try to get from auth if fields are hidden
        if (window.auth && typeof window.auth.getCurrentUser === 'function') {
            const { user } = await window.auth.getCurrentUser();
            if (user) {
                if (!name) {
                    const { profile } = await window.auth.getUserProfile(user.id);
                    name = profile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || '';
                }
                if (!email) {
                    email = user.email || '';
                }
            }
        }
    }
    
    if (!name || !email || rating === 0 || !reviewText) {
        showFormError('Please fill in all required fields and select a rating.');
        return;
    }
    
    if (reviewText.length < 10) {
        showFormError('Review must be at least 10 characters long.');
        return;
    }
    
    if (reviewText.length > 1000) {
        showFormError('Review must not exceed 1000 characters.');
        return;
    }
    
    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    
    // Prepare data
    const reviewData = {
        product_id: parseInt(productId),
        user_name: name,
        rating: rating,
        review_text: reviewText
    };
    
    // Submit to Supabase
    const url = `${window.SUPABASE_BASE_URL}/product_reviews`;
    const httpRequest = new XMLHttpRequest();
    httpRequest.open('POST', url, true);
    httpRequest.setRequestHeader('apikey', window.SUPABASE_ANON_KEY);
    httpRequest.setRequestHeader('Authorization', 'Bearer ' + window.SUPABASE_ANON_KEY);
    httpRequest.setRequestHeader('Content-Type', 'application/json');
    httpRequest.setRequestHeader('Prefer', 'return=representation');
    
    httpRequest.onreadystatechange = function() {
        if (this.readyState === 4) {
            if (this.status === 201) {
                showFormSuccess('Thank you! Your review has been submitted successfully.');
                form.reset();
                document.getElementById('productCharCount').textContent = '0';
                createStarRatingInput('productRatingInput', 0);
                closeReviewForm('productReviewFormContainer');
                
                // Reload reviews
                if (typeof window.fetchProductReviews === 'function') {
                    setTimeout(() => {
                        window.fetchProductReviews(parseInt(productId));
                    }, 1000);
                }
            } else {
                showFormError('Failed to submit review. Please try again.');
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Review';
            }
        }
    };
    
    httpRequest.onerror = function() {
        showFormError('Network error. Please check your connection and try again.');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Review';
    };
    
    httpRequest.send(JSON.stringify(reviewData));
}

// Function to show form error
function showFormError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-message form-error';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    
    // Remove existing messages
    const existing = document.querySelector('.form-message');
    if (existing) existing.remove();
    
    // Insert error message
    const form = document.querySelector('.review-form');
    if (form) {
        form.insertBefore(errorDiv, form.firstChild);
        errorDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
}

// Function to show form success
function showFormSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'form-message form-success';
    successDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    
    // Remove existing messages
    const existing = document.querySelector('.form-message');
    if (existing) existing.remove();
    
    // Insert success message
    const form = document.querySelector('.review-form');
    if (form) {
        form.insertBefore(successDiv, form.firstChild);
        successDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// Function to close review form (alias for hideReviewForm)
function closeReviewForm(containerId) {
    hideReviewForm(containerId);
}

// Function to show review form
function showReviewForm(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.style.display = 'block';
        // Ensure form is visible
        container.style.visibility = 'visible';
        container.style.opacity = '1';
        container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// Function to hide review form
function hideReviewForm(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.style.display = 'none';
    }
}

// Export functions for global use
window.createWebsiteReviewForm = createWebsiteReviewForm;
window.createProductReviewForm = createProductReviewForm;
window.closeReviewForm = closeReviewForm;
window.showReviewForm = showReviewForm;
window.hideReviewForm = hideReviewForm;

