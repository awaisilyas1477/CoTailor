// Global Search Functionality
let allProducts = [];
let searchTimeout;

// Load all products for search
function loadProductsForSearch() {
    const SUPABASE_URL = "https://grksptxhbdlbdrlabaew.supabase.co/rest/v1/products?select=*";
    const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdya3NwdHhoYmRsYmRybGFiYWV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyOTI2MDgsImV4cCI6MjA4Mjg2ODYwOH0.TpiilrTDb4ZNbETvl0h4E_LFHZGpcx91_6Nx_dDPbew";
    
    let httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
        if (this.readyState === 4) {
            if (this.status == 200) {
                try {
                    allProducts = JSON.parse(this.responseText);
                } catch (error) {
                    // Error parsing response
                }
            }
        }
    };
    
    httpRequest.onerror = function() {
        // Request error
    };
    
    httpRequest.open("GET", SUPABASE_URL, true);
    httpRequest.setRequestHeader("apikey", SUPABASE_ANON_KEY);
    httpRequest.setRequestHeader("Authorization", "Bearer " + SUPABASE_ANON_KEY);
    httpRequest.send();
}

// Search products
function searchProducts(query) {
    if (!query || query.trim().length < 1) {
        return [];
    }
    
    if (allProducts.length === 0) {
        return [];
    }
    
    const searchTerm = query.toLowerCase().trim();
    const results = allProducts.filter(product => {
        if (!product) return false;
        
        const name = (product.name || '').toLowerCase();
        const brand = (product.brand || '').toLowerCase();
        const description = (product.description || '').toLowerCase();
        
        return name.includes(searchTerm) || 
               brand.includes(searchTerm) || 
               description.includes(searchTerm);
    });
    
    return results.slice(0, 8); // Limit to 8 results
}

// Display search results
function displaySearchResults(results) {
    const resultsContainer = document.getElementById('searchResults');
    if (!resultsContainer) {
        return;
    }
    
    // Clear previous results
    resultsContainer.innerHTML = '';
    
    if (allProducts.length === 0) {
        resultsContainer.innerHTML = `
            <div class="search-result-item no-results">
                <i class="fas fa-spinner fa-spin"></i>
                <span>Loading products...</span>
            </div>
        `;
        resultsContainer.classList.add('show');
        return;
    }
    
    if (results.length === 0) {
        resultsContainer.innerHTML = `
            <div class="search-result-item no-results">
                <i class="fas fa-search"></i>
                <span>No products found matching your search</span>
            </div>
        `;
        resultsContainer.classList.add('show');
        return;
    }
    
    let resultsHTML = '';
    const searchInput = document.getElementById('globalSearch');
    const currentSearch = searchInput ? searchInput.value.trim() : '';
    
    results.forEach(product => {
        if (!product || !product.id) return;
        
        // Preserve search parameter in product links
        let productUrl = `contentDetails.html?${product.id}`;
        if (currentSearch) {
            productUrl += `&search=${encodeURIComponent(currentSearch)}`;
        }
        
        resultsHTML += `
            <a href="${productUrl}" class="search-result-item">
                <img src="${product.preview || ''}" alt="${product.name || 'Product'}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'50\\' height=\\'50\\'%3E%3Crect fill=\\'%23ddd\\' width=\\'50\\' height=\\'50\\'/%3E%3C/svg%3E'">
                <div class="search-result-info">
                    <div class="search-result-name">${product.name || 'Product'}</div>
                    <div class="search-result-brand">${product.brand || ''}</div>
                    <div class="search-result-price">Rs ${product.price || 0}</div>
                </div>
            </a>
        `;
    });
    
    resultsContainer.innerHTML = resultsHTML;
    resultsContainer.classList.add('show');
    resultsContainer.style.display = 'block';
    resultsContainer.style.visibility = 'visible';
    resultsContainer.style.opacity = '1';
    resultsContainer.style.position = 'absolute';
    resultsContainer.style.top = 'calc(100% + 5px)';
    resultsContainer.style.left = '25px';
    resultsContainer.style.right = '25px';
    resultsContainer.style.width = 'calc(100% - 50px)';
    resultsContainer.style.zIndex = '2001';
}

// Hide search results
function hideSearchResults() {
    const resultsContainer = document.getElementById('searchResults');
    if (resultsContainer) {
        resultsContainer.classList.remove('show');
    }
}

// Initialize search
function initSearch() {
    const searchInput = document.getElementById('globalSearch');
    if (!searchInput) {
        return;
    }
    
    // Check if already initialized
    if (searchInput.dataset.initialized === 'true') {
        return;
    }
    
    searchInput.dataset.initialized = 'true';
    
    // Load products when page loads (only once)
    if (allProducts.length === 0) {
        loadProductsForSearch();
    }
    
    // Check for search parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    if (searchParam) {
        searchInput.value = decodeURIComponent(searchParam);
        // Don't open popup automatically - just set the value
        // Perform search after products load
        setTimeout(() => {
            if (allProducts.length > 0) {
                const results = searchProducts(searchParam);
                displaySearchResults(results);
            } else {
                // Wait for products to load
                const checkProducts = setInterval(() => {
                    if (allProducts.length > 0) {
                        clearInterval(checkProducts);
                        const results = searchProducts(searchParam);
                        displaySearchResults(results);
                    }
                }, 100);
                // Stop checking after 5 seconds
                setTimeout(() => clearInterval(checkProducts), 5000);
            }
        }, 500);
    }
    
    // Search on input
    searchInput.addEventListener('input', function(e) {
        const query = e.target.value;
        
        clearTimeout(searchTimeout);
        
        // Update URL parameter without page reload - only after user stops typing
        // (We'll update it in the timeout below)
        
        if (query.length < 1) {
            hideSearchResults();
            return;
        }
        
        // Show loading state
        if (allProducts.length === 0) {
            const resultsContainer = document.getElementById('searchResults');
            if (resultsContainer) {
                resultsContainer.innerHTML = `
                    <div class="search-result-item no-results">
                        <i class="fas fa-spinner fa-spin"></i>
                        <span>Loading products...</span>
                    </div>
                `;
                resultsContainer.classList.add('show');
            }
        }
        
        searchTimeout = setTimeout(() => {
            // Update URL parameter after user stops typing (300ms delay)
            try {
                const currentUrl = window.location.href.split('?')[0];
                let newUrl = currentUrl;
                
                if (query.length > 0) {
                    const encodedQuery = encodeURIComponent(query);
                    // Check if there are existing params
                    if (window.location.search) {
                        const urlParams = new URLSearchParams(window.location.search);
                        urlParams.set('search', encodedQuery);
                        newUrl = currentUrl + '?' + urlParams.toString();
                    } else {
                        newUrl = currentUrl + '?search=' + encodedQuery;
                    }
                } else {
                    // Remove search param but keep other params
                    if (window.location.search) {
                        const urlParams = new URLSearchParams(window.location.search);
                        urlParams.delete('search');
                        const remainingParams = urlParams.toString();
                        newUrl = remainingParams ? currentUrl + '?' + remainingParams : currentUrl;
                    }
                }
                
                // Update URL
                window.history.pushState({search: query}, '', newUrl);
            } catch (error) {
                // Error updating URL
            }
            
            if (allProducts.length === 0) {
                const resultsContainer = document.getElementById('searchResults');
                if (resultsContainer) {
                    resultsContainer.innerHTML = `
                        <div class="search-result-item no-results">
                            <i class="fas fa-spinner fa-spin"></i>
                            <span>Loading products...</span>
                        </div>
                    `;
                    resultsContainer.classList.add('show');
                    resultsContainer.style.display = 'block';
                }
                return;
            }
            const results = searchProducts(query);
            displaySearchResults(results);
        }, 300);
    });
    
    // Show results on focus if there's text
    searchInput.addEventListener('focus', function(e) {
        const query = e.target.value.trim();
        if (query.length >= 1 && allProducts.length > 0) {
            const results = searchProducts(query);
            displaySearchResults(results);
        }
    });
    
    // Hide results when clicking outside
    document.addEventListener('click', function(e) {
        const searchContainer = document.getElementById('searchContainer');
        if (searchContainer && !searchContainer.contains(e.target)) {
            hideSearchResults();
        }
    });
    
    // Handle Enter key
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const query = e.target.value.trim();
            if (query.length >= 1) {
                // Update URL with search parameter
                try {
                    const currentUrl = window.location.href.split('?')[0];
                    const encodedQuery = encodeURIComponent(query);
                    const newUrl = currentUrl + '?search=' + encodedQuery;
                    window.history.pushState({search: query}, '', newUrl);
                } catch (error) {
                    // Error updating URL
                }
                
                // Close search popup
                closeSearchPopup();
                
                const results = searchProducts(query);
                if (results.length > 0) {
                    // Navigate to first result with search param preserved
                    window.location.href = `contentDetails.html?${results[0].id}&search=${encodeURIComponent(query)}`;
                } else {
                    // Show "no results" message but close popup
                    displaySearchResults([]);
                    closeSearchPopup();
                }
            } else {
                // Close popup if search is empty
                closeSearchPopup();
            }
        }
    });
}

// Search Popup Functions
function openSearchPopup() {
    const popup = document.getElementById('searchPopup');
    if (popup) {
        popup.classList.add('show');
        // Focus on search input after a short delay
        setTimeout(() => {
            const searchInput = document.getElementById('globalSearch');
            if (searchInput) {
                searchInput.focus();
            }
        }, 100);
    }
}

function closeSearchPopup() {
    const popup = document.getElementById('searchPopup');
    if (popup) {
        popup.classList.remove('show');
        popup.style.display = 'none';
        hideSearchResults();
        // Don't clear search input - keep the value for URL param
    }
}

// Initialize search popup
function initSearchPopup() {
    const searchIcon = document.getElementById('searchIcon');
    const closeSearch = document.getElementById('closeSearch');
    const popup = document.getElementById('searchPopup');
    
    if (searchIcon) {
        searchIcon.addEventListener('click', function(e) {
            e.stopPropagation();
            openSearchPopup();
        });
    }
    
    if (closeSearch) {
        closeSearch.addEventListener('click', function(e) {
            e.stopPropagation();
            closeSearchPopup();
        });
    }
    
    // Close popup when clicking outside
    if (popup) {
        popup.addEventListener('click', function(e) {
            if (e.target === popup) {
                closeSearchPopup();
            }
        });
    }
    
    // Close popup on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeSearchPopup();
        }
    });
}

// Initialize search - works for both direct load and dynamic load
function initializeSearchWhenReady() {
    const searchInput = document.getElementById('globalSearch');
    if (searchInput && !searchInput.dataset.initialized) {
        initSearch();
        initSearchPopup();
        return true;
    }
    return false;
}

// Try multiple times to catch dynamically loaded headers
function tryInitializeSearch() {
    if (!initializeSearchWhenReady()) {
        // Retry after delays
        setTimeout(() => initializeSearchWhenReady(), 100);
        setTimeout(() => initializeSearchWhenReady(), 300);
        setTimeout(() => initializeSearchWhenReady(), 500);
        setTimeout(() => initializeSearchWhenReady(), 1000);
    } else {
        // Also initialize popup if search is already initialized
        initSearchPopup();
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tryInitializeSearch);
} else {
    tryInitializeSearch();
}

// Also try immediately and after delays for dynamically loaded headers
tryInitializeSearch();

// Mobile Drawer Functionality
function initMobileDrawer() {
    const menuIcon = document.getElementById('mobileMenuIcon');
    const drawer = document.getElementById('mobileDrawer');
    const drawerClose = document.getElementById('drawerClose');
    const drawerOverlay = document.getElementById('drawerOverlay');
    
    if (menuIcon && drawer) {
        menuIcon.addEventListener('click', function(e) {
            e.stopPropagation();
            drawer.classList.add('open');
            document.body.style.overflow = 'hidden'; // Prevent body scroll when drawer is open
        });
    }
    
    function closeDrawer() {
        if (drawer) {
            drawer.classList.remove('open');
            document.body.style.overflow = ''; // Restore body scroll
        }
    }
    
    if (drawerClose) {
        drawerClose.addEventListener('click', closeDrawer);
    }
    
    if (drawerOverlay) {
        drawerOverlay.addEventListener('click', closeDrawer);
    }
    
    // Close drawer when clicking on a link
    const drawerLinks = document.querySelectorAll('.drawer-link');
    drawerLinks.forEach(link => {
        link.addEventListener('click', function() {
            setTimeout(closeDrawer, 300); // Small delay for smooth transition
        });
    });
    
    // Close drawer on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && drawer && drawer.classList.contains('open')) {
            closeDrawer();
        }
    });
}

// Initialize mobile drawer when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileDrawer);
} else {
    initMobileDrawer();
}

// Also try after delays for dynamically loaded headers
setTimeout(initMobileDrawer, 100);
setTimeout(initMobileDrawer, 300);
setTimeout(initMobileDrawer, 500);
setTimeout(initMobileDrawer, 1000);

// Update badge counter function - runs on all pages
// INSTANT from cache, then refresh in background
function updateBadgeCounter() {
    const badge = document.getElementById("badge");
    if (!badge) return;
    
    // STEP 1: Check localStorage cache FIRST (instant, synchronous) - NO SKELETON if cache exists
    if (window.userCart && typeof window.userCart.getCachedCart === 'function') {
        try {
            const cached = window.userCart.getCachedCart();
            if (cached && cached.length > 0) {
                let totalCount = 0;
                cached.forEach(item => {
                    totalCount += (item.quantity || 1);
                });
                
                // INSTANT: Update badge immediately from cache (no skeleton delay)
                badge.classList.remove('skeleton-badge');
                badge.innerHTML = totalCount;
                
                // NO DATABASE CALLS - Only localStorage/cookies
                return;
            }
        } catch (error) {
            // Fall through to state manager check
        }
    }
    
    // STEP 1b: Check state manager FIRST (most reliable - always has latest optimistic updates)
    if (window.stateManager) {
        try {
            const state = window.stateManager.getState();
            if (state.cart && state.cart.length > 0) {
                let totalCount = 0;
                state.cart.forEach(item => {
                    totalCount += (item.quantity || 1);
                });
                
                // INSTANT: Update badge immediately from state manager (no skeleton delay)
                badge.classList.remove('skeleton-badge');
                badge.innerHTML = totalCount;
                
                // NO DATABASE CALLS - Only localStorage/cookies
                return;
            }
        } catch (error) {
            // Fall through to cookie check
        }
    }
    
    // STEP 3: Fall back to cookies (NO DATABASE - using localStorage/cookies only)
    
    // STEP 4: Auth not available - fall back to cookies (for guest users)
    badge.classList.remove('skeleton-badge');
    if (document.cookie && document.cookie.indexOf(',counter=') >= 0) {
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

// Initialize badge on page load and after delays for dynamically loaded headers
function tryUpdateBadge() {
    updateBadgeCounter();
}

// Try immediately and after delays
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tryUpdateBadge);
} else {
    tryUpdateBadge();
}

// Also try after delays for dynamically loaded headers
setTimeout(tryUpdateBadge, 100);
setTimeout(tryUpdateBadge, 300);
setTimeout(tryUpdateBadge, 500);
setTimeout(tryUpdateBadge, 1000);

