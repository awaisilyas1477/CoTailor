// Saved Addresses Management
// Handles saving, loading, and managing user delivery addresses

// Supabase Configuration
if (typeof window.SUPABASE_BASE_URL === 'undefined') {
    window.SUPABASE_BASE_URL = "https://grksptxhbdlbdrlabaew.supabase.co/rest/v1";
}
if (typeof window.SUPABASE_ANON_KEY === 'undefined') {
    window.SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdya3NwdHhoYmRsYmRybGFiYWV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyOTI2MDgsImV4cCI6MjA4Mjg2ODYwOH0.TpiilrTDb4ZNbETvl0h4E_LFHZGpcx91_6Nx_dDPbew";
}

// Cache configuration
const ADDRESSES_CACHE_KEY = 'savedAddresses';
const ADDRESSES_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

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

// Get cached addresses from localStorage (SYNCHRONOUS - instant, no async)
function getCachedAddresses() {
    try {
        const cached = localStorage.getItem(ADDRESSES_CACHE_KEY);
        if (!cached) return null;
        
        const data = JSON.parse(cached);
        const now = Date.now();
        
        // Check if cache is still valid (within 5 minutes)
        if (data.timestamp && (now - data.timestamp) < ADDRESSES_CACHE_DURATION) {
            return data.addresses || [];
        }
        
        // Cache expired, remove it
        localStorage.removeItem(ADDRESSES_CACHE_KEY);
        return null;
    } catch (error) {
        return null;
    }
}

// Cache addresses to localStorage
function cacheAddresses(addresses) {
    try {
        const data = {
            addresses: addresses,
            timestamp: Date.now()
        };
        localStorage.setItem(ADDRESSES_CACHE_KEY, JSON.stringify(data));
    } catch (error) {
        // Ignore localStorage errors
    }
}

// Clear addresses cache
function clearAddressesCache() {
    try {
        localStorage.removeItem(ADDRESSES_CACHE_KEY);
    } catch (error) {
        // Ignore localStorage errors
    }
}

// Get saved addresses for current user
async function getSavedAddresses() {
    try {
        const { user } = await window.auth.getCurrentUser();
        if (!user) {
            return [];
        }

        // Check localStorage FIRST - return immediately if cache exists
        const cached = getCachedAddresses();
        if (cached !== null) {
            // Return cached data immediately, then refresh in background
            refreshAddressesInBackground(user.id);
            return cached;
        }

        // No cache - fetch from API
        const accessToken = await getUserAccessToken();
        if (!accessToken) {
            return [];
        }

        const url = `${window.SUPABASE_BASE_URL}/saved_addresses?user_id=eq.${user.id}&order=is_default.desc,created_at.desc`;
        
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
                            const addresses = JSON.parse(xhr.responseText);
                            // Cache the result
                            cacheAddresses(addresses);
                            resolve(addresses);
                        } catch (e) {
                            resolve([]);
                        }
                    } else {
                        resolve([]);
                    }
                }
            };
            
            xhr.onerror = () => resolve([]);
            xhr.send();
        });
    } catch (error) {
        return [];
    }
}

// Refresh addresses from database in background (non-blocking)
async function refreshAddressesInBackground(userId) {
    try {
        const accessToken = await getUserAccessToken();
        if (!accessToken) {
            return;
        }

        const url = `${window.SUPABASE_BASE_URL}/saved_addresses?user_id=eq.${userId}&order=is_default.desc,created_at.desc`;
        
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.setRequestHeader('apikey', window.SUPABASE_ANON_KEY);
        xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
        xhr.setRequestHeader('Content-Type', 'application/json');
        
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                try {
                    const addresses = JSON.parse(xhr.responseText);
                    // Update cache in background
                    cacheAddresses(addresses);
                } catch (e) {
                    // Ignore parsing errors
                }
            }
        };
        
        xhr.onerror = () => {
            // Ignore background refresh errors
        };
        xhr.send();
    } catch (error) {
        // Ignore background refresh errors
    }
}

// Save a new address
async function saveAddress(addressData) {
    try {
        const { user } = await window.auth.getCurrentUser();
        if (!user) {
            return { error: { message: 'User not logged in' } };
        }

        // Get user's access token for RLS
        const accessToken = await getUserAccessToken();
        if (!accessToken) {
            return { error: { message: 'Session expired. Please log in again.' } };
        }

        const addressPayload = {
            user_id: user.id,
            address_label: addressData.address_label || 'Home',
            full_name: addressData.full_name,
            phone_number: addressData.phone_number,
            email: addressData.email || null,
            delivery_address: addressData.delivery_address,
            city: addressData.city,
            postal_code: addressData.postal_code || null,
            province: addressData.province,
            is_default: addressData.is_default || false
        };

        const url = `${window.SUPABASE_BASE_URL}/saved_addresses`;
        
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', url, true);
            xhr.setRequestHeader('apikey', window.SUPABASE_ANON_KEY);
            xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Prefer', 'return=representation');
            
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 201) {
                        try {
                            const result = JSON.parse(xhr.responseText);
                            const savedAddress = result[0];
                            // Update cache with new address
                            const cached = getCachedAddresses();
                            if (cached) {
                                cached.push(savedAddress);
                                cacheAddresses(cached);
                            } else {
                                // No cache, just cache the new address
                                cacheAddresses([savedAddress]);
                            }
                            resolve({ data: savedAddress, error: null });
                        } catch (e) {
                            resolve({ data: null, error: { message: 'Failed to parse response' } });
                        }
                    } else {
                        try {
                            const error = JSON.parse(xhr.responseText);
                            resolve({ data: null, error });
                        } catch (e) {
                            resolve({ data: null, error: { message: 'Failed to save address' } });
                        }
                    }
                }
            };
            
            xhr.onerror = () => resolve({ data: null, error: { message: 'Network error' } });
            xhr.send(JSON.stringify(addressPayload));
        });
    } catch (error) {
        return { data: null, error: { message: error.message } };
    }
}

// Delete a saved address
async function deleteAddress(addressId) {
    try {
        const { user } = await window.auth.getCurrentUser();
        if (!user) {
            return { error: { message: 'User not logged in' } };
        }

        // Get user's access token for RLS
        const accessToken = await getUserAccessToken();
        if (!accessToken) {
            return { error: { message: 'Session expired. Please log in again.' } };
        }

        const url = `${window.SUPABASE_BASE_URL}/saved_addresses?id=eq.${addressId}&user_id=eq.${user.id}`;
        
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('DELETE', url, true);
            xhr.setRequestHeader('apikey', window.SUPABASE_ANON_KEY);
            xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
            xhr.setRequestHeader('Prefer', 'return=representation');
            
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200 || xhr.status === 204) {
                        // Update cache by removing deleted address
                        const cached = getCachedAddresses();
                        if (cached) {
                            const updated = cached.filter(addr => addr.id !== addressId);
                            cacheAddresses(updated);
                        }
                        resolve({ error: null });
                    } else {
                        try {
                            const error = JSON.parse(xhr.responseText);
                            resolve({ error });
                        } catch (e) {
                            resolve({ error: { message: 'Failed to delete address' } });
                        }
                    }
                }
            };
            
            xhr.onerror = () => resolve({ error: { message: 'Network error' } });
            xhr.send();
        });
    } catch (error) {
        return { error: { message: error.message } };
    }
}

// Update an address
async function updateAddress(addressId, addressData) {
    try {
        const { user } = await window.auth.getCurrentUser();
        if (!user) {
            return { error: { message: 'User not logged in' } };
        }

        // Get user's access token for RLS
        const accessToken = await getUserAccessToken();
        if (!accessToken) {
            return { error: { message: 'Session expired. Please log in again.' } };
        }

        const addressPayload = {
            address_label: addressData.address_label,
            full_name: addressData.full_name,
            phone_number: addressData.phone_number,
            email: addressData.email || null,
            delivery_address: addressData.delivery_address,
            city: addressData.city,
            postal_code: addressData.postal_code || null,
            province: addressData.province,
            is_default: addressData.is_default || false
        };

        const url = `${window.SUPABASE_BASE_URL}/saved_addresses?id=eq.${addressId}&user_id=eq.${user.id}`;
        
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('PATCH', url, true);
            xhr.setRequestHeader('apikey', window.SUPABASE_ANON_KEY);
            xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Prefer', 'return=representation');
            
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        try {
                            const result = JSON.parse(xhr.responseText);
                            const savedAddress = result[0];
                            // Update cache with updated address
                            const cached = getCachedAddresses();
                            if (cached) {
                                const updated = cached.map(addr => 
                                    addr.id === addressId ? savedAddress : addr
                                );
                                cacheAddresses(updated);
                            } else {
                                // No cache, just cache the updated address
                                cacheAddresses([savedAddress]);
                            }
                            resolve({ data: savedAddress, error: null });
                        } catch (e) {
                            resolve({ data: null, error: { message: 'Failed to parse response' } });
                        }
                    } else {
                        try {
                            const error = JSON.parse(xhr.responseText);
                            resolve({ data: null, error });
                        } catch (e) {
                            resolve({ data: null, error: { message: 'Failed to update address' } });
                        }
                    }
                }
            };
            
            xhr.onerror = () => resolve({ data: null, error: { message: 'Network error' } });
            xhr.send(JSON.stringify(addressPayload));
        });
    } catch (error) {
        return { data: null, error: { message: error.message } };
    }
}

// Export functions for global access
window.savedAddresses = {
    getSavedAddresses,
    getCachedAddresses,
    saveAddress,
    deleteAddress,
    updateAddress,
    clearAddressesCache
};

