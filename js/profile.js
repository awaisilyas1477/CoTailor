// ============================================================================
// PROFILE PAGE - User Profile Management
// ============================================================================

// Check if user is logged in
async function checkAuthAndLoadProfile() {
    // Try to load from localStorage FIRST (synchronously, no waiting)
    const form = document.getElementById('profileForm');
    if (!form) {
        setTimeout(checkAuthAndLoadProfile, 100);
        return;
    }
    
    try {
        const cached = localStorage.getItem('userProfile');
        if (cached) {
            const cachedProfile = JSON.parse(cached);
            if (cachedProfile && cachedProfile.id) {
                // Fill form IMMEDIATELY from localStorage - no waiting!
                fillProfileForm(cachedProfile);
                // Still check auth in background and refresh if needed
            }
        }
    } catch (error) {
        // Ignore errors, continue with auth check
    }
    
    // Then check auth (for redirect if needed)
    if (!window.auth || typeof window.auth.getCurrentUser !== 'function') {
        // Wait a bit for auth to load
        setTimeout(checkAuthAndLoadProfile, 200);
        return;
    }

    const { user } = await window.auth.getCurrentUser();
    if (!user) {
        // Redirect to home if not logged in
        window.location.href = 'index.html';
        return;
    }
    // Load profile data (will use cache if available, or fetch if missing)
    await loadProfileData();
}

// Load profile data into form
async function loadProfileData() {
    // Wait for form to be ready
    const form = document.getElementById('profileForm');
    if (!form) {
        // Retry after a short delay if form not ready
        setTimeout(loadProfileData, 100);
        return;
    }
    
    // READ DIRECTLY FROM localStorage FIRST - NO WAITING FOR window.auth
    let cachedProfile = null;
    try {
        const cached = localStorage.getItem('userProfile');
        if (cached) {
            cachedProfile = JSON.parse(cached);
        }
    } catch (error) {
        // Ignore localStorage errors
    }
    
    // If cache exists, show data INSTANTLY - no waiting, no API call
    if (cachedProfile && cachedProfile.id) {
        fillProfileForm(cachedProfile);
        // Data is shown immediately - done!
        return;
    }
    
    // Only if cache is missing - wait for auth and fetch from API
    if (!window.auth || typeof window.auth.getUserProfile !== 'function') {
        // Wait a bit for auth to load
        setTimeout(loadProfileData, 200);
        return;
    }
    
    // Show loading state only if we need to fetch from API
    if (form) {
        form.style.opacity = '0.5';
        form.style.pointerEvents = 'none';
    }
    
    // Fetch profile from API only if cache is missing
    try {
        const { profile, error } = await window.auth.getUserProfile();
        
        if (error) {
            showProfileMessage('error', 'Failed to load profile: ' + (error.message || 'Unknown error'));
            if (form) {
                form.style.opacity = '1';
                form.style.pointerEvents = 'auto';
            }
            return;
        }

        if (!profile) {
            showProfileMessage('error', 'Profile not found. Please contact support.');
            if (form) {
                form.style.opacity = '1';
                form.style.pointerEvents = 'auto';
            }
            return;
        }

        // Fill form with fresh data (this also updates cache automatically)
        fillProfileForm(profile);
    } catch (error) {
        showProfileMessage('error', 'Failed to load profile data.');
    }
    
    // Always re-enable form
    if (form) {
        form.style.opacity = '1';
        form.style.pointerEvents = 'auto';
    }
}

// Helper function to fill profile form
function fillProfileForm(profile) {
    if (!profile) {
        return;
    }
    
    // Fill all form fields with profile data (check if element exists first)
    const fullNameInput = document.getElementById('profileFullName');
    const emailInput = document.getElementById('profileEmail');
    const phoneInput = document.getElementById('profilePhone');
    const dateOfBirthInput = document.getElementById('profileDateOfBirth');
    const genderInput = document.getElementById('profileGender');
    const languageInput = document.getElementById('profileLanguage');
    const emailNotificationsInput = document.getElementById('profileEmailNotifications');
    const smsNotificationsInput = document.getElementById('profileSmsNotifications');
    const avatarUrlInput = document.getElementById('avatarUrl');
    
    // Fill name first
    if (fullNameInput) {
        fullNameInput.value = profile.full_name || '';
    }
    
    // Fill email - set readonly and get from profile first (synchronous)
    if (emailInput) {
        emailInput.setAttribute('readonly', 'readonly');
        // Set email from profile first (synchronous, instant)
        if (profile.email) {
            emailInput.value = profile.email;
        }
        
        // Then try to update from user object if available (async, non-blocking)
        if (window.auth && typeof window.auth.getCurrentUser === 'function') {
            window.auth.getCurrentUser().then(({ user }) => {
                if (user && user.email && emailInput) {
                    emailInput.value = user.email;
                }
            }).catch(() => {
                // Ignore errors, keep profile email
            });
        }
    }
    
    // Handle phone number - remove +92 prefix if present
    if (phoneInput) {
        let phoneNumber = profile.phone_number || '';
        if (phoneNumber) {
            phoneNumber = phoneNumber.replace(/^\+92/, '').replace(/\s+/g, '');
        }
        phoneInput.value = phoneNumber;
    }
    
    if (dateOfBirthInput) {
        // Format date for input (YYYY-MM-DD)
        if (profile.date_of_birth) {
            try {
                const date = new Date(profile.date_of_birth);
                if (!isNaN(date.getTime())) {
                    const formattedDate = date.toISOString().split('T')[0];
                    dateOfBirthInput.value = formattedDate;
                } else {
                    dateOfBirthInput.value = '';
                }
            } catch (e) {
                dateOfBirthInput.value = '';
            }
        } else {
            dateOfBirthInput.value = '';
        }
    }
    
    if (genderInput) {
        genderInput.value = profile.gender || '';
    }
    
    if (languageInput) {
        languageInput.value = profile.preferred_language || 'en';
    }
    
    if (emailNotificationsInput) {
        emailNotificationsInput.checked = profile.email_notifications !== false;
    }
    
    if (smsNotificationsInput) {
        smsNotificationsInput.checked = profile.sms_notifications === true;
    }
    
    if (avatarUrlInput) {
        avatarUrlInput.value = profile.avatar_url || '';
    }

    // Update avatar preview - ensure it's called after form is filled
    // Use setTimeout to ensure DOM is ready and name field is populated
    setTimeout(() => {
        // Debug: Check if avatar_url exists
        if (profile.avatar_url) {
        }
        updateAvatarPreview(profile.avatar_url);
    }, 100);
}

// Update avatar preview
function updateAvatarPreview(avatarUrl) {
    const avatarPreview = document.getElementById('avatarPreview');
    if (!avatarPreview) {
        // Retry if element not ready
        setTimeout(() => updateAvatarPreview(avatarUrl), 100);
        return;
    }

    if (avatarUrl && avatarUrl.trim() !== '') {
        // Create img element with proper styling
        const img = document.createElement('img');
        img.src = avatarUrl;
        img.alt = 'Profile Picture';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '50%';
        img.style.display = 'block';
        img.onerror = function() {
            // If image fails to load, show first letter or icon
            const nameInput = document.getElementById('profileFullName');
            const nameValue = nameInput ? nameInput.value : '';
            if (nameValue) {
                avatarPreview.innerHTML = nameValue.charAt(0).toUpperCase();
            } else {
                avatarPreview.innerHTML = '<i class="fas fa-user"></i>';
            }
        };
        avatarPreview.innerHTML = '';
        avatarPreview.appendChild(img);
    } else {
        // Get first letter of name
        const nameInput = document.getElementById('profileFullName');
        const name = nameInput ? nameInput.value : '';
        const firstLetter = name ? name.charAt(0).toUpperCase() : 'U';
        avatarPreview.innerHTML = firstLetter;
    }
}

// Format phone number (Pakistan - 10 digits)
function formatPhoneNumber(input) {
    if (!input) return;
    
    // Remove all non-digits
    let value = input.value.replace(/\D/g, '');
    
    // Limit to 10 digits
    if (value.length > 10) {
        value = value.substring(0, 10);
    }
    
    input.value = value;
    
    // Validate and show error
    const phoneError = document.getElementById('profilePhoneError');
    if (value.length > 0 && value.length !== 10) {
        if (phoneError) {
            phoneError.textContent = 'Please enter a valid 10-digit phone number (e.g., 3034651965)';
            phoneError.style.display = 'block';
        }
        input.setCustomValidity('Please enter a valid 10-digit phone number');
    } else {
        if (phoneError) {
            phoneError.style.display = 'none';
        }
        input.setCustomValidity('');
    }
}

// Get full phone number with country code
function getFullPhoneNumber(input) {
    if (!input) return '';
    const phone = input.value.replace(/\D/g, '');
    if (phone.length === 10) {
        return '+92' + phone;
    }
    return phone ? '+92' + phone : '';
}

// Handle avatar URL input
document.addEventListener('DOMContentLoaded', function() {
    const avatarUrlInput = document.getElementById('avatarUrl');
    if (avatarUrlInput) {
        avatarUrlInput.addEventListener('input', function() {
            updateAvatarPreview(this.value);
        });
    }

    const fullNameInput = document.getElementById('profileFullName');
    if (fullNameInput) {
        fullNameInput.addEventListener('input', function() {
            // Update avatar preview with first letter if no URL
            if (!document.getElementById('avatarUrl').value) {
                const firstLetter = this.value.charAt(0).toUpperCase() || 'U';
                const avatarPreview = document.getElementById('avatarPreview');
                if (avatarPreview && !avatarPreview.querySelector('img')) {
                    avatarPreview.innerHTML = firstLetter;
                }
            }
        });
    }

    // Phone number formatting
    const phoneInput = document.getElementById('profilePhone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            formatPhoneNumber(this);
        });
        
        phoneInput.addEventListener('blur', function() {
            formatPhoneNumber(this);
        });
        
        // Reset border color on focus
        phoneInput.addEventListener('focus', function() {
            const wrapper = this.closest('.phone-input-wrapper');
            if (wrapper) {
                wrapper.style.borderColor = '';
            }
        });
    }
});

// Handle form submission
async function handleProfileSubmit(e) {
    e.preventDefault();

    if (!window.auth || typeof window.auth.updateUserProfile !== 'function') {
        showProfileMessage('error', 'Authentication system not loaded. Please refresh the page.');
        return;
    }

    const submitBtn = document.getElementById('saveProfileBtn');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

    try {
        // Collect form data
        // Email cannot be changed - get from user object
        const { user } = await window.auth.getCurrentUser();
        const originalEmail = user ? user.email : null;
        
        const phoneInput = document.getElementById('profilePhone');
        const phoneNumber = phoneInput ? getFullPhoneNumber(phoneInput) : null;
        
        const profileData = {
            full_name: document.getElementById('profileFullName').value.trim(),
            email: originalEmail, // Use original email (cannot be changed)
            phone_number: phoneNumber || null,
            date_of_birth: document.getElementById('profileDateOfBirth').value || null,
            gender: document.getElementById('profileGender').value || null,
            preferred_language: document.getElementById('profileLanguage').value || 'en',
            email_notifications: document.getElementById('profileEmailNotifications').checked,
            sms_notifications: document.getElementById('profileSmsNotifications').checked,
            avatar_url: document.getElementById('avatarUrl').value.trim() || null
        };

        // Validate required fields
        if (!profileData.full_name) {
            showProfileMessage('error', 'Full name is required.');
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
            submitBtn.innerHTML = originalText;
            return;
        }

        if (!originalEmail || !originalEmail.includes('@')) {
            showProfileMessage('error', 'Email address is required. Please contact support if you need to change your email.');
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
            submitBtn.innerHTML = originalText;
            return;
        }

        // Email is already set from user object above (line 410)
        // Ensure email field shows the original email (cannot be changed)
        if (user && user.email) {
            const emailInput = document.getElementById('profileEmail');
            if (emailInput && emailInput.value !== user.email) {
                emailInput.value = user.email;
            }
            // Use original email for profile update (already set in profileData.email)
            profileData.email = user.email;
        }

        // Update profile
        const { profile, error } = await window.auth.updateUserProfile(profileData);

        if (error) {
            showProfileMessage('error', 'Failed to update profile: ' + (error.message || 'Unknown error'));
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
            submitBtn.innerHTML = originalText;
            return;
        }

        // Success
        showProfileMessage('success', 'Profile updated successfully!');
        
        // Update avatar preview
        setTimeout(() => {
            updateAvatarPreview(profileData.avatar_url);
        }, 50);

        // Update header name immediately (without page reload)
        if (window.auth && typeof window.auth.updateAuthUI === 'function') {
            await window.auth.updateAuthUI();
        }
        
        // Update cached profile immediately so next page load is instant
        if (window.auth && typeof window.auth.getCachedProfile === 'function') {
            // Cache is already updated by updateUserProfile, but ensure it's fresh
            const updatedProfile = window.auth.getCachedProfile();
            if (updatedProfile && profile) {
                // Merge updated data
                Object.assign(updatedProfile, profile);
                localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
            }
        }

        // Scroll to top to show message
        window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error) {
        showProfileMessage('error', 'An error occurred while updating your profile.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        submitBtn.innerHTML = originalText;
    }
}

// Show profile message
function showProfileMessage(type, message) {
    const messageDiv = document.getElementById('profileMessage');
    if (!messageDiv) return;

    messageDiv.className = `profile-message ${type}`;
    messageDiv.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    messageDiv.style.display = 'flex';

    // Auto-hide after 5 seconds
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}

// Initialize when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        checkAuthAndLoadProfile();
        
        // Set up form handler
        const profileForm = document.getElementById('profileForm');
        if (profileForm) {
            profileForm.addEventListener('submit', handleProfileSubmit);
        }
    });
} else {
    checkAuthAndLoadProfile();
    
    // Set up form handler
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileSubmit);
    }
}

