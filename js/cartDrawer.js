// Cart Drawer - Right to Left Slide (Shopify Style)
// Global functions to open/close cart drawer

// Make functions globally available immediately (before DOM ready)
window.openCartDrawer = function() {
  console.log('[Cart Drawer] openCartDrawer called');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartDrawerOverlay = document.getElementById('cartDrawerOverlay');
  const body = document.body;
  
  if (!cartDrawer) {
    console.error('[Cart Drawer] Drawer element not found! Make sure header.html is loaded.');
    return;
  }
  
  console.log('[Cart Drawer] Opening drawer...');
  cartDrawer.classList.add('active');
  if (cartDrawerOverlay) {
    cartDrawerOverlay.classList.add('active');
  }
  if (body) {
    body.style.overflow = 'hidden'; // Prevent body scroll
  }
  
  // Load cart items immediately
  if (typeof loadCartDrawerItems === 'function') {
    loadCartDrawerItems();
  } else {
    console.warn('[Cart Drawer] loadCartDrawerItems function not found');
  }
};

window.closeCartDrawer = function() {
  const cartDrawer = document.getElementById('cartDrawer');
  const cartDrawerOverlay = document.getElementById('cartDrawerOverlay');
  const body = document.body;
  
  if (cartDrawer) {
    cartDrawer.classList.remove('active');
    if (cartDrawerOverlay) {
      cartDrawerOverlay.classList.remove('active');
    }
    if (body) {
      body.style.overflow = ''; // Restore body scroll
    }
  }
};

// Initialize cart drawer
function initCartDrawer() {
  const cartDrawer = document.getElementById('cartDrawer');
  const cartDrawerOverlay = document.getElementById('cartDrawerOverlay');
  const cartDrawerClose = document.getElementById('cartDrawerClose');
  const cartIcon = document.querySelector('.cart-link');
  
  if (!cartDrawer) return;
  
  // Close drawer handlers
  if (cartDrawerClose) {
    cartDrawerClose.addEventListener('click', window.closeCartDrawer);
  }
  
  if (cartDrawerOverlay) {
    cartDrawerOverlay.addEventListener('click', window.closeCartDrawer);
  }
  
  // Open drawer when cart icon is clicked
  if (cartIcon) {
    cartIcon.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      window.openCartDrawer();
      return false;
    });
  }
  
  // Also handle clicks on cart icon badge
  const cartBadge = document.getElementById('badge');
  if (cartBadge && cartIcon) {
    cartBadge.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      window.openCartDrawer();
      return false;
    });
  }
  
  // Close on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && cartDrawer.classList.contains('active')) {
      window.closeCartDrawer();
    }
  });
  
  // Load cart items when drawer opens
  cartDrawer.addEventListener('transitionend', function() {
    if (cartDrawer.classList.contains('active')) {
      loadCartDrawerItems();
    }
  });
}

// Load cart items into drawer
function loadCartDrawerItems() {
  const cartItemsContainer = document.getElementById('cartDrawerItems');
  const cartDrawerEmpty = document.getElementById('cartDrawerEmpty');
  const cartDrawerTotal = document.getElementById('cartDrawerTotal');
  const cartDrawerSubtotal = document.getElementById('cartDrawerSubtotal');
  const cartDrawerDelivery = document.getElementById('cartDrawerDelivery');
  
  if (!cartItemsContainer) return;
  
  // Show loading state
  cartItemsContainer.innerHTML = '<div class="cart-drawer-loading"><div class="loader"></div><p>Loading cart...</p></div>';
  
  // Get cart items from state manager, localStorage, or cookies
  let cartItems = [];
  
  // Try state manager first
  if (window.stateManager && typeof window.stateManager.getCart === 'function') {
    const cart = window.stateManager.getCart();
    if (cart && cart.items && Array.isArray(cart.items)) {
      cartItems = cart.items;
    }
  }
  
  // Fallback to localStorage
  if (cartItems.length === 0) {
    try {
      const cachedCart = localStorage.getItem('userCartCache');
      if (cachedCart) {
        const parsed = JSON.parse(cachedCart);
        if (parsed && Array.isArray(parsed)) {
          cartItems = parsed;
        }
      }
    } catch (e) {
      console.error('[Cart Drawer] Error reading localStorage:', e);
    }
  }
  
  // Fallback to cookies
  if (cartItems.length === 0) {
    try {
      if (document.cookie && document.cookie.indexOf(',counter=') >= 0) {
        const order = document.cookie.split(',')[0].split('=')[1];
        if (order) {
          const itemIds = order.trim().split(' ');
          const itemCount = {};
          itemIds.forEach(id => {
            itemCount[id] = (itemCount[id] || 0) + 1;
          });
          
          // Convert to cart items format
          cartItems = Object.keys(itemCount).map(id => ({
            product_id: Number(id),
            quantity: itemCount[id]
          }));
        }
      }
    } catch (e) {
      console.error('[Cart Drawer] Error reading cookies:', e);
    }
  }
  
  // Display cart items
  if (cartItems.length === 0) {
    cartItemsContainer.innerHTML = '';
    if (cartDrawerEmpty) {
      cartDrawerEmpty.style.display = 'block';
    }
    if (cartDrawerTotal) {
      cartDrawerTotal.textContent = 'Rs 0';
    }
    if (cartDrawerSubtotal) {
      cartDrawerSubtotal.textContent = 'Rs 0';
    }
    return;
  }
  
  if (cartDrawerEmpty) {
    cartDrawerEmpty.style.display = 'none';
  }
  
  // Fetch product details and render items
  fetchCartDrawerProducts(cartItems, cartItemsContainer, cartDrawerTotal, cartDrawerSubtotal, cartDrawerDelivery);
}

// Fetch product details for cart items
async function fetchCartDrawerProducts(cartItems, container, totalEl, subtotalEl, deliveryEl) {
  if (!container) return;
  
  container.innerHTML = '<div class="cart-drawer-loading"><div class="loader"></div><p>Loading products...</p></div>';
  
  try {
    // Get all unique product IDs
    const productIds = [...new Set(cartItems.map(item => item.product_id))];
    
    // Fetch products from Supabase
    const SUPABASE_URL = `${window.SUPABASE_BASE_URL}/products?select=*&id=in.(${productIds.join(',')})`;
    const response = await fetch(SUPABASE_URL, {
      headers: {
        'apikey': window.SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${window.SUPABASE_ANON_KEY}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    
    const products = await response.json();
    const productsMap = {};
    products.forEach(p => {
      productsMap[p.id] = p;
    });
    
    // Render cart items
    container.innerHTML = '';
    let subtotal = 0;
    
    cartItems.forEach((cartItem, index) => {
      const product = productsMap[cartItem.product_id];
      if (!product) return;
      
      const quantity = cartItem.quantity || 1;
      const price = Math.round(Number(product.final_price || product.price || 0));
      const itemTotal = price * quantity;
      subtotal += itemTotal;
      
      const itemDiv = document.createElement('div');
      itemDiv.className = 'cart-drawer-item';
      itemDiv.innerHTML = `
        <div class="cart-drawer-item-image">
          <img src="${product.preview || product.image_url || ''}" alt="${product.name || 'Product'}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'100\\' height=\\'100\\'%3E%3Crect fill=\\'%23ddd\\' width=\\'100\\' height=\\'100\\'/%3E%3Ctext fill=\\'%23999\\' font-family=\\'sans-serif\\' font-size=\\'14\\' x=\\'50%25\\' y=\\'50%25\\' text-anchor=\\'middle\\' dy=\\'.3em\\'%3EImage%3C/text%3E%3C/svg%3E'">
        </div>
        <div class="cart-drawer-item-details">
          <h4><a href="contentDetails.html?id=${product.id}">${product.name || 'Product'}</a></h4>
          ${cartItem.size_name || cartItem.color_name ? `<p class="cart-drawer-variant">${cartItem.size_name ? 'Size: ' + cartItem.size_name : ''}${cartItem.size_name && cartItem.color_name ? ' | ' : ''}${cartItem.color_name ? 'Color: ' + cartItem.color_name : ''}</p>` : ''}
          <div class="cart-drawer-item-controls">
            <button class="cart-drawer-qty-btn decrease" data-item-id="${cartItem.product_id}" data-index="${index}">
              <i class="fas fa-minus"></i>
            </button>
            <span class="cart-drawer-qty-value">${quantity}</span>
            <button class="cart-drawer-qty-btn increase" data-item-id="${cartItem.product_id}" data-index="${index}">
              <i class="fas fa-plus"></i>
            </button>
          </div>
          <div class="cart-drawer-item-price">Rs ${itemTotal.toLocaleString()}</div>
          <button class="cart-drawer-remove" data-item-id="${cartItem.product_id}" data-index="${index}">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `;
      
      container.appendChild(itemDiv);
    });
    
    // Update totals
    const delivery = 200;
    const total = subtotal + delivery;
    
    if (subtotalEl) {
      subtotalEl.textContent = 'Rs ' + subtotal.toLocaleString();
    }
    if (deliveryEl) {
      deliveryEl.textContent = 'Rs ' + delivery.toLocaleString();
    }
    if (totalEl) {
      totalEl.textContent = 'Rs ' + total.toLocaleString();
    }
    
    // Attach event listeners
    attachCartDrawerEventListeners();
    
  } catch (error) {
    console.error('[Cart Drawer] Error loading products:', error);
    container.innerHTML = '<div class="cart-drawer-error"><p>Error loading cart items. Please try again.</p></div>';
  }
}

// Attach event listeners to cart drawer items
function attachCartDrawerEventListeners() {
  // Quantity increase
  document.querySelectorAll('.cart-drawer-qty-btn.increase').forEach(btn => {
    btn.addEventListener('click', async function() {
      const productId = Number(this.getAttribute('data-item-id'));
      if (window.optimisticCart && typeof window.optimisticCart.updateQuantity === 'function') {
        // Get current quantity
        const qtyEl = this.parentElement.querySelector('.cart-drawer-qty-value');
        const currentQty = parseInt(qtyEl.textContent, 10) || 1;
        await window.optimisticCart.updateQuantity(productId, currentQty + 1);
        loadCartDrawerItems(); // Reload drawer
      }
    });
  });
  
  // Quantity decrease
  document.querySelectorAll('.cart-drawer-qty-btn.decrease').forEach(btn => {
    btn.addEventListener('click', async function() {
      const productId = Number(this.getAttribute('data-item-id'));
      const qtyEl = this.parentElement.querySelector('.cart-drawer-qty-value');
      const currentQty = parseInt(qtyEl.textContent, 10) || 1;
      
      if (currentQty > 1) {
        if (window.optimisticCart && typeof window.optimisticCart.updateQuantity === 'function') {
          await window.optimisticCart.updateQuantity(productId, currentQty - 1);
          loadCartDrawerItems(); // Reload drawer
        }
      } else {
        // Remove item
        if (window.optimisticCart && typeof window.optimisticCart.removeFromCart === 'function') {
          await window.optimisticCart.removeFromCart(productId);
          loadCartDrawerItems(); // Reload drawer
        }
      }
    });
  });
  
  // Remove item
  document.querySelectorAll('.cart-drawer-remove').forEach(btn => {
    btn.addEventListener('click', async function() {
      const productId = Number(this.getAttribute('data-item-id'));
      if (window.optimisticCart && typeof window.optimisticCart.removeFromCart === 'function') {
        await window.optimisticCart.removeFromCart(productId);
        loadCartDrawerItems(); // Reload drawer
      }
    });
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCartDrawer);
} else {
  initCartDrawer();
}
