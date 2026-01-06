// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
  initProductDetails();
});

// Also run immediately if DOM is already loaded
if (document.readyState === 'loading') {
  // DOM is still loading, wait for DOMContentLoaded
} else {
  // DOM is already loaded
  initProductDetails();
}

function initProductDetails() {
  // Get integer ID from URL
  // URL format: contentDetails.html?1 or contentDetails.html?1&quantity=2
  let id = null;
  let quantity = 1;
  const searchString = location.search;

  if (searchString) {
    // Try URLSearchParams first (for ?id=1&quantity=2 format)
    const urlParams = new URLSearchParams(searchString);
    const idParam = urlParams.get('id');
    const quantityParam = urlParams.get('quantity');
    
    if (idParam) {
      id = parseInt(idParam, 10);
    }
    
    if (quantityParam) {
      quantity = parseInt(quantityParam, 10);
      if (isNaN(quantity) || quantity < 1) quantity = 1;
    }
    
    // If no id from URLSearchParams, try direct format (contentDetails.html?1&quantity=2)
    if (!id || isNaN(id)) {
      // Remove the ? and split by &
      const parts = searchString.replace('?', '').split('&');
      const firstPart = parts[0].trim();
      id = firstPart ? parseInt(firstPart, 10) : null;
      
      // Check for quantity in parts
      if (parts.length > 1) {
        for (let i = 1; i < parts.length; i++) {
          if (parts[i].startsWith('quantity=')) {
            const qty = parseInt(parts[i].split('=')[1], 10);
            if (!isNaN(qty) && qty > 0) {
              quantity = qty;
            }
          }
        }
      }
    }
  }

  // Store quantity for later use (ensure it's a number)
  window.selectedQuantity = quantity;
  
  // Show loader
  showLoader();
  
  // Make API call
  if (id && !isNaN(id) && id > 0) {
    fetchProductDetails(id);
  } else {
    hideLoader();
    showError("Product ID not found. Please select a valid product.");
  }
}

// Show loading indicator
function showLoader() {
  const container = document.getElementById('containerProduct');
  if (container) {
    const loader = document.createElement("div");
    loader.className = "loader-container";
    loader.innerHTML = `
      <div class="loader"></div>
      <p>Loading product details...</p>
    `;
    container.appendChild(loader);
  }
}

// Hide loading indicator
function hideLoader() {
  const container = document.getElementById('containerProduct');
  if (container) {
    const loader = container.querySelector(".loader-container");
    if (loader) {
      loader.remove();
    }
  }
}

// Show error message
function showError(message) {
  const container = document.getElementById('containerProduct');
  if (container) {
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.innerHTML = `
      <i class="fas fa-exclamation-circle"></i>
      <p>${message}</p>
      <button onclick="location.reload()">Retry</button>
    `;
    container.appendChild(errorDiv);
  }
}

// Update badge counter - INSTANT from cache, then refresh in background
function updateBadge() {
  const badge = document.getElementById("badge");
  if (!badge) return;
  
  // Show skeleton loader for better UX
  badge.classList.add('skeleton-badge');
  badge.innerHTML = '';
  
  // STEP 1: Check localStorage cache FIRST (instant, synchronous)
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
      // Fall through to cookie check
    }
  }
  
  // Fallback to cookie-based badge
  setTimeout(() => {
    badge.classList.remove('skeleton-badge');
    if(document.cookie && document.cookie.indexOf(',counter=')>=0) {
      let counter = document.cookie.split(',')[1].split('=')[1];
      badge.innerHTML = counter;
    } else {
      badge.innerHTML = '0';
    }
  }, 1000);
}

// Show success message when item is added to cart
function showAddToCartSuccess() {
  const successMsg = document.createElement("div");
  successMsg.className = "success-message";
  successMsg.innerHTML = `
    <i class="fas fa-check-circle"></i>
    <span>Item added to cart!</span>
  `;
  document.body.appendChild(successMsg);
  
  setTimeout(() => {
    successMsg.classList.add("show");
  }, 10);
  
  setTimeout(() => {
    successMsg.classList.remove("show");
    setTimeout(() => successMsg.remove(), 300);
  }, 2000);
}

// Initialize badge
updateBadge();

// Show loader initially (only once - removed duplicate)
// showLoader(); // Removed - loader is shown in initProductDetails()

// =====================================================
// VARIANT SELECTOR FUNCTIONS
// =====================================================

/**
 * Render size and color selectors
 */
function renderVariantSelectors(container, sizes, colors, variants, product) {
  console.log('[Variants] renderVariantSelectors called with:', {
    sizes: sizes ? sizes.length : 0,
    colors: colors ? colors.length : 0,
    variants: variants ? variants.length : 0,
    container: container ? 'exists' : 'missing'
  });
  container.innerHTML = ''; // Clear container
  
  // Check if we have any variants to display
  const hasSizes = sizes && sizes.length > 0;
  const hasColors = colors && colors.length > 0;
  
  if (!hasSizes && !hasColors) {
    // No variants to display - return early
    console.log('[Variants] No sizes or colors to display');
    return false; // Return false to indicate nothing was rendered
  }
  
  // Size selector
  if (sizes && sizes.length > 0) {
    console.log('[Variants] Rendering size selector with', sizes.length, 'sizes');
    let sizeContainer = document.createElement('div');
    sizeContainer.className = 'variant-selector-group';
    
    let sizeLabel = document.createElement('label');
    sizeLabel.textContent = 'Size:';
    sizeLabel.className = 'variant-label';
    sizeContainer.appendChild(sizeLabel);
    
    let sizeBoxContainer = document.createElement('div');
    sizeBoxContainer.className = 'variant-box-container';
    sizeBoxContainer.id = 'size-box-container';
    
    sizes.forEach(size => {
      let sizeBox = document.createElement('div');
      sizeBox.className = 'variant-box size-box';
      sizeBox.setAttribute('data-size-id', size.id);
      sizeBox.setAttribute('role', 'button');
      sizeBox.setAttribute('tabindex', '0');
      sizeBox.setAttribute('aria-label', `Select size ${size.display_name || size.name}`);
      
      let sizeText = document.createElement('span');
      sizeText.className = 'variant-box-text';
      sizeText.textContent = size.display_name || size.name;
      sizeBox.appendChild(sizeText);
      
      // Click handler
      sizeBox.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Remove selected class from all size boxes
        sizeBoxContainer.querySelectorAll('.variant-box').forEach(box => {
          box.classList.remove('selected');
        });
        
        // Add selected class to clicked box
        this.classList.add('selected');
        
        const selectedSizeId = parseInt(this.getAttribute('data-size-id')) || null;
        window.selectedVariant.size_id = selectedSizeId;
        
        if (selectedSizeId) {
          const selectedSize = sizes.find(s => s.id === selectedSizeId);
          window.selectedVariant.size_name = selectedSize ? (selectedSize.display_name || selectedSize.name) : null;
        } else {
          window.selectedVariant.size_name = null;
        }
        
        // Update available colors based on selected size
        if (typeof updateColorBoxes === 'function' && typeof updateVariantSelection === 'function') {
          try {
            updateColorBoxes(selectedSizeId, colors, variants);
            updateVariantSelection(variants, product);
          } catch (e) {
            console.error('[Variants] Error updating color boxes:', e);
          }
        }
      };
      
      // Keyboard support
      sizeBox.onkeydown = function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.onclick(e);
        }
      };
      
      sizeBoxContainer.appendChild(sizeBox);
    });
    
    sizeContainer.appendChild(sizeBoxContainer);
    container.appendChild(sizeContainer);
  }
  
  // Color selector
  if (colors && colors.length > 0) {
    console.log('[Variants] Rendering color selector with', colors.length, 'colors');
    let colorContainer = document.createElement('div');
    colorContainer.className = 'variant-selector-group';
    
    let colorLabel = document.createElement('label');
    colorLabel.textContent = 'Color:';
    colorLabel.className = 'variant-label';
    colorContainer.appendChild(colorLabel);
    
    let colorBoxContainer = document.createElement('div');
    colorBoxContainer.className = 'variant-box-container';
    colorBoxContainer.id = 'color-box-container';
    
    colors.forEach(color => {
      let colorBox = document.createElement('div');
      colorBox.className = 'variant-box color-box';
      colorBox.setAttribute('data-color-id', color.id);
      colorBox.setAttribute('role', 'button');
      colorBox.setAttribute('tabindex', '0');
      colorBox.setAttribute('aria-label', `Select color ${color.name}`);
      colorBox.title = color.name;
      
      // Set background color if hex_code exists
      if (color.hex_code) {
        colorBox.style.backgroundColor = color.hex_code;
      } else {
        // Fallback gradient for colors without hex
        colorBox.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      }
      
      // Add checkmark icon (hidden by default, shown when selected)
      let checkmark = document.createElement('span');
      checkmark.className = 'color-checkmark';
      checkmark.innerHTML = '✓';
      colorBox.appendChild(checkmark);
      
      // Click handler
      colorBox.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Check if size is selected first
        if (!window.selectedVariant || !window.selectedVariant.size_id) {
          if (typeof Swal !== 'undefined') {
            Swal.fire({
              icon: 'warning',
              title: 'Please Select Size First',
              text: 'Please select a size before choosing a color.',
              confirmButtonColor: 'rgb(3, 122, 122)',
              confirmButtonText: 'OK'
            });
          } else {
            alert('Please select a size first before choosing a color.');
          }
          return;
        }
        
        // Remove selected class from all color boxes
        colorBoxContainer.querySelectorAll('.variant-box').forEach(box => {
          box.classList.remove('selected');
        });
        
        // Add selected class to clicked box
        this.classList.add('selected');
        
        const selectedColorId = parseInt(this.getAttribute('data-color-id')) || null;
        window.selectedVariant.color_id = selectedColorId;
        
        if (selectedColorId) {
          const selectedColor = colors.find(c => c.id === selectedColorId);
          window.selectedVariant.color_name = selectedColor ? selectedColor.name : null;
        } else {
          window.selectedVariant.color_name = null;
        }
        
        if (typeof updateVariantSelection === 'function') {
          try {
            updateVariantSelection(variants, product);
          } catch (e) {
            console.error('[Variants] Error updating variant selection:', e);
          }
        }
      };
      
      // Keyboard support
      colorBox.onkeydown = function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.onclick(e);
        }
      };
      
      colorBoxContainer.appendChild(colorBox);
    });
    
    colorContainer.appendChild(colorBoxContainer);
    container.appendChild(colorContainer);
  }
  
  // Return true if we rendered any selectors
  const hasRendered = (hasSizes && sizes && sizes.length > 0) || (hasColors && colors && colors.length > 0);
  if (!hasRendered) {
    console.log('[Variants] No selectors were rendered');
    return false;
  }
  
  console.log('[Variants] Selectors rendered successfully, returning true');
  
  // Set default variant if available
  if (window.productVariants && typeof window.productVariants.getDefaultVariant === 'function') {
    window.productVariants.getDefaultVariant(product.id, function(defaultVariant) {
      if (defaultVariant) {
        if (defaultVariant.size_id) {
          const sizeBox = document.querySelector(`[data-size-id="${defaultVariant.size_id}"]`);
          if (sizeBox) {
            sizeBox.click();
          }
        }
        if (defaultVariant.color_id) {
          const colorBox = document.querySelector(`[data-color-id="${defaultVariant.color_id}"]`);
          if (colorBox) {
            colorBox.click();
          }
        }
      }
    });
  }
  
  return true; // Return true to indicate selectors were rendered
}

/**
 * Update available color boxes based on selected size
 */
function updateColorBoxes(selectedSizeId, allColors, variants) {
  const colorBoxContainer = document.getElementById('color-box-container');
  if (!colorBoxContainer) return;
  
  // Get all color boxes
  const allColorBoxes = colorBoxContainer.querySelectorAll('.variant-box');
  
  if (!selectedSizeId) {
    // If no size selected, show all colors
    allColorBoxes.forEach(box => {
      box.style.display = 'inline-block';
      box.disabled = false;
    });
    return;
  }
  
  // Filter colors available for selected size
  const availableColors = new Set();
  variants.forEach(variant => {
    if (variant.size_id === selectedSizeId && variant.color_id) {
      availableColors.add(variant.color_id);
    }
  });
  
  // Show/hide and enable/disable color boxes
  allColorBoxes.forEach(box => {
    const colorId = parseInt(box.getAttribute('data-color-id'));
    if (availableColors.has(colorId)) {
      box.style.display = 'inline-block';
      box.disabled = false;
      box.style.opacity = '1';
    } else {
      box.style.display = 'none';
      box.disabled = true;
      box.style.opacity = '0.3';
    }
  });
}

/**
 * Update price, stock, and image based on selected variant
 */
function updateVariantSelection(variants, product) {
  // Ensure selectedVariant exists
  if (!window.selectedVariant) {
    window.selectedVariant = {
      variant_id: null,
      size_id: null,
      color_id: null,
      size_name: null,
      color_name: null,
      price: null,
      stock: null
    };
  }
  
  const sizeId = window.selectedVariant.size_id;
  const colorId = window.selectedVariant.color_id;
  
  // Find matching variant
  const variant = variants.find(v => {
    const vSizeId = v.size_id || null;
    const vColorId = v.color_id || null;
    return vSizeId === sizeId && vColorId === colorId;
  });
  
  if (variant) {
    window.selectedVariant.variant_id = variant.variant_id;
    window.selectedVariant.price = variant.display_price || variant.variant_final_price || variant.product_final_price || variant.product_price;
    window.selectedVariant.stock = variant.display_stock || variant.stock || variant.product_stock || 0;
    
    // Update price display
    const priceDisplay = document.getElementById('price-display-details');
    const originalPriceDisplay = document.getElementById('original-price-display');
    const stockDisplay = document.getElementById('stock-display');
    
    if (priceDisplay) {
      const price = Math.round(window.selectedVariant.price);
      priceDisplay.textContent = 'Rs ' + price.toLocaleString();
    }
    
    // Update stock display
    if (stockDisplay) {
      if (window.selectedVariant.stock > 0) {
        stockDisplay.textContent = 'In Stock: ' + window.selectedVariant.stock + ' available';
        stockDisplay.style.color = '#38a169';
      } else {
        stockDisplay.textContent = 'Out of Stock';
        stockDisplay.style.color = '#e53e3e';
      }
    }
    
    // Update main image if variant has specific image
    if (variant.variant_image_url || variant.display_image) {
      const mainImg = document.getElementById('imgDetails');
      if (mainImg) {
        mainImg.src = variant.variant_image_url || variant.display_image;
        // Reinitialize zoom for new image
        if (mainImg.complete) {
          initImageZoom(mainImg);
        } else {
          mainImg.onload = function() {
            initImageZoom(mainImg);
          };
        }
      }
    }
    
    // Update price based on quantity
    if (typeof updatePriceDisplayDetails === 'function') {
      updatePriceDisplayDetails();
    }
  } else {
    // No variant selected, use product defaults
    window.selectedVariant.variant_id = null;
    window.selectedVariant.price = product.final_price || product.price || 0;
    window.selectedVariant.stock = product.stock || 0;
    
    const priceDisplay = document.getElementById('price-display-details');
    const stockDisplay = document.getElementById('stock-display');
    
    if (priceDisplay) {
      const price = Math.round(window.selectedVariant.price);
      priceDisplay.textContent = 'Rs ' + price.toLocaleString();
    }
    
    if (stockDisplay) {
      if (window.selectedVariant.stock > 0) {
        stockDisplay.textContent = 'In Stock: ' + window.selectedVariant.stock + ' available';
        stockDisplay.style.color = '#38a169';
      } else {
        stockDisplay.textContent = 'Out of Stock';
        stockDisplay.style.color = '#e53e3e';
      }
    }
  }
}

function dynamicContentDetails(ob)
{
    // Validate product object
    if (!ob || !ob.id) {
        hideLoader();
        showError("Invalid product data. Please try again.");
        return;
    }
    
    hideLoader();
    
    const containerProduct = document.getElementById('containerProduct');
    if (!containerProduct) {
        showError("Page structure error. Please refresh the page.");
        return;
    }
    
    // Clear any existing content
    containerProduct.innerHTML = '';
    
    let mainContainer = document.createElement('div')
    mainContainer.id = 'containerD'
    containerProduct.appendChild(mainContainer);

    let imageSectionDiv = document.createElement('div')
    imageSectionDiv.id = 'imageSection'

    // Image container with relative positioning for badges
    let imageWrapper = document.createElement("div");
    imageWrapper.style.position = "relative";
    imageWrapper.style.display = "inline-block";
    imageWrapper.style.width = "100%";
    
    // Badge containers - separate for left and right
    // Left side badges container (New Arrival)
    let leftBadgeContainer = document.createElement("div");
    leftBadgeContainer.style.position = "absolute";
    leftBadgeContainer.style.top = "10px";
    leftBadgeContainer.style.left = "10px";
    leftBadgeContainer.style.zIndex = "3";
    leftBadgeContainer.style.display = "flex";
    leftBadgeContainer.style.flexDirection = "column";
    leftBadgeContainer.style.gap = "8px";
    leftBadgeContainer.style.alignItems = "flex-start";
    
    // Right side badges container (Hot Sale, Best Seller, Discount)
    let rightBadgeContainer = document.createElement("div");
    rightBadgeContainer.className = "product-badges-detail";
    rightBadgeContainer.style.position = "absolute";
    rightBadgeContainer.style.top = "10px";
    rightBadgeContainer.style.right = "10px";
    rightBadgeContainer.style.zIndex = "3";
    rightBadgeContainer.style.display = "flex";
    rightBadgeContainer.style.flexDirection = "column";
    rightBadgeContainer.style.gap = "8px";
    rightBadgeContainer.style.alignItems = "flex-end";
    
    // New Arrival badge (left side)
    if (ob.new_arrival) {
      let newBadge = document.createElement("span");
      newBadge.className = "badge badge-new";
      newBadge.innerHTML = "✨ New Arrival";
      leftBadgeContainer.appendChild(newBadge);
    }
    
    // Hot Sale badge (right side)
    if (ob.hot_sale) {
      let hotBadge = document.createElement("span");
      hotBadge.className = "badge hot-sale";
      hotBadge.textContent = "Hot Sale";
      rightBadgeContainer.appendChild(hotBadge);
    }
    
    // Best Seller badge (right side)
    if (ob.best_seller) {
      let bestBadge = document.createElement("span");
      bestBadge.className = "badge best-seller";
      bestBadge.textContent = "Best Seller";
      rightBadgeContainer.appendChild(bestBadge);
    }

    let imgTag = document.createElement('img')
     imgTag.id = 'imgDetails'
    // Priority: preview > image_url (as per schema)
    // Get main image URL first (priority: preview > image_url)
    const mainImageUrl = ob.preview || ob.image_url || "";
    imgTag.src = mainImageUrl
    imgTag.alt = ob.name || "Product Image"
    // Add width and height to prevent layout shift (main product image)
    imgTag.setAttribute("width", "600");
    imgTag.setAttribute("height", "600");
    imgTag.onerror = function() {
      this.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect fill='%23ddd' width='300' height='300'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='18' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EImage not available%3C/text%3E%3C/svg%3E";
    }

    // Add zoom functionality to image
    imgTag.className = 'product-image-zoom';
    imgTag.style.cursor = 'zoom-in';
    
    imageWrapper.appendChild(imgTag);
    if (leftBadgeContainer.children.length > 0) {
      imageWrapper.appendChild(leftBadgeContainer);
    }
    if (rightBadgeContainer.children.length > 0) {
      imageWrapper.appendChild(rightBadgeContainer);
    }
    imageSectionDiv.appendChild(imageWrapper);
    
    // Product preview images will be appended here (below main image)
    
    // Initialize image zoom after image loads
    imgTag.onload = function() {
      initImageZoom(imgTag);
    };
    
    // Also initialize if image is already loaded
    if (imgTag.complete) {
      initImageZoom(imgTag);
    }

    let productDetailsDiv = document.createElement('div')
    productDetailsDiv.id = 'productDetails'

    let h1 = document.createElement('h1')
    let h1Text = document.createTextNode(ob.name)
    h1.appendChild(h1Text)

    // Rating Stars
    function createRatingStars(rating) {
        const ratingDiv = document.createElement("div");
        ratingDiv.className = "product-rating-details";
        rating = rating || 0;
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
        for (let i = 0; i < 5; i++) {
            const star = document.createElement("i");
            if (i < fullStars) {
                star.className = "fas fa-star";
            } else if (i === fullStars && hasHalfStar) {
                star.className = "fas fa-star-half-alt";
            } else {
                star.className = "far fa-star";
            }
            ratingDiv.appendChild(star);
        }
        
        // Add rating number
        const ratingText = document.createElement("span");
        ratingText.className = "rating-number-details";
        ratingText.textContent = rating > 0 ? rating.toFixed(1) : "0.0";
        ratingDiv.appendChild(ratingText);
        
        return ratingDiv;
    }
    
    // Get rating from product (prefer calculated rating from reviews, then strike_rate, then default)
    const productRating = ob.calculatedRating || (ob.strike_rate ? Number(ob.strike_rate) : (ob.rating || 4.5));
    const ratingStars = createRatingStars(productRating);

    let h4 = document.createElement('h4')
    h4.id = 'brand-display'
    // Fetch brand name if brand_id exists
    if (ob.brand_id && window.productVariants && typeof window.productVariants.getBrandName === 'function') {
      window.productVariants.getBrandName(ob.brand_id, function(brandName) {
        if (brandName) {
          h4.textContent = brandName;
        } else if (ob.brand) {
          h4.textContent = ob.brand;
        }
      });
    } else if (ob.brand) {
      let h4Text = document.createTextNode(ob.brand)
      h4.appendChild(h4Text)
    }

    let detailsDiv = document.createElement('div')
    detailsDiv.id = 'details'

    // Price with discount
    let h3DetailsDiv = document.createElement('div')
    h3DetailsDiv.className = 'price-details'
    
    const unitPrice = Math.round(Number(ob.final_price || ob.price || 0));
    const originalUnitPrice = Math.round(Number(ob.price || 0));
    
    // Create price display elements
    let originalPriceSpan = null;
    let finalPriceSpan = document.createElement('span')
    finalPriceSpan.className = 'final-price'
    finalPriceSpan.id = 'price-display-details' // Add ID for updating
    
    if (ob.discount_percent && ob.discount_percent > 0 && ob.final_price) {
      originalPriceSpan = document.createElement('span')
      originalPriceSpan.className = 'original-price'
      originalPriceSpan.id = 'original-price-display'
      originalPriceSpan.textContent = 'Rs ' + originalUnitPrice.toLocaleString()
      
      finalPriceSpan.textContent = 'Rs ' + unitPrice.toLocaleString()
      
      let discountBadge = document.createElement('span')
      discountBadge.className = 'discount-badge'
      discountBadge.textContent = '-' + Math.round(ob.discount_percent) + '% OFF'
      
      h3DetailsDiv.appendChild(originalPriceSpan)
      h3DetailsDiv.appendChild(finalPriceSpan)
      h3DetailsDiv.appendChild(discountBadge)
    } else {
      finalPriceSpan.textContent = 'Rs ' + unitPrice.toLocaleString()
      h3DetailsDiv.appendChild(finalPriceSpan)
    }
    
    // Function to update price based on quantity (will be defined after quantityDisplay is created)
    let updatePriceDisplayDetails = null;
    
    // Stock information (will be updated based on variant selection)
    let stockDiv = document.createElement('div')
    stockDiv.className = 'stock-info'
    stockDiv.id = 'stock-display'
    if (ob.stock !== undefined && ob.stock !== null) {
      if (ob.stock > 0) {
        stockDiv.textContent = 'In Stock: ' + ob.stock + ' available'
        stockDiv.style.color = '#38a169'
      } else {
        stockDiv.textContent = 'Out of Stock'
        stockDiv.style.color = '#e53e3e'
      }
    }
    // Don't append stockDiv to detailsDiv - will append to quantity container wrapper

    // Variant selectors (Size and Color) - Only show if productVariants is available
    // Store selected variant info (initialize safely)
    if (!window.selectedVariant) {
      window.selectedVariant = {
        variant_id: null,
        size_id: null,
        color_id: null,
        size_name: null,
        color_name: null,
        price: null,
        stock: null
      };
    }
    
    // Variant selectors container (only create if variants are available)
    let variantContainer = document.createElement('div')
    variantContainer.className = 'variant-selectors'
    variantContainer.id = 'variant-selectors'
    
    // Fetch and display variants (safely, don't break page if it fails)
    try {
      if (window.productVariants && typeof window.productVariants.fetchProductVariants === 'function') {
        console.log('[Variants] Fetching variants for product ID:', ob.id);
        window.productVariants.fetchProductVariants(ob.id, function(variants) {
          try {
            console.log('[Variants] Received variants:', variants ? variants.length : 0, 'variants');
            if (variants && variants.length > 0) {
              // Get available sizes and colors
              window.productVariants.getAvailableSizesForProduct(ob.id, function(sizes) {
                try {
                  console.log('[Variants] Available sizes:', sizes ? sizes.length : 0, 'sizes');
                  window.productVariants.getAvailableColorsForProduct(ob.id, function(colors) {
                    try {
                      console.log('[Variants] Available colors:', colors ? colors.length : 0, 'colors');
                      // Store sizes and colors globally for button validation
                      window.productSizes = sizes || [];
                      window.productColors = colors || [];
                      
                      // Check if we have sizes or colors to display
                      const hasSizes = sizes && sizes.length > 0;
                      const hasColors = colors && colors.length > 0;
                      
                      if (hasSizes || hasColors) {
                        if (typeof renderVariantSelectors === 'function') {
                          console.log('[Variants] Rendering selectors...');
                          const rendered = renderVariantSelectors(variantContainer, sizes, colors, variants, ob);
                          if (rendered && variantContainer.children.length > 0) {
                            console.log('[Variants] Selectors rendered successfully');
                            // Only append if container has content
                            variantContainer.style.display = 'block';
                            if (!variantContainer.parentElement) {
                              detailsDiv.appendChild(variantContainer);
                            }
                          } else {
                            console.log('[Variants] No selectors rendered, not appending container');
                          }
                        } else {
                          console.error('[Variants] renderVariantSelectors function not found');
                        }
                      } else {
                        console.log('[Variants] No sizes or colors available, not appending container');
                      }
                    } catch (e) {
                      console.error('[Variants] Error rendering selectors:', e);
                    }
                  });
                } catch (e) {
                  console.error('[Variants] Error fetching colors:', e);
                }
              });
            } else {
              console.log('[Variants] No variants found for product:', ob.id);
            }
          } catch (e) {
            console.error('[Variants] Error processing variants:', e);
          }
        });
      } else {
        console.warn('[Variants] productVariants not available. Check if productVariants.js is loaded.');
      }
    } catch (e) {
      console.error('[Variants] Error fetching variants:', e);
    }
    
    // Don't append container here - wait for variants to load
    // Container will only be appended if it has content (sizes or colors)

    let h3 = document.createElement('h3')
    let h3Text = document.createTextNode('Description')
    h3.appendChild(h3Text)

    let para = document.createElement('p')
    let paraText = document.createTextNode(ob.description)
    para.appendChild(paraText)

    let productPreviewDiv = document.createElement('div')
    productPreviewDiv.id = 'productPreview'

    // Handle photos array or single image
    let photos = [];
    
    // Check if photos array exists and is valid (PostgreSQL array comes as JavaScript array)
    if (ob.photos) {
      // Handle both array and string formats
      let photosArray = ob.photos;
      if (typeof photosArray === 'string') {
        // If it's a string, try to parse it (PostgreSQL array format)
        try {
          photosArray = JSON.parse(photosArray);
        } catch (e) {
          // If not JSON, treat as single string
          photosArray = [photosArray];
        }
      }
      
      if (Array.isArray(photosArray) && photosArray.length > 0) {
        // Fix malformed URLs that were split at commas
        // Pattern: URLs are split like ["https://domain.com/h_1440", "q_100", "w_1080/path/image.jpg"]
        // Need to reconstruct: "https://domain.com/h_1440,q_100,w_1080/path/image.jpg"
        let reconstructedPhotos = [];
        let currentUrl = '';
        
        for (let i = 0; i < photosArray.length; i++) {
          const item = photosArray[i];
          if (!item || typeof item !== 'string') continue;
          
          const trimmed = item.trim();
          
          // If this item starts with "https://", it's the start of a new URL
          if (trimmed.startsWith('https://')) {
            // Save previous URL if exists and is complete (has image extension)
            if (currentUrl && (currentUrl.includes('.jpg') || currentUrl.includes('.png') || currentUrl.includes('.jpeg'))) {
              reconstructedPhotos.push(currentUrl.trim());
            }
            currentUrl = trimmed;
          } else if (currentUrl) {
            // Continue building the current URL by joining with comma
            // All items after https:// are part of the URL until we hit a complete URL
            currentUrl += ',' + trimmed;
            
            // If this item contains an image extension, the URL is complete
            if (trimmed.includes('.jpg') || trimmed.includes('.png') || trimmed.includes('.jpeg')) {
              // URL is complete, save it
              reconstructedPhotos.push(currentUrl.trim());
              currentUrl = ''; // Reset for next URL
            }
          } else {
            // No current URL being built - might be a standalone complete URL
            if (trimmed.startsWith('http') && (trimmed.includes('.jpg') || trimmed.includes('.png') || trimmed.includes('.jpeg'))) {
              reconstructedPhotos.push(trimmed);
            }
          }
        }
        
        // Add the last URL if exists and is complete
        if (currentUrl && (currentUrl.includes('.jpg') || currentUrl.includes('.png') || currentUrl.includes('.jpeg'))) {
          reconstructedPhotos.push(currentUrl.trim());
        }
        
        // Filter out invalid URLs and ensure they're complete
        photos = reconstructedPhotos.filter(photo => {
          if (!photo || typeof photo !== 'string') return false;
          const trimmed = photo.trim();
          // Must be a valid URL (starts with http and contains image extension)
          return trimmed.startsWith('http') && (trimmed.includes('.jpg') || trimmed.includes('.png') || trimmed.includes('.jpeg'));
        });
        
        // If main image (preview) is not in photos array, add it as first preview
        if (mainImageUrl && mainImageUrl.trim() !== '' && !photos.includes(mainImageUrl)) {
          photos.unshift(mainImageUrl);
        }
      }
    }
    
    // If no photos array or empty, use main image as preview
    if (photos.length === 0 && mainImageUrl && mainImageUrl.trim() !== '') {
      photos = [mainImageUrl];
    }
    
    // Always show at least the main image if available
    if (photos && photos.length > 0) {
      let imagesAdded = 0;
      
      for(let i = 0; i < photos.length; i++) {
        if (photos[i] && typeof photos[i] === 'string' && photos[i].trim() !== '') { // Only add if photo URL exists and is not empty
          let imgTagProductPreviewDiv = document.createElement('img');
          imgTagProductPreviewDiv.className = 'previewImg';
          // Mark first image as selected initially
          if (i === 0) {
            imgTagProductPreviewDiv.classList.add('selected');
          }
          imgTagProductPreviewDiv.src = photos[i];
          imgTagProductPreviewDiv.alt = 'Preview ' + String(i + 1);
          // Add lazy loading for preview images (except first one)
          if (i > 0) {
            imgTagProductPreviewDiv.loading = "lazy";
          }
          // Add dimensions to prevent layout shift (increased size)
          imgTagProductPreviewDiv.setAttribute("width", "80");
          imgTagProductPreviewDiv.setAttribute("height", "80");
          
          // Add error handler for broken images - show error instead of hiding
          imgTagProductPreviewDiv.onerror = function() {
            this.style.border = '2px solid #e53e3e';
            this.alt = 'Image failed to load';
            // Don't hide, show broken image icon
          };
          
          // Add load handler to confirm image loaded
          imgTagProductPreviewDiv.onload = function() {
            imagesAdded++;
          };
          
          // Fix: Use closure to capture the correct index
          (function(photoIndex, photoUrl, imgElement) {
            // Change main image on hover (like Amazon/Daraz)
            imgElement.addEventListener('mouseenter', function(event) {
              event.preventDefault();
              event.stopPropagation();
              
              // Remove selected class from all preview images
              const allPreviews = document.querySelectorAll('.previewImg');
              allPreviews.forEach(img => img.classList.remove('selected'));
              
              // Add selected class to hovered image
              imgElement.classList.add('selected');
              
              // Update main image
              const mainImg = document.getElementById("imgDetails");
              if (mainImg && photoUrl) {
                // Only update if URL is different to avoid unnecessary reloads
                if (mainImg.src !== photoUrl) {
                  mainImg.src = photoUrl;
                  
                  // Reinitialize zoom for new image
                  if (mainImg.complete) {
                    setTimeout(() => {
                      if (typeof initImageZoom === 'function') {
                        initImageZoom(mainImg);
                      }
                    }, 100);
                  } else {
                    mainImg.onload = function() {
                      if (typeof initImageZoom === 'function') {
                        initImageZoom(mainImg);
                      }
                    };
                  }
                }
              }
            });
            
            // Keep click handler for accessibility (optional)
            imgElement.onclick = function(event) {
              // Remove selected class from all preview images
              const allPreviews = document.querySelectorAll('.previewImg');
              allPreviews.forEach(img => img.classList.remove('selected'));
              
              // Add selected class to clicked image
              imgElement.classList.add('selected');
              
              // Update main image
              const mainImg = document.getElementById("imgDetails");
              if (mainImg) {
                mainImg.src = photoUrl;
                
                // Reinitialize zoom for new image
                if (mainImg.complete) {
                  initImageZoom(mainImg);
                } else {
                  mainImg.onload = function() {
                    initImageZoom(mainImg);
                  };
                }
              }
            };
          })(i, photos[i], imgTagProductPreviewDiv);
          
          productPreviewDiv.appendChild(imgTagProductPreviewDiv);
        }
      }
      
      // If no images were successfully added, don't show any message
    }
    
    // Append product preview images to imageSectionDiv (below main image)
    // Append directly to imageSectionDiv since we have the reference
    if (productPreviewDiv) {
      imageSectionDiv.appendChild(productPreviewDiv);
    }

    // Create Recommended Products Section (below containerD)
    let recommendedSection = document.createElement('div');
    recommendedSection.className = 'recommended-products-section';
    recommendedSection.id = 'recommendedProducts';
    
    let recommendedTitle = document.createElement('h2');
    recommendedTitle.className = 'recommended-title';
    recommendedTitle.textContent = 'May You Like?';
    recommendedSection.appendChild(recommendedTitle);
    
    let recommendedContainer = document.createElement('div');
    recommendedContainer.className = 'recommended-products-container';
    recommendedContainer.id = 'recommendedProductsContainer';
    recommendedSection.appendChild(recommendedContainer);
    
    // Append recommended section to containerProduct (after containerD)
    const containerProductRef = document.getElementById('containerProduct');
    if (containerProductRef) {
      containerProductRef.appendChild(recommendedSection);
    }
    
    // Fetch and display recommended products
    fetchRecommendedProducts(ob.id, recommendedContainer);

    // Quantity controls container
    let quantityContainerDiv = document.createElement('div')
    quantityContainerDiv.className = 'quantity-controls-details'
    
    let quantityLabel = document.createElement('span')
    quantityLabel.className = 'quantity-label-details'
    quantityLabel.textContent = 'Quantity:'
    
    let decreaseBtn = document.createElement('button')
    decreaseBtn.className = 'quantity-btn-details decrease-btn-details'
    decreaseBtn.innerHTML = '<i class="fas fa-minus"></i>'
    decreaseBtn.setAttribute('aria-label', 'Decrease quantity')
    
    let quantityDisplay = document.createElement('span')
    quantityDisplay.className = 'quantity-value-details'
    quantityDisplay.setAttribute('data-item-id', ob.id)
    
    // Initialize quantity from URL, cart, or default to 1
    let currentQuantity = window.selectedQuantity || 1
    if (isNaN(currentQuantity) || currentQuantity < 1) {
      currentQuantity = 1
    }
    
    // Set quantity to neutral/default value (always start at 1 or URL quantity)
    // Don't load from cart - keep it neutral
    quantityDisplay.textContent = currentQuantity;
    
    let increaseBtn = document.createElement('button')
    increaseBtn.className = 'quantity-btn-details increase-btn-details'
    increaseBtn.innerHTML = '<i class="fas fa-plus"></i>'
    increaseBtn.setAttribute('aria-label', 'Increase quantity')
    
    // Quantity control handlers
    decreaseBtn.onclick = function(e) {
      e.preventDefault()
      e.stopPropagation()
      if (currentQuantity > 1) {
        currentQuantity--
        quantityDisplay.textContent = currentQuantity
        decreaseBtn.disabled = currentQuantity <= 1
        // Update price display
        if (typeof updatePriceDisplayDetails === 'function') {
          updatePriceDisplayDetails()
        }
      }
    }
    
    increaseBtn.onclick = function(e) {
      e.preventDefault()
      e.stopPropagation()
      currentQuantity++
      quantityDisplay.textContent = currentQuantity
      decreaseBtn.disabled = false
      // Update price display
      if (typeof updatePriceDisplayDetails === 'function') {
        updatePriceDisplayDetails()
      }
    }
    
    // Disable decrease button if quantity is 1
    if (currentQuantity <= 1) {
      decreaseBtn.disabled = true
    }
    
    // Define price update function now that quantityDisplay exists
    updatePriceDisplayDetails = function() {
      const currentQty = parseInt(quantityDisplay.textContent, 10) || 1;
      const totalPrice = Math.round(unitPrice * currentQty);
      const totalOriginalPrice = Math.round(originalUnitPrice * currentQty);
      
      if (originalPriceSpan) {
        originalPriceSpan.textContent = 'Rs ' + totalOriginalPrice.toLocaleString();
      }
      if (finalPriceSpan) {
        finalPriceSpan.textContent = 'Rs ' + totalPrice.toLocaleString();
      }
    };
    
    quantityContainerDiv.appendChild(quantityLabel)
    quantityContainerDiv.appendChild(decreaseBtn)
    quantityContainerDiv.appendChild(quantityDisplay)
    quantityContainerDiv.appendChild(increaseBtn)
    
    // Append stock info inside quantity controls (at the end, right side)
    quantityContainerDiv.appendChild(stockDiv)

    // Share Icon (will be positioned with rating on right side)
    let shareIcon = document.createElement('button')
    shareIcon.id = 'shareIcon'
    shareIcon.className = 'share-icon-rating'
    shareIcon.innerHTML = '<i class="fas fa-share-alt"></i>'
    shareIcon.setAttribute('aria-label', 'Share product')
    shareIcon.title = 'Share product'
    shareIcon.onclick = function() {
      shareProduct(ob);
    }

    let buttonDiv = document.createElement('div')
    buttonDiv.id = 'button'
    buttonDiv.className = 'button-container'

    // Add to Cart Button
    let addToCartBtn = document.createElement('button')
    addToCartBtn.id = 'addToCartBtn'
    addToCartBtn.className = 'btn-add-to-cart'
    let addToCartText = document.createTextNode('Add to Cart')
    addToCartBtn.appendChild(addToCartText)
    
    addToCartBtn.onclick = async function() {
      // Check if variants are available and if size/color are selected
      const sizes = window.productSizes || [];
      const colors = window.productColors || [];
      const hasVariants = (sizes && sizes.length > 0) || (colors && colors.length > 0);
      
      if (hasVariants) {
        // Check if size is selected
        if (!window.selectedVariant || !window.selectedVariant.size_id) {
          if (typeof Swal !== 'undefined') {
            await Swal.fire({
              icon: 'warning',
              title: 'Please Select Size',
              text: 'Please select a size before adding to cart.',
              confirmButtonColor: 'rgb(3, 122, 122)',
              confirmButtonText: 'OK'
            });
          } else {
            alert('Please select a size before adding to cart.');
          }
          return;
        }
        
        // Check if color is selected (if colors are available)
        if (colors && colors.length > 0 && (!window.selectedVariant || !window.selectedVariant.color_id)) {
          if (typeof Swal !== 'undefined') {
            await Swal.fire({
              icon: 'warning',
              title: 'Please Select Color',
              text: 'Please select a color before adding to cart.',
              confirmButtonColor: 'rgb(3, 122, 122)',
              confirmButtonText: 'OK'
            });
          } else {
            alert('Please select a color before adding to cart.');
          }
          return;
        }
      }
      
      // Disable button briefly for visual feedback
      addToCartBtn.disabled = true;
      const originalHTML = addToCartBtn.innerHTML;
      addToCartBtn.innerHTML = '<i class="fas fa-check"></i> Added!';
      
      // Use product ID from the product object
      const productId = ob.id;
      // Get quantity from the quantity display
      let quantity = parseInt(quantityDisplay.textContent, 10);
      
      // Ensure quantity is a valid number
      if (!quantity || isNaN(quantity) || quantity < 1) {
        quantity = 1;
      }
      
      // Get variant information
      const variantInfo = {
        variant_id: window.selectedVariant ? window.selectedVariant.variant_id : null,
        size_id: window.selectedVariant ? window.selectedVariant.size_id : null,
        color_id: window.selectedVariant ? window.selectedVariant.color_id : null,
        size_name: window.selectedVariant ? window.selectedVariant.size_name : null,
        color_name: window.selectedVariant ? window.selectedVariant.color_name : null
      };
      
      // INSTANT: Add to cart optimistically (handles both logged-in and guest users)
      if (window.optimisticCart && typeof window.optimisticCart.addToCart === 'function') {
        // Pass variant info as third parameter (if supported)
        await window.optimisticCart.addToCart(productId, quantity, variantInfo);
        // Badge is updated instantly in optimisticAddToCart function
        // API calls happen in background (user won't see)
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
        } catch (error) {
          // Ignore errors
        }
      }
      
      // Re-enable button after brief delay
      setTimeout(() => {
        addToCartBtn.disabled = false;
        addToCartBtn.innerHTML = originalHTML;
        setTimeout(() => {
          // Open cart drawer instead of redirecting
          console.log('[Add to Cart] Attempting to open cart drawer...');
          if (typeof window.openCartDrawer === 'function') {
            console.log('[Add to Cart] Calling window.openCartDrawer()');
            window.openCartDrawer();
          } else {
            console.error('[Add to Cart] window.openCartDrawer not found! Waiting...');
            // Wait a bit for drawer to load, then try again
            setTimeout(() => {
              if (typeof window.openCartDrawer === 'function') {
                console.log('[Add to Cart] Retrying - Calling window.openCartDrawer()');
                window.openCartDrawer();
              } else {
                console.error('[Add to Cart] window.openCartDrawer still not found after wait');
              }
            }, 500);
          }
        }, 500);
      }, 1000);
    }
    
    // Helper function to add to cookie cart
    function addToCookieCart(productId, quantity) {
      let order = "";
      let counter = 0;
      
      // Get current cart state
      if(document.cookie.indexOf(',counter=')>=0) {
        order = document.cookie.split(',')[0].split('=')[1];
        counter = Number(document.cookie.split(',')[1].split('=')[1]);
      }
      
      // Add items based on quantity
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
      
      updateBadge();
      // Also update global badge counter (for header on all pages)
      if (typeof updateBadgeCounter === 'function') {
        updateBadgeCounter();
      }
      showAddToCartSuccess();
      
      // Re-enable button
      addToCartBtn.disabled = false;
      addToCartBtn.innerHTML = 'Add to Cart';
      
      // Open cart drawer after 1 second
        setTimeout(() => {
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
        }, 1000);
    }
    
    // Buy Now Button
    let buyNowBtn = document.createElement('button')
    buyNowBtn.id = 'buyNowBtn'
    buyNowBtn.className = 'btn-buy-now'
    let buyNowText = document.createTextNode('Buy Now')
    buyNowBtn.appendChild(buyNowText)
    
    buyNowBtn.onclick = async function() {
      // Check if variants are available and if size/color are selected
      const sizes = window.productSizes || [];
      const colors = window.productColors || [];
      const hasVariants = (sizes && sizes.length > 0) || (colors && colors.length > 0);
      
      if (hasVariants) {
        // Check if size is selected
        if (!window.selectedVariant || !window.selectedVariant.size_id) {
          if (typeof Swal !== 'undefined') {
            await Swal.fire({
              icon: 'warning',
              title: 'Please Select Size',
              text: 'Please select a size before proceeding.',
              confirmButtonColor: 'rgb(3, 122, 122)',
              confirmButtonText: 'OK'
            });
          } else {
            alert('Please select a size before proceeding.');
          }
          return;
        }
        
        // Check if color is selected (if colors are available)
        if (colors && colors.length > 0 && (!window.selectedVariant || !window.selectedVariant.color_id)) {
          if (typeof Swal !== 'undefined') {
            await Swal.fire({
              icon: 'warning',
              title: 'Please Select Color',
              text: 'Please select a color before proceeding.',
              confirmButtonColor: 'rgb(3, 122, 122)',
              confirmButtonText: 'OK'
            });
          } else {
            alert('Please select a color before proceeding.');
          }
          return;
        }
      }
      
      // Disable button briefly for visual feedback
      buyNowBtn.disabled = true;
      const originalHTML = buyNowBtn.innerHTML;
      buyNowBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
      
      // Use product ID from the product object
      const productId = ob.id;
      // Get quantity from the quantity display
      let quantity = parseInt(quantityDisplay.textContent, 10);
      
      // Ensure quantity is a valid number
      if (!quantity || isNaN(quantity) || quantity < 1) {
        quantity = 1;
      }
      
      // Get variant information
      const variantInfo = {
        variant_id: window.selectedVariant ? window.selectedVariant.variant_id : null,
        size_id: window.selectedVariant ? window.selectedVariant.size_id : null,
        color_id: window.selectedVariant ? window.selectedVariant.color_id : null,
        size_name: window.selectedVariant ? window.selectedVariant.size_name : null,
        color_name: window.selectedVariant ? window.selectedVariant.color_name : null
      };
      
      // INSTANT: Add to cart optimistically (same logic as Shop Now / Add to Cart)
      if (window.optimisticCart && typeof window.optimisticCart.addToCart === 'function') {
        // Pass variant info as third parameter (if supported)
        await window.optimisticCart.addToCart(productId, quantity, variantInfo);
        // Badge is updated instantly in optimisticAddToCart function
        // API calls happen in background (user won't see)
        
        // Re-enable button
        buyNowBtn.disabled = false;
        buyNowBtn.innerHTML = originalHTML;
        
        // Redirect directly to checkout instantly (don't wait for API)
        window.location.href = 'checkout.html';
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
          
          window.location.href = 'checkout.html';
        } catch (error) {
          // Ignore errors
          window.location.href = 'checkout.html';
        }
      }
    }
    
    buttonDiv.appendChild(addToCartBtn)
    buttonDiv.appendChild(buyNowBtn)

    mainContainer.appendChild(imageSectionDiv)
    mainContainer.appendChild(productDetailsDiv)
    productDetailsDiv.appendChild(h1)
    
    // Create container for rating and share icon (right side with space between)
    let ratingShareContainer = document.createElement('div')
    ratingShareContainer.className = 'rating-share-container'
    ratingShareContainer.appendChild(ratingStars)
    ratingShareContainer.appendChild(shareIcon)
    productDetailsDiv.appendChild(ratingShareContainer) // Add rating and share icon together
    
    if (ob.brand) {
    productDetailsDiv.appendChild(h4)
    }
    productDetailsDiv.appendChild(detailsDiv)
    detailsDiv.appendChild(h3DetailsDiv)
    productDetailsDiv.appendChild(h3)
    productDetailsDiv.appendChild(para)
    // productPreviewDiv moved to imageSectionDiv (below main image)
    productDetailsDiv.appendChild(quantityContainerDiv) // Append quantity controls directly (stock info is inside)
    productDetailsDiv.appendChild(buttonDiv)

    // Update meta tags for SEO and sharing
    updateMetaTags(ob);
    
    return mainContainer
}

// Function to share product
function shareProduct(product) {
  const productUrl = window.location.href;
  const productName = product.name || 'Product';
  const productPrice = product.final_price || product.price || 0;
  const shareText = `Check out ${productName} - Rs ${productPrice} at CO TAILOR`;
  
  if (navigator.share) {
    // Use Web Share API if available
    navigator.share({
      title: productName,
      text: shareText,
      url: productUrl
    }).catch(err => {
      fallbackShare(productUrl, shareText);
    });
  } else {
    // Fallback to copy to clipboard
    fallbackShare(productUrl, shareText);
  }
}

// Fallback share method
function fallbackShare(url, text) {
  // Copy to clipboard
  if (navigator.clipboard) {
    navigator.clipboard.writeText(url).then(() => {
      showShareSuccess('Link copied to clipboard!');
    }).catch(() => {
      promptShare(url);
    });
  } else {
    promptShare(url);
  }
}

// Prompt user to copy URL
function promptShare(url) {
  const input = document.createElement('input');
  input.value = url;
  document.body.appendChild(input);
  input.select();
  try {
    document.execCommand('copy');
    showShareSuccess('Link copied to clipboard!');
  } catch (err) {
    alert('Please copy this link: ' + url);
  }
  document.body.removeChild(input);
}

// Show share success message
function showShareSuccess(message) {
  const successMsg = document.createElement("div");
  successMsg.className = "success-message show";
  successMsg.innerHTML = `
    <i class="fas fa-check-circle"></i>
    <span>${message}</span>
  `;
  document.body.appendChild(successMsg);
  
  setTimeout(() => {
    successMsg.classList.remove('show');
    setTimeout(() => successMsg.remove(), 300);
  }, 2000);
}

// Update meta tags dynamically for SEO and social sharing
function updateMetaTags(product) {
  const baseUrl = window.location.origin;
  const productUrl = window.location.href;
  const productName = product.name || 'Product';
  const productDescription = product.description || `Buy ${productName} at CO TAILOR - Juki Machine Accessories`;
  const productPrice = product.final_price || product.price || 0;
  const productImage = product.preview || product.image_url || '';
  
  // Helper function to update or create meta tag
  function setMetaTag(property, content) {
    let meta = document.querySelector(`meta[property="${property}"]`) || 
               document.querySelector(`meta[name="${property}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      if (property.startsWith('og:') || property.startsWith('twitter:')) {
        meta.setAttribute('property', property);
      } else {
        meta.setAttribute('name', property);
      }
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  }
  
  // Update title
  document.title = `${productName} - CO TAILOR | Juki Machine Accessories`;
  
  // Basic meta tags
  setMetaTag('description', productDescription);
  setMetaTag('keywords', `${productName}, Juki Machine Accessories, ${product.brand || ''}, Industrial Parts`);
  
  // Open Graph tags
  setMetaTag('og:title', productName);
  setMetaTag('og:description', productDescription);
  setMetaTag('og:image', productImage);
  setMetaTag('og:url', productUrl);
  setMetaTag('og:type', 'product');
  setMetaTag('og:site_name', 'CO TAILOR');
  setMetaTag('product:price:amount', productPrice);
  setMetaTag('product:price:currency', 'PKR');
  
  // Twitter Card tags
  setMetaTag('twitter:card', 'summary_large_image');
  setMetaTag('twitter:title', productName);
  setMetaTag('twitter:description', productDescription);
  setMetaTag('twitter:image', productImage);
  
  // Canonical URL
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', productUrl);
}



// Supabase Configuration
// Constants are declared in productVariants.js (loaded before this file)
// If productVariants.js didn't load, we need to ensure these are available
// Use window object to avoid duplicate const declaration errors
if (typeof window.SUPABASE_BASE_URL === 'undefined') {
  window.SUPABASE_BASE_URL = "https://grksptxhbdlbdrlabaew.supabase.co/rest/v1";
  window.SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdya3NwdHhoYmRsYmRybGFiYWV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyOTI2MDgsImV4cCI6MjA4Mjg2ODYwOH0.TpiilrTDb4ZNbETvl0h4E_LFHZGpcx91_6Nx_dDPbew";
}

// Create local references to avoid using const (which would cause duplicate declaration error)
// Use the constants from productVariants.js if available, otherwise use window variables
const SUPABASE_BASE_URL_REF = typeof SUPABASE_BASE_URL !== 'undefined' ? SUPABASE_BASE_URL : window.SUPABASE_BASE_URL;
const SUPABASE_ANON_KEY_REF = typeof SUPABASE_ANON_KEY !== 'undefined' ? SUPABASE_ANON_KEY : window.SUPABASE_ANON_KEY;

// Retry configuration
let retryCount = 0;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Function to fetch product details from Supabase with retry logic
function fetchProductDetails(id, retryAttempt = 0) {
  if (id && !isNaN(id) && id > 0) {
    // Include brand information in the query (use simple select if join fails)
    const supabaseUrl = `${SUPABASE_BASE_URL_REF}/products?id=eq.${id}&select=*`;
    
    let httpRequest = new XMLHttpRequest();
    let requestCompleted = false;
    
    httpRequest.onreadystatechange = function() {
      if(this.readyState === 4 && !requestCompleted) {
        requestCompleted = true;
        
        if(this.status == 200) {
          try {
            let response = JSON.parse(this.responseText);
            
            // Supabase returns an array, get first item
            if (Array.isArray(response) && response.length > 0) {
              let contentDetails = response[0];
              
              // Extract brand information if nested (safely)
              try {
                if (contentDetails.brands && typeof contentDetails.brands === 'object') {
                  contentDetails.brand_id = contentDetails.brands.id;
                  contentDetails.brand = contentDetails.brands.name;
                }
              } catch (e) {
                console.error('[Product] Error extracting brand info:', e);
                // Continue without brand info
              }
              
              // Validate required fields
              if (!contentDetails.name) {
                hideLoader();
                showError("Product data is incomplete. Please try again.");
                return;
              }
              
              // Reset retry count on success
              retryCount = 0;
              
              // Increment view count (optional - make a PATCH request)
              incrementViewCount(contentDetails.id);
              
              // Fetch product reviews first to get accurate rating
              fetchProductRatingForDisplay(contentDetails.id, function(avgRating) {
                // Use the calculated rating from reviews, or fallback to strike_rate/default
                if (avgRating > 0) {
                  contentDetails.calculatedRating = avgRating;
                }
                // Render product details (will use calculatedRating if available)
                try {
                  dynamicContentDetails(contentDetails);
                } catch (error) {
                  console.error('[Product Details] Error rendering product:', error);
                  hideLoader();
                  showError("Error displaying product. Please refresh the page.");
                }
                
                // Fetch and display full product reviews
                if (typeof window.fetchProductReviews === 'function') {
                  setTimeout(() => {
                    window.fetchProductReviews(contentDetails.id);
                  }, 500);
                }
              });
            } else {
              hideLoader();
              showError("Product not found. Please check the product ID and try again.");
            }
          } catch (error) {
            // Retry on parse error
            if (retryAttempt < MAX_RETRIES) {
              setTimeout(function() {
                fetchProductDetails(id, retryAttempt + 1);
              }, RETRY_DELAY * (retryAttempt + 1));
            } else {
              hideLoader();
              showError("Error loading product details. Please try again.");
            }
          }
        } else if(this.status == 0) {
          // Retry on network error
          if (retryAttempt < MAX_RETRIES) {
            setTimeout(function() {
              fetchProductDetails(id, retryAttempt + 1);
            }, RETRY_DELAY * (retryAttempt + 1));
          } else {
            hideLoader();
            showError("Network error. Please check your connection and try again.");
          }
        } else {
          // Retry on 5xx errors (server errors)
          if ((this.status >= 500 && this.status < 600) && retryAttempt < MAX_RETRIES) {
            setTimeout(function() {
              fetchProductDetails(id, retryAttempt + 1);
            }, RETRY_DELAY * (retryAttempt + 1));
          } else {
            hideLoader();
            showError("Product not found (Status: " + this.status + "). Please check the product ID and try again.");
          }
        }
      }
    };
    
    // Add error handler
    httpRequest.onerror = function() {
      if (!requestCompleted) {
        requestCompleted = true;
        
        // Retry on network error
        if (retryAttempt < MAX_RETRIES) {
          setTimeout(function() {
            fetchProductDetails(id, retryAttempt + 1);
          }, RETRY_DELAY * (retryAttempt + 1));
        } else {
          hideLoader();
          showError("Network error. Please check your connection and try again.");
        }
      }
    };
    
    // Add timeout handler
    httpRequest.ontimeout = function() {
      if (!requestCompleted) {
        requestCompleted = true;
        
        // Retry on timeout
        if (retryAttempt < MAX_RETRIES) {
          setTimeout(function() {
            fetchProductDetails(id, retryAttempt + 1);
          }, RETRY_DELAY * (retryAttempt + 1));
        } else {
          hideLoader();
          showError("Request timeout. Please try again.");
        }
      }
    };
    
    httpRequest.open('GET', supabaseUrl, true);
    httpRequest.setRequestHeader('apikey', SUPABASE_ANON_KEY_REF);
    httpRequest.setRequestHeader('Authorization', 'Bearer ' + SUPABASE_ANON_KEY_REF);
    httpRequest.setRequestHeader('Content-Type', 'application/json');
    httpRequest.setRequestHeader('Prefer', 'return=representation');
    httpRequest.timeout = 15000; // 15 second timeout
    httpRequest.send();
  } else {
    hideLoader();
    showError("Product ID not found. Please select a valid product.");
  }
}

// Function to fetch product rating from reviews for initial display
function fetchProductRatingForDisplay(productId, callback) {
  if (!productId) {
    callback(0);
    return;
  }
  
  const url = `https://grksptxhbdlbdrlabaew.supabase.co/rest/v1/product_reviews?product_id=eq.${productId}&select=rating`;
  const httpRequest = new XMLHttpRequest();
  
  httpRequest.onreadystatechange = function() {
    if (this.readyState === 4) {
      if (this.status === 200) {
        try {
          const reviews = JSON.parse(this.responseText);
          if (reviews && reviews.length > 0) {
            const avgRating = reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / reviews.length;
            callback(avgRating);
          } else {
            callback(0); // No reviews yet
          }
        } catch (error) {
          callback(0);
        }
      } else {
        callback(0);
      }
    }
  };
  
  httpRequest.onerror = function() {
    callback(0);
  };
  
  httpRequest.open('GET', url, true);
  httpRequest.setRequestHeader('apikey', SUPABASE_ANON_KEY);
  httpRequest.setRequestHeader('Authorization', 'Bearer ' + SUPABASE_ANON_KEY);
  httpRequest.setRequestHeader('Content-Type', 'application/json');
  httpRequest.send();
}

// Function to increment view count
function incrementViewCount(productId) {
  // Optional: Increment view count in background
  // First get current views, then increment
  const getRequest = new XMLHttpRequest();
  getRequest.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
      try {
        const product = JSON.parse(this.responseText);
        if (Array.isArray(product) && product.length > 0) {
          const currentViews = product[0].views || 0;
          const newViews = currentViews + 1;
          
          // Update views
          const updateRequest = new XMLHttpRequest();
          const updateUrl = `${SUPABASE_BASE_URL_REF}/products?id=eq.${productId}`;
          updateRequest.open('PATCH', updateUrl, true);
          updateRequest.setRequestHeader('apikey', SUPABASE_ANON_KEY);
          updateRequest.setRequestHeader('Authorization', 'Bearer ' + SUPABASE_ANON_KEY);
          updateRequest.setRequestHeader('Content-Type', 'application/json');
          updateRequest.setRequestHeader('Prefer', 'return=minimal');
          updateRequest.send(JSON.stringify({ views: newViews }));
        }
      } catch (e) {
        // Error incrementing view count - silently fail
      }
    }
  };
  
  const getUrl = `${SUPABASE_BASE_URL_REF}/products?id=eq.${productId}&select=views`;
  getRequest.open('GET', getUrl, true);
  getRequest.setRequestHeader('apikey', SUPABASE_ANON_KEY);
  getRequest.setRequestHeader('Authorization', 'Bearer ' + SUPABASE_ANON_KEY);
  getRequest.send();
}

/**
 * Initialize image zoom effect (like Daraz/Amazon)
 * Creates a magnifying lens that follows the mouse cursor
 */
function initImageZoom(imgElement) {
  if (!imgElement) return;
  
  // Don't initialize if already initialized
  if (imgElement.dataset.zoomInitialized === 'true') return;
  imgElement.dataset.zoomInitialized = 'true';
  
  // Create zoom lens (the magnifying glass circle)
  const lens = document.createElement('div');
  lens.className = 'zoom-lens';
  lens.style.display = 'none';
  
  // Create zoom result container (the magnified preview)
  const zoomResult = document.createElement('div');
  zoomResult.className = 'zoom-result';
  zoomResult.style.display = 'none';
  
  // Create zoomed image (full size)
  const zoomedImg = document.createElement('img');
  zoomedImg.src = imgElement.src;
  zoomedImg.alt = imgElement.alt;
  zoomResult.appendChild(zoomedImg);
  
  // Insert lens into image wrapper
  const imageWrapper = imgElement.parentElement;
  if (imageWrapper) {
    imageWrapper.style.position = 'relative';
    imageWrapper.appendChild(lens);
    
    // Add zoom result to body so it doesn't affect any layout
    const existingZoom = document.querySelector('.zoom-result');
    if (existingZoom) {
      existingZoom.remove();
    }
    document.body.appendChild(zoomResult);
  }
  
  // Zoom level (2.5x magnification for better visibility)
  const zoom = 2.5;
  const lensSize = 150; // Lens size in pixels
  
  // Track if zoom is currently visible to avoid repeated updates
  let zoomVisible = false;
  const productDetails = document.getElementById('productDetails');
  
  // Wait for image to load to get natural dimensions
  const setupZoom = () => {
    if (!imgElement.complete || !imgElement.naturalWidth) {
      imgElement.addEventListener('load', setupZoom, { once: true });
      return;
    }
    
    // Mouse enter handler - show zoom and position it
    imgElement.addEventListener('mouseenter', function() {
      if (!zoomVisible) {
        zoomVisible = true;
        lens.style.display = 'block';
        zoomResult.style.display = 'block';
        
        // Position zoom result relative to productDetails (right side, top)
        const updateZoomPosition = () => {
          const productDetails = document.getElementById('productDetails');
          if (productDetails) {
            const rect = productDetails.getBoundingClientRect();
            const zoomWidth = zoomResult.offsetWidth || 500;
            const zoomHeight = zoomResult.offsetHeight || 500;
            
            // Position on right side of productDetails
            zoomResult.style.top = (rect.top + -20) + 'px';
            zoomResult.style.left = (rect.left + 80) + 'px';
          }
        };
        
        updateZoomPosition();
        
        // Update position on scroll and resize
        window.addEventListener('scroll', updateZoomPosition, { passive: true });
        window.addEventListener('resize', updateZoomPosition, { passive: true });
        
        // Store update function for cleanup
        zoomResult._updatePosition = updateZoomPosition;
      }
    });
    
    // Mouse move handler - only update lens and zoom position
    imgElement.addEventListener('mousemove', function(e) {
      if (!imgElement.complete || !imgElement.naturalWidth || !zoomVisible) return;
      
      const rect = imgElement.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Position lens (centered on cursor)
      let lensX = x - lensSize / 2;
      let lensY = y - lensSize / 2;
      
      // Keep lens within image bounds
      lensX = Math.max(0, Math.min(lensX, rect.width - lensSize));
      lensY = Math.max(0, Math.min(lensY, rect.height - lensSize));
      
      lens.style.left = lensX + 'px';
      lens.style.top = lensY + 'px';
      
      // Calculate zoomed image position (show exact area under cursor)
      const fx = zoomedImg.naturalWidth / imgElement.width;
      const fy = zoomedImg.naturalHeight / imgElement.height;
      
      // Calculate the position in the zoomed image
      // The lens position in the original image corresponds to the zoomed image position
      // We need to move the zoomed image so the area under the lens is visible in the center of zoom result
      const zoomResultWidth = zoomResult.offsetWidth || 500;
      const zoomResultHeight = zoomResult.offsetHeight || 500;
      
      // Calculate how much to move the zoomed image
      // The lens center position in original image
      const lensCenterX = lensX + lensSize / 2;
      const lensCenterY = lensY + lensSize / 2;
      
      // Position in the zoomed image (scaled by zoom factor)
      const zoomedX = lensCenterX * fx * zoom;
      const zoomedY = lensCenterY * fy * zoom;
      
      // Move the image so the zoomed position is at the center of the zoom result
      const zoomX = -(zoomedX - zoomResultWidth / 2);
      const zoomY = -(zoomedY - zoomResultHeight / 2);
      
      zoomedImg.style.left = zoomX + 'px';
      zoomedImg.style.top = zoomY + 'px';
      zoomedImg.style.width = (imgElement.naturalWidth * zoom) + 'px';
      zoomedImg.style.height = (imgElement.naturalHeight * zoom) + 'px';
    });
  };
  
  setupZoom();
  
  // Hide lens and zoom result on mouse leave
  const hideZoom = function() {
    if (zoomVisible) {
      zoomVisible = false;
      lens.style.display = 'none';
      zoomResult.style.display = 'none';
      
      // Remove event listeners
      if (zoomResult._updatePosition) {
        window.removeEventListener('scroll', zoomResult._updatePosition);
        window.removeEventListener('resize', zoomResult._updatePosition);
        delete zoomResult._updatePosition;
      }
    }
  };
  
  imgElement.addEventListener('mouseleave', hideZoom);
  
  // Also hide when mouse leaves the wrapper
  if (imageWrapper) {
    imageWrapper.addEventListener('mouseleave', hideZoom);
  }
}

// Function to fetch and display recommended products
function fetchRecommendedProducts(currentProductId, container) {
  if (!container) return;
  
  // Show loader
  container.innerHTML = '<div class="loader-container"><div class="loader"></div></div>';
  
  const SUPABASE_URL = `${window.SUPABASE_BASE_URL || SUPABASE_BASE_URL_REF}/products?select=*&id=neq.${currentProductId}&limit=8`;
  let httpRequest = new XMLHttpRequest();
  httpRequest.open('GET', SUPABASE_URL, true);
  httpRequest.setRequestHeader('apikey', window.SUPABASE_ANON_KEY || SUPABASE_ANON_KEY_REF);
  httpRequest.setRequestHeader('Authorization', 'Bearer ' + (window.SUPABASE_ANON_KEY || SUPABASE_ANON_KEY_REF));

  httpRequest.onreadystatechange = function() {
    if (this.readyState === 4) {
      if (this.status == 200) {
        try {
          const products = JSON.parse(this.responseText);
          container.innerHTML = ''; // Clear loader
          
          if (products && products.length > 0) {
            // Display products
            products.forEach(product => {
              const productCard = createRecommendedProductCard(product);
              container.appendChild(productCard);
            });
          } else {
            container.innerHTML = '<p style="text-align: center; padding: 20px; color: #666;">No recommended products available.</p>';
          }
        } catch (error) {
          console.error('[Recommended Products] Error parsing response:', error);
          container.innerHTML = '<p style="text-align: center; padding: 20px; color: #666;">Error loading recommended products.</p>';
        }
      } else {
        console.error('[Recommended Products] API error:', this.status);
        container.innerHTML = '<p style="text-align: center; padding: 20px; color: #666;">Error loading recommended products.</p>';
      }
    }
  };
  
  httpRequest.send();
}

// Function to create a product card for recommended section
function createRecommendedProductCard(product) {
  const box = document.createElement('div');
  box.className = 'box recommended-product-box';
  box.setAttribute('data-product-id', product.id);
  
  const link = document.createElement('a');
  link.href = `contentDetails.html?id=${product.id}`;
  link.style.textDecoration = 'none';
  link.style.color = 'black';
  
  // Image container
  const imageContainer = document.createElement('div');
  imageContainer.className = 'image-container';
  imageContainer.style.position = 'relative';
  imageContainer.style.display = 'block';
  
  const img = document.createElement('img');
  img.src = product.preview || product.image_url || '';
  img.alt = product.name || 'Product';
  img.loading = 'lazy';
  img.style.width = '100%';
  img.style.height = '200px';
  img.style.objectFit = 'cover';
  img.onerror = function() {
    this.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect fill='%23ddd' width='300' height='300'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='18' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EImage not available%3C/text%3E%3C/svg%3E";
  };
  
  // Badges on image
  // New Arrival badge (top-left corner)
  if (product.new_arrival) {
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
  if (product.discount_percent && product.discount_percent > 0 && product.final_price) {
    let discountBadge = document.createElement("span");
    discountBadge.className = "badge discount-badge-top";
    discountBadge.textContent = "-" + Math.round(product.discount_percent) + "% OFF";
    discountBadge.style.position = "absolute";
    discountBadge.style.top = "10px";
    discountBadge.style.right = "10px";
    discountBadge.style.zIndex = "2";
    imageContainer.appendChild(discountBadge);
  }
  
  imageContainer.appendChild(img);
  link.appendChild(imageContainer);
  
  // Product name
  const h3 = document.createElement('h3');
  h3.textContent = product.name || 'Product';
  link.appendChild(h3);
  
  // Price with strike rate (original price if discounted)
  const priceDiv = document.createElement('div');
  priceDiv.className = 'price-quantity-row';
  
  // Show original price with strikethrough if there's a discount
  if (product.discount_percent && product.discount_percent > 0 && product.price && product.final_price) {
    const originalPrice = Math.round(product.price);
    const finalPrice = Math.round(product.final_price);
    
    const priceContainer = document.createElement('div');
    priceContainer.style.display = 'flex';
    priceContainer.style.alignItems = 'center';
    priceContainer.style.gap = '10px';
    priceContainer.style.flexWrap = 'wrap';
    
    // Original price (strikethrough)
    const originalPriceSpan = document.createElement('span');
    originalPriceSpan.style.textDecoration = 'line-through';
    originalPriceSpan.style.color = '#999';
    originalPriceSpan.style.fontSize = '16px';
    originalPriceSpan.textContent = 'Rs ' + originalPrice.toLocaleString();
    priceContainer.appendChild(originalPriceSpan);
    
    // Final price
    const priceH2 = document.createElement('h2');
    priceH2.style.margin = '0';
    priceH2.style.fontSize = '20px';
    priceH2.style.color = '#4ecdc4';
    priceH2.style.fontWeight = '600';
    priceH2.textContent = 'Rs ' + finalPrice.toLocaleString();
    priceContainer.appendChild(priceH2);
    
    priceDiv.appendChild(priceContainer);
  } else {
    // No discount, just show final price
    const priceH2 = document.createElement('h2');
    const finalPrice = Math.round(product.final_price || product.price || 0);
    priceH2.textContent = 'Rs ' + finalPrice.toLocaleString();
    priceH2.style.margin = '0';
    priceH2.style.fontSize = '20px';
    priceH2.style.color = '#4ecdc4';
    priceH2.style.fontWeight = '600';
    priceDiv.appendChild(priceH2);
  }
  
  link.appendChild(priceDiv);
  
  box.appendChild(link);
  return box;
}

