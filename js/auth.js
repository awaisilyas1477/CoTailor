// ============================================================================
// AUTHENTICATION MODULE
// ============================================================================
// Handles user authentication with Google OAuth and local email/password
// ============================================================================

// Supabase Configuration - Use window properties to avoid conflicts
if (typeof window.SUPABASE_AUTH_URL === 'undefined') {
    window.SUPABASE_AUTH_URL = "https://grksptxhbdlbdrlabaew.supabase.co";
}
if (typeof window.SUPABASE_AUTH_ANON_KEY === 'undefined') {
    window.SUPABASE_AUTH_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdya3NwdHhoYmRsYmRybGFiYWV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyOTI2MDgsImV4cCI6MjA4Mjg2ODYwOH0.TpiilrTDb4ZNbETvl0h4E_LFHZGpcx91_6Nx_dDPbew";
}

// Access via window properties (no const/var declaration to avoid conflicts)
// Use window.SUPABASE_AUTH_URL and window.SUPABASE_AUTH_ANON_KEY directly

// Initialize Supabase client
// Note: 'supabase' is a global variable from the Supabase CDN, don't declare it
if (typeof window.supabase === 'undefined') {
    // Supabase client will be initialized after CDN loads
    window.supabaseClientReady = false;
}

// Initialize Supabase client when CDN is loaded
function initSupabaseClient() {
    // Check if already initialized
    if (window.supabase && window.supabaseClientReady) {
        return window.supabase;
    }
    
    // Check if supabase CDN is loaded
    // The CDN creates a global 'supabase' variable - access it via window or global scope
    // Use bracket notation to avoid any declaration conflicts
    let supabaseFromCDN = null;
    
    // Try to get supabase from window first
    if (window.supabase && typeof window.supabase.createClient === 'function') {
        supabaseFromCDN = window.supabase;
    } 
    // Then try global scope (CDN might attach it to window or global)
    else if (window['supabase'] && typeof window['supabase'].createClient === 'function') {
        supabaseFromCDN = window['supabase'];
    }
    // Last resort: check if it exists in global scope (but don't reference it directly)
    else {
        try {
            // Use Function constructor to safely access global supabase without declaration
            const checkSupabase = new Function('return typeof supabase !== "undefined" ? supabase : null');
            const globalSupabase = checkSupabase();
            if (globalSupabase && typeof globalSupabase.createClient === 'function') {
                supabaseFromCDN = globalSupabase;
            }
        } catch (e) {
            // Ignore errors
        }
    }
    
    if (supabaseFromCDN) {
        // Initialize client
        window.supabase = supabaseFromCDN.createClient(window.SUPABASE_AUTH_URL, window.SUPABASE_AUTH_ANON_KEY, {
            auth: {
                // Suppress admin API errors - these are harmless
                autoRefreshToken: true,
                persistSession: true,
                detectSessionInUrl: true
            }
        });
        window.supabaseClientReady = true;
        
        // Suppress admin API errors in console (these are harmless - library tries admin endpoints but gets rejected)
        const originalFetch = window.fetch;
        window.fetch = function(...args) {
            const url = args[0];
            // Check if it's an admin endpoint that will fail
            if (typeof url === 'string' && url.includes('/auth/v1/admin/')) {
                // Intercept and handle admin endpoint errors silently
                return originalFetch.apply(this, args).catch(error => {
                    // If it's a "not_admin" error, suppress it (harmless)
                    if (error.message && error.message.includes('not_admin')) {
                        console.debug('Supabase admin endpoint access denied (expected with anon key)');
                        return Promise.reject(error);
                    }
                    throw error;
                });
            }
            return originalFetch.apply(this, args);
        };
        
        return window.supabase;
    }
    
    // Wait for CDN to load
    return null;
}

// Wait for Supabase to be available
async function getSupabaseClient() {
    // Check if already initialized
    if (window.supabase && window.supabaseClientReady) {
        return window.supabase;
    }
    
    // Try to initialize
    const client = initSupabaseClient();
    if (client) {
        return client;
    }
    
    // Wait for CDN to load
    return new Promise((resolve) => {
        let attempts = 0;
        const maxAttempts = 50; // 5 seconds max wait
        
        const checkInterval = setInterval(() => {
            attempts++;
            const client = initSupabaseClient();
            if (client) {
                clearInterval(checkInterval);
                resolve(client);
            } else if (attempts >= maxAttempts) {
                clearInterval(checkInterval);
                resolve(null);
            }
        }, 100);
    });
}

// ============================================================================
// AUTHENTICATION FUNCTIONS
// ============================================================================

/**
 * Sign up with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} fullName - User full name
 * @returns {Promise<{user: object, error: object}>}
 */
async function signUpWithEmail(email, password, fullName) {
    try {
        const supabase = await getSupabaseClient();
        if (!supabase) {
            return { user: null, error: { message: 'Supabase client not initialized' } };
        }

        const { data, error } = await supabase.auth.signUp({
            email: email.trim(),
            password: password,
            options: {
                data: {
                    full_name: fullName
                },
                emailRedirectTo: window.location.origin + window.location.pathname
            }
        });

        if (error) {
            return { user: null, error: error };
        }

        // Ensure profile is created (trigger should handle this, but ensure it exists)
        if (data.user && data.user.id) {
            // Wait a moment for trigger to create profile
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Check if profile exists, if not create it
            const { profile: existingProfile } = await getUserProfile(data.user.id);
            if (!existingProfile) {
                // Profile doesn't exist, create it manually
                try {
                    const { error: profileError } = await supabase
                        .from('profiles')
                        .insert({
                            id: data.user.id,
                            email: data.user.email,
                            full_name: fullName || data.user.user_metadata?.full_name || '',
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString()
                        });
                    
                    if (profileError) {
                        // Error creating profile
                    }
                } catch (e) {
                    // Exception creating profile
                }
            } else {
                // Profile exists, update full_name if provided
                if (fullName && existingProfile.full_name !== fullName) {
                    await updateUserProfile({ full_name: fullName });
                }
            }
        }

        // If email confirmation is disabled, try to confirm email programmatically
        if (data.user && !data.user.email_confirmed_at) {
            // Try to update email_confirmed_at via admin API (if we have service role key)
            // Note: This won't work with anon key, but we can try
            try {
                // For now, just try to sign in - if email confirmation is truly disabled, it should work
                const signInResult = await supabase.auth.signInWithPassword({
                    email: email.trim(),
                    password: password
                });
                
                if (signInResult.data && signInResult.data.user) {
                    return { user: signInResult.data.user, error: null };
                }
            } catch (e) {
                // Auto sign-in exception
            }
        }

        return { user: data.user, error: null };
    } catch (error) {
        return { user: null, error: { message: error.message || 'Sign up failed' } };
    }
}

/**
 * Sign in with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<{user: object, error: object}>}
 */
async function signInWithEmail(email, password) {
    try {
        const supabase = await getSupabaseClient();
        if (!supabase) {
            return { user: null, error: { message: 'Supabase client not initialized' } };
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password: password
        });

        if (error) {
            
            // If error is about email confirmation, try to handle it
            if (error.message && (error.message.toLowerCase().includes('email') && error.message.toLowerCase().includes('confirm'))) {
                // Check if we can resend confirmation or auto-confirm
                
                // Try to resend confirmation email (might work even if disabled)
                try {
                    const { error: resendError } = await supabase.auth.resend({
                        type: 'signup',
                        email: email.trim()
                    });
                    
                    if (!resendError) {
                    }
                } catch (e) {
                }
            }
            
            // Return error with more details
            return { 
                user: null, 
                error: {
                    message: error.message,
                    status: error.status,
                    ...error
                }
            };
        }

        // Update last login
        if (data.user) {
            updateLastLogin(data.user.id);
        }

        return { user: data.user, error: null };
    } catch (error) {
        return { user: null, error: { message: error.message || 'Sign in failed' } };
    }
}

/**
 * Sign in with Google OAuth
 * @returns {Promise<{error: object}>}
 */
async function signInWithGoogle() {
    try {
        const supabase = await getSupabaseClient();
        if (!supabase) {
            return { error: { message: 'Supabase client not initialized' } };
        }

        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin + window.location.pathname
            }
        });

        if (error) {
            return { error: error };
        }

        return { error: null };
    } catch (error) {
        return { error: { message: error.message || 'Google sign in failed' } };
    }
}

/**
 * Resend confirmation email
 * @param {string} email - User email
 * @returns {Promise<{error: object}>}
 */
async function resendConfirmationEmail(email) {
    try {
        const supabase = await getSupabaseClient();
        if (!supabase) {
            return { error: { message: 'Supabase client not initialized' } };
        }

        const { error } = await supabase.auth.resend({
            type: 'signup',
            email: email.trim()
        });

        if (error) {
            return { error: error };
        }

        return { error: null };
    } catch (error) {
        return { error: { message: error.message || 'Failed to resend confirmation email' } };
    }
}

/**
 * Sign out current user
 * @returns {Promise<{error: object}>}
 */
async function signOut() {
    try {
        const supabase = await getSupabaseClient();
        if (!supabase) {
            return { error: { message: 'Supabase client not initialized' } };
        }

        const { error } = await supabase.auth.signOut();

        if (error) {
            return { error: error };
        }

        // Clear all user-related data from local storage
        localStorage.removeItem('userProfile');
        
        // Clear cart cache
        if (window.userCart && typeof window.userCart.clearCartCache === 'function') {
            window.userCart.clearCartCache();
        } else {
            // Fallback: clear cart cache directly (key is 'userCart')
            try {
                localStorage.removeItem('userCart');
            } catch (e) {
                // Ignore errors
            }
        }
        
        // Clear addresses cache
        if (window.savedAddresses && typeof window.savedAddresses.clearAddressesCache === 'function') {
            window.savedAddresses.clearAddressesCache();
        } else {
            // Fallback: clear addresses cache directly (key is 'savedAddresses')
            try {
                localStorage.removeItem('savedAddresses');
            } catch (e) {
                // Ignore errors
            }
        }
        
        // Clear app state (from stateManager)
        try {
            localStorage.removeItem('appState');
        } catch (e) {
            // Ignore errors
        }
        
        // Clear any other user-related localStorage items
        try {
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && (key.includes('cart') || key.includes('address') || key.includes('user') || key.includes('auth'))) {
                    keysToRemove.push(key);
                }
            }
            keysToRemove.forEach(key => localStorage.removeItem(key));
        } catch (e) {
            // Ignore errors
        }
        
        return { error: null };
    } catch (error) {
        return { error: { message: error.message || 'Sign out failed' } };
    }
}

/**
 * Get current authenticated user
 * @returns {Promise<{user: object, error: object}>}
 */
async function getCurrentUser() {
    try {
        const supabase = await getSupabaseClient();
        if (!supabase) {
            return { user: null, error: { message: 'Supabase client not initialized' } };
        }

        const { data: { user }, error } = await supabase.auth.getUser();

        if (error) {
            return { user: null, error: error };
        }

        return { user: user, error: null };
    } catch (error) {
        return { user: null, error: { message: error.message || 'Failed to get user' } };
    }
}

/**
 * Get user session
 * @returns {Promise<{session: object, error: object}>}
 */
async function getSession() {
    try {
        const supabase = await getSupabaseClient();
        if (!supabase) {
            return { session: null, error: { message: 'Supabase client not initialized' } };
        }

        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
            return { session: null, error: error };
        }

        return { session: session, error: null };
    } catch (error) {
        return { session: null, error: { message: error.message || 'Failed to get session' } };
    }
}

// ============================================================================
// PROFILE MANAGEMENT
// ============================================================================

/**
 * Get user profile from profiles table
 * @param {string} userId - User ID (optional, defaults to current user)
 * @returns {Promise<{profile: object, error: object}>}
 */
async function getUserProfile(userId = null, forceRefresh = false) {
    // PRIORITY: ALWAYS check localStorage FIRST (before any async operations)
    if (!forceRefresh) {
        const cached = getCachedProfile();
        if (cached && cached.id) {
            // If userId provided, verify it matches
            if (userId && cached.id !== userId) {
                // Cache is for different user, continue to API
            } else if (!userId || cached.id === userId) {
                // Cache exists and matches - return IMMEDIATELY, NO API CALL
                return { profile: cached, error: null };
            }
        }
    }
    
    try {
        const supabase = await getSupabaseClient();
        if (!supabase) {
            return { profile: null, error: { message: 'Supabase client not initialized' } };
        }

        // Get current user if userId not provided
        if (!userId) {
            const { user, error: userError } = await getCurrentUser();
            if (userError || !user) {
                return { profile: null, error: userError || { message: 'Not authenticated' } };
            }
            userId = user.id;
            
            // Check cache again with userId now known
            if (!forceRefresh) {
                const cached = getCachedProfile();
                if (cached && cached.id === userId) {
                    // Cache exists and matches - return IMMEDIATELY, NO API CALL
                    return { profile: cached, error: null };
                }
            }
        }

        // Only make API call if cache is missing or force refresh is true
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            return { profile: null, error: error };
        }

        // IMPORTANT: Save to localStorage after API call
        if (data) {
            localStorage.setItem('userProfile', JSON.stringify(data));
        }

        return { profile: data, error: null };
    } catch (error) {
        return { profile: null, error: { message: error.message || 'Failed to get profile' } };
    }
}

/**
 * Update user profile
 * @param {object} profileData - Profile data to update
 * @returns {Promise<{profile: object, error: object}>}
 */
async function updateUserProfile(profileData) {
    try {
        const supabase = await getSupabaseClient();
        if (!supabase) {
            return { profile: null, error: { message: 'Supabase client not initialized' } };
        }

        const { user, error: userError } = await getCurrentUser();
        if (userError || !user) {
            return { profile: null, error: userError || { message: 'Not authenticated' } };
        }

        const { data, error } = await supabase
            .from('profiles')
            .update(profileData)
            .eq('id', user.id)
            .select()
            .single();

        if (error) {
            return { profile: null, error: error };
        }

        // Update cached profile
        if (data) {
            localStorage.setItem('userProfile', JSON.stringify(data));
        }

        return { profile: data, error: null };
    } catch (error) {
        return { profile: null, error: { message: error.message || 'Failed to update profile' } };
    }
}

/**
 * Update last login timestamp
 * @param {string} userId - User ID
 */
async function updateLastLogin(userId) {
    try {
        const supabase = await getSupabaseClient();
        if (!supabase) {
            return;
        }

        await supabase
            .from('profiles')
            .update({ 
                last_login_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .eq('id', userId);
    } catch (error) {
        // Silently fail - not critical
    }
}

// ============================================================================
// AUTH STATE MANAGEMENT
// ============================================================================

let authStateCallbacks = [];

/**
 * Listen to authentication state changes
 * @param {function} callback - Callback function (event, session) => {}
 */
function onAuthStateChange(callback) {
    if (typeof callback !== 'function') {
        return;
    }

    authStateCallbacks.push(callback);

    // Initialize Supabase auth state listener
    getSupabaseClient().then(supabase => {
        if (supabase) {
            supabase.auth.onAuthStateChange((event, session) => {
                authStateCallbacks.forEach(cb => {
                    try {
                        cb(event, session);
                    } catch (error) {
                    }
                });
            });
        }
    });
}

/**
 * Get cached user profile from localStorage
 * @returns {object|null}
 */
function getCachedProfile() {
    try {
        const cached = localStorage.getItem('userProfile');
        return cached ? JSON.parse(cached) : null;
    } catch (error) {
        return null;
    }
}

// ============================================================================
// SUPPRESS HARMLESS ADMIN API ERRORS
// ============================================================================
// The Supabase JS library sometimes tries to access admin endpoints which
// require service role key. These errors are harmless and can be ignored.
// ============================================================================

// Intercept fetch requests to suppress admin API errors
if (typeof window !== 'undefined' && !window.supabaseFetchIntercepted) {
    window.supabaseFetchIntercepted = true;
    const originalFetch = window.fetch;
    
    window.fetch = function(...args) {
        const url = args[0];
        const isAdminEndpoint = typeof url === 'string' && url.includes('/auth/v1/admin/');
        
        if (isAdminEndpoint) {
            // Intercept admin endpoint requests and suppress errors
            return originalFetch.apply(this, args).catch(error => {
                // Suppress "not_admin" errors - these are expected when using anon key
                if (error && (
                    (error.message && (error.message.includes('not_admin') || error.message.includes('User not allowed'))) ||
                    (error.code === 'not_admin')
                )) {
                    // Return a rejected promise but don't log it
                    return Promise.reject({
                        ...error,
                        _suppressed: true // Mark as suppressed
                    });
                }
                throw error;
            });
        }
        
        return originalFetch.apply(this, args);
    };
    
    // Also catch unhandled promise rejections for admin API errors
    window.addEventListener('unhandledrejection', function(event) {
        const error = event.reason;
        if (error && (
            (error._suppressed === true) ||
            (error.message && (error.message.includes('not_admin') || error.message.includes('User not allowed'))) ||
            (error.code === 'not_admin') ||
            (typeof error === 'object' && error.code === 'not_admin')
        )) {
            // Suppress admin API errors - these are harmless
            event.preventDefault();
            // Optionally log at debug level (commented out to keep console clean)
            // console.debug('Supabase admin endpoint access denied (expected with anon key)');
        }
    });
}

// ============================================================================
// INITIALIZE AUTHENTICATION
// ============================================================================

/**
 * Initialize authentication system
 */
async function initAuth() {
    // Wait for Supabase client to be ready
    const supabase = await getSupabaseClient();
    
    if (!supabase) {
        return;
    }

    // Set up auth state listener
    onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
            // User signed in - check localStorage first
            const cached = getCachedProfile();
            if (cached && cached.id === session.user.id) {
                // Cache exists - update UI immediately, NO API CALL
                updateAuthUI();
            } else {
                // Cache missing - make ONE API call and save to localStorage
                getUserProfile(session.user.id).then(() => {
                    updateAuthUI();
                });
            }
        } else if (event === 'SIGNED_OUT') {
            // User signed out - clear localStorage and UI
            localStorage.removeItem('userProfile');
            updateAuthUI();
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
            // Token refreshed - only update if cache is missing
            const cached = getCachedProfile();
            if (!cached || cached.id !== session.user.id) {
                getUserProfile(session.user.id);
            }
        }
    });

    // Check current auth state
    const { user } = await getCurrentUser();
    if (user) {
        // PRIORITY: Check localStorage FIRST (before any API calls)
        const cached = getCachedProfile();
        if (cached && cached.id === user.id) {
            // Cache exists and matches - update UI immediately, NO API CALL
            updateAuthUI();
        } else {
            // Cache missing - make ONE API call and save to localStorage
            getUserProfile(user.id).then(() => {
                // Update UI after profile is loaded and cached
                updateAuthUI();
            });
        }
    } else {
        // Update UI
        updateAuthUI();
    }
}

/**
 * Set user name and avatar from localStorage immediately (synchronous)
 * This runs before any async operations to show name instantly
 */
function setUserNameFromCache() {
    const profile = getCachedProfile();
    const userNameDisplay = document.getElementById('authUserName');
    const userAvatar = document.getElementById('authUserAvatar');
    
    if (profile && profile.full_name) {
        // Set name immediately from localStorage
        if (userNameDisplay) {
            userNameDisplay.textContent = profile.full_name;
        }
        
        // Set avatar immediately from localStorage
        if (userAvatar) {
            if (profile.avatar_url) {
                userAvatar.innerHTML = `<img src="${profile.avatar_url}" alt="Avatar" style="width: 100%; height: 100%; object-fit: cover;">`;
            } else {
                const firstLetter = profile.full_name[0].toUpperCase();
                userAvatar.innerHTML = firstLetter;
                userAvatar.style.display = 'flex';
                userAvatar.style.alignItems = 'center';
                userAvatar.style.justifyContent = 'center';
            }
        }
    }
}

/**
 * Update authentication UI based on current state
 * Checks for session token to determine if user is logged in
 */
async function updateAuthUI() {
    // PRIORITY: Read from localStorage FIRST (synchronously, before any async operations)
    const profile = getCachedProfile();
    
    // Get DOM elements
    const loginBtn = document.getElementById('authLoginBtn');
    const userMenu = document.getElementById('authUserMenu');
    const userMenuTrigger = document.getElementById('authUserMenuTrigger');
    const userNameDisplay = document.getElementById('authUserName');
    const userAvatar = document.getElementById('authUserAvatar');
    
    // If profile exists in localStorage, show name and avatar IMMEDIATELY (before async checks)
    if (profile && profile.full_name && userNameDisplay) {
        userNameDisplay.textContent = profile.full_name;
    }
    if (profile && userAvatar) {
        if (profile.avatar_url) {
            userAvatar.innerHTML = `<img src="${profile.avatar_url}" alt="Avatar" style="width: 100%; height: 100%; object-fit: cover;">`;
        } else if (profile.full_name) {
            const firstLetter = profile.full_name[0].toUpperCase();
            userAvatar.innerHTML = firstLetter;
            userAvatar.style.display = 'flex';
            userAvatar.style.alignItems = 'center';
            userAvatar.style.justifyContent = 'center';
        }
    }
    
    // Then check for session token (async)
    const { session } = await getSession();
    const { user } = await getCurrentUser();
    
    // User is logged in if we have either a session or a user
    const isLoggedIn = !!(session?.user || user);

    if (isLoggedIn) {
        // User is logged in - HIDE login button, SHOW user menu
        if (loginBtn) {
            loginBtn.style.display = 'none';
            loginBtn.style.visibility = 'hidden';
            loginBtn.style.opacity = '0';
            loginBtn.setAttribute('aria-hidden', 'true');
            // Login button hidden (user logged in)
        }
        
        if (userMenuTrigger) {
            userMenuTrigger.style.display = 'flex';
            userMenuTrigger.style.visibility = 'visible';
            // User menu trigger shown
        }
        
        if (userMenu && !userMenu.classList.contains('active')) {
            // Only set to none if menu is not currently open (active)
            userMenu.style.display = 'none';
        }

        // PRIORITY: Get user info from localStorage FIRST (instant display)
        const profile = getCachedProfile();
        const currentUser = session?.user || user;
        let displayName = 'User';
        
        if (userNameDisplay) {
            // Check localStorage profile FIRST (instant, no waiting)
            if (profile && profile.full_name) {
                displayName = profile.full_name;
            } else if (currentUser) {
                // Fallback to user metadata or email
                displayName = currentUser.user_metadata?.full_name || 
                             currentUser.email?.split('@')[0] || 
                             'User';
            }
            
            // Set name IMMEDIATELY (from localStorage if available)
            userNameDisplay.textContent = displayName;
        }
        
        // Update avatar
        if (userAvatar && currentUser) {
            const avatarUrl = profile?.avatar_url || currentUser.user_metadata?.avatar_url;
            if (avatarUrl) {
                userAvatar.innerHTML = `<img src="${avatarUrl}" alt="Avatar" style="width: 100%; height: 100%; object-fit: cover;">`;
            } else {
                // Show first letter of name
                const firstLetter = (profile?.full_name || currentUser.email || 'U')[0].toUpperCase();
                userAvatar.innerHTML = firstLetter;
                userAvatar.style.display = 'flex';
                userAvatar.style.alignItems = 'center';
                userAvatar.style.justifyContent = 'center';
            }
        }
    } else {
        // User is not logged in - SHOW login button, HIDE user menu
        if (loginBtn) {
            loginBtn.style.display = 'flex';
            loginBtn.style.visibility = 'visible';
            loginBtn.style.opacity = '1';
            loginBtn.removeAttribute('aria-hidden');
            // Login button shown (user not logged in)
        }
        
        if (userMenu) {
            userMenu.style.display = 'none';
            userMenu.classList.remove('active');
        }
        
        if (userMenuTrigger) {
            userMenuTrigger.style.display = 'none';
            userMenuTrigger.style.visibility = 'hidden';
            userMenuTrigger.classList.remove('active');
            // User menu trigger hidden
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuth);
} else {
    initAuth();
}

/**
 * Update user email in auth.users
 * @param {string} newEmail - New email address
 * @returns {Promise<{error: object}>}
 */
async function updateUserEmail(newEmail) {
    try {
        const supabase = await getSupabaseClient();
        if (!supabase) {
            return { error: { message: 'Supabase client not initialized' } };
        }

        const { user, error: userError } = await getCurrentUser();
        if (userError || !user) {
            return { error: userError || { message: 'Not authenticated' } };
        }

        // Update email in auth.users
        const { data, error } = await supabase.auth.updateUser({
            email: newEmail.trim()
        });

        if (error) {
            // Provide more detailed error message
            let errorMessage = error.message || 'Failed to update email';
            if (error.message && error.message.toLowerCase().includes('already')) {
                errorMessage = 'This email address is already in use by another account.';
            } else if (error.message && error.message.toLowerCase().includes('invalid')) {
                errorMessage = 'Please enter a valid email address.';
            }
            return { error: { message: errorMessage, ...error } };
        }

        // Note: Supabase may require email confirmation for new email
        // The user will receive a confirmation email if email confirmation is enabled
        // Even if confirmation is disabled, the update should work
        
        return { error: null };
    } catch (error) {
        return { error: { message: error.message || 'Failed to update email' } };
    }
}

// Export functions to window for global access
window.auth = {
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    signOut,
    getCurrentUser,
    getSession,
    getUserProfile,
    updateUserProfile,
    updateUserEmail,
    onAuthStateChange,
    getCachedProfile,
    updateAuthUI,
    initAuth
};

