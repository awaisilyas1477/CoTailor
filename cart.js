// Show loading indicator
function showLoader() {
  const cartContainer = document.getElementById('cartContainer');
  if (cartContainer) {
    const loader = document.createElement("div");
    loader.className = "loader-container";
    loader.innerHTML = `
      <div class="loader"></div>
      <p>Loading cart...</p>
    `;
    cartContainer.appendChild(loader);
  }
}

// Hide loading indicator
function hideLoader() {
  const cartContainer = document.getElementById('cartContainer');
  if (cartContainer) {
    const loader = cartContainer.querySelector(".loader-container");
    if (loader) {
      loader.remove();
    }
  }
}

// Show error message
function showError(message) {
  const cartContainer = document.getElementById('cartContainer');
  if (cartContainer) {
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.innerHTML = `
      <i class="fas fa-exclamation-circle"></i>
      <p>${message}</p>
      <button onclick="location.href='index.html'">Continue Shopping</button>
    `;
    cartContainer.appendChild(errorDiv);
  }
}

// Show empty cart message
function showEmptyCart() {
  const cartContainer = document.getElementById('cartContainer');
  if (cartContainer) {
    const emptyDiv = document.createElement("div");
    emptyDiv.className = "empty-cart";
    emptyDiv.innerHTML = `
      <i class="fas fa-shopping-cart"></i>
      <h2>Your cart is empty</h2>
      <p>Add some items to your cart to continue shopping.</p>
      <a href="index.html"><button>Continue Shopping</button></a>
    `;
    cartContainer.appendChild(emptyDiv);
  }
}

// Update badge counter INSTANTLY from cache/cookies (synchronous, no waiting)
function updateBadgeInstantly() {
    const badge = document.getElementById("badge");
    if (!badge) return;
    
    // Check localStorage cache FIRST (instant)
    if (window.userCart && typeof window.userCart.getCachedCart === 'function') {
        try {
            const cached = window.userCart.getCachedCart();
            if (cached && cached.length > 0) {
                let totalCount = 0;
                cached.forEach(item => {
                    totalCount += (item.quantity || 1);
                });
                badge.innerHTML = totalCount;
                return;
            }
        } catch (error) {
            // Fall through to state manager check
        }
    }
    
    // Also check state manager if userCart cache is empty
    if (window.stateManager) {
        try {
            const state = window.stateManager.getState();
            if (state.cart && state.cart.length > 0) {
                let totalCount = 0;
                state.cart.forEach(item => {
                    totalCount += (item.quantity || 1);
                });
                badge.innerHTML = totalCount;
                return;
            }
        } catch (error) {
            // Fall through to cookie check
        }
    }
    
    // Fallback to cookies (for guest users)
    if(document.cookie && document.cookie.indexOf(',counter=')>=0) {
        try {
            let counter = document.cookie.split(',')[1].split('=')[1];
            badge.innerHTML = counter;
        } catch (error) {
            badge.innerHTML = '0';
        }
    } else {
        badge.innerHTML = '0';
    }
}

// Update badge instantly on page load
updateBadgeInstantly();

const cartContainer = document.getElementById('cartContainer');
const boxContainerDiv = document.createElement('div');
boxContainerDiv.id = 'boxContainer';

// Don't show loader initially - cart will display instantly from cache
// showLoader(); // Removed for instant display

// Function to update quantity
async function updateQuantity(itemId, change, quantityDisplay, amountElement, itemPrice, decreaseBtn) {
    let currentQuantity = Number(quantityDisplay.textContent);
    let newQuantity = currentQuantity + change;
    
    // IMPORTANT: Preserve localStorage cart before updating
    // This ensures we don't lose cart data during quantity updates
    
    // Don't allow quantity less than 1
    if (newQuantity < 1) {
        return;
    }
    
    // Disable buttons during update
    const actualDecreaseBtn = decreaseBtn || quantityDisplay.previousElementSibling;
    const increaseBtn = quantityDisplay.nextElementSibling;
    if (actualDecreaseBtn) actualDecreaseBtn.disabled = true;
    if (increaseBtn) increaseBtn.disabled = true;
    
    // INSTANT: Update UI optimistically
    quantityDisplay.textContent = newQuantity;
    const newAmount = Math.round(itemPrice * newQuantity);
    amountElement.textContent = 'Amount: Rs ' + newAmount;
    
    // Disable decrease button if quantity is 1
    if (actualDecreaseBtn) {
        if (newQuantity <= 1) {
            actualDecreaseBtn.disabled = true;
        } else {
            actualDecreaseBtn.disabled = false;
        }
    }
    
    // Re-enable increase button
    if (increaseBtn) increaseBtn.disabled = false;
    
    // INSTANT: Update state manager optimistically
    if (window.optimisticCart) {
        await window.optimisticCart.updateQuantity(itemId, newQuantity);
        // Recalculate total instantly
        if (typeof recalculateTotal === 'function') {
            recalculateTotal();
        }
        // Update badge instantly
        if (typeof updateBadgeInstantly === 'function') {
            updateBadgeInstantly();
        }
        // Also update badge globally
        if (typeof updateBadgeCounter === 'function') {
            updateBadgeCounter();
        }
        return; // Background sync handles the rest
    }
    
    // Fallback to old method
    // Check if user is logged in and has database cart
    if (window.userCart && cartItemIdMap[itemId]) {
        // Update in database
        const cartItemId = cartItemIdMap[itemId];
        const result = await window.userCart.updateCartItemQuantity(cartItemId, newQuantity);
        
        if (result.error) {
            // Re-enable buttons on error and revert UI
            quantityDisplay.textContent = currentQuantity;
            const oldAmount = Math.round(itemPrice * currentQuantity);
            amountElement.textContent = 'Amount: Rs ' + oldAmount;
            if (actualDecreaseBtn) actualDecreaseBtn.disabled = false;
            if (increaseBtn) increaseBtn.disabled = false;
            return;
        }
        
        // Update dbCartItems array to reflect new quantity
        if (dbCartItems && dbCartItems.length > 0) {
            const cartItem = dbCartItems.find(item => item.product_id === itemId);
            if (cartItem) {
                cartItem.quantity = newQuantity;
            }
        }
        
        // Update badge everywhere (header, all pages)
        updateBadgeFromDatabase();
        // Also call global badge update function if available
        if (typeof updateBadgeCounter === 'function') {
            updateBadgeCounter();
        }
        
        // Recalculate and update total
        recalculateTotal();
    } else {
        // Fallback to cookie-based cart
        if(!document.cookie || document.cookie.indexOf(',counter=') < 0) {
            if (actualDecreaseBtn) actualDecreaseBtn.disabled = false;
            if (increaseBtn) increaseBtn.disabled = false;
            return;
        }
        
        let item = document.cookie.split(',')[0].split('=')[1].split(" ").filter(id => id.trim() !== '');
        let counter = Number(document.cookie.split(',')[1].split('=')[1]);
        
        if (change > 0) {
            // Increase: add item to cart
            item.push(String(itemId));
            counter += 1;
        } else {
            // Decrease: remove one instance
            const index = item.indexOf(String(itemId));
            if (index > -1) {
                item.splice(index, 1);
                counter -= 1;
            }
        }
        
        // Update cookie
        let order = item.join(" ") + " ";
        document.cookie = "orderId=" + order + ",counter=" + counter;
        
        // Update badge
        const badge = document.getElementById("badge");
        if (badge) badge.innerHTML = counter;
        
        // Update quantity display
        quantityDisplay.textContent = newQuantity;
        
        // Update amount
        const newAmount = Math.round(itemPrice * newQuantity);
        amountElement.textContent = 'Amount: Rs ' + newAmount;
        
        // Disable decrease button if quantity is 1
        const btnDecrease = decreaseBtn || quantityDisplay.previousElementSibling;
        if (btnDecrease) {
            if (newQuantity <= 1) {
                btnDecrease.disabled = true;
            } else {
                btnDecrease.disabled = false;
            }
        }
        
        // Re-enable increase button
        if (increaseBtn) increaseBtn.disabled = false;
        
        // Recalculate and update total
        recalculateTotal();
    }
}

// Update badge from database cart (only called when user makes changes, not on page load)
async function updateBadgeFromDatabase() {
    // DON'T call API - just use cache for badge update
    // API will be called by optimistic cart functions when user makes changes
    const badge = document.getElementById("badge");
    if (!badge) return;
    
    // Use cache/localStorage to update badge (no API call)
    if (window.userCart && typeof window.userCart.getCachedCart === 'function') {
        try {
            const cached = window.userCart.getCachedCart();
            if (cached && cached.length > 0) {
                let totalCount = 0;
                cached.forEach(item => {
                    totalCount += (item.quantity || 1);
                });
                badge.innerHTML = totalCount;
                return;
            }
        } catch (error) {
            // Ignore errors
        }
    }
    
    // Also check state manager
    if (window.stateManager) {
        try {
            const state = window.stateManager.getState();
            if (state.cart && state.cart.length > 0) {
                let totalCount = 0;
                state.cart.forEach(item => {
                    totalCount += (item.quantity || 1);
                });
                badge.innerHTML = totalCount;
                return;
            }
        } catch (error) {
            // Ignore errors
        }
    }
    
    // Also update global badge counter (for header on all pages) - but it uses cache, not API
    if (typeof updateBadgeCounter === 'function') {
        updateBadgeCounter();
    }
}

// Function to recalculate total
async function recalculateTotal() {
    // First check if cart is empty by checking DOM
    const remainingItems = boxContainerDiv.querySelectorAll('.cart-item-box');
    if (remainingItems.length === 0) {
        // Cart is empty - hide total container and show empty cart message
        const totalContainer = document.getElementById('totalContainer');
        if (totalContainer) {
            totalContainer.remove();
        }
        const cartContainer = document.getElementById('cartContainer');
        if (cartContainer) {
            cartContainer.innerHTML = '';
        }
        showEmptyCart();
        removeBuyNowButton();
        removeBuyNowButtonBelow();
        const totalItem = document.getElementById("totalItem");
        if (totalItem) totalItem.innerHTML = 'Total Items: 0';
        return;
    }
    
    const SUPABASE_URL = "https://grksptxhbdlbdrlabaew.supabase.co/rest/v1/products?select=*";
    const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdya3NwdHhoYmRsYmRybGFiYWV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyOTI2MDgsImV4cCI6MjA4Mjg2ODYwOH0.TpiilrTDb4ZNbETvl0h4E_LFHZGpcx91_6Nx_dDPbew";
    
    const httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', SUPABASE_URL, true);
    httpRequest.setRequestHeader('apikey', SUPABASE_ANON_KEY);
    httpRequest.setRequestHeader('Authorization', 'Bearer ' + SUPABASE_ANON_KEY);
    
    httpRequest.onreadystatechange = async function() {
        if(this.readyState === 4 && this.status === 200) {
            try {
                let allProducts = JSON.parse(this.responseText);
                let totalAmount = 0;
                let totalCounter = 0;
                
                // Calculate from DOM (cart-item-box elements) - more reliable than dbCartItems
                const cartItems = boxContainerDiv.querySelectorAll('.cart-item-box');
                if (cartItems.length > 0) {
                    cartItems.forEach(cartItemBox => {
                        // Get product ID from data attribute or quantity display
                        const quantityDisplay = cartItemBox.querySelector('.quantity-value');
                        const amountElement = cartItemBox.querySelector('h4');
                        
                        if (quantityDisplay && amountElement) {
                            const itemId = parseInt(quantityDisplay.getAttribute('data-item-id'), 10);
                            const quantity = parseInt(quantityDisplay.textContent, 10) || 1;
                            
                            // Find product
                            const product = allProducts.find(p => p.id === itemId);
                            if (product) {
                                const price = Math.round(Number(product.final_price || product.price || 0));
                                totalAmount += price * quantity;
                                totalCounter += quantity;
                            }
                        }
                    });
                } else if (window.userCart && dbCartItems && dbCartItems.length > 0) {
                    // Fallback: Calculate from database cart if DOM is not available
                    dbCartItems.forEach(cartItem => {
                        const product = allProducts.find(p => p.id === cartItem.product_id);
                        if (product) {
                            const price = Math.round(Number(product.final_price || product.price || 0));
                            const quantity = cartItem.quantity || 1;
                            totalAmount += price * quantity;
                            totalCounter += quantity;
                        }
                    });
                } else {
                    // Fallback to cookie-based cart
                    if(!document.cookie || document.cookie.indexOf(',counter=') < 0) {
                        // Cart is empty - hide total container and show empty cart message
                        const totalContainer = document.getElementById('totalContainer');
                        if (totalContainer) {
                            totalContainer.remove();
                        }
                        const cartContainer = document.getElementById('cartContainer');
                        if (cartContainer) {
                            cartContainer.innerHTML = '';
                        }
                        showEmptyCart();
                        removeBuyNowButton();
                        removeBuyNowButtonBelow();
                        const totalItem = document.getElementById("totalItem");
                        if (totalItem) totalItem.innerHTML = 'Total Items: 0';
                        return;
                    }
                    
                    let item = document.cookie.split(',')[0].split('=')[1].split(" ").filter(id => id.trim() !== '');
                    
                    // Count items
                    let itemCounts = {};
                    for(let i = 0; i < item.length; i++) {
                        if (item[i] && item[i].trim() !== '') {
                            let id = item[i];
                            itemCounts[id] = (itemCounts[id] || 0) + 1;
                        }
                    }
                    
                    // Calculate total - find products by ID
                    for(let itemId in itemCounts) {
                        let itemIdNum = Number(itemId);
                        const product = allProducts.find(p => p.id === itemIdNum);
                        if (product) {
                            const price = Math.round(Number(product.final_price || product.price || 0));
                            totalAmount += price * itemCounts[itemId];
                            totalCounter += itemCounts[itemId];
                        }
                    }
                }
                
                // Double-check if cart is still not empty (in case items were removed during async operation)
                const stillRemainingItems = boxContainerDiv.querySelectorAll('.cart-item-box');
                if (stillRemainingItems.length === 0) {
                    // Cart became empty - hide total container and show empty cart message
                    const totalContainer = document.getElementById('totalContainer');
                    if (totalContainer) {
                        totalContainer.remove();
                    }
                    const cartContainer = document.getElementById('cartContainer');
                    if (cartContainer) {
                        cartContainer.innerHTML = '';
                    }
                    showEmptyCart();
                    removeBuyNowButton();
                    removeBuyNowButtonBelow();
                    const totalItem = document.getElementById("totalItem");
                    if (totalItem) totalItem.innerHTML = 'Total Items: 0';
                    return;
                }
                
                // Update total display (this will clear and replace, not append)
                amountUpdate(totalAmount);
                
                // Update Buy Now button below with new total
                const deliveryCharges = 200;
                const finalTotal = totalAmount + deliveryCharges;
                createBuyNowButtonBelow(finalTotal);
                
                // Update total items
                const totalItem = document.getElementById("totalItem");
                if (totalItem) {
                    totalItem.innerHTML = 'Total Items: ' + totalCounter;
                }
            } catch (error) {
                // Error recalculating total
            }
        }
    };
    
    httpRequest.send();
}

// Function to remove item from cart
async function removeFromCart(itemId, deleteBtn) {
    // INSTANT: Remove from UI optimistically
    const cartItemBox = deleteBtn ? deleteBtn.closest('.cart-item-box') : null;
    if (cartItemBox) {
        cartItemBox.style.opacity = '0.5';
        cartItemBox.style.transition = 'opacity 0.3s';
    }
    
    // Get cartItemId from map (for database operations)
    const cartItemId = cartItemIdMap[itemId] || null;
    
    // Remove from cartItemIdMap immediately
    if (cartItemIdMap[itemId]) {
        delete cartItemIdMap[itemId];
    }
    
    // INSTANT: Update state manager
    if (window.optimisticCart) {
        await window.optimisticCart.removeFromCart(itemId, cartItemId);
        // Remove from UI instantly
        if (cartItemBox) {
            cartItemBox.remove();
        }
        // Check if cart is now empty
        const remainingItems = boxContainerDiv.querySelectorAll('.cart-item-box');
        if (remainingItems.length === 0) {
            // Cart is empty - hide total container and show empty cart message
            const totalContainer = document.getElementById('totalContainer');
            if (totalContainer) {
                totalContainer.remove();
            }
            const cartContainer = document.getElementById('cartContainer');
            if (cartContainer) {
                cartContainer.innerHTML = '';
            }
            showEmptyCart();
            removeBuyNowButton();
            removeBuyNowButtonBelow();
            const totalItem = document.getElementById("totalItem");
            if (totalItem) totalItem.innerHTML = 'Total Items: 0';
        } else {
            // Recalculate total instantly
            if (typeof recalculateTotal === 'function') {
                recalculateTotal();
            }
        }
        // Update badge instantly
        if (typeof updateBadgeInstantly === 'function') {
            updateBadgeInstantly();
        }
        // Also update badge globally
        if (typeof updateBadgeCounter === 'function') {
            updateBadgeCounter();
        }
        return; // Background sync handles the rest
    }
    
    // Fallback to old method
    if (deleteBtn) {
        deleteBtn.disabled = true;
        deleteBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        deleteBtn.style.opacity = '0.6';
    }
    
    // Check if user is logged in and has database cart
    if (window.userCart && cartItemIdMap[itemId]) {
        // Remove from database
        const cartItemId = cartItemIdMap[itemId];
        const result = await window.userCart.removeFromUserCart(cartItemId);
        
        if (result.error) {
            // Re-enable button on error
            if (deleteBtn) {
                deleteBtn.disabled = false;
                deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
                deleteBtn.style.opacity = '1';
            }
            return;
        }
        
        // Reload page to refresh cart
        setTimeout(() => {
            location.reload();
        }, 300);
    } else {
        // Fallback to cookie-based cart
        if(!document.cookie || document.cookie.indexOf(',counter=') < 0) {
            if (deleteBtn) {
                deleteBtn.disabled = false;
                deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
                deleteBtn.style.opacity = '1';
            }
            return;
        }
        
        let item = document.cookie.split(',')[0].split('=')[1].split(" ").filter(id => id.trim() !== '');
        let counter = Number(document.cookie.split(',')[1].split('=')[1]);
        
        // Remove all instances of this item
        item = item.filter(id => id !== String(itemId));
        
        // Update counter
        counter = item.length;
        
        // Update cookie
        let order = item.join(" ") + " ";
        document.cookie = "orderId=" + order + ",counter=" + counter;
        
        // Update badge
        const badge = document.getElementById("badge");
        if (badge) badge.innerHTML = counter;
        
        // Small delay to show loader, then reload
        setTimeout(() => {
            location.reload();
        }, 300);
    }
}

// DYNAMIC CODE TO SHOW THE SELECTED ITEMS IN YOUR CART
function dynamicCartSection(ob, itemCounter, itemId, cartItemId = null, cartItemData = null) {
    let boxDiv = document.createElement('div');
    boxDiv.id = 'box';
    boxDiv.className = 'cart-item-box';
    boxContainerDiv.appendChild(boxDiv);

    // Image container
    let imageContainer = document.createElement('div');
    imageContainer.className = 'cart-item-image';
    
    let boxImg = document.createElement('img');
    boxImg.src = ob.preview;
    boxImg.alt = ob.name;
    boxImg.onerror = function() {
      this.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect fill='%23ddd' width='80' height='80'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='12' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ENo image%3C/text%3E%3C/svg%3E";
    };
    imageContainer.appendChild(boxImg);
    boxDiv.appendChild(imageContainer);

    // Details container
    let detailsContainer = document.createElement('div');
    detailsContainer.className = 'cart-item-details';

    let boxh3 = document.createElement('h3');
    let h3Text = document.createTextNode(ob.name);
    boxh3.appendChild(h3Text);
    detailsContainer.appendChild(boxh3);
    
    // Display variant information (size and color) if available
    let variantText = '';
    if (cartItemData) {
        // Use variant info from cartItemData (passed from processCartItems)
        if (cartItemData.size_name || cartItemData.color_name) {
            const parts = [];
            if (cartItemData.size_name) parts.push(`Size: ${cartItemData.size_name}`);
            if (cartItemData.color_name) parts.push(`Color: ${cartItemData.color_name}`);
            variantText = parts.join(' | ');
        }
    } else {
        // Fallback: Check state manager or cache
        if (window.stateManager) {
            const state = window.stateManager.getState();
            const cartItem = state.cart?.find(item => item.product_id === itemId);
            if (cartItem && (cartItem.size_name || cartItem.color_name)) {
                const parts = [];
                if (cartItem.size_name) parts.push(`Size: ${cartItem.size_name}`);
                if (cartItem.color_name) parts.push(`Color: ${cartItem.color_name}`);
                variantText = parts.join(' | ');
            }
        }
        
        // Also check localStorage cache
        if (!variantText && window.userCart && typeof window.userCart.getCachedCart === 'function') {
            try {
                const cached = window.userCart.getCachedCart();
                const cartItem = cached?.find(item => item.product_id === itemId);
                if (cartItem && (cartItem.size_name || cartItem.color_name)) {
                    const parts = [];
                    if (cartItem.size_name) parts.push(`Size: ${cartItem.size_name}`);
                    if (cartItem.color_name) parts.push(`Color: ${cartItem.color_name}`);
                    variantText = parts.join(' | ');
                }
            } catch (e) {
                // Ignore errors
            }
        }
    }
    
    if (variantText) {
        let variantInfoContainer = document.createElement('div');
        variantInfoContainer.className = 'cart-item-variant';
        variantInfoContainer.style.cssText = 'margin: 8px 0; font-size: 13px; color: #666;';
        variantInfoContainer.textContent = variantText;
        detailsContainer.appendChild(variantInfoContainer);
    }

    // Quantity controls
    let quantityContainer = document.createElement('div');
    quantityContainer.className = 'quantity-controls';
    
    let quantityLabel = document.createElement('span');
    quantityLabel.className = 'quantity-label';
    quantityLabel.textContent = 'Quantity:';
    
    let decreaseBtn = document.createElement('button');
    decreaseBtn.className = 'quantity-btn decrease-btn';
    decreaseBtn.innerHTML = '<i class="fas fa-minus"></i>';
    if (itemCounter <= 1) {
        decreaseBtn.disabled = true;
    }
    const roundedPrice = Math.round(Number(ob.final_price || ob.price || 0));
    
    decreaseBtn.onclick = function() {
        updateQuantity(itemId, -1, quantityDisplay, boxh4, roundedPrice, decreaseBtn);
    };
    
    let quantityDisplay = document.createElement('span');
    quantityDisplay.className = 'quantity-value';
    quantityDisplay.textContent = itemCounter;
    quantityDisplay.setAttribute('data-item-id', itemId);
    
    let increaseBtn = document.createElement('button');
    increaseBtn.className = 'quantity-btn increase-btn';
    increaseBtn.innerHTML = '<i class="fas fa-plus"></i>';
    increaseBtn.onclick = function() {
        updateQuantity(itemId, 1, quantityDisplay, boxh4, roundedPrice);
    };
    
    quantityContainer.appendChild(quantityLabel);
    quantityContainer.appendChild(decreaseBtn);
    quantityContainer.appendChild(quantityDisplay);
    quantityContainer.appendChild(increaseBtn);
    detailsContainer.appendChild(quantityContainer);

    let boxh4 = document.createElement('h4');
    let h4Text = document.createTextNode('Amount: Rs ' + (roundedPrice * itemCounter));
    boxh4.appendChild(h4Text);
    detailsContainer.appendChild(boxh4);
    
    boxDiv.appendChild(detailsContainer);

    // Delete button
    let deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    deleteBtn.title = 'Remove from cart';
    deleteBtn.onclick = function() {
        removeFromCart(itemId, deleteBtn);
    };
    boxDiv.appendChild(deleteBtn);

    return boxDiv;
}

// Create total container
let totalContainerDiv = document.createElement('div');
totalContainerDiv.id = 'totalContainer';

let totalDiv = document.createElement('div');
totalDiv.id = 'total';
totalContainerDiv.appendChild(totalDiv);

let totalh2 = document.createElement('h2');
let h2Text = document.createTextNode('Total Amount');
totalh2.appendChild(h2Text);
totalDiv.appendChild(totalh2);

// TO UPDATE THE TOTAL AMOUNT
function amountUpdate(amount) {
    // Clear all existing content except the h2 title
    const title = totalDiv.querySelector('h2');
    totalDiv.innerHTML = '';
    if (title) {
        totalDiv.appendChild(title);
    }
    
    // Delivery charges
    const deliveryCharges = 200;
    const subtotal = Math.round(amount);
    const finalTotal = Math.round(subtotal + deliveryCharges);
    
    // Subtotal
    let subtotalDiv = document.createElement('div');
    subtotalDiv.className = 'total-row';
    subtotalDiv.innerHTML = '<span>Subtotal:</span><span>Rs ' + subtotal + '</span>';
    totalDiv.appendChild(subtotalDiv);
    
    // Delivery charges
    let deliveryDiv = document.createElement('div');
    deliveryDiv.className = 'total-row';
    deliveryDiv.innerHTML = '<span>Delivery Charges:</span><span>Rs ' + deliveryCharges + '</span>';
    totalDiv.appendChild(deliveryDiv);
    
    // Delivery info
    let deliveryInfoDiv = document.createElement('div');
    deliveryInfoDiv.className = 'delivery-info-cart';
    deliveryInfoDiv.innerHTML = '<i class="fas fa-truck"></i> <span>Estimated Delivery: 3 to 5 business days</span>';
    totalDiv.appendChild(deliveryInfoDiv);
    
    // Total amount
    let totalh4 = document.createElement('h4');
    totalh4.id = 'toth4';
    totalh4.className = 'final-total';
    totalh4.innerHTML = '<span>Total Amount:</span><span>Rs ' + finalTotal + '</span>';
    totalDiv.appendChild(totalh4);
    
    // Add button if not already added
    if (!totalDiv.querySelector('#button')) {
        totalDiv.appendChild(buttonDiv);
    }
    
    // Create/Update fixed Buy Now button with final total
    createBuyNowButton(finalTotal);
    
    // Update Buy Now button below cart items
    createBuyNowButtonBelow(finalTotal);
}

// Remove fixed Buy Now button
function removeBuyNowButton() {
    const existingBtn = document.getElementById('fixedBuyButton');
    if (existingBtn) {
        existingBtn.remove();
    }
}

let buttonDiv = document.createElement('div');
buttonDiv.id = 'button';

let buttonTag = document.createElement('button');
buttonTag.id = 'placeOrderBtn';

let buttonLink = document.createElement('a');
buttonLink.href = 'checkout.html';
buttonLink.innerHTML = '<i class="fas fa-shopping-cart"></i> Checkout';
buttonLink.className = 'checkout-link';
buttonTag.appendChild(buttonLink);

buttonTag.onclick = function(e) {
    window.location.href = 'checkout.html';
}

// Create fixed Buy Now button (Shopify style)
function createBuyNowButton(totalAmount) {
    // Remove existing buy button if any
    const existingBtn = document.getElementById('fixedBuyButton');
    if (existingBtn) {
        existingBtn.remove();
    }
    
    const buyButtonContainer = document.createElement('div');
    buyButtonContainer.id = 'fixedBuyButton';
    buyButtonContainer.className = 'fixed-buy-button';
    
    const buyButton = document.createElement('button');
    buyButton.className = 'btn-buy-now-fixed';
    buyButton.innerHTML = `
        <span class="buy-button-text">
            <i class="fas fa-shopping-bag"></i>
            Buy Now
        </span>
        <span class="buy-button-amount">Rs ${totalAmount}</span>
    `;
    
    buyButton.onclick = function() {
        window.location.href = 'checkout.html';
    };
    
    buyButtonContainer.appendChild(buyButton);
    document.body.appendChild(buyButtonContainer);
}

// Create Buy Now button below cart items
function createBuyNowButtonBelow(totalAmount) {
    const buttonContainer = document.getElementById('buyNowButtonContainer');
    if (!buttonContainer) return;
    
    // Clear existing button
    buttonContainer.innerHTML = '';
    buttonContainer.style.display = 'none';
    
    // Only show if there are items
    if (totalAmount > 0) {
        const buyButton = document.createElement('button');
        buyButton.className = 'btn-buy-now-below';
        buyButton.innerHTML = `
            <span class="buy-button-text-below">
                <i class="fas fa-shopping-bag"></i>
                <span>Buy Now</span>
            </span>
            <span class="buy-button-amount-below">Rs ${totalAmount}</span>
        `;
        
        buyButton.onclick = function() {
            window.location.href = 'checkout.html';
        };
        
        buttonContainer.appendChild(buyButton);
        buttonContainer.style.display = 'block';
    }
}

// Remove Buy Now button below cart items
function removeBuyNowButtonBelow() {
    const buttonContainer = document.getElementById('buyNowButtonContainer');
    if (buttonContainer) {
        buttonContainer.innerHTML = '';
        buttonContainer.style.display = 'none';
    }
}

// BACKEND CALL
// Supabase Configuration
const SUPABASE_BASE_URL = "https://grksptxhbdlbdrlabaew.supabase.co/rest/v1";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdya3NwdHhoYmRsYmRybGFiYWV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyOTI2MDgsImV4cCI6MjA4Mjg2ODYwOH0.TpiilrTDb4ZNbETvl0h4E_LFHZGpcx91_6Nx_dDPbew";

let httpRequest = new XMLHttpRequest();
let totalAmount = 0;

// Store cart items from database
let dbCartItems = [];
let cartItemIdMap = {}; // Maps product_id to cart item id for database operations

// Load cart items INSTANTLY from localStorage (synchronous, no waiting)
function loadCartItemsFromCache() {
    try {
        // Check localStorage FIRST - instant, no async
        if (window.userCart && typeof window.userCart.getCachedCart === 'function') {
            const cached = window.userCart.getCachedCart();
            if (cached !== null && cached.length > 0) {
                return cached;
            }
        }
        
        // Also check state manager if userCart cache is empty (for optimistic updates)
        if (window.stateManager) {
            const state = window.stateManager.getState();
            if (state.cart && state.cart.length > 0) {
                return state.cart;
            }
        }
        
        // No cache - check cookies (for guest users)
        if(document.cookie && document.cookie.indexOf(',counter=') >= 0) {
            return 'cookie'; // Signal to use cookies
        }
        
        return null;
    } catch (error) {
        return null;
    }
}

// Load cart items from database - REMOVED (NO DATABASE - using localStorage only)
// This function is kept for compatibility but returns null (no database calls)
async function loadCartItemsFromDatabase() {
    // NO DATABASE CALLS - Only localStorage/cookies
    return null;
}

// Process and display cart items
function processCartItems(allProducts, cartItems) {
    try {
        // Clear boxContainerDiv before adding items
        boxContainerDiv.innerHTML = '';
        
        let totalCounter = 0;
        totalAmount = 0;
        
        if (cartItems && cartItems.length > 0) {
            // Process database cart items
            cartItemIdMap = {};
            cartItems.forEach(cartItem => {
                const productId = cartItem.product_id;
                const quantity = cartItem.quantity || 1;
                const cartItemId = cartItem.id;
                
                cartItemIdMap[productId] = cartItemId;
                
                const product = allProducts.find(p => p.id === productId);
                if (product) {
                    const price = Math.round(Number(product.final_price || product.price || 0));
                    totalAmount += price * quantity;
                    totalCounter += quantity;
                    // Pass cartItem to dynamicCartSection so it can display variant info
                    dynamicCartSection(product, quantity, productId, cartItemId, cartItem);
                }
            });
        } else {
            // Fallback to cookies (for non-logged-in users)
            if(!document.cookie || document.cookie.indexOf(',counter=') < 0) {
                showEmptyCart();
                removeBuyNowButton();
                const totalItem = document.getElementById("totalItem");
                if (totalItem) totalItem.innerHTML = 'Total Items: 0';
                return;
            }
            
            let counter = Number(document.cookie.split(',')[1].split('=')[1]);
            const totalItem = document.getElementById("totalItem");
            if (totalItem) totalItem.innerHTML = 'Total Items: ' + counter;
            
            if (counter === 0) {
                showEmptyCart();
                removeBuyNowButton();
                return;
            }

            let item = document.cookie.split(',')[0].split('=')[1].split(" ").filter(id => id.trim() !== '');

            if (!item || item.length === 0) {
                showEmptyCart();
                return;
            }
            
            // Process cookie cart items
            let processedItems = [];
            
            for(let i = 0; i < item.length; i++) {
                if (!item[i] || item[i].trim() === '') continue;
                
                let itemId = Number(item[i]);
                if (isNaN(itemId) || itemId < 1) {
                    continue;
                }
                
                let itemCounter = 1;
                for(let j = i + 1; j < item.length; j++) {
                    if(Number(item[j]) === itemId) {
                        itemCounter += 1;
                    }
                }
                
                // Check if already processed
                if (processedItems.indexOf(itemId) === -1) {
                    processedItems.push(itemId);
                    const product = allProducts.find(p => p.id === itemId);
                    if (product) {
                        const price = Math.round(Number(product.final_price || product.price || 0));
                        totalAmount += price * itemCounter;
                        totalCounter += itemCounter;
                        dynamicCartSection(product, itemCounter, itemId);
                    }
                }
            }
        }
        
        // Update total items display
        const totalItem = document.getElementById("totalItem");
        if (totalItem) totalItem.innerHTML = 'Total Items: ' + totalCounter;
        
        // Append containers to cart with proper structure
        if (cartContainer) {
            // Clear container first to ensure clean structure
            cartContainer.innerHTML = '';
            
            // Append boxContainer (left column - cart items)
            if (boxContainerDiv.children.length > 0) {
                cartContainer.appendChild(boxContainerDiv);
            } else {
                showEmptyCart();
                removeBuyNowButton();
                return;
            }
            
            // Append totalContainer (right column - order summary)
            cartContainer.appendChild(totalContainerDiv);
            amountUpdate(totalAmount);
        } else {
            showEmptyCart();
            removeBuyNowButton();
            removeBuyNowButtonBelow();
        }
    } catch (error) {
        showError("Error loading cart. Please try again.");
    }
}

// Initialize cart loading - INSTANT display from cache, then refresh in background
function initCart() {
    // STEP 1: Load from localStorage/cookies INSTANTLY (synchronous, no waiting)
    const cachedCartItems = loadCartItemsFromCache();
    
    // Only show loader if no cache exists
    if (!cachedCartItems || (cachedCartItems !== 'cookie' && cachedCartItems.length === 0)) {
        showLoader();
    }
    
    // STEP 2: Fetch products and display cart IMMEDIATELY
    httpRequest.onreadystatechange = async function() {
        if(this.readyState === 4) {
            hideLoader();
            
            if(this.status == 200) {
                try {
                    let allProducts = JSON.parse(this.responseText);
                    
                    // Display cart IMMEDIATELY from cache/cookies
                    if (cachedCartItems === 'cookie') {
                        // Use cookie-based cart
                        processCartItems(allProducts, null);
                    } else if (cachedCartItems && cachedCartItems.length > 0) {
                        // Use cached database cart
                        dbCartItems = cachedCartItems;
                        processCartItems(allProducts, cachedCartItems);
                    } else {
                        // No cache - show empty cart (don't call API on page load)
                        processCartItems(allProducts, null);
                    }
                    
                    // STEP 3: DO NOT call API on page load - API will only be called when user makes changes
                    // (increment/decrement quantity, add to cart, remove from cart)
                    // This prevents unnecessary API calls on cart page load
                } catch (error) {
                    showError("Error loading cart. Please try again.");
                }
            } else {
                showError("Failed to load cart. Please check your connection and try again.");
            }
        }
    };

    httpRequest.onerror = function() {
        hideLoader();
        showError("Network error. Please check your connection and try again.");
    };

    const SUPABASE_URL = `${SUPABASE_BASE_URL}/products?select=*`;
    httpRequest.open('GET', SUPABASE_URL, true);
    httpRequest.setRequestHeader('apikey', SUPABASE_ANON_KEY);
    httpRequest.setRequestHeader('Authorization', 'Bearer ' + SUPABASE_ANON_KEY);
    httpRequest.send();
}

// Wait for userCart.js to load before initializing cart
function waitForUserCartAndInit() {
    if (window.userCart) {
        // userCart is loaded - initialize cart
        initCart();
    } else {
        // Wait a bit and try again
        setTimeout(waitForUserCartAndInit, 100);
    }
}

// Start cart initialization - wait for userCart.js if needed
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForUserCartAndInit);
} else {
    waitForUserCartAndInit();
}




