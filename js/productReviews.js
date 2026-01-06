// Product Reviews Integration with Supabase
// This file handles fetching and displaying product-specific reviews

// Supabase Configuration (only declare if not already declared)
if (typeof window.SUPABASE_BASE_URL === 'undefined') {
    window.SUPABASE_BASE_URL = "https://grksptxhbdlbdrlabaew.supabase.co/rest/v1";
}
if (typeof window.SUPABASE_ANON_KEY === 'undefined') {
    window.SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdya3NwdHhoYmRsYmRybGFiYWV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyOTI2MDgsImV4cCI6MjA4Mjg2ODYwOH0.TpiilrTDb4ZNbETvl0h4E_LFHZGpcx91_6Nx_dDPbew";
}

// Use window properties directly (no redeclaration to avoid conflicts)
// Access via window.SUPABASE_BASE_URL and window.SUPABASE_ANON_KEY

// Function to format date to relative time
function formatReviewDate(dateString) {
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

// Function to create star rating display
function createProductReviewStars(rating) {
    const starsDiv = document.createElement("div");
    starsDiv.className = "product-review-stars";
    
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement("i");
        if (i <= rating) {
            star.className = "fas fa-star";
        } else {
            star.className = "far fa-star";
        }
        starsDiv.appendChild(star);
    }
    
    return starsDiv;
}

// Function to fetch product reviews from Supabase
function fetchProductReviews(productId) {
    if (!productId) {
        return;
    }
    
    // Using the exact format from your admin site: select with join syntax
    // Format: select=*,products:product_id(id,name,brand)
    const selectParam = encodeURIComponent('*,products:product_id(id,name,brand)');
    const url = `${window.SUPABASE_BASE_URL}/product_reviews?product_id=eq.${productId}&select=${selectParam}&order=review_date.desc`;
    
    const httpRequest = new XMLHttpRequest();
    
    httpRequest.onreadystatechange = function() {
        if (this.readyState === 4) {
            if (this.status === 200) {
                try {
                    const reviews = JSON.parse(this.responseText);
                    renderProductReviews(reviews, productId);
                } catch (error) {
                    showNoReviews(productId);
                }
            } else {
                showNoReviews(productId);
            }
        }
    };
    
    httpRequest.onerror = function() {
        showNoReviews(productId);
    };
    
    httpRequest.open('GET', url, true);
    httpRequest.setRequestHeader('apikey', window.SUPABASE_ANON_KEY);
    httpRequest.setRequestHeader('Authorization', 'Bearer ' + window.SUPABASE_ANON_KEY);
    httpRequest.setRequestHeader('Content-Type', 'application/json');
    httpRequest.send();
}

// Function to render product reviews
function renderProductReviews(reviews, productId) {
    const reviewsContainer = document.getElementById('productReviewsContainer');
    if (!reviewsContainer) return;
    
    // Clear existing content
    reviewsContainer.innerHTML = '';
    
    if (!reviews || reviews.length === 0) {
        showNoReviews(productId);
        return;
    }
    
    // Calculate statistics
    const totalReviews = reviews.length;
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;
    const ratingBreakdown = {
        5: reviews.filter(r => r.rating === 5).length,
        4: reviews.filter(r => r.rating === 4).length,
        3: reviews.filter(r => r.rating === 3).length,
        2: reviews.filter(r => r.rating === 2).length,
        1: reviews.filter(r => r.rating === 1).length
    };
    
    // Create statistics section
    const statsSection = document.createElement('div');
    statsSection.className = 'product-reviews-stats';
    statsSection.innerHTML = `
        <div class="product-reviews-stats-left">
            <div class="product-reviews-overall">
                <span class="product-reviews-rating-number">${avgRating.toFixed(1)}</span>
                <div class="product-reviews-stars-large">
                    ${createProductReviewStars(Math.round(avgRating)).outerHTML}
                </div>
                <p class="product-reviews-total">Based on ${totalReviews} review${totalReviews !== 1 ? 's' : ''}</p>
            </div>
        </div>
        <div class="product-reviews-stats-right">
            ${Object.keys(ratingBreakdown).reverse().map(rating => {
                const count = ratingBreakdown[rating];
                const percent = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
                return `
                    <div class="product-reviews-rating-bar">
                        <span>${rating} <i class="fas fa-star"></i></span>
                        <div class="product-reviews-bar-container">
                            <div class="product-reviews-bar-fill" style="width: ${percent}%"></div>
                        </div>
                        <span class="product-reviews-percentage">${percent}%</span>
                    </div>
                `;
            }).join('')}
        </div>
    `;
    reviewsContainer.appendChild(statsSection);
    
    // Create reviews list
    const reviewsList = document.createElement('div');
    reviewsList.className = 'product-reviews-list';
    reviewsList.id = 'productReviewsList';
    
    reviews.forEach(review => {
        const reviewItem = document.createElement('div');
        reviewItem.className = 'product-review-item';
        
        reviewItem.innerHTML = `
            <div class="product-review-header">
                <div class="product-reviewer-info">
                    <div class="product-reviewer-avatar">
                        ${review.user_name.charAt(0).toUpperCase()}
                    </div>
                    <div class="product-reviewer-details">
                        <h4 class="product-reviewer-name">${review.user_name}</h4>
                        <div class="product-review-meta">
                            ${createProductReviewStars(review.rating).outerHTML}
                            <span class="product-review-date">${formatReviewDate(review.review_date)}</span>
                            ${review.is_verified_purchase ? '<span class="verified-badge"><i class="fas fa-check-circle"></i> Verified Purchase</span>' : ''}
                        </div>
                    </div>
                </div>
            </div>
            <div class="product-review-content">
                <p>${review.review_text}</p>
            </div>
        `;
        
        reviewsList.appendChild(reviewItem);
    });
    
    reviewsContainer.appendChild(reviewsList);
}

// Function to show "no reviews" message
function showNoReviews(productId) {
    const reviewsContainer = document.getElementById('productReviewsContainer');
    if (!reviewsContainer) return;
    
    const noReviewsDiv = document.createElement('div');
    noReviewsDiv.className = 'no-reviews-message';
    noReviewsDiv.innerHTML = `
        <i class="fas fa-comment-slash"></i>
        <p>No reviews yet. Be the first to review this product!</p>
        <button class="btn-write-review" id="noReviewsWriteBtn">
            <i class="fas fa-edit"></i> Write the First Review
        </button>
    `;
    
    // Add click handler for the button
    const writeBtn = noReviewsDiv.querySelector('#noReviewsWriteBtn');
    if (writeBtn) {
        writeBtn.onclick = async function() {
            // Prevent multiple clicks
            if (writeBtn.disabled) return;
            
            // Show loader
            const originalHTML = writeBtn.innerHTML;
            writeBtn.disabled = true;
            writeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Opening...';
            writeBtn.style.opacity = '0.7';
            writeBtn.style.cursor = 'not-allowed';
            
            try {
                let formContainer = document.getElementById('productReviewFormContainer');
                
                // Create form if it doesn't exist
                if (!formContainer) {
                    if (typeof createProductReviewForm === 'function') {
                        await createProductReviewForm(productId);
                        // Wait a moment for form to be inserted into DOM
                        await new Promise(resolve => setTimeout(resolve, 100));
                        formContainer = document.getElementById('productReviewFormContainer');
                    } else {
                        writeBtn.disabled = false;
                        writeBtn.innerHTML = originalHTML;
                        writeBtn.style.opacity = '1';
                        writeBtn.style.cursor = 'pointer';
                        return;
                    }
                }
                
                // Show the form immediately
                if (formContainer) {
                    formContainer.style.display = 'block';
                    formContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                } else if (typeof showReviewForm === 'function') {
                    showReviewForm('productReviewFormContainer');
                }
            } catch (error) {
            } finally {
                // Remove loader and restore button
                writeBtn.disabled = false;
                writeBtn.innerHTML = originalHTML;
                writeBtn.style.opacity = '1';
                writeBtn.style.cursor = 'pointer';
            }
        };
    }
    
    reviewsContainer.innerHTML = '';
    reviewsContainer.appendChild(noReviewsDiv);
}

// Function to add "Write Review" button to product reviews
function addProductWriteReviewButton(productId) {
    const reviewsContainer = document.getElementById('productReviewsContainer');
    if (!reviewsContainer) return;
    
    // Check if button already exists
    if (document.getElementById('productWriteReviewBtn')) return;
    
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'write-review-button-container';
    buttonContainer.innerHTML = `
        <button id="productWriteReviewBtn" class="btn-write-review">
            <i class="fas fa-edit"></i> Write a Review
        </button>
    `;
    
    // Add click handler
    const button = buttonContainer.querySelector('#productWriteReviewBtn');
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
            let formContainer = document.getElementById('productReviewFormContainer');
            
            // Create form if it doesn't exist
            if (!formContainer) {
                if (typeof createProductReviewForm === 'function') {
                    await createProductReviewForm(productId);
                    // Wait a moment for form to be inserted into DOM
                    await new Promise(resolve => setTimeout(resolve, 100));
                    formContainer = document.getElementById('productReviewFormContainer');
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
                showReviewForm('productReviewFormContainer');
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
    
    // Insert button at the beginning of reviews container
    reviewsContainer.insertBefore(buttonContainer, reviewsContainer.firstChild);
}

// Function to render product reviews (updated to include write button)
function renderProductReviews(reviews, productId) {
    const reviewsContainer = document.getElementById('productReviewsContainer');
    if (!reviewsContainer) return;
    
    // Clear existing content
    reviewsContainer.innerHTML = '';
    
    // Add write review button
    addProductWriteReviewButton(productId);
    
    if (!reviews || reviews.length === 0) {
        showNoReviews(productId);
        return;
    }
    
    // Calculate statistics
    const totalReviews = reviews.length;
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;
    const ratingBreakdown = {
        5: reviews.filter(r => r.rating === 5).length,
        4: reviews.filter(r => r.rating === 4).length,
        3: reviews.filter(r => r.rating === 3).length,
        2: reviews.filter(r => r.rating === 2).length,
        1: reviews.filter(r => r.rating === 1).length
    };
    
    // Update product rating display on product details page
    updateProductRatingDisplay(avgRating, totalReviews);
    
    // Create statistics section
    const statsSection = document.createElement('div');
    statsSection.className = 'product-reviews-stats';
    statsSection.innerHTML = `
        <div class="product-reviews-stats-left">
            <div class="product-reviews-overall">
                <span class="product-reviews-rating-number">${avgRating.toFixed(1)}</span>
                <div class="product-reviews-stars-large">
                    ${createProductReviewStars(Math.round(avgRating)).outerHTML}
                </div>
                <p class="product-reviews-total">Based on ${totalReviews} review${totalReviews !== 1 ? 's' : ''}</p>
            </div>
        </div>
        <div class="product-reviews-stats-right">
            ${Object.keys(ratingBreakdown).reverse().map(rating => {
                const count = ratingBreakdown[rating];
                const percent = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
                return `
                    <div class="product-reviews-rating-bar">
                        <span>${rating} <i class="fas fa-star"></i></span>
                        <div class="product-reviews-bar-container">
                            <div class="product-reviews-bar-fill" style="width: ${percent}%"></div>
                        </div>
                        <span class="product-reviews-percentage">${percent}%</span>
                    </div>
                `;
            }).join('')}
        </div>
    `;
    reviewsContainer.appendChild(statsSection);
    
    // Create reviews list
    const reviewsList = document.createElement('div');
    reviewsList.className = 'product-reviews-list';
    reviewsList.id = 'productReviewsList';
    
    reviews.forEach(review => {
        const reviewItem = document.createElement('div');
        reviewItem.className = 'product-review-item';
        
        reviewItem.innerHTML = `
            <div class="product-review-header">
                <div class="product-reviewer-info">
                    <div class="product-reviewer-avatar">
                        ${review.user_name.charAt(0).toUpperCase()}
                    </div>
                    <div class="product-reviewer-details">
                        <h4 class="product-reviewer-name">${review.user_name}</h4>
                        <div class="product-review-meta">
                            ${createProductReviewStars(review.rating).outerHTML}
                            <span class="product-review-date">${formatReviewDate(review.review_date)}</span>
                            ${review.is_verified_purchase ? '<span class="verified-badge"><i class="fas fa-check-circle"></i> Verified Purchase</span>' : ''}
                        </div>
                    </div>
                </div>
            </div>
            <div class="product-review-content">
                <p>${review.review_text}</p>
            </div>
        `;
        
        reviewsList.appendChild(reviewItem);
    });
    
    reviewsContainer.appendChild(reviewsList);
}

// Function to update product rating display on product details page
function updateProductRatingDisplay(avgRating, totalReviews) {
    // Update product-rating-details (main product rating display)
    const productRatingDetails = document.querySelector('.product-rating-details');
    if (productRatingDetails) {
        const ratingNumberDetails = productRatingDetails.querySelector('.rating-number-details');
        if (ratingNumberDetails) {
            ratingNumberDetails.textContent = avgRating.toFixed(1);
        }
        
        // Update stars
        const stars = productRatingDetails.querySelectorAll('i');
        const fullStars = Math.floor(avgRating);
        const hasHalfStar = avgRating % 1 >= 0.5;
        
        stars.forEach((star, index) => {
            if (index < fullStars) {
                star.className = 'fas fa-star';
            } else if (index === fullStars && hasHalfStar) {
                star.className = 'fas fa-star-half-alt';
            } else {
                star.className = 'far fa-star';
            }
        });
    }
    
    // Also update product-rating if it exists (for consistency)
    const productRating = document.querySelector('.product-rating');
    if (productRating) {
        const ratingNumber = productRating.querySelector('.rating-number');
        if (ratingNumber) {
            ratingNumber.textContent = avgRating.toFixed(1);
        }
        
        // Update stars
        const stars = productRating.querySelectorAll('i');
        const fullStars = Math.floor(avgRating);
        const hasHalfStar = avgRating % 1 >= 0.5;
        
        stars.forEach((star, index) => {
            if (index < fullStars) {
                star.className = 'fas fa-star';
            } else if (index === fullStars && hasHalfStar) {
                star.className = 'fas fa-star-half-alt';
            } else {
                star.className = 'far fa-star';
            }
        });
    }
}

// Export function to be called from contentDetails.js
window.fetchProductReviews = fetchProductReviews;

