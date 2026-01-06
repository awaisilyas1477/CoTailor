// ============================================================================
// API LAYER - Background sync with error handling and retry logic
// ============================================================================

class APILayer {
    constructor() {
        this.queue = [];
        this.isProcessing = false;
        this.retryAttempts = 3;
        this.retryDelay = 1000;
    }
    
    // Queue an API operation for background sync
    queueOperation(operation) {
        this.queue.push({
            ...operation,
            attempts: 0,
            timestamp: Date.now()
        });
        
        this.processQueue();
    }
    
    // Process queued operations
    async processQueue() {
        if (this.isProcessing || this.queue.length === 0) {
            return;
        }
        
        this.isProcessing = true;
        
        while (this.queue.length > 0) {
            const operation = this.queue.shift();
            
            try {
                await this.executeOperation(operation);
            } catch (error) {
                // Retry if attempts remaining
                if (operation.attempts < this.retryAttempts) {
                    operation.attempts++;
                    this.queue.push(operation);
                    await this.delay(this.retryDelay * operation.attempts);
                } else {
                    // Max retries reached - notify user
                    this.handleOperationError(operation, error);
                }
            }
        }
        
        this.isProcessing = false;
    }
    
    // Execute a single operation
    async executeOperation(operation) {
        switch (operation.type) {
            // Cart operations removed - using localStorage only (NO DATABASE)
            case 'addAddress':
                return await this.addAddressAPI(operation.data);
            case 'updateAddress':
                return await this.updateAddressAPI(operation.data);
            case 'removeAddress':
                return await this.removeAddressAPI(operation.data);
            default:
                throw new Error(`Unknown operation type: ${operation.type}`);
        }
    }
    
    // Cart API operations REMOVED - Using localStorage only (NO DATABASE)
    
    // Address API operations
    async addAddressAPI(addressData) {
        if (!window.savedAddresses) {
            throw new Error('SavedAddresses not available');
        }
        
        const result = await window.savedAddresses.saveAddress(addressData);
        if (result.error) {
            throw result.error;
        }
        
        return result;
    }
    
    async updateAddressAPI({ addressId, addressData }) {
        if (!window.savedAddresses) {
            throw new Error('SavedAddresses not available');
        }
        
        const result = await window.savedAddresses.updateAddress(addressId, addressData);
        if (result.error) {
            throw result.error;
        }
        
        return result;
    }
    
    async removeAddressAPI({ addressId }) {
        if (!window.savedAddresses) {
            throw new Error('SavedAddresses not available');
        }
        
        const result = await window.savedAddresses.deleteAddress(addressId);
        if (result.error) {
            throw result.error;
        }
        
        return result;
    }
    
    // Handle operation errors
    handleOperationError(operation, error) {
        // Rollback optimistic update
        if (window.stateManager) {
            window.stateManager.rollback();
        }
        
        // Show non-blocking toast
        this.showErrorToast(`Failed to ${operation.type}. Please try again.`);
    }
    
    // Show error toast (non-blocking)
    showErrorToast(message) {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: message,
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true
            });
        } else {
            // Fallback to console if SweetAlert not available
            console.error(message);
        }
    }
    
    // Utility: delay
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Create global API layer instance
window.apiLayer = new APILayer();

