// ============================================================================
// OPTIMISTIC CART - Instant cart operations with background sync
// ============================================================================

// Optimistic add to cart - INSTANT updates using localStorage for both logged-in and guest users
async function optimisticAddToCart(productId, quantity = 1, variantInfo = null) {
    // ============================================
    // BOTH LOGGED-IN AND GUEST: Use localStorage/cookies (NO DATABASE)
    // ============================================
    
    // STEP 1: Update state manager (if available)
    if (window.stateManager) {
        // Hydrate state manager from localStorage cache if empty
        try {
            const state = window.stateManager.getState();
            if (!state.cart || state.cart.length === 0) {
                // Use localStorage cache
                if (window.userCart && typeof window.userCart.getCachedCart === 'function') {
                    const cachedCart = window.userCart.getCachedCart();
                    if (cachedCart && cachedCart.length > 0) {
                        window.stateManager.setState({
                            cart: cachedCart,
                            lastSync: Date.now()
                        }, false);
                    }
                }
            }
        } catch (error) {
            // Ignore errors, will proceed with optimistic update
        }
        
        // INSTANT: Update state manager (optimistic UI)
        // Check if item with same productId and variant already exists
        const state = window.stateManager.getState();
        const existingCart = state.cart || [];
        
        // Create a unique key for variant matching
        const variantKey = variantInfo ? 
            `${productId}-${variantInfo.size_id || 'no-size'}-${variantInfo.color_id || 'no-color'}` : 
            `${productId}-no-variant`;
        
        // Check if exact variant already exists in cart
        const existingItemIndex = existingCart.findIndex(item => {
            const itemVariantKey = item.variant_id || item.size_id || item.color_id ?
                `${item.product_id}-${item.size_id || 'no-size'}-${item.color_id || 'no-color'}` :
                `${item.product_id}-no-variant`;
            return itemVariantKey === variantKey;
        });
        
        if (existingItemIndex >= 0) {
            // Update quantity of existing variant
            existingCart[existingItemIndex].quantity = (existingCart[existingItemIndex].quantity || 1) + quantity;
            window.stateManager.setState({
                cart: existingCart,
                lastSync: Date.now()
            }, false);
        } else {
            // Add new item with variant info
            const newItem = {
                product_id: productId,
                quantity: quantity,
                id: `temp-${Date.now()}-${Math.random()}`,
                ...(variantInfo && {
                    variant_id: variantInfo.variant_id || null,
                    size_id: variantInfo.size_id || null,
                    color_id: variantInfo.color_id || null,
                    size_name: variantInfo.size_name || null,
                    color_name: variantInfo.color_name || null
                })
            };
            existingCart.push(newItem);
            window.stateManager.setState({
                cart: existingCart,
                lastSync: Date.now()
            }, false);
        }
        
        const updatedState = window.stateManager.getState();
        
        // INSTANT: Save to localStorage for instant checkout display
        if (window.userCart && typeof window.userCart.cacheCart === 'function') {
            window.userCart.cacheCart(updatedState.cart);
        }
        
        // INSTANT: Update badge immediately
        const badge = document.getElementById("badge");
        if (badge) {
            try {
                let totalCount = 0;
                if (state.cart && state.cart.length > 0) {
                    state.cart.forEach(item => {
                        totalCount += (item.quantity || 1);
                    });
                }
                badge.classList.remove('skeleton-badge');
                badge.innerHTML = totalCount;
            } catch (error) {
                // Ignore errors
            }
        }
    }
    
        // STEP 2: Also update cookies for guest users (fallback if stateManager not available)
        if (!window.stateManager) {
            // INSTANT: Update cookies immediately
            try {
                let order = "";
                let counter = 0;
                
                // Get current cart state from cookies
                if (document.cookie && document.cookie.indexOf(",counter=") >= 0) {
                    order = document.cookie.split(",")[0].split("=")[1];
                    counter = Number(document.cookie.split(",")[1].split("=")[1]);
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
                
                // Update cookie instantly
                document.cookie = "orderId=" + order + ",counter=" + counter;
                
                // INSTANT: Update badge immediately
                const badge = document.getElementById("badge");
                if (badge) {
                    badge.classList.remove('skeleton-badge');
                    badge.innerHTML = counter;
                }
            } catch (error) {
                // Ignore cookie errors
            }
        }
    
    // STEP 5: Show success feedback (instant)
    if (typeof showAddToCartSuccess === 'function') {
        showAddToCartSuccess();
    }
}

// Optimistic update cart quantity - Use localStorage only (NO DATABASE)
async function optimisticUpdateCartQuantity(productId, quantity) {
    // IMPORTANT: Start with existing cache to preserve ALL items
    // This ensures we don't lose any cart items during quantity updates
    let existingCart = [];
    if (window.userCart && typeof window.userCart.getCachedCart === 'function') {
        const cached = window.userCart.getCachedCart();
        if (cached && cached.length > 0) {
            existingCart = cached;
        }
    }
    
    // If cache is empty, try state manager as fallback
    if (existingCart.length === 0 && window.stateManager) {
        const state = window.stateManager.getState();
        if (state.cart && state.cart.length > 0) {
            existingCart = state.cart;
        }
    }
    
    // Update the quantity for the specific product in the existing cart
    // This preserves ALL items and only updates the quantity of the changed item
    const updatedCart = existingCart.map(item => {
        if (item.product_id === productId) {
            return {
                ...item,
                quantity: quantity // Update quantity for this specific item
            };
        }
        return item; // Keep all other items unchanged
    });
    
    // If product not found in cart, add it (shouldn't happen, but safety check)
    const itemExists = updatedCart.some(item => item.product_id === productId);
    if (!itemExists && quantity > 0) {
        updatedCart.push({
            product_id: productId,
            quantity: quantity,
            id: `temp-${Date.now()}`
        });
    }
    
    // INSTANT: Update state manager with the updated cart
    if (window.stateManager) {
        window.stateManager.setState({
            cart: updatedCart,
            lastSync: Date.now()
        }, false);
    }
    
    // INSTANT: Save updated cart to localStorage (preserves ALL items)
    if (window.userCart && typeof window.userCart.cacheCart === 'function') {
        window.userCart.cacheCart(updatedCart);
    }
    
    // NO API CALLS - Only localStorage
}

// Optimistic remove from cart
async function optimisticRemoveFromCart(productId, cartItemId = null) {
    // INSTANT: Update UI optimistically
    if (window.stateManager) {
        window.stateManager.removeFromCart(productId);
        
        // Get updated state after removal
        const state = window.stateManager.getState();
        
        // IMPORTANT: Update userCart cache format for instant cart page display (remove deleted item from cache)
        if (window.userCart && typeof window.userCart.cacheCart === 'function' && state.cart) {
            // Update localStorage cache with the new cart state (without the deleted item)
            window.userCart.cacheCart(state.cart);
        }
    }
    
    // For guest users (not logged in), also update cookies immediately
    if (window.auth && typeof window.auth.getCurrentUser === 'function') {
        try {
            const { user } = await window.auth.getCurrentUser();
            if (!user) {
                // Guest user - update cookies
                if (document.cookie && document.cookie.indexOf(',counter=') >= 0) {
                    try {
                        let items = document.cookie.split(',')[0].split('=')[1].split(" ").filter(id => id.trim() !== '');
                        let counter = Number(document.cookie.split(',')[1].split('=')[1]);
                        
                        // Remove all instances of this product
                        items = items.filter(id => id !== String(productId));
                        
                        // Update counter
                        counter = items.length;
                        
                        // Update cookie
                        let order = items.join(" ") + " ";
                        document.cookie = "orderId=" + order + ",counter=" + counter;
                        
                        // Update badge immediately
                        const badge = document.getElementById("badge");
                        if (badge) badge.innerHTML = counter;
                    } catch (error) {
                        // Ignore cookie errors
                    }
                }
            }
        } catch (error) {
            // Ignore auth errors, will try cookie update anyway
            // Guest user - update cookies
            if (document.cookie && document.cookie.indexOf(',counter=') >= 0) {
                try {
                    let items = document.cookie.split(',')[0].split('=')[1].split(" ").filter(id => id.trim() !== '');
                    let counter = Number(document.cookie.split(',')[1].split('=')[1]);
                    
                    // Remove all instances of this product
                    items = items.filter(id => id !== String(productId));
                    
                    // Update counter
                    counter = items.length;
                    
                    // Update cookie
                    let order = items.join(" ") + " ";
                    document.cookie = "orderId=" + order + ",counter=" + counter;
                    
                    // Update badge immediately
                    const badge = document.getElementById("badge");
                    if (badge) badge.innerHTML = counter;
                } catch (error) {
                    // Ignore cookie errors
                }
            }
        }
    } else {
        // Auth not available - assume guest user, update cookies
        if (document.cookie && document.cookie.indexOf(',counter=') >= 0) {
            try {
                let items = document.cookie.split(',')[0].split('=')[1].split(" ").filter(id => id.trim() !== '');
                let counter = Number(document.cookie.split(',')[1].split('=')[1]);
                
                // Remove all instances of this product
                items = items.filter(id => id !== String(productId));
                
                // Update counter
                counter = items.length;
                
                // Update cookie
                let order = items.join(" ") + " ";
                document.cookie = "orderId=" + order + ",counter=" + counter;
                
                // Update badge immediately
                const badge = document.getElementById("badge");
                if (badge) badge.innerHTML = counter;
            } catch (error) {
                // Ignore cookie errors
            }
        }
    }
    
    // NO API CALLS - Only localStorage/cookies
}

// Load cart with instant hydration
async function loadCartOptimistically() {
    // STEP 1: Show skeleton
    if (window.uiLayer) {
        window.uiLayer.showSkeleton('cart');
        window.uiLayer.showSkeleton('orderSummary');
    }
    
    // STEP 2: Hydrate from localStorage (instant)
    if (window.stateManager) {
        const state = window.stateManager.getState();
        if (state.cart.length > 0) {
            // Hide skeleton and show cached cart instantly
            if (window.uiLayer) {
                window.uiLayer.updateCartUI(state.cart);
                window.uiLayer.updateCartTotals();
            }
        }
    }
    
    // NO DATABASE CALLS - Only use localStorage/cookies
    // Cart is already loaded from localStorage in STEP 2
}

// Export functions
window.optimisticCart = {
    addToCart: optimisticAddToCart,
    updateQuantity: optimisticUpdateCartQuantity,
    removeFromCart: optimisticRemoveFromCart,
    loadCart: loadCartOptimistically
};

