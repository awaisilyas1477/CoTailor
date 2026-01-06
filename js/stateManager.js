// ============================================================================
// STATE MANAGER - Centralized state management with optimistic updates
// ============================================================================

class StateManager {
    constructor() {
        this.state = {
            cart: [],
            addresses: [],
            user: null,
            products: [],
            isLoading: false,
            lastSync: null
        };
        
        this.listeners = new Map();
        this.pendingUpdates = new Map();
        this.undoStack = [];
        
        // localStorage disabled - state only exists in memory
        // No hydration from localStorage
        // No auto-save to localStorage
    }
    
    // Hydrate state from localStorage (DISABLED - no-op)
    hydrateFromStorage() {
        // localStorage disabled - do nothing
        return;
    }
    
    // Auto-save state to localStorage (DISABLED - no-op)
    setupAutoSave() {
        // localStorage disabled - do nothing
        // Don't override setState
        return;
    }
    
    // Save state to localStorage (DISABLED - no-op)
    saveToStorage() {
        // localStorage disabled - do nothing
        return;
    }
    
    // Get current state
    getState() {
        return { ...this.state };
    }
    
    // Subscribe to state changes
    subscribe(key, callback) {
        if (!this.listeners.has(key)) {
            this.listeners.set(key, []);
        }
        this.listeners.get(key).push(callback);
        
        // Return unsubscribe function
        return () => {
            const callbacks = this.listeners.get(key);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        };
    }
    
    // Notify listeners of state changes
    notify(key, data) {
        if (this.listeners.has(key)) {
            this.listeners.get(key).forEach(callback => {
                try {
                    callback(data, this.getState());
                } catch (error) {
                    // Ignore callback errors
                }
            });
        }
    }
    
    // Update state optimistically
    setState(updates, optimistic = false) {
        // Save previous state for rollback
        if (optimistic) {
            this.undoStack.push({ ...this.state });
            if (this.undoStack.length > 10) {
                this.undoStack.shift(); // Keep only last 10 states
            }
        }
        
        // Apply updates
        this.state = { ...this.state, ...updates };
        
        // Notify all listeners
        Object.keys(updates).forEach(key => {
            this.notify(key, updates[key]);
        });
    }
    
    // Rollback to previous state
    rollback() {
        if (this.undoStack.length > 0) {
            const previousState = this.undoStack.pop();
            this.state = { ...previousState };
            
            // Notify listeners of rollback
            Object.keys(previousState).forEach(key => {
                this.notify(key, this.state[key]);
            });
            
            return true;
        }
        return false;
    }
    
    // Cart operations
    addToCart(productId, quantity = 1) {
        const existingItem = this.state.cart.find(item => item.product_id === productId);
        
        if (existingItem) {
            // Update quantity optimistically
            this.setState({
                cart: this.state.cart.map(item =>
                    item.product_id === productId
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                )
            }, true);
        } else {
            // Add new item optimistically
            this.setState({
                cart: [...this.state.cart, {
                    product_id: productId,
                    quantity: quantity,
                    id: `temp-${Date.now()}` // Temporary ID
                }]
            }, true);
        }
        
        this.notify('cart', this.state.cart);
    }
    
    updateCartQuantity(productId, quantity) {
        if (quantity <= 0) {
            this.removeFromCart(productId);
            return;
        }
        
        this.setState({
            cart: this.state.cart.map(item =>
                item.product_id === productId
                    ? { ...item, quantity }
                    : item
            )
        }, true);
        
        this.notify('cart', this.state.cart);
    }
    
    removeFromCart(productId) {
        this.setState({
            cart: this.state.cart.filter(item => item.product_id !== productId)
        }, true);
        
        this.notify('cart', this.state.cart);
    }
    
    // Calculate cart totals (instant, no API call)
    calculateCartTotals(products) {
        let subtotal = 0;
        let totalItems = 0;
        
        this.state.cart.forEach(cartItem => {
            const product = products.find(p => p.id === cartItem.product_id);
            if (product) {
                const price = product.final_price || product.price || 0;
                subtotal += price * cartItem.quantity;
                totalItems += cartItem.quantity;
            }
        });
        
        const deliveryCharges = 200;
        const total = subtotal + deliveryCharges;
        
        return {
            subtotal: Math.round(subtotal),
            deliveryCharges,
            total: Math.round(total),
            totalItems
        };
    }
    
    // Address operations
    addAddress(address) {
        this.setState({
            addresses: [...this.state.addresses, address]
        }, true);
        
        this.notify('addresses', this.state.addresses);
    }
    
    updateAddress(addressId, updates) {
        this.setState({
            addresses: this.state.addresses.map(addr =>
                addr.id === addressId ? { ...addr, ...updates } : addr
            )
        }, true);
        
        this.notify('addresses', this.state.addresses);
    }
    
    removeAddress(addressId) {
        this.setState({
            addresses: this.state.addresses.filter(addr => addr.id !== addressId)
        }, true);
        
        this.notify('addresses', this.state.addresses);
    }
    
    // Sync state with server (background)
    async syncWithServer() {
        this.setState({ isLoading: true });
        
        try {
            // Sync cart
            if (window.userCart && this.state.cart.length > 0) {
                await window.userCart.syncCart(this.state.cart);
            }
            
            // Sync addresses
            if (window.savedAddresses && this.state.addresses.length > 0) {
                // Addresses are already synced individually
            }
            
            this.setState({
                lastSync: Date.now(),
                isLoading: false
            });
        } catch (error) {
            this.setState({ isLoading: false });
            throw error;
        }
    }
}

// Create global state manager instance
window.stateManager = new StateManager();

