/**
 * Global Auth Initialization
 * This script ensures auth works on ALL pages, not just index.html
 * Include this script on every page that needs authentication
 */

(function() {
    'use strict';
    
    // Set ALL user information from localStorage IMMEDIATELY (synchronous, before any async operations)
    function setUserInfoFromLocalStorage() {
        try {
            const cached = localStorage.getItem('userProfile');
            if (cached) {
                const profile = JSON.parse(cached);
                if (profile) {
                    // Try to set all user info immediately (retry if elements not ready)
                    function trySetUserInfo() {
                        // Set user name in header
                        const userNameDisplay = document.getElementById('authUserName');
                        if (userNameDisplay && profile.full_name) {
                            userNameDisplay.textContent = profile.full_name;
                        }
                        
                        // Set user avatar in header
                        const userAvatar = document.getElementById('authUserAvatar');
                        if (userAvatar) {
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
                        
                        // Show user menu if profile exists (user is logged in)
                        const userMenuTrigger = document.getElementById('authUserMenuTrigger');
                        const loginBtn = document.getElementById('authLoginBtn');
                        if (profile.id) {
                            // User is logged in - show menu, hide login button
                            if (userMenuTrigger) {
                                userMenuTrigger.style.display = 'flex';
                                userMenuTrigger.style.visibility = 'visible';
                            }
                            if (loginBtn) {
                                loginBtn.style.display = 'none';
                                loginBtn.style.visibility = 'hidden';
                                loginBtn.style.opacity = '0';
                                loginBtn.setAttribute('aria-hidden', 'true');
                            }
                        }
                        
                        // If elements not ready yet, retry
                        if (!userNameDisplay && !userAvatar) {
                            setTimeout(trySetUserInfo, 50);
                        }
                    }
                    
                    // Try immediately
                    trySetUserInfo();
                    
                    // Also try when DOM is ready
                    if (document.readyState === 'loading') {
                        document.addEventListener('DOMContentLoaded', trySetUserInfo);
                    } else {
                        // DOM already ready, try again
                        setTimeout(trySetUserInfo, 50);
                    }
                    
                    // Also try after page loads (for dynamically loaded header)
                    window.addEventListener('load', function() {
                        setTimeout(trySetUserInfo, 100);
                    });
                    
                    // Keep trying periodically until elements are found (max 5 seconds)
                    let retryCount = 0;
                    const maxRetries = 100;
                    let retryInterval = null;
                    
                    // Only create interval if elements don't exist
                    const userNameDisplay = document.getElementById('authUserName');
                    const userAvatar = document.getElementById('authUserAvatar');
                    if (!userNameDisplay || !userAvatar || (userNameDisplay && userNameDisplay.textContent !== profile.full_name)) {
                        retryInterval = setInterval(function() {
                            try {
                                retryCount++;
                                const userNameDisplay = document.getElementById('authUserName');
                                const userAvatar = document.getElementById('authUserAvatar');
                                
                                // Clear interval if condition met or max retries reached
                                if ((userNameDisplay && userNameDisplay.textContent === profile.full_name) || retryCount >= maxRetries) {
                                    if (retryInterval) {
                                        clearInterval(retryInterval);
                                        retryInterval = null;
                                    }
                                } else {
                                    trySetUserInfo();
                                }
                            } catch (error) {
                                // On error, clear interval to prevent infinite loop
                                if (retryInterval) {
                                    clearInterval(retryInterval);
                                    retryInterval = null;
                                }
                            }
                        }, 50);
                    }
                }
            }
        } catch (error) {
            // Ignore errors
        }
    }
    
    // Set ALL user info immediately when script loads (before DOM ready, before any async operations)
    setUserInfoFromLocalStorage();
    
    let initAttempts = 0;
    const maxAttempts = 50; // Try for 5 seconds
    
    // Wait for DOM to be ready
    function initAuthOnPage() {
        initAttempts++;
        
        // Wait for auth scripts to load
        if (!window.auth || !window.authUI) {
            if (initAttempts < maxAttempts) {
                setTimeout(initAuthOnPage, 100);
            } else {
            }
            return;
        }
        
        
        // Initialize auth UI
        if (window.authUI && typeof window.authUI.initAuthUI === 'function') {
            try {
                window.authUI.initAuthUI();
            } catch (e) {
            }
        }
        
        // Initialize auth system
        if (window.auth && typeof window.auth.initAuth === 'function') {
            try {
                window.auth.initAuth().then(() => {
                    // Update UI after auth is initialized
                    if (window.auth && typeof window.auth.updateAuthUI === 'function') {
                        window.auth.updateAuthUI();
                    }
                }).catch(e => {
                });
            } catch (e) {
            }
        }
        
        // Also update UI immediately (in case auth is already initialized)
        if (window.auth && typeof window.auth.updateAuthUI === 'function') {
            setTimeout(() => {
                window.auth.updateAuthUI();
            }, 500);
        }
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAuthOnPage);
    } else {
        // DOM already loaded
        initAuthOnPage();
    }
    
    // Also initialize after page fully loads (for dynamically loaded content like header)
    window.addEventListener('load', function() {
        setTimeout(() => {
            initAuthOnPage();
            // Also check periodically for header elements
            let checkCount = 0;
            const checkInterval = setInterval(() => {
                checkCount++;
                const loginBtn = document.getElementById('authLoginBtn');
                if (loginBtn || checkCount > 20) {
                    clearInterval(checkInterval);
                    if (window.auth && typeof window.auth.updateAuthUI === 'function') {
                        window.auth.updateAuthUI();
                    }
                }
            }, 200);
        }, 1000);
    });
})();

