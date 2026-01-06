// User Cart Management
// Handles saving, loading, and managing user cart items with localStorage caching

// Supabase Configuration
if (typeof window.SUPABASE_BASE_URL === 'undefined') {
    window.SUPABASE_BASE_URL = "https://grksptxhbdlbdrlabaew.supabase.co/rest/v1";
}
if (typeof window.SUPABASE_ANON_KEY === 'undefined') {
    window.SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdya3NwdHhoYmRsYmRybGFiYWV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyOTI2MDgsImV4cCI6MjA4Mjg2ODYwOH0.TpiilrTDb4ZNbETvl0h4E_LFHZGpcx91_6Nx_dDPbew";
}

// Get user's access token from session
async function getUserAccessToken() {
    try {
        if (!window.auth || typeof window.auth.getSession !== 'function') {
            return null;
        }
        const { session } = await window.auth.getSession();
        return session?.access_token || null;
    } catch (error) {
        return null;
    }
}

// Cache configuration for instant checkout display
const CART_CACHE_KEY = 'userCart';
const CART_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Get cached cart from localStorage (INSTANT - synchronous, no async)
function getCachedCart() {
    try {
        const cached = localStorage.getItem(CART_CACHE_KEY);
        if (!cached) return null;
        
        const data = JSON.parse(cached);
        const now = Date.now();
        
        // Check if cache is still valid (within 5 minutes)
        if (data.timestamp && (now - data.timestamp) < CART_CACHE_DURATION) {
            return data.items || [];
        }
        
        // Cache expired, remove it
        localStorage.removeItem(CART_CACHE_KEY);
        return null;
    } catch (error) {
        return null;
    }
}

// Cache cart items to localStorage (for instant checkout display)
function cacheCartItems(items) {
    try {
        const cacheData = {
            items: items || [],
            timestamp: Date.now()
        };
        localStorage.setItem(CART_CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
        // Ignore localStorage errors
    }
}

// Alias for cacheCartItems (for compatibility)
function cacheCart(items) {
    cacheCartItems(items);
}

// Clear cart cache
function clearCartCache() {
    try {
        localStorage.removeItem(CART_CACHE_KEY);
    } catch (error) {
        // Ignore localStorage errors
    }
}

// Get user cart items from database
async function getUserCart() {
    try {
        const { user } = await window.auth.getCurrentUser();
        if (!user) {
            return [];
        }

        // Fetch from API (no cache)
        const accessToken = await getUserAccessToken();
        if (!accessToken) {
            return [];
        }

        const url = `${window.SUPABASE_BASE_URL}/user_cart?user_id=eq.${user.id}&order=updated_at.desc`;
        
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.setRequestHeader('apikey', window.SUPABASE_ANON_KEY);
            xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Prefer', 'return=representation');
            
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        try {
                            const items = JSON.parse(xhr.responseText);
                            // INSTANT: Save to localStorage for instant checkout display
                            cacheCartItems(items);
                            // DON'T call updateBadgeCounter() here - it causes infinite loop
                            // Badge will be updated by the caller if needed
                            resolve(items);
                        } catch (e) {
                            resolve([]);
                        }
                    } else {
                        resolve([]);
                    }
                }
            };
            
            xhr.onerror = () => {
                resolve([]);
            };
            xhr.send();
        });
    } catch (error) {
        return [];
    }
}

// Refresh cart in background (for cache updates)
async function refreshUserCartInBackground(userId) {
    try {
        const accessToken = await getUserAccessToken();
        if (!accessToken) return;

        const url = `${window.SUPABASE_BASE_URL}/user_cart?user_id=eq.${userId}&order=updated_at.desc`;
        
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.setRequestHeader('apikey', window.SUPABASE_ANON_KEY);
        xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
        xhr.setRequestHeader('Content-Type', 'application/json');
        
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                try {
                    const items = JSON.parse(xhr.responseText);
                    // Cache disabled - do nothing
                } catch (e) {
                    // Ignore errors
                }
            }
        };
        
        xhr.onerror = () => {};
        xhr.send();
    } catch (error) {
        // Ignore errors
    }
}

// Sync cart with server (for background sync)
async function syncCart(cartItems) {
    try {
        const { user } = await window.auth.getCurrentUser();
        if (!user) {
            return { error: { message: 'User not logged in' } };
        }

        const accessToken = await getUserAccessToken();
        if (!accessToken) {
            return { error: { message: 'Session expired' } };
        }

        // Get current cart from server
        const currentCart = await getUserCart();
        
        // Sync each item
        for (const item of cartItems) {
            const existingItem = currentCart.find(ci => ci.product_id === item.product_id);
            
            if (existingItem) {
                // Update quantity if different
                if (existingItem.quantity !== item.quantity) {
                    await updateCartItemQuantity(existingItem.id, item.quantity);
                }
            } else {
                // New item - add to cart
                await addToUserCart(item.product_id, item.quantity);
            }
        }
        
        // Remove items that are no longer in local cart
        for (const serverItem of currentCart) {
            const localItem = cartItems.find(li => li.product_id === serverItem.product_id);
            if (!localItem) {
                await removeFromUserCart(serverItem.id);
            }
        }

        return { success: true };
    } catch (error) {
        return { error: { message: error.message } };
    }
}

// Add item to cart (or update quantity if exists)
async function addToUserCart(productId, quantity = 1) {
    try {
        const { user } = await window.auth.getCurrentUser();
        if (!user) {
            return { error: { message: 'User not logged in' } };
        }

        const accessToken = await getUserAccessToken();
        if (!accessToken) {
            return { error: { message: 'Session expired. Please log in again.' } };
        }

        // Check if item already exists in cart
        const existingItems = await getUserCart();
        const existingItem = existingItems.find(item => item.product_id === productId);

        if (existingItem) {
            // Update quantity
            const newQuantity = existingItem.quantity + quantity;
            return await updateCartItemQuantity(existingItem.id, newQuantity);
        } else {
            // Insert new item
            const cartPayload = {
                user_id: user.id,
                product_id: productId,
                quantity: quantity
            };

            const url = `${window.SUPABASE_BASE_URL}/user_cart`;
            
            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('POST', url, true);
                xhr.setRequestHeader('apikey', window.SUPABASE_ANON_KEY);
                xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Prefer', 'return=representation');
                
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 201 || xhr.status === 200) {
                            try {
                                const result = JSON.parse(xhr.responseText);
                                resolve({ data: Array.isArray(result) ? result[0] : result, error: null });
                            } catch (e) {
                                resolve({ data: null, error: { message: 'Failed to parse response' } });
                            }
                        } else {
                            try {
                                const error = JSON.parse(xhr.responseText);
                                resolve({ data: null, error: error });
                            } catch (e) {
                                resolve({ data: null, error: { message: 'Failed to add item to cart' } });
                            }
                        }
                    }
                };
                
                xhr.onerror = () => resolve({ data: null, error: { message: 'Network error' } });
                xhr.send(JSON.stringify(cartPayload));
            });
        }
    } catch (error) {
        return { data: null, error: { message: error.message || 'Failed to add item to cart' } };
    }
}

// Update cart item quantity
async function updateCartItemQuantity(cartItemId, quantity) {
    try {
        if (quantity <= 0) {
            return await removeFromUserCart(cartItemId);
        }

        const { user } = await window.auth.getCurrentUser();
        if (!user) {
            return { error: { message: 'User not logged in' } };
        }

        const accessToken = await getUserAccessToken();
        if (!accessToken) {
            return { error: { message: 'Session expired. Please log in again.' } };
        }

        const url = `${window.SUPABASE_BASE_URL}/user_cart?id=eq.${cartItemId}`;
        const payload = { quantity: quantity };
        
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('PATCH', url, true);
            xhr.setRequestHeader('apikey', window.SUPABASE_ANON_KEY);
            xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Prefer', 'return=representation');
            
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200 || xhr.status === 204) {
                        try {
                            const result = xhr.responseText ? JSON.parse(xhr.responseText) : null;
                            // Update badge everywhere
                            if (typeof updateBadgeCounter === 'function') {
                                updateBadgeCounter();
                            }
                            resolve({ data: Array.isArray(result) ? result[0] : result, error: null });
                        } catch (e) {
                            resolve({ data: null, error: null }); // Success even if no response
                        }
                    } else {
                        try {
                            const error = JSON.parse(xhr.responseText);
                            resolve({ data: null, error: error });
                        } catch (e) {
                            resolve({ data: null, error: { message: 'Failed to update cart item' } });
                        }
                    }
                }
            };
            
            xhr.onerror = () => resolve({ data: null, error: { message: 'Network error' } });
            xhr.send(JSON.stringify(payload));
        });
    } catch (error) {
        return { data: null, error: { message: error.message || 'Failed to update cart item' } };
    }
}

// Remove item from cart
async function removeFromUserCart(cartItemId) {
    try {
        const { user } = await window.auth.getCurrentUser();
        if (!user) {
            return { error: { message: 'User not logged in' } };
        }

        const accessToken = await getUserAccessToken();
        if (!accessToken) {
            return { error: { message: 'Session expired. Please log in again.' } };
        }

        const url = `${window.SUPABASE_BASE_URL}/user_cart?id=eq.${cartItemId}`;
        
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('DELETE', url, true);
            xhr.setRequestHeader('apikey', window.SUPABASE_ANON_KEY);
            xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Prefer', 'return=representation');
            
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200 || xhr.status === 204) {
                        // Update badge everywhere
                        if (typeof updateBadgeCounter === 'function') {
                            updateBadgeCounter();
                        }
                        resolve({ error: null });
                    } else {
                        try {
                            const error = JSON.parse(xhr.responseText);
                            resolve({ error: error });
                        } catch (e) {
                            resolve({ error: { message: 'Failed to remove item from cart' } });
                        }
                    }
                }
            };
            
            xhr.onerror = () => resolve({ error: { message: 'Network error' } });
            xhr.send();
        });
    } catch (error) {
        return { error: { message: error.message || 'Failed to remove item from cart' } };
    }
}

// Clear entire cart
async function clearUserCart() {
    try {
        const { user } = await window.auth.getCurrentUser();
        if (!user) {
            return { error: { message: 'User not logged in' } };
        }

        const accessToken = await getUserAccessToken();
        if (!accessToken) {
            return { error: { message: 'Session expired. Please log in again.' } };
        }

        const url = `${window.SUPABASE_BASE_URL}/user_cart?user_id=eq.${user.id}`;
        
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('DELETE', url, true);
            xhr.setRequestHeader('apikey', window.SUPABASE_ANON_KEY);
            xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
            xhr.setRequestHeader('Content-Type', 'application/json');
            
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200 || xhr.status === 204) {
                        // Update badge everywhere
                        if (typeof updateBadgeCounter === 'function') {
                            updateBadgeCounter();
                        }
                        resolve({ error: null });
                    } else {
                        try {
                            const error = JSON.parse(xhr.responseText);
                            resolve({ error: error });
                        } catch (e) {
                            resolve({ error: { message: 'Failed to clear cart' } });
                        }
                    }
                }
            };
            
            xhr.onerror = () => resolve({ error: { message: 'Network error' } });
            xhr.send();
        });
    } catch (error) {
        return { error: { message: error.message || 'Failed to clear cart' } };
    }
}

// Sync cookie cart to database (when user logs in)
async function syncCookieCartToDatabase() {
    try {
        // Get cart from cookies
        if(!document.cookie || document.cookie.indexOf(',counter=') < 0) {
            return { synced: false, message: 'No cart in cookies' };
        }

        let items = document.cookie.split(',')[0].split('=')[1].split(" ").filter(id => id.trim() !== '');
        if (!items || items.length === 0) {
            return { synced: false, message: 'Cart is empty' };
        }

        // Count items
        let itemCount = {};
        items.forEach(id => {
            if (id && id.trim() !== '') {
                const productId = parseInt(id);
                if (!isNaN(productId)) {
                    itemCount[productId] = (itemCount[productId] || 0) + 1;
                }
            }
        });

        // Add each item to database cart
        const results = [];
        for (const [productId, quantity] of Object.entries(itemCount)) {
            const result = await addToUserCart(parseInt(productId), quantity);
            results.push(result);
        }

        // Clear cookie cart after successful sync
        document.cookie = "orderId= ,counter=0";
        
        return { synced: true, results: results };
    } catch (error) {
        return { synced: false, error: error.message };
    }
}

// Export functions to window for global access
window.userCart = {
    getUserCart,
    addToUserCart,
    updateCartItemQuantity,
    removeFromUserCart,
    clearUserCart,
    syncCookieCartToDatabase,
    syncCart, // Sync entire cart for optimistic UI
    clearCartCache,
    getCachedCart, // Synchronous function for instant access
    cacheCart: cacheCart, // Export cacheCart function (alias for cacheCartItems)
    cacheCartItems: cacheCartItems // Also export cacheCartItems directly
};

