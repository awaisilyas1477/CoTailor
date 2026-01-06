// ============================================================================
// ORDER HISTORY - Fetch and Display User Orders
// ============================================================================

// Supabase Configuration
const SUPABASE_BASE_URL = "https://grksptxhbdlbdrlabaew.supabase.co/rest/v1";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdya3NwdHhoYmRsYmRybGFiYWV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyOTI2MDgsImV4cCI6MjA4Mjg2ODYwOH0.TpiilrTDb4ZNbETvl0h4E_LFHZGpcx91_6Nx_dDPbew";

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    checkAuthAndLoadOrders();
});

// Check authentication and load orders
async function checkAuthAndLoadOrders() {
    // Wait for auth to be available
    if (!window.auth || typeof window.auth.getCurrentUser !== 'function') {
        setTimeout(checkAuthAndLoadOrders, 200);
        return;
    }

    // Check if user is logged in
    const { user } = await window.auth.getCurrentUser();
    
    if (!user) {
        // User not logged in - show message
        showError('Please log in to view your order history.');
        return;
    }

    // User is logged in - load orders
    loadOrderHistory();
}

// Load order history
async function loadOrderHistory() {
    const loadingEl = document.getElementById('orderHistoryLoading');
    const emptyEl = document.getElementById('orderHistoryEmpty');
    const errorEl = document.getElementById('orderHistoryError');
    const listEl = document.getElementById('orderHistoryList');

    // Show loading, hide others
    if (loadingEl) loadingEl.style.display = 'block';
    if (emptyEl) emptyEl.style.display = 'none';
    if (errorEl) errorEl.style.display = 'none';
    if (listEl) listEl.style.display = 'none';

    try {
        // Get current user
        const { user } = await window.auth.getCurrentUser();
        if (!user) {
            showError('User not found. Please log in again.');
            return;
        }

        // Call the SQL function via RPC
        const orders = await getUserOrders(user.id);

        if (!orders || orders.length === 0) {
            // No orders
            if (loadingEl) loadingEl.style.display = 'none';
            if (emptyEl) emptyEl.style.display = 'block';
        } else {
            // Display orders
            displayOrders(orders);
            if (loadingEl) loadingEl.style.display = 'none';
            if (listEl) listEl.style.display = 'block';
        }
    } catch (error) {
        showError(error.message || 'Failed to load orders. Please try again.');
    }
}

// Get user orders using the SQL function
async function getUserOrders(userId) {
    return new Promise((resolve, reject) => {
        // Call the RPC function get_user_orders
        const httpRequest = new XMLHttpRequest();
        
        httpRequest.onreadystatechange = function() {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    try {
                        const orders = JSON.parse(this.responseText);
                        resolve(orders);
                    } catch (e) {
                        reject(new Error('Failed to parse orders data'));
                    }
                } else if (this.status === 404 || this.status === 400) {
                    // Function might not exist, fallback to REST API
                    getOrdersViaREST(userId).then(resolve).catch(reject);
                } else {
                    reject(new Error('Failed to fetch orders: ' + this.status));
                }
            }
        };

        httpRequest.onerror = function() {
            // Fallback to REST API
            getOrdersViaREST(userId).then(resolve).catch(reject);
        };

        // Try RPC first
        const rpcUrl = `https://grksptxhbdlbdrlabaew.supabase.co/rest/v1/rpc/get_user_orders`;
        httpRequest.open('POST', rpcUrl, true);
        httpRequest.setRequestHeader('Content-Type', 'application/json');
        httpRequest.setRequestHeader('apikey', SUPABASE_ANON_KEY);
        httpRequest.setRequestHeader('Authorization', 'Bearer ' + SUPABASE_ANON_KEY);
        httpRequest.setRequestHeader('Prefer', 'return=representation');
        httpRequest.send(JSON.stringify({ p_user_id: userId }));
    });
}

// Fallback: Get orders via REST API
async function getOrdersViaREST(userId) {
    return new Promise((resolve, reject) => {
        // First, get orders with delivery details
        const ordersRequest = new XMLHttpRequest();
        
        ordersRequest.onreadystatechange = function() {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    try {
                        const orders = JSON.parse(this.responseText);
                        
                        // For each order, get items
                        const ordersWithItems = orders.map(order => {
                            return getOrderItems(order.id).then(items => {
                                return {
                                    ...order,
                                    order_items: items
                                };
                            });
                        });
                        
                        Promise.all(ordersWithItems).then(resolve).catch(reject);
                    } catch (e) {
                        reject(new Error('Failed to parse orders'));
                    }
                } else {
                    reject(new Error('Failed to fetch orders: ' + this.status));
                }
            }
        };

        ordersRequest.onerror = function() {
            reject(new Error('Network error'));
        };

        // Fetch orders with delivery details
        const url = `${SUPABASE_BASE_URL}/orders?user_id=eq.${userId}&select=*,delivery_details(*)&order=created_at.desc`;
        ordersRequest.open('GET', url, true);
        ordersRequest.setRequestHeader('apikey', SUPABASE_ANON_KEY);
        ordersRequest.setRequestHeader('Authorization', 'Bearer ' + SUPABASE_ANON_KEY);
        ordersRequest.send();
    });
}

// Get order items for a specific order
function getOrderItems(orderId) {
    return new Promise((resolve, reject) => {
        const httpRequest = new XMLHttpRequest();
        
        httpRequest.onreadystatechange = function() {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    try {
                        const items = JSON.parse(this.responseText);
                        resolve(items);
                    } catch (e) {
                        reject(new Error('Failed to parse order items'));
                    }
                } else {
                    resolve([]); // Return empty array if no items
                }
            }
        };

        httpRequest.onerror = function() {
            resolve([]); // Return empty array on error
        };

        // Query order items (includes variant columns if they exist in the table)
        const url = `${SUPABASE_BASE_URL}/order_items?order_id=eq.${orderId}&order=product_name.asc`;
        httpRequest.open('GET', url, true);
        httpRequest.setRequestHeader('apikey', SUPABASE_ANON_KEY);
        httpRequest.setRequestHeader('Authorization', 'Bearer ' + SUPABASE_ANON_KEY);
        httpRequest.send();
    });
}

// Display orders
function displayOrders(orders) {
    const listEl = document.getElementById('orderHistoryList');
    if (!listEl) return;

    listEl.innerHTML = '';

    orders.forEach(order => {
        const orderCard = createOrderCard(order);
        listEl.appendChild(orderCard);
    });
}

// Create order card element
function createOrderCard(order) {
    const card = document.createElement('div');
    card.className = 'order-card';
    
    // Format date
    const orderDate = new Date(order.order_date || order.created_at);
    const formattedDate = orderDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    // Format order ID (show last 8 characters)
    const orderId = order.order_id || order.id;
    const shortOrderId = orderId ? orderId.substring(orderId.length - 8).toUpperCase() : 'N/A';

    // Get delivery details
    const delivery = order.delivery_details || order;
    const items = order.order_items || [];

    card.innerHTML = `
        <div class="order-header">
            <div class="order-info">
                <div class="order-id">Order #${shortOrderId}</div>
                <div class="order-date">${formattedDate}</div>
                <span class="order-status-badge ${getStatusClass(order.order_status)}">
                    ${order.order_status || 'pending'}
                </span>
            </div>
            <div class="order-summary">
                <div class="order-total">Rs ${formatNumber(order.total_amount || 0)}</div>
                <div class="order-items-count">${order.total_items || items.length} item(s)</div>
            </div>
        </div>
        
        <button class="order-toggle" onclick="toggleOrderDetails(this)">
            View Details
            <i class="fas fa-chevron-down"></i>
        </button>
        
        <div class="order-details">
            ${createOrderDetails(order, delivery, items)}
        </div>
    `;

    return card;
}

// Create order details HTML
function createOrderDetails(order, delivery, items) {
    return `
        ${items.length > 0 ? `
        <div class="details-section">
            <div class="details-section-title">
                <i class="fas fa-box"></i>
                Order Items
            </div>
            <div class="order-items-list">
                ${items.map(item => {
                    // Build variant text if available
                    let variantText = '';
                    if (item.size_name || item.color_name) {
                        const parts = [];
                        if (item.size_name) parts.push(`Size: ${item.size_name}`);
                        if (item.color_name) parts.push(`Color: ${item.color_name}`);
                        variantText = parts.join(' | ');
                    }
                    
                    return `
                    <div class="order-item">
                        <div class="order-item-info">
                            <div class="order-item-name">${escapeHtml(item.product_name)}</div>
                            ${variantText ? `<div class="order-item-variant" style="font-size: 0.85em; color: #666; margin-top: 4px;">${escapeHtml(variantText)}</div>` : ''}
                            <div class="order-item-meta">
                                Rs ${formatNumber(item.product_price)} × ${item.quantity}
                            </div>
                        </div>
                        <div class="order-item-price">
                            <div class="order-item-total">Rs ${formatNumber((item.product_price || 0) * (item.quantity || 1))}</div>
                        </div>
                    </div>
                    `;
                }).join('')}
            </div>
        </div>
        ` : ''}
        
        <div class="details-section">
            <div class="details-section-title">
                <i class="fas fa-truck"></i>
                Delivery Information
            </div>
            <div class="details-grid">
                <div class="detail-item">
                    <div class="detail-label">Full Name</div>
                    <div class="detail-value">${escapeHtml(delivery.full_name || 'N/A')}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Phone Number</div>
                    <div class="detail-value">${escapeHtml(delivery.phone_number || 'N/A')}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Email</div>
                    <div class="detail-value">${escapeHtml(delivery.email || 'N/A')}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Address</div>
                    <div class="detail-value">${escapeHtml(delivery.delivery_address || 'N/A')}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">City</div>
                    <div class="detail-value">${escapeHtml(delivery.city || 'N/A')}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Province</div>
                    <div class="detail-value">${escapeHtml(delivery.province || 'N/A')}</div>
                </div>
                ${delivery.postal_code ? `
                <div class="detail-item">
                    <div class="detail-label">Postal Code</div>
                    <div class="detail-value">${escapeHtml(delivery.postal_code)}</div>
                </div>
                ` : ''}
            </div>
        </div>
        
        <div class="details-section">
            <div class="details-section-title">
                <i class="fas fa-receipt"></i>
                Order Summary
            </div>
            <div class="order-summary-section">
                <div class="summary-row">
                    <span class="summary-label">Subtotal</span>
                    <span class="summary-value">Rs ${formatNumber(order.subtotal || 0)}</span>
                </div>
                <div class="summary-row">
                    <span class="summary-label">Delivery Charges</span>
                    <span class="summary-value">Rs ${formatNumber(order.delivery_charges || 0)}</span>
                </div>
                <div class="summary-row total">
                    <span class="summary-label">Total Amount</span>
                    <span class="summary-value">Rs ${formatNumber(order.total_amount || 0)}</span>
                </div>
                <div class="summary-row">
                    <span class="summary-label">Payment Method</span>
                    <span class="summary-value">${escapeHtml(order.payment_method || 'Cash on Delivery')}</span>
                </div>
                <div class="summary-row">
                    <span class="summary-label">Estimated Delivery</span>
                    <span class="summary-value">${escapeHtml(order.estimated_delivery || '3 to 5 business days')}</span>
                </div>
            </div>
        </div>
    `;
}

// Toggle order details
function toggleOrderDetails(button) {
    const card = button.closest('.order-card');
    if (card) {
        card.classList.toggle('expanded');
        button.innerHTML = card.classList.contains('expanded') 
            ? 'Hide Details <i class="fas fa-chevron-up"></i>'
            : 'View Details <i class="fas fa-chevron-down"></i>';
    }
}

// Get status class for badge
function getStatusClass(status) {
    const statusLower = (status || 'pending').toLowerCase();
    if (statusLower.includes('delivered')) return 'delivered';
    if (statusLower.includes('shipped')) return 'shipped';
    if (statusLower.includes('processing')) return 'processing';
    if (statusLower.includes('confirmed')) return 'confirmed';
    if (statusLower.includes('cancelled') || statusLower.includes('canceled')) return 'cancelled';
    return 'pending';
}

// Format number with commas
function formatNumber(num) {
    return Number(num).toLocaleString('en-PK');
}

// Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Show error
function showError(message) {
    const loadingEl = document.getElementById('orderHistoryLoading');
    const errorEl = document.getElementById('orderHistoryError');
    const errorMessageEl = document.getElementById('orderHistoryErrorMessage');

    if (loadingEl) loadingEl.style.display = 'none';
    if (errorEl) errorEl.style.display = 'block';
    if (errorMessageEl) errorMessageEl.textContent = message;
}

// Make loadOrderHistory available globally for retry button
window.loadOrderHistory = loadOrderHistory;


