console.log('[Content.js] Script loaded and executing...');

// Supabase Configuration
if (typeof window.SUPABASE_BASE_URL === 'undefined') {
    window.SUPABASE_BASE_URL = "https://grksptxhbdlbdrlabaew.supabase.co/rest/v1";
}
if (typeof window.SUPABASE_ANON_KEY === 'undefined') {
    window.SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdya3NwdHhoYmRsYmRybGFiYWV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyOTI2MDgsImV4cCI6MjA4Mjg2ODYwOH0.TpiilrTDb4ZNbETvl0h4E_LFHZGpcx91_6Nx_dDPbew";
}

let contentTitle;

// Update badge counter function - INSTANT from cache, then refresh in background
function updateBadge() {
  const badge = document.getElementById("badge");
  if (!badge) return;
  
  // STEP 1: Check state manager FIRST (most reliable - always has latest optimistic updates)
  if (window.stateManager) {
    try {
      const state = window.stateManager.getState();
      if (state.cart && state.cart.length > 0) {
        let totalCount = 0;
        state.cart.forEach(item => {
          totalCount += (item.quantity || 1);
        });
        
        // INSTANT: Update badge immediately from state manager (no API calls)
        badge.classList.remove('skeleton-badge');
        badge.innerHTML = totalCount;
        return; // Don't hit API - use state manager only
      }
    } catch (error) {
      // Fall through to userCart cache check
    }
  }
  
  // STEP 1b: Check localStorage cache (fallback if state manager is empty)
  if (window.userCart && typeof window.userCart.getCachedCart === 'function') {
    try {
      const cached = window.userCart.getCachedCart();
      if (cached && cached.length > 0) {
        let totalCount = 0;
        cached.forEach(item => {
          totalCount += (item.quantity || 1);
        });
        
        // INSTANT: Update badge immediately from cache (no API calls)
        badge.classList.remove('skeleton-badge');
        badge.innerHTML = totalCount;
        return; // Don't hit API - use cache only
      }
    } catch (error) {
      // Fall through to database check
    }
  }
  
  // STEP 3: Fall back to cookies (NO DATABASE - using localStorage/cookies only)
  badge.classList.remove('skeleton-badge');
  if (document.cookie && document.cookie.indexOf(",counter=") >= 0) {
    try {
      var counter = document.cookie.split(",")[1].split("=")[1];
      badge.innerHTML = counter;
    } catch (error) {
      badge.innerHTML = '0';
    }
  } else {
    badge.innerHTML = '0';
  }
}

// Show success message when item is added to cart
function showAddToCartSuccess() {
  // Create or get notification element
  let notification = document.getElementById("cart-notification");
  if (!notification) {
    notification = document.createElement("div");
    notification.id = "cart-notification";
    notification.className = "cart-notification";
    document.body.appendChild(notification);
  }
  
  notification.textContent = "Item added to cart!";
  notification.style.display = "block";
  
  // Hide notification after 2 seconds
  setTimeout(() => {
    notification.style.display = "none";
  }, 2000);
}

// Initialize badge on page load
updateBadge();

// Show loading indicator
function showLoader(container) {
  const loader = document.createElement("div");
  loader.className = "loader";
  loader.innerHTML = "Loading products...";
  container.appendChild(loader);
}

// Hide loading indicator
function hideLoader(container) {
  const loader = container.querySelector(".loader");
  if (loader) {
    loader.remove();
  }
}

// Show error message
function showError(container, message) {
  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message";
  errorDiv.innerHTML = `
    <p>${message}</p>
    <button onclick="location.reload()" class="retry-btn">Retry</button>
  `;
  container.appendChild(errorDiv);
}

function dynamicClothingSection(ob) {
  let boxDiv = document.createElement("div");
  boxDiv.className = "box";
  boxDiv.setAttribute("data-product-id", ob.id);

  let boxLink = document.createElement("a");
  boxLink.href = `contentDetails.html?id=${ob.id}`;
  boxLink.style.textDecoration = "none";
  boxLink.style.color = "black";

  // Image container with relative positioning for badge
  let imageContainer = document.createElement("div");
  imageContainer.style.position = "relative";
  imageContainer.style.display = "block";

  let boxImg = document.createElement("img");
  boxImg.alt = ob.name || "Product Image";
  boxImg.width = 300;
  boxImg.height = 200;
  boxImg.style.width = "100%";
  boxImg.style.height = "200px";
  boxImg.style.objectFit = "cover";
  boxImg.style.display = "block";
  boxImg.style.borderTopLeftRadius = "10px";
  boxImg.style.borderTopRightRadius = "10px";
  
  // Set image source - load immediately (no lazy loading for instant display)
  const imageUrl = ob.preview || ob.image_url || '';
  if (imageUrl) {
    boxImg.src = imageUrl;
  } else {
    // Use placeholder immediately if no URL
    boxImg.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200'%3E%3Crect fill='%23ddd' width='300' height='200'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='18' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EImage not available%3C/text%3E%3C/svg%3E";
  }
  
  boxImg.onerror = function() {
    // Fallback if image fails to load
    this.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200'%3E%3Crect fill='%23ddd' width='300' height='200'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='18' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EImage not available%3C/text%3E%3C/svg%3E";
  };

  // Badges on image
  // New Arrival badge (top-left corner)
  if (ob.new_arrival) {
    let newBadge = document.createElement("span");
    newBadge.className = "badge badge-new";
    newBadge.innerHTML = "✨ New Arrival";
    newBadge.style.position = "absolute";
    newBadge.style.top = "10px";
    newBadge.style.left = "10px";
    newBadge.style.zIndex = "3";
    imageContainer.appendChild(newBadge);
  }
  
  // Discount badge on image (top-right corner)
  if (ob.discount_percent && ob.discount_percent > 0 && ob.final_price) {
    let discountBadge = document.createElement("span");
    discountBadge.className = "badge discount-badge-top";
    discountBadge.textContent = "-" + Math.round(ob.discount_percent) + "% OFF";
    discountBadge.style.position = "absolute";
    discountBadge.style.top = "10px";
    discountBadge.style.right = "10px";
    discountBadge.style.zIndex = "2";
    imageContainer.appendChild(discountBadge);
  }

  imageContainer.appendChild(boxImg);

  let boxh3 = document.createElement("h3");
  let h3Text = document.createTextNode(ob.name);
  boxh3.appendChild(h3Text);
  
  // Brand display (if brand_id exists, fetch brand name)
  if (ob.brand_id && window.productVariants && typeof window.productVariants.getBrandName === 'function') {
    let brandSpan = document.createElement("span");
    brandSpan.className = "product-brand";
    brandSpan.style.display = "block";
    brandSpan.style.fontSize = "0.9em";
    brandSpan.style.color = "#666";
    brandSpan.style.marginTop = "5px";
    window.productVariants.getBrandName(ob.brand_id, function(brandName) {
      if (brandName) {
        brandSpan.textContent = brandName;
        boxh3.appendChild(brandSpan);
      } else if (ob.brand) {
        brandSpan.textContent = ob.brand;
        boxh3.appendChild(brandSpan);
      }
    });
  } else if (ob.brand) {
    let brandSpan = document.createElement("span");
    brandSpan.className = "product-brand";
    brandSpan.style.display = "block";
    brandSpan.style.fontSize = "0.9em";
    brandSpan.style.color = "#666";
    brandSpan.style.marginTop = "5px";
    brandSpan.textContent = ob.brand;
    boxh3.appendChild(brandSpan);
  }

  // Rating stars - same structure as contentDetails.js
  function createRatingStars(rating) {
    const ratingDiv = document.createElement("div");
    ratingDiv.className = "product-rating-details"; // Same class as contentDetails page
    rating = rating || 0;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      const star = document.createElement("i");
      star.setAttribute("aria-hidden", "true");
      if (i < fullStars) {
        star.className = "fas fa-star";
      } else if (i === fullStars && hasHalfStar) {
        star.className = "fas fa-star-half-alt";
      } else {
        star.className = "far fa-star";
      }
      ratingDiv.appendChild(star);
    }
    
    // Add rating number - same class as contentDetails page
    const ratingText = document.createElement("span");
    ratingText.className = "rating-number-details"; // Same class as contentDetails page
    ratingText.textContent = rating > 0 ? rating.toFixed(1) : "0.0";
    ratingDiv.appendChild(ratingText);
    
    return ratingDiv;
  }
  
  // Get rating from product - product-based rating
  // Priority: calculatedRating (from reviews - fetched separately) > strike_rate > default to 0
  // Note: The products table doesn't have a 'rating' field, so we use calculatedRating from reviews
  let productRating = 0;
  
  // Priority 1: calculatedRating (from reviews - if already fetched and attached to product object)
  if (ob.calculatedRating !== undefined && ob.calculatedRating !== null && !isNaN(Number(ob.calculatedRating))) {
    productRating = Number(ob.calculatedRating);
  }
  // Priority 2: strike_rate (fallback - from products table, only if > 0)
  else if (ob.strike_rate !== undefined && ob.strike_rate !== null && ob.strike_rate !== '' && !isNaN(Number(ob.strike_rate)) && Number(ob.strike_rate) > 0) {
    productRating = Number(ob.strike_rate);
  }
  // Default to 0 if no rating available
  
  // Ensure rating is a valid number between 0 and 5
  if (isNaN(productRating) || productRating < 0) {
    productRating = 0;
  }
  if (productRating > 5) {
    productRating = 5; // Cap at 5 stars
  }
  
  // Always show rating (even if 0) - the rating element should always be visible
  const ratingStars = createRatingStars(productRating);
  ratingStars.setAttribute("data-product-id", ob.id);
  ratingStars.className = "product-rating-details"; // Ensure class is set
  ratingStars.style.display = 'flex';
  ratingStars.style.visibility = 'visible';

  // Price and quantity row
  let priceQuantityRow = document.createElement("div");
  priceQuantityRow.className = "price-quantity-row";
  
  // Get unit price (prefer final_price if available, otherwise use price)
  let unitPrice = ob.final_price ? parseFloat(ob.final_price) : parseFloat(ob.price) || 0;
  unitPrice = Math.round(unitPrice); // Round to whole number
  
  let priceContainer = document.createElement("h2");
  priceContainer.className = "product-price-display";
  let priceText = document.createTextNode("Rs " + unitPrice.toLocaleString('en-IN'));
  priceContainer.appendChild(priceText);
  priceQuantityRow.appendChild(priceContainer);

  // Quantity controls
  let quantityContainer = document.createElement("div");
  quantityContainer.className = "quantity-controls-index";
  
  let decreaseBtn = document.createElement("button");
  decreaseBtn.type = "button";
  decreaseBtn.className = "quantity-btn-index decrease-btn-index";
  decreaseBtn.innerHTML = '<i class="fas fa-minus"></i>';
  decreaseBtn.setAttribute("aria-label", "Decrease quantity");
  
  let quantityDisplay = document.createElement("span");
  quantityDisplay.className = "quantity-value-index";
  quantityDisplay.textContent = "1";
  quantityDisplay.setAttribute("data-product-id", ob.id);
  
  let increaseBtn = document.createElement("button");
  increaseBtn.type = "button";
  increaseBtn.className = "quantity-btn-index increase-btn-index";
  increaseBtn.innerHTML = '<i class="fas fa-plus"></i>';
  increaseBtn.setAttribute("aria-label", "Increase quantity");

  // Function to update price based on quantity
  function updatePrice(quantity) {
    const totalPrice = Math.round(unitPrice * quantity);
    priceContainer.textContent = "Rs " + totalPrice.toLocaleString('en-IN');
  }

  // Quantity control handlers
  let currentQuantity = 1;
  
  decreaseBtn.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    if (currentQuantity > 1) {
      currentQuantity--;
      quantityDisplay.textContent = currentQuantity.toString();
      decreaseBtn.disabled = currentQuantity <= 1;
      updatePrice(currentQuantity); // Update price when quantity decreases
    }
    return false;
  });
  
  increaseBtn.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    currentQuantity++;
    quantityDisplay.textContent = currentQuantity.toString();
    decreaseBtn.disabled = false;
    updatePrice(currentQuantity); // Update price when quantity increases
    return false;
  });
  
  decreaseBtn.disabled = true;
  
  quantityContainer.appendChild(decreaseBtn);
  quantityContainer.appendChild(quantityDisplay);
  quantityContainer.appendChild(increaseBtn);
  priceQuantityRow.appendChild(quantityContainer);

  boxLink.appendChild(imageContainer);
  boxLink.appendChild(boxh3);
  boxLink.appendChild(ratingStars);
  boxLink.appendChild(priceQuantityRow);
  boxDiv.appendChild(boxLink);

  // Action container for "Shop Now" button (outside the link)
  let actionContainer = document.createElement("div");
  actionContainer.className = "action-container";

  let shopNowBtn = document.createElement("button");
  shopNowBtn.className = "btn-shop-now-index";
  shopNowBtn.setAttribute("aria-label", "Shop now");
  shopNowBtn.innerHTML = '<i class="fas fa-shopping-bag" aria-hidden="true"></i> Shop Now';

  shopNowBtn.onclick = async function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const productId = ob.id;
    // IMPORTANT: Read quantity from the quantity display span (quantity-value-index)
    // This value is updated by increment/decrement buttons
    const quantity = parseInt(quantityDisplay.textContent, 10) || 1;
    
    // INSTANT: Add to cart optimistically (handles both logged-in and guest users)
    // The quantity value from quantityDisplay will be sent to backend user_cart table
    if (window.optimisticCart && typeof window.optimisticCart.addToCart === 'function') {
      // Check if user is logged in first
      let isLoggedIn = false;
      try {
        if (window.auth && typeof window.auth.getCurrentUser === 'function') {
          const { user } = await window.auth.getCurrentUser();
          isLoggedIn = !!user;
        }
      } catch (error) {
        isLoggedIn = false;
      }
      
      await window.optimisticCart.addToCart(productId, quantity);
      // Badge is updated instantly in optimisticAddToCart function
      // API calls happen in background (user won't see)
      // The quantity value is sent to user_cart table via addToCartAPI -> addToUserCart
      
      // NO API CALLS - Only localStorage (NO DATABASE)
      
      // Open cart drawer instead of redirecting
      console.log('[Shop Now] Attempting to open cart drawer...');
      if (typeof window.openCartDrawer === 'function') {
        console.log('[Shop Now] Calling window.openCartDrawer()');
        window.openCartDrawer();
      } else {
        console.error('[Shop Now] window.openCartDrawer not found! Waiting...');
        // Wait a bit for drawer to load, then try again
        setTimeout(() => {
          if (typeof window.openCartDrawer === 'function') {
            console.log('[Shop Now] Retrying - Calling window.openCartDrawer()');
            window.openCartDrawer();
          } else {
            console.error('[Shop Now] window.openCartDrawer still not found after wait');
          }
        }, 500);
      }
    } else {
      // Fallback: Basic cookie update for guest users
      try {
        let order = "";
        let counter = 0;
        
        if (document.cookie && document.cookie.indexOf(",counter=") >= 0) {
          order = document.cookie.split(",")[0].split("=")[1];
          counter = Number(document.cookie.split(",")[1].split("=")[1]);
        }
        
        const productIdStr = String(productId);
        for (let i = 0; i < quantity; i++) {
          if (order) {
            order = order + " " + productIdStr;
          } else {
            order = productIdStr;
          }
          counter++;
        }
        
        document.cookie = "orderId=" + order + ",counter=" + counter;
        
        const badge = document.getElementById("badge");
        if (badge) badge.innerHTML = counter;
        
        // Open cart drawer instead of redirecting
        if (typeof window.openCartDrawer === 'function') {
          window.openCartDrawer();
        } else if (typeof openCartDrawer === 'function') {
          openCartDrawer();
        } else {
          // Wait a bit for drawer to load, then try again
          setTimeout(() => {
            if (typeof window.openCartDrawer === 'function') {
              window.openCartDrawer();
            } else if (typeof openCartDrawer === 'function') {
              openCartDrawer();
            }
          }, 200);
        }
      } catch (error) {
        // Ignore errors
        // Open cart drawer instead of redirecting
        if (typeof window.openCartDrawer === 'function') {
          window.openCartDrawer();
        } else if (typeof openCartDrawer === 'function') {
          openCartDrawer();
        } else {
          // Wait a bit for drawer to load, then try again
          setTimeout(() => {
            if (typeof window.openCartDrawer === 'function') {
              window.openCartDrawer();
            } else if (typeof openCartDrawer === 'function') {
              openCartDrawer();
            }
          }, 200);
        }
      }
    }
  };
  
  actionContainer.appendChild(shopNowBtn);

  // Append action container to details (outside the link)
  boxDiv.appendChild(actionContainer);

  return boxDiv;
}

// Flag to prevent multiple initializations
let productListingInitialized = false;
let productListingInProgress = false;

// Function to initialize product listing - waits for containers to be available
function initProductListing() {
  // Prevent multiple initializations
  if (productListingInitialized || productListingInProgress) {
    console.log('[Product Listing] Already initialized or in progress, skipping...');
    return;
  }

  console.log('[Product Listing] Initializing...');
  let mainContainer = document.getElementById("mainContainer");
  let containerClothing = document.getElementById("containerClothing");
  let containerAccessories = document.getElementById("containerAccessories");

  console.log('[Product Listing] Containers found:', {
    mainContainer: !!mainContainer,
    containerClothing: !!containerClothing,
    containerAccessories: !!containerAccessories
  });

  // If containers don't exist yet, wait and retry
  if (!containerClothing && !containerAccessories) {
    console.log('[Product Listing] Containers not found, retrying in 100ms...');
    // Retry after a short delay
    setTimeout(initProductListing, 100);
    return;
  }

  // Mark as in progress
  productListingInProgress = true;

  // Clear containers before appending new products
  if (containerClothing) containerClothing.innerHTML = '';
  if (containerAccessories) containerAccessories.innerHTML = '';

  // Show loaders
  if (containerClothing) showLoader(containerClothing);
  if (containerAccessories) showLoader(containerAccessories);

  const SUPABASE_URL = `${window.SUPABASE_BASE_URL}/products?select=*`;
  let httpRequest = new XMLHttpRequest();
  httpRequest.open('GET', SUPABASE_URL, true);
  httpRequest.setRequestHeader('apikey', window.SUPABASE_ANON_KEY);
  httpRequest.setRequestHeader('Authorization', 'Bearer ' + window.SUPABASE_ANON_KEY);

  httpRequest.onreadystatechange = function() {
    if (this.readyState === 4) {
      if (this.status == 200) {
        try {
          contentTitle = JSON.parse(this.responseText);
          console.log('[Product Listing] Products fetched:', contentTitle.length);

          // Update badge after products are loaded
          if (typeof updateBadgeCounter === 'function') {
            updateBadgeCounter();
          }

          // Hide loaders before showing products
          if (containerClothing) hideLoader(containerClothing);
          if (containerAccessories) hideLoader(containerAccessories);

          // Check if products array is empty
          if (!contentTitle || contentTitle.length === 0) {
            console.log('[Product Listing] No products found');
            if (containerClothing) showError(containerClothing, "No Juki machine parts available.");
            if (containerAccessories) showError(containerAccessories, "No accessories available.");
            productListingInitialized = true;
            productListingInProgress = false;
            return;
          }

          // Loop through products and append
          let clothingCount = 0;
          let accessoriesCount = 0;
          
          for (let i = 0; i < contentTitle.length; i++) {
            const product = contentTitle[i];
            
            if (product.isaccessory) {
              if (containerAccessories) {
                containerAccessories.appendChild(dynamicClothingSection(product));
                accessoriesCount++;
              }
            } else {
              if (containerClothing) {
                containerClothing.appendChild(dynamicClothingSection(product));
                clothingCount++;
              }
            }
          }

          console.log('[Product Listing] Products displayed - Clothing:', clothingCount, 'Accessories:', accessoriesCount);
          
          // Fetch ratings from reviews for all products and update displays
          fetchAllProductRatings(contentTitle);

          // Show message if no products in category
          if (clothingCount === 0 && containerClothing) {
            showError(containerClothing, "No Juki machine parts available.");
          }
          if (accessoriesCount === 0 && containerAccessories) {
            showError(containerAccessories, "No Juki machine accessories available.");
          }

          // Mark as initialized
          productListingInitialized = true;
          productListingInProgress = false;

          // Fetch product reviews and update ratings
          if (window.productReviews && typeof window.productReviews.fetchAndDisplayReviews === 'function') {
            window.productReviews.fetchAndDisplayReviews();
          }
        } catch (error) {
          console.error('[Product Listing] Error parsing products:', error);
          if (containerClothing) {
            hideLoader(containerClothing);
            showError(containerClothing, "Error loading products. Please try again.");
          }
          if (containerAccessories) {
            hideLoader(containerAccessories);
            showError(containerAccessories, "Error loading products. Please try again.");
          }
          productListingInitialized = true;
          productListingInProgress = false;
        }
      } else {
        console.error('[Product Listing] API error:', this.status);
        if (containerClothing) {
          hideLoader(containerClothing);
          showError(containerClothing, "Error loading products. Please try again.");
        }
        if (containerAccessories) {
          hideLoader(containerAccessories);
          showError(containerAccessories, "Error loading products. Please try again.");
        }
        productListingInitialized = true;
        productListingInProgress = false;
      }
    }
  };

  httpRequest.onerror = function() {
    console.error('[Product Listing] Network error');
    if (containerClothing) {
      hideLoader(containerClothing);
      showError(containerClothing, "Network error. Please check your connection and try again.");
    }
    if (containerAccessories) {
      hideLoader(containerAccessories);
      showError(containerAccessories, "Network error. Please check your connection and try again.");
    }
    productListingInitialized = true;
    productListingInProgress = false;
  };

  httpRequest.send();
}

// Try to initialize product listing when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for containers to be loaded
    setTimeout(initProductListing, 100);
  });
} else {
  // DOM already loaded
  setTimeout(initProductListing, 100);
}

// Also try after delays in case containers are loaded dynamically
setTimeout(initProductListing, 300);
setTimeout(initProductListing, 500);

// Function to fetch ratings from product_reviews for all products
function fetchAllProductRatings(products) {
  if (!products || products.length === 0) return;
  
  // Get all product IDs
  const productIds = products.map(p => p.id).filter(id => id);
  if (productIds.length === 0) return;
  
  // Build filter for multiple product IDs (Supabase PostgREST format)
  // Use 'in' filter: product_id=in.(1,2,3)
  const productIdsStr = productIds.join(',');
  const url = `${window.SUPABASE_BASE_URL}/product_reviews?select=product_id,rating&product_id=in.(${productIdsStr})`;
  
  const httpRequest = new XMLHttpRequest();
  httpRequest.open('GET', url, true);
  httpRequest.setRequestHeader('apikey', window.SUPABASE_ANON_KEY);
  httpRequest.setRequestHeader('Authorization', 'Bearer ' + window.SUPABASE_ANON_KEY);
  httpRequest.setRequestHeader('Content-Type', 'application/json');
  
  httpRequest.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
      try {
        const reviews = JSON.parse(this.responseText);
        
        // Calculate average rating per product
        const ratingsByProduct = {};
        reviews.forEach(review => {
          if (review.product_id && review.rating) {
            if (!ratingsByProduct[review.product_id]) {
              ratingsByProduct[review.product_id] = { sum: 0, count: 0 };
            }
            ratingsByProduct[review.product_id].sum += Number(review.rating) || 0;
            ratingsByProduct[review.product_id].count += 1;
          }
        });
        
        // Update rating displays for each product
        Object.keys(ratingsByProduct).forEach(productId => {
          const ratingData = ratingsByProduct[productId];
          const avgRating = ratingData.count > 0 ? ratingData.sum / ratingData.count : 0;
          
          if (avgRating > 0) {
            // Find the rating element for this product
            const ratingElement = document.querySelector(`.product-rating-details[data-product-id="${productId}"]`);
            if (ratingElement) {
              // Remove old content
              ratingElement.innerHTML = '';
              
              // Create new rating stars
              const fullStars = Math.floor(avgRating);
              const hasHalfStar = avgRating % 1 >= 0.5;
              
              for (let i = 0; i < 5; i++) {
                const star = document.createElement("i");
                star.setAttribute("aria-hidden", "true");
                if (i < fullStars) {
                  star.className = "fas fa-star";
                } else if (i === fullStars && hasHalfStar) {
                  star.className = "fas fa-star-half-alt";
                } else {
                  star.className = "far fa-star";
                }
                ratingElement.appendChild(star);
              }
              
              // Add rating number
              const ratingText = document.createElement("span");
              ratingText.className = "rating-number-details";
              ratingText.textContent = avgRating.toFixed(1);
              ratingElement.appendChild(ratingText);
              
              // Ensure visibility
              ratingElement.style.display = 'flex';
              ratingElement.style.visibility = 'visible';
            }
          }
        });
      } catch (error) {
        console.error('[Product Listing] Error parsing ratings:', error);
      }
    }
  };
  
  httpRequest.onerror = function() {
    console.error('[Product Listing] Error fetching ratings');
  };
  
  httpRequest.send();
}
