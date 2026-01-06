// ============================================================================
// UI LAYER - Instant UI updates with optimistic rendering
// ============================================================================

class UILayer {
    constructor() {
        this.skeletonLoaders = new Map();
        this.initialized = false;
    }
    
    // Initialize UI layer
    init() {
        if (this.initialized) return;
        
        // Subscribe to state changes
        this.setupStateSubscriptions();
        
        // Setup skeleton loaders
        this.setupSkeletonLoaders();
        
        // Initial render
        this.renderAll();
        
        this.initialized = true;
    }
    
    // Setup state subscriptions for instant UI updates
    setupStateSubscriptions() {
        if (!window.stateManager) return;
        
        // Subscribe to cart changes
        window.stateManager.subscribe('cart', (cart) => {
            this.updateCartUI(cart);
            this.updateCartBadge(cart);
            this.updateCartTotals();
        });
        
        // Subscribe to address changes
        window.stateManager.subscribe('addresses', (addresses) => {
            this.updateAddressesUI(addresses);
        });
    }
    
    // Setup skeleton loaders
    setupSkeletonLoaders() {
        // Cart skeleton
        this.skeletonLoaders.set('cart', {
            element: document.getElementById('cartSkeleton'),
            container: document.getElementById('cartContainer')
        });
        
        // Order summary skeleton
        this.skeletonLoaders.set('orderSummary', {
            element: document.getElementById('summarySkeleton'),
            container: document.getElementById('summaryContent')
        });
        
        // Addresses skeleton
        this.skeletonLoaders.set('addresses', {
            element: document.getElementById('addressesSkeleton'),
            container: document.getElementById('addressesContainer')
        });
    }
    
    // Show skeleton loader
    showSkeleton(key) {
        const loader = this.skeletonLoaders.get(key);
        if (loader && loader.element) {
            loader.element.style.display = 'block';
        }
    }
    
    // Hide skeleton loader
    hideSkeleton(key) {
        const loader = this.skeletonLoaders.get(key);
        if (loader && loader.element) {
            loader.element.style.display = 'none';
        }
    }
    
    // Update cart UI instantly
    updateCartUI(cart) {
        // Hide skeleton
        this.hideSkeleton('cart');
        
        // Update cart display
        if (typeof updateCartDisplay === 'function') {
            updateCartDisplay(cart);
        }
    }
    
    // Update cart badge instantly
    updateCartBadge(cart) {
        const badge = document.getElementById('badge');
        if (!badge) return;
        
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        badge.textContent = totalItems;
        badge.classList.remove('skeleton-badge');
    }
    
    // Update cart totals instantly
    updateCartTotals() {
        if (!window.stateManager) return;
        
        // Get products (should be cached)
        const products = window.stateManager.getState().products || [];
        
        // Calculate totals instantly
        const totals = window.stateManager.calculateCartTotals(products);
        
        // Update UI elements
        const totalItemHeader = document.getElementById('totalItem');
        if (totalItemHeader) {
            totalItemHeader.textContent = `Total Items: ${totals.totalItems}`;
        }
        
        const summaryContent = document.getElementById('summaryContent');
        if (summaryContent && !summaryContent.querySelector('.summary-skeleton')) {
            this.updateOrderSummary(totals);
        }
    }
    
    // Update order summary instantly
    updateOrderSummary(totals) {
        const summaryContent = document.getElementById('summaryContent');
        if (!summaryContent) return;
        
        // Hide skeleton
        this.hideSkeleton('orderSummary');
        
        // Build summary HTML
        const cart = window.stateManager.getState().cart;
        const products = window.stateManager.getState().products || [];
        
        let summaryHTML = '<div class="summary-items">';
        
        cart.forEach(cartItem => {
            const product = products.find(p => p.id === cartItem.product_id);
            if (product) {
                const itemTotal = (product.final_price || product.price || 0) * cartItem.quantity;
                summaryHTML += `
                    <div class="summary-item">
                        <span class="item-name">${product.name} × ${cartItem.quantity}</span>
                        <span class="item-price">Rs ${Math.round(itemTotal)}</span>
                    </div>
                `;
            }
        });
        
        summaryHTML += '</div>';
        summaryHTML += `
            <div class="summary-total">
                <div class="total-row">
                    <span>Total Items:</span>
                    <span>${totals.totalItems}</span>
                </div>
                <div class="total-row">
                    <span>Subtotal:</span>
                    <span>Rs ${totals.subtotal}</span>
                </div>
                <div class="total-row">
                    <span>Delivery Charges:</span>
                    <span>Rs ${totals.deliveryCharges}</span>
                </div>
                <div class="total-row final-total-row">
                    <span>Total Amount:</span>
                    <span class="total-amount">Rs ${totals.total}</span>
                </div>
            </div>
        `;
        
        summaryContent.innerHTML = summaryHTML;
    }
    
    // Update addresses UI instantly
    updateAddressesUI(addresses) {
        const addressesContainer = document.getElementById('addressesContainer');
        const savedAddressesSection = document.getElementById('savedAddressesSection');
        
        if (!addressesContainer) return;
        
        // Hide skeleton
        this.hideSkeleton('addresses');
        
        if (addresses.length === 0) {
            if (savedAddressesSection) {
                savedAddressesSection.style.display = 'none';
            }
            return;
        }
        
        // Show section
        if (savedAddressesSection) {
            savedAddressesSection.style.display = 'block';
        }
        
        addressesContainer.style.display = 'grid';
        addressesContainer.innerHTML = '';
        
        // Render address cards
        addresses.forEach(address => {
            if (typeof createAddressCard === 'function') {
                const card = createAddressCard(address);
                addressesContainer.appendChild(card);
            }
        });
    }
    
    // Render all UI components
    renderAll() {
        const state = window.stateManager.getState();
        
        // Render cart
        if (state.cart.length > 0) {
            this.updateCartUI(state.cart);
        } else {
            this.showSkeleton('cart');
        }
        
        // Render addresses
        if (state.addresses.length > 0) {
            this.updateAddressesUI(state.addresses);
        }
        
        // Render totals
        this.updateCartTotals();
    }
}

// Create global UI layer instance
window.uiLayer = new UILayer();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.uiLayer.init();
    });
} else {
    window.uiLayer.init();
}

