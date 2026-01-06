// ============================================================================
// AUTHENTICATION UI HANDLER
// ============================================================================
// Handles all UI interactions for authentication (modals, forms, etc.)
// ============================================================================

// Wait for auth.js to be loaded
let authUIInitialized = false;

function initAuthUI() {
    if (authUIInitialized) return;
    
    // Wait a bit for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(doInitAuthUI, 200);
        });
    } else {
        setTimeout(doInitAuthUI, 200);
    }
}

function doInitAuthUI() {
    if (authUIInitialized) return;
    authUIInitialized = true;

    // Preload auth modal HTML immediately
    loadAuthModal();

    // Set up event listeners
    setupAuthEventListeners();

    // Handle OAuth callback
    handleOAuthCallback();
    
    // Initialize auth system
    if (window.auth && window.auth.initAuth) {
        window.auth.initAuth();
    } else {
        // Retry after a delay if auth not ready
        setTimeout(() => {
            if (window.auth && window.auth.initAuth) {
                window.auth.initAuth();
            }
        }, 500);
    }
    
    // Update UI state immediately
    if (window.auth && window.auth.updateAuthUI) {
        window.auth.updateAuthUI();
    }
    
    // Test: Log that initialization is complete
    // Auth UI initialized
}

// Load auth modal HTML
function loadAuthModal() {
    // Check if modal already exists
    if (document.getElementById('authModal')) {
        // Auth modal already loaded
        setupAuthModalEvents(); // Make sure events are set up
        return;
    }

    // Loading auth-modal.html
    // Load modal HTML
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'auth-modal.html', true);
    xhr.onreadystatechange = function() {
        if (this.readyState === 4) {
            if (this.status === 200) {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = this.responseText;
                const modal = tempDiv.querySelector('#authModal');
                if (modal) {
                    document.body.appendChild(modal);
                    setupAuthModalEvents();
                    setupAuthFormHandlers();
                    // Auth modal loaded successfully
                } else {
                    // Auth modal element not found in loaded HTML
                }
            } else {
                // Failed to load auth-modal.html
            }
        }
    };
    xhr.onerror = function() {
        // Network error loading auth-modal.html
    };
    xhr.send();
}

// Set up auth modal events
function setupAuthModalEvents() {
    const modal = document.getElementById('authModal');
    const overlay = document.getElementById('authModalOverlay');
    const closeBtn = document.getElementById('authModalClose');
    const loginTab = document.getElementById('authLoginTab');
    const signupTab = document.getElementById('authSignupTab');
    const switchToSignup = document.getElementById('authSwitchToSignup');
    const switchToLogin = document.getElementById('authSwitchToLogin');

    // Close modal
    function closeModal() {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    if (overlay) {
        overlay.addEventListener('click', closeModal);
    }

    // Switch between login and signup
    if (switchToSignup) {
        switchToSignup.addEventListener('click', (e) => {
            e.preventDefault();
            if (loginTab) loginTab.classList.remove('active');
            if (signupTab) signupTab.classList.add('active');
        });
    }

    if (switchToLogin) {
        switchToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            if (signupTab) signupTab.classList.remove('active');
            if (loginTab) loginTab.classList.add('active');
        });
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

// Track if menu listeners are already set up
let menuListenersSetup = false;

// Set up all auth event listeners
function setupAuthEventListeners() {
    // Setting up auth event listeners
    
    // Use event delegation for login button (works even if header loads after)
    document.addEventListener('click', function(e) {
        const loginBtn = e.target.closest('#authLoginBtn');
        if (loginBtn) {
            e.preventDefault();
            e.stopPropagation();
            // Login button clicked via event delegation
            openAuthModal('login');
            return false;
        }
    }, true); // Use capture phase
    
    // Also set up direct listener if button exists (for immediate response)
    const loginBtn = document.getElementById('authLoginBtn');
    if (loginBtn) {
        // Direct listener attached to login button
        // Remove any existing listeners first by cloning
        const newBtn = loginBtn.cloneNode(true);
        loginBtn.parentNode.replaceChild(newBtn, loginBtn);
        
        // Add fresh listener
        const freshBtn = document.getElementById('authLoginBtn');
        freshBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            // Login button clicked (direct listener)
            openAuthModal('login');
            return false;
        });
    } else {
        // Login button not found yet, using event delegation only
        // Try again after a delay
        setTimeout(function() {
            const retryBtn = document.getElementById('authLoginBtn');
            if (retryBtn) {
                // Login button found on retry, attaching listener
                retryBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // Login button clicked (retry listener)
                    openAuthModal('login');
                    return false;
                });
            }
        }, 500);
    }

    // User menu trigger - prevent duplicate listeners
    if (!menuListenersSetup) {
        const userMenuTrigger = document.getElementById('authUserMenuTrigger');
        const userMenu = document.getElementById('authUserMenu');
        
        if (userMenuTrigger && userMenu) {
            menuListenersSetup = true;
            
            // Remove any existing listeners by cloning
            const newTrigger = userMenuTrigger.cloneNode(true);
            userMenuTrigger.parentNode.replaceChild(newTrigger, userMenuTrigger);
            const trigger = document.getElementById('authUserMenuTrigger');
            const menu = document.getElementById('authUserMenu');
            
            // Flag to track if trigger was just clicked
            let triggerJustClicked = false;
            let menuToggleTime = 0;
            
            // Simple toggle function
            function toggleMenu() {
                const isOpen = trigger.classList.contains('active');
                
                if (isOpen) {
                    // Close menu
                    trigger.classList.remove('active');
                    menu.classList.remove('active');
                    // Remove inline style to let CSS handle it
                    menu.style.removeProperty('display');
                } else {
                    // Open menu - add class first, CSS will handle display via !important
                    trigger.classList.add('active');
                    menu.classList.add('active');
                    // Remove any inline display:none that might be set by updateAuthUI
                    menu.style.removeProperty('display');
                }
            }
            
            // Attach click listener to trigger
            trigger.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                
                // Set flag and timestamp to prevent document click from closing immediately
                triggerJustClicked = true;
                menuToggleTime = Date.now();
                
                // Toggle menu using requestAnimationFrame to ensure DOM update happens
                requestAnimationFrame(() => {
                    toggleMenu();
                    
                    // Reset flag after DOM update and a small delay
                    setTimeout(() => {
                        triggerJustClicked = false;
                        menuToggleTime = 0;
                    }, 150);
                });
            }, true); // Capture phase - runs first

            // Close menu when clicking outside - check if click is NOT on trigger or menu
            document.addEventListener('click', function(e) {
                // Skip if trigger was just clicked (within 200ms) to prevent immediate closing
                if (triggerJustClicked || (menuToggleTime > 0 && Date.now() - menuToggleTime < 200)) {
                    return;
                }
                
                // If click is on trigger or menu, don't close
                if (trigger && menu && (trigger.contains(e.target) || menu.contains(e.target))) {
                    return;
                }
                
                // Click is outside - close menu if open
                if (trigger && trigger.classList.contains('active')) {
                    trigger.classList.remove('active');
                    if (menu) {
                        menu.classList.remove('active');
                        menu.style.display = 'none';
                    }
                }
            }, false); // Bubble phase - runs after capture phase
        }
    }

    // Logout button
    const logoutBtn = document.getElementById('authLogoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }


    // View profile
    const viewProfileBtn = document.getElementById('authViewProfile');
    if (viewProfileBtn) {
        viewProfileBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Close user menu
            const userMenu = document.getElementById('authUserMenu');
            if (userMenu) {
                userMenu.style.display = 'none';
                userMenu.classList.remove('active');
            }
            const userMenuTrigger = document.getElementById('authUserMenuTrigger');
            if (userMenuTrigger) {
                userMenuTrigger.classList.remove('active');
            }
            // Navigate to profile page
            window.location.href = 'profile.html';
        });
    }

    // Order history
    const orderHistoryBtn = document.getElementById('authOrderHistory');
    if (orderHistoryBtn) {
        orderHistoryBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Navigate to order history page
            window.location.href = 'orderHistory.html';
        });
    }

    // Set up form handlers (will be called after modal loads)
    setupAuthFormHandlers();
}

// Set up form event handlers (separate function so it can be called after modal loads)
function setupAuthFormHandlers() {
    // Login form submission
    const loginForm = document.getElementById('authLoginForm');
    if (loginForm && !loginForm.hasAttribute('data-handler-attached')) {
        loginForm.setAttribute('data-handler-attached', 'true');
        loginForm.addEventListener('submit', handleLoginSubmit);
    }

    // Signup form submission
    const signupForm = document.getElementById('authSignupForm');
    if (signupForm && !signupForm.hasAttribute('data-handler-attached')) {
        signupForm.setAttribute('data-handler-attached', 'true');
        signupForm.addEventListener('submit', handleSignupSubmit);
    }

    // Google login buttons
    const googleLoginBtn = document.getElementById('authGoogleLoginBtn');
    const googleSignupBtn = document.getElementById('authGoogleSignupBtn');
    
    if (googleLoginBtn && !googleLoginBtn.hasAttribute('data-handler-attached')) {
        googleLoginBtn.setAttribute('data-handler-attached', 'true');
        googleLoginBtn.addEventListener('click', handleGoogleLogin);
    }
    
    if (googleSignupBtn && !googleSignupBtn.hasAttribute('data-handler-attached')) {
        googleSignupBtn.setAttribute('data-handler-attached', 'true');
        googleSignupBtn.addEventListener('click', handleGoogleLogin);
    }
}

// Open auth modal
function openAuthModal(tab = 'login') {
    let modal = document.getElementById('authModal');
    
    // If modal doesn't exist, load it first
    if (!modal) {
        // Loading auth modal
        loadAuthModal();
        // Wait for modal to load, then try again
        let attempts = 0;
        const checkModal = setInterval(() => {
            attempts++;
            modal = document.getElementById('authModal');
            if (modal) {
                clearInterval(checkModal);
                openAuthModal(tab); // Retry opening
            } else if (attempts > 30) {
                clearInterval(checkModal);
                // Failed to load auth modal after 3 seconds
                alert('Failed to load login form. Please refresh the page.');
            }
        }, 100);
        return;
    }

    const loginTab = document.getElementById('authLoginTab');
    const signupTab = document.getElementById('authSignupTab');

    // Opening auth modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Clear previous errors
    clearAuthMessages();

    // Switch to appropriate tab
    if (tab === 'signup') {
        if (loginTab) loginTab.classList.remove('active');
        if (signupTab) signupTab.classList.add('active');
    } else {
        if (signupTab) signupTab.classList.remove('active');
        if (loginTab) loginTab.classList.add('active');
    }
    
    // Make sure form handlers are set up
    setupAuthFormHandlers();
}

// Close auth modal
function closeAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Handle login form submission
async function handleLoginSubmit(e) {
    e.preventDefault();

    const email = document.getElementById('authLoginEmail').value.trim();
    const password = document.getElementById('authLoginPassword').value;
    const submitBtn = document.getElementById('authLoginSubmitBtn');
    const spinner = document.getElementById('authLoginSpinner');
    const errorDiv = document.getElementById('authLoginError');

    if (!email || !password) {
        showAuthError('login', 'Please fill in all fields');
        return;
    }
    
    // Validate email format
    if (!email.includes('@') || !email.includes('.')) {
        showAuthError('login', 'Please enter a valid email address');
        return;
    }
    
    if (password.length < 6) {
        showAuthError('login', 'Password must be at least 6 characters');
        return;
    }

    // Show loading state
    if (submitBtn) {
        submitBtn.disabled = true;
        if (spinner) spinner.style.display = 'inline-block';
    }

    clearAuthMessages('login');

    // Sign in
    if (window.auth && window.auth.signInWithEmail) {
        const { user, error } = await window.auth.signInWithEmail(email, password);

        if (error) {
            let errorMessage = error.message || 'Invalid email or password';
            
            // Provide helpful messages for common errors
            if (error.status === 400 || error.message) {
                const errorMsg = error.message.toLowerCase();
                
                if (errorMsg.includes('invalid login') || errorMsg.includes('invalid credentials')) {
                    errorMessage = 'Invalid email or password. Please check your credentials and try again.';
                } else if (errorMsg.includes('email') && (errorMsg.includes('confirm') || errorMsg.includes('verified') || errorMsg.includes('not confirmed'))) {
                    errorMessage = 'Email not confirmed. This account was created before email confirmation was disabled. Please contact support to confirm your email, or sign up with a different email address.';
                } else if (errorMsg.includes('user not found') || errorMsg.includes('no user found')) {
                    errorMessage = 'No account found with this email. Please sign up first or check your email address.';
                } else if (errorMsg.includes('wrong password') || errorMsg.includes('incorrect password')) {
                    errorMessage = 'Incorrect password. Please try again or use "Forgot password" to reset it.';
                } else {
                    // Show the actual error message from Supabase
                    errorMessage = error.message || 'Sign in failed. Please try again.';
                }
            }
            
            // Sign in error
            showAuthError('login', errorMessage);
        } else if (user) {
            showAuthSuccess('login', 'Successfully signed in!');
            setTimeout(async () => {
                closeAuthModal();
                // Sync cookie cart to database if user has items in cookies
                if (window.userCart && typeof window.userCart.syncCookieCartToDatabase === 'function') {
                    await window.userCart.syncCookieCartToDatabase();
                }
                
                // INSTANT: Fetch cart from database and save to localStorage for instant checkout
                if (window.userCart && typeof window.userCart.getUserCart === 'function') {
                    try {
                        const cartItems = await window.userCart.getUserCart();
                        // Save to localStorage for instant checkout display
                        if (window.userCart && typeof window.userCart.cacheCart === 'function') {
                            window.userCart.cacheCart(cartItems);
                        }
                        // Also update state manager
                        if (window.stateManager) {
                            window.stateManager.setState({
                                cart: cartItems,
                                lastSync: Date.now()
                            }, false);
                        }
                    } catch (error) {
                        // Ignore errors
                    }
                }
                
                // Update UI to hide login button and show user menu
                if (window.auth && window.auth.updateAuthUI) {
                    await window.auth.updateAuthUI();
                    // UI updated after login
                }
                
                // Redirect to home page
                window.location.href = 'index.html';
            }, 1000);
        }
    } else {
        // window.auth not available
        showAuthError('login', 'Authentication system is loading. Please wait a moment and try again.');
        // Retry after a short delay
        setTimeout(() => {
            if (window.auth && window.auth.signInWithEmail) {
                // Auth system now available
            }
        }, 2000);
    }

    // Reset loading state
    if (submitBtn) {
        submitBtn.disabled = false;
        if (spinner) spinner.style.display = 'none';
    }
}

// Handle signup form submission
async function handleSignupSubmit(e) {
    e.preventDefault();

    const fullName = document.getElementById('authSignupName').value.trim();
    const email = document.getElementById('authSignupEmail').value.trim();
    const password = document.getElementById('authSignupPassword').value;
    const passwordConfirm = document.getElementById('authSignupPasswordConfirm').value;
    const submitBtn = document.getElementById('authSignupSubmitBtn');
    const spinner = document.getElementById('authSignupSpinner');
    const errorDiv = document.getElementById('authSignupError');

    // Validation
    if (!fullName || !email || !password || !passwordConfirm) {
        showAuthError('signup', 'Please fill in all fields');
        return;
    }

    if (password.length < 6) {
        showAuthError('signup', 'Password must be at least 6 characters');
        return;
    }

    if (password !== passwordConfirm) {
        showAuthError('signup', 'Passwords do not match');
        return;
    }

    // Show loading state
    if (submitBtn) {
        submitBtn.disabled = true;
        if (spinner) spinner.style.display = 'inline-block';
    }

    clearAuthMessages('signup');

    // Sign up
    if (window.auth && window.auth.signUpWithEmail) {
        const { user, error } = await window.auth.signUpWithEmail(email, password, fullName);

        if (error) {
            // Signup error
            showAuthError('signup', error.message || 'Failed to create account');
        } else if (user) {
            // Signup successful
            
            // Check if user is already signed in (has session)
            const { session } = await window.auth.getSession();
            
            if (session && session.user) {
                // User is signed in automatically
                showAuthSuccess('signup', 'Account created and signed in successfully!');
                // Clear form
                document.getElementById('authSignupForm').reset();
                // Close modal and update UI
                setTimeout(async () => {
                    closeAuthModal();
                    // Sync cookie cart to database if user has items in cookies
                    if (window.userCart && typeof window.userCart.syncCookieCartToDatabase === 'function') {
                        await window.userCart.syncCookieCartToDatabase();
                    }
                    
                    // NO DATABASE CALLS - Only localStorage (NO user_cart table)
                    // Cart is stored in localStorage only
                    
                    if (window.auth && window.auth.updateAuthUI) {
                        await window.auth.updateAuthUI();
                        // UI updated after signup
                    }
                    
                    // Redirect to home page
                    window.location.href = 'index.html';
                }, 1500);
            } else {
                // User created but email not confirmed - needs manual confirmation
                if (!user.email_confirmed_at) {
                    showAuthSuccess('signup', 'Account created! However, your email needs to be confirmed. Please check your email or contact support to confirm your account. You can also try signing in with Google.');
                } else {
                    showAuthSuccess('signup', 'Account created successfully! You can now sign in.');
                }
                // Clear form
                document.getElementById('authSignupForm').reset();
                // Switch to login tab after delay
                setTimeout(() => {
                    const loginTab = document.getElementById('authLoginTab');
                    const signupTab = document.getElementById('authSignupTab');
                    if (signupTab) signupTab.classList.remove('active');
                    if (loginTab) loginTab.classList.add('active');
                    // Pre-fill email in login form
                    const loginEmail = document.getElementById('authLoginEmail');
                    const signupEmail = document.getElementById('authSignupEmail');
                    if (loginEmail && signupEmail) {
                        loginEmail.value = signupEmail.value;
                    }
                }, 2000);
            }
        }
    } else {
        // window.auth not available
        showAuthError('signup', 'Authentication system is loading. Please wait a moment and try again.');
        // Retry after a short delay
        setTimeout(() => {
            if (window.auth && window.auth.signUpWithEmail) {
                // Auth system now available
            }
        }, 2000);
    }

    // Reset loading state
    if (submitBtn) {
        submitBtn.disabled = false;
        if (spinner) spinner.style.display = 'none';
    }
}

// Handle Google login
async function handleGoogleLogin() {
    if (window.auth && window.auth.signInWithGoogle) {
        const { error } = await window.auth.signInWithGoogle();
        if (error) {
            showAuthError('login', error.message || 'Failed to sign in with Google');
        }
        // Note: Google OAuth will redirect, so we don't need to close modal here
    } else {
        // window.auth not available
        showAuthError('login', 'Authentication system is loading. Please wait a moment and try again.');
        // Retry after a short delay
        setTimeout(() => {
            if (window.auth && window.auth.signInWithGoogle) {
                // Auth system now available
            }
        }, 2000);
    }
}

// Handle logout
async function handleLogout() {
    // Logout button clicked
    
    if (window.auth && window.auth.signOut) {
        const { error } = await window.auth.signOut();
        if (error) {
            // Logout error
            alert('Failed to logout: ' + (error.message || 'Unknown error'));
        } else {
            // Logout successful
            
            // Clear all localStorage (cart, addresses, etc. are already cleared in signOut)
            // Additional cleanup if needed
            try {
                // Clear any remaining user-related data
                const keysToRemove = [];
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key && (key.includes('cart') || key.includes('address') || key.includes('user') || key.includes('auth') || key.includes('profile') || key.includes('appState') || key.includes('state'))) {
                        keysToRemove.push(key);
                    }
                }
                keysToRemove.forEach(key => localStorage.removeItem(key));
            } catch (e) {
                // Ignore errors
            }
            
            // Clear cart cache if userCart is available
            if (window.userCart && typeof window.userCart.clearCartCache === 'function') {
                window.userCart.clearCartCache();
            }
            
            // Clear addresses cache if savedAddresses is available
            if (window.savedAddresses && typeof window.savedAddresses.clearAddressesCache === 'function') {
                window.savedAddresses.clearAddressesCache();
            }
            
            // Clear ALL localStorage to ensure clean state
            try {
                localStorage.clear();
            } catch (e) {
                // Ignore errors if clear() fails
            }
            
            // Close user menu
            const userMenu = document.getElementById('authUserMenu');
            const userMenuTrigger = document.getElementById('authUserMenuTrigger');
            if (userMenu) {
                userMenu.classList.remove('active');
                userMenu.style.display = 'none';
            }
            if (userMenuTrigger) {
                userMenuTrigger.classList.remove('active');
                userMenuTrigger.style.display = 'none';
            }
            
            // Show login button
            const loginBtn = document.getElementById('authLoginBtn');
            if (loginBtn) {
                loginBtn.style.display = 'flex';
                // Login button shown after logout
            }
            
            // Update UI
            if (window.auth && window.auth.updateAuthUI) {
                await window.auth.updateAuthUI();
            }
            
            // Update badge counter to 0
            const badge = document.getElementById('badge');
            if (badge) {
                badge.textContent = '0';
            }
            
            // Update global badge counter if available
            if (typeof updateBadgeCounter === 'function') {
                updateBadgeCounter();
            }
            
            // Redirect to home page
            window.location.href = 'index.html';
            
            // Show success message
            // User logged out successfully
        }
    } else {
        // window.auth.signOut not available
        alert('Logout function not available. Please refresh the page.');
    }
}

// Show auth error message
function showAuthError(tab, message) {
    const errorDiv = document.getElementById(`auth${tab.charAt(0).toUpperCase() + tab.slice(1)}Error`);
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        
        // Scroll to error
        errorDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// Show auth success message
function showAuthSuccess(tab, message) {
    const successDiv = document.getElementById(`auth${tab.charAt(0).toUpperCase() + tab.slice(1)}Success`);
    if (successDiv) {
        successDiv.textContent = message;
        successDiv.style.display = 'block';
        // Auto-hide after 5 seconds
        setTimeout(() => {
            if (successDiv) {
                successDiv.style.display = 'none';
            }
        }, 5000);
    }
}

// Clear auth messages
function clearAuthMessages(tab = null) {
    if (tab) {
        const errorDiv = document.getElementById(`auth${tab.charAt(0).toUpperCase() + tab.slice(1)}Error`);
        const successDiv = document.getElementById(`auth${tab.charAt(0).toUpperCase() + tab.slice(1)}Success`);
        if (errorDiv) errorDiv.style.display = 'none';
        if (successDiv) successDiv.style.display = 'none';
    } else {
        // Clear all
        const allErrors = document.querySelectorAll('.auth-error');
        const allSuccess = document.querySelectorAll('.auth-success');
        allErrors.forEach(el => el.style.display = 'none');
        allSuccess.forEach(el => el.style.display = 'none');
    }
}

// Handle OAuth callback
function handleOAuthCallback() {
    // Check if we're returning from OAuth
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');
    
    if (error) {
        // OAuth error
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
    } else if (code || window.location.hash.includes('access_token')) {
        // OAuth callback detected - Supabase will handle it automatically
        // OAuth callback detected, initializing auth
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Wait for session to be established, then initialize and update UI
        setTimeout(async () => {
            if (window.auth) {
                // Initialize auth to set up listeners
                if (window.auth.initAuth) {
                    await window.auth.initAuth();
                }
                // Sync cookie cart to database if user has items in cookies
                if (window.userCart && typeof window.userCart.syncCookieCartToDatabase === 'function') {
                    await window.userCart.syncCookieCartToDatabase();
                }
                
                // INSTANT: Fetch cart from database and save to localStorage for instant checkout
                if (window.userCart && typeof window.userCart.getUserCart === 'function') {
                    try {
                        const cartItems = await window.userCart.getUserCart();
                        // Save to localStorage for instant checkout display
                        if (window.userCart && typeof window.userCart.cacheCart === 'function') {
                            window.userCart.cacheCart(cartItems);
                        }
                        // Also update state manager
                        if (window.stateManager) {
                            window.stateManager.setState({
                                cart: cartItems,
                                lastSync: Date.now()
                            }, false);
                        }
                    } catch (error) {
                        // Ignore errors
                    }
                }
                
                // Update UI
                if (window.auth.updateAuthUI) {
                    await window.auth.updateAuthUI();
                    // UI updated after Google login
                }
                
                // Redirect to home page
                window.location.href = 'index.html';
            }
        }, 1500);
    }
}

// Export functions
window.authUI = {
    openAuthModal,
    closeAuthModal,
    showAuthError,
    showAuthSuccess,
    clearAuthMessages,
    initAuthUI,
    doInitAuthUI
};

// Initialize when DOM is ready (will be called from index.html after page loads)
// This ensures header is loaded first

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(initAuthUI, 300);
    });
} else {
    setTimeout(initAuthUI, 300);
}

