// Product Variants Management
// Handles fetching and managing product variants, brands, sizes, and colors

const SUPABASE_BASE_URL = "https://grksptxhbdlbdrlabaew.supabase.co/rest/v1";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdya3NwdHhoYmRsYmRybGFiYWV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyOTI2MDgsImV4cCI6MjA4Mjg2ODYwOH0.TpiilrTDb4ZNbETvl0h4E_LFHZGpcx91_6Nx_dDPbew";

// Cache for brands, sizes, and colors
let brandsCache = null;
let sizesCache = null;
let colorsCache = null;

// =====================================================
// BRANDS
// =====================================================

/**
 * Fetch all active brands
 */
function fetchBrands(callback) {
  if (brandsCache) {
    callback(brandsCache);
    return;
  }

  const url = `${SUPABASE_BASE_URL}/brands?is_active=eq.true&select=id,name,slug,logo_url&order=name.asc`;
  
  const httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = function() {
    if (this.readyState === 4) {
      if (this.status === 200) {
        try {
          brandsCache = JSON.parse(this.responseText);
          callback(brandsCache);
        } catch (error) {
          console.error('[Variants] Error parsing brands:', error);
          callback([]);
        }
      } else {
        console.error('[Variants] Error fetching brands:', this.status);
        callback([]);
      }
    }
  };
  
  httpRequest.open('GET', url, true);
  httpRequest.setRequestHeader('apikey', SUPABASE_ANON_KEY);
  httpRequest.setRequestHeader('Authorization', 'Bearer ' + SUPABASE_ANON_KEY);
  httpRequest.send();
}

/**
 * Get brand name by ID
 */
function getBrandName(brandId, callback) {
  if (!brandId) {
    callback(null);
    return;
  }

  fetchBrands(function(brands) {
    const brand = brands.find(b => b.id === brandId);
    callback(brand ? brand.name : null);
  });
}

// =====================================================
// SIZES
// =====================================================

/**
 * Fetch all active sizes
 */
function fetchSizes(callback) {
  if (sizesCache) {
    callback(sizesCache);
    return;
  }

  const url = `${SUPABASE_BASE_URL}/sizes?is_active=eq.true&select=id,name,display_name,size_type,sort_order&order=size_type.asc,sort_order.asc,name.asc`;
  
  const httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = function() {
    if (this.readyState === 4) {
      if (this.status === 200) {
        try {
          sizesCache = JSON.parse(this.responseText);
          callback(sizesCache);
        } catch (error) {
          console.error('[Variants] Error parsing sizes:', error);
          callback([]);
        }
      } else {
        console.error('[Variants] Error fetching sizes:', this.status);
        callback([]);
      }
    }
  };
  
  httpRequest.open('GET', url, true);
  httpRequest.setRequestHeader('apikey', SUPABASE_ANON_KEY);
  httpRequest.setRequestHeader('Authorization', 'Bearer ' + SUPABASE_ANON_KEY);
  httpRequest.send();
}

/**
 * Get size name by ID
 */
function getSizeName(sizeId, callback) {
  if (!sizeId) {
    callback(null);
    return;
  }

  fetchSizes(function(sizes) {
    const size = sizes.find(s => s.id === sizeId);
    callback(size ? (size.display_name || size.name) : null);
  });
}

// =====================================================
// COLORS
// =====================================================

/**
 * Fetch all active colors
 */
function fetchColors(callback) {
  if (colorsCache) {
    callback(colorsCache);
    return;
  }

  const url = `${SUPABASE_BASE_URL}/colors?is_active=eq.true&select=id,name,hex_code,image_url&order=name.asc`;
  
  const httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = function() {
    if (this.readyState === 4) {
      if (this.status === 200) {
        try {
          colorsCache = JSON.parse(this.responseText);
          callback(colorsCache);
        } catch (error) {
          console.error('[Variants] Error parsing colors:', error);
          callback([]);
        }
      } else {
        console.error('[Variants] Error fetching colors:', this.status);
        callback([]);
      }
    }
  };
  
  httpRequest.open('GET', url, true);
  httpRequest.setRequestHeader('apikey', SUPABASE_ANON_KEY);
  httpRequest.setRequestHeader('Authorization', 'Bearer ' + SUPABASE_ANON_KEY);
  httpRequest.send();
}

/**
 * Get color name by ID
 */
function getColorName(colorId, callback) {
  if (!colorId) {
    callback(null);
    return;
  }

  fetchColors(function(colors) {
    const color = colors.find(c => c.id === colorId);
    callback(color ? color.name : null);
  });
}

// =====================================================
// PRODUCT VARIANTS
// =====================================================

/**
 * Fetch all variants for a product
 */
function fetchProductVariants(productId, callback) {
  if (!productId) {
    callback([]);
    return;
  }

  // Query the table directly WITHOUT nested selects (more reliable with RLS)
  // We'll fetch related data separately
  const url = `${SUPABASE_BASE_URL}/product_variants?product_id=eq.${productId}&is_active=eq.true&select=*`;
  
  const httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = function() {
    if (this.readyState === 4) {
      if (this.status === 200) {
        try {
          const variants = JSON.parse(this.responseText);
          console.log('[Variants] Raw API response (variants only):', variants);
          
          if (!variants || variants.length === 0) {
            console.log('[Variants] No variants found');
            callback([]);
            return;
          }
          
          // Fetch related data separately (more reliable with RLS)
          const sizeIds = [...new Set(variants.map(v => v.size_id).filter(id => id !== null))];
          const colorIds = [...new Set(variants.map(v => v.color_id).filter(id => id !== null))];
          const productIds = [...new Set(variants.map(v => v.product_id).filter(id => id !== null))];
          
          console.log('[Variants] Need to fetch:', {
            sizes: sizeIds.length,
            colors: colorIds.length,
            products: productIds.length
          });
          
          let sizesMap = new Map();
          let colorsMap = new Map();
          let productsMap = new Map();
          let completed = 0;
          const totalRequests = (sizeIds.length > 0 ? 1 : 0) + (colorIds.length > 0 ? 1 : 0) + (productIds.length > 0 ? 1 : 0);
          
          function checkComplete() {
            completed++;
            if (completed >= totalRequests) {
              // Transform and return
              const transformed = variants.map(v => ({
                variant_id: v.id,
                product_id: v.product_id,
                sku: v.sku,
                stock: v.stock,
                variant_price: v.price,
                variant_discount: v.discount_percent,
                variant_final_price: v.final_price,
                variant_image_url: v.image_url,
                is_default: v.is_default,
                variant_active: v.is_active,
                product_name: productsMap.get(v.product_id)?.name || null,
                product_price: productsMap.get(v.product_id)?.price || null,
                product_final_price: productsMap.get(v.product_id)?.final_price || null,
                product_image: productsMap.get(v.product_id)?.preview || null,
                product_stock: productsMap.get(v.product_id)?.stock || null,
                brand_id: productsMap.get(v.product_id)?.brand_id || null,
                size_id: v.size_id,
                size_name: sizesMap.get(v.size_id)?.name || null,
                size_display_name: sizesMap.get(v.size_id)?.display_name || sizesMap.get(v.size_id)?.name || null,
                size_type: sizesMap.get(v.size_id)?.size_type || null,
                sort_order: sizesMap.get(v.size_id)?.sort_order || null,
                color_id: v.color_id,
                color_name: colorsMap.get(v.color_id)?.name || null,
                color_hex: colorsMap.get(v.color_id)?.hex_code || null,
                color_image: colorsMap.get(v.color_id)?.image_url || null,
                display_price: v.final_price || productsMap.get(v.product_id)?.final_price || productsMap.get(v.product_id)?.price || null,
                display_stock: v.stock !== null && v.stock !== undefined ? v.stock : (productsMap.get(v.product_id)?.stock || 0),
                display_image: v.image_url || productsMap.get(v.product_id)?.preview || null
              }));
              
              console.log('[Variants] Transformed variants:', transformed);
              callback(transformed);
            }
          }
          
          // Fetch sizes
          if (sizeIds.length > 0) {
            const sizesUrl = `${SUPABASE_BASE_URL}/sizes?id=in.(${sizeIds.join(',')})&select=*`;
            const req = new XMLHttpRequest();
            req.onreadystatechange = function() {
              if (this.readyState === 4 && this.status === 200) {
                try {
                  JSON.parse(this.responseText).forEach(s => sizesMap.set(s.id, s));
                  console.log('[Variants] Fetched sizes:', sizesMap.size);
                } catch (e) { console.error('[Variants] Error parsing sizes:', e); }
                checkComplete();
              } else if (this.readyState === 4) {
                console.error('[Variants] Error fetching sizes. Status:', this.status);
                checkComplete();
              }
            };
            req.open('GET', sizesUrl, true);
            req.setRequestHeader('apikey', SUPABASE_ANON_KEY);
            req.setRequestHeader('Authorization', 'Bearer ' + SUPABASE_ANON_KEY);
            req.send();
          } else {
            checkComplete();
          }
          
          // Fetch colors
          if (colorIds.length > 0) {
            const colorsUrl = `${SUPABASE_BASE_URL}/colors?id=in.(${colorIds.join(',')})&select=*`;
            const req = new XMLHttpRequest();
            req.onreadystatechange = function() {
              if (this.readyState === 4 && this.status === 200) {
                try {
                  JSON.parse(this.responseText).forEach(c => colorsMap.set(c.id, c));
                  console.log('[Variants] Fetched colors:', colorsMap.size);
                } catch (e) { console.error('[Variants] Error parsing colors:', e); }
                checkComplete();
              } else if (this.readyState === 4) {
                console.error('[Variants] Error fetching colors. Status:', this.status);
                checkComplete();
              }
            };
            req.open('GET', colorsUrl, true);
            req.setRequestHeader('apikey', SUPABASE_ANON_KEY);
            req.setRequestHeader('Authorization', 'Bearer ' + SUPABASE_ANON_KEY);
            req.send();
          } else {
            checkComplete();
          }
          
          // Fetch products
          if (productIds.length > 0) {
            const productsUrl = `${SUPABASE_BASE_URL}/products?id=in.(${productIds.join(',')})&select=*`;
            const req = new XMLHttpRequest();
            req.onreadystatechange = function() {
              if (this.readyState === 4 && this.status === 200) {
                try {
                  JSON.parse(this.responseText).forEach(p => productsMap.set(p.id, p));
                  console.log('[Variants] Fetched products:', productsMap.size);
                } catch (e) { console.error('[Variants] Error parsing products:', e); }
                checkComplete();
              } else if (this.readyState === 4) {
                console.error('[Variants] Error fetching products. Status:', this.status);
                checkComplete();
              }
            };
            req.open('GET', productsUrl, true);
            req.setRequestHeader('apikey', SUPABASE_ANON_KEY);
            req.setRequestHeader('Authorization', 'Bearer ' + SUPABASE_ANON_KEY);
            req.send();
          } else {
            checkComplete();
          }
        } catch (error) {
          console.error('[Variants] Error parsing variants:', error);
          console.error('[Variants] Response text:', this.responseText);
          callback([]);
        }
      } else {
        console.error('[Variants] Error fetching variants. Status:', this.status);
        console.error('[Variants] Response:', this.responseText);
        callback([]);
      }
    }
  };
  
  httpRequest.onerror = function() {
    console.error('[Variants] Network error fetching variants');
    callback([]);
  };
  
  httpRequest.open('GET', url, true);
  httpRequest.setRequestHeader('apikey', SUPABASE_ANON_KEY);
  httpRequest.setRequestHeader('Authorization', 'Bearer ' + SUPABASE_ANON_KEY);
  httpRequest.send();
}

/**
 * Get available sizes for a product (from variants)
 */
function getAvailableSizesForProduct(productId, callback) {
  fetchProductVariants(productId, function(variants) {
    const sizeMap = new Map();
    
    variants.forEach(variant => {
      if (variant.size_id && variant.size_name) {
        if (!sizeMap.has(variant.size_id)) {
          sizeMap.set(variant.size_id, {
            id: variant.size_id,
            name: variant.size_name,
            display_name: variant.size_display_name || variant.size_name,
            size_type: variant.size_type,
            sort_order: variant.sort_order || 0
          });
        }
      }
    });
    
    const sizes = Array.from(sizeMap.values());
    // Sort by type, then sort_order, then name
    sizes.sort((a, b) => {
      if (a.size_type !== b.size_type) {
        return a.size_type === 'numeric' ? 1 : -1;
      }
      if (a.sort_order !== b.sort_order) {
        return a.sort_order - b.sort_order;
      }
      return a.name.localeCompare(b.name);
    });
    
    callback(sizes);
  });
}

/**
 * Get available colors for a product (from variants)
 */
function getAvailableColorsForProduct(productId, callback) {
  fetchProductVariants(productId, function(variants) {
    const colorMap = new Map();
    
    variants.forEach(variant => {
      if (variant.color_id && variant.color_name) {
        if (!colorMap.has(variant.color_id)) {
          colorMap.set(variant.color_id, {
            id: variant.color_id,
            name: variant.color_name,
            hex_code: variant.color_hex,
            image_url: variant.color_image
          });
        }
      }
    });
    
    const colors = Array.from(colorMap.values());
    colors.sort((a, b) => a.name.localeCompare(b.name));
    
    callback(colors);
  });
}

/**
 * Get available colors for a product-size combination
 */
function getAvailableColorsForProductSize(productId, sizeId, callback) {
  fetchProductVariants(productId, function(variants) {
    const colorMap = new Map();
    
    variants.forEach(variant => {
      if (variant.size_id === sizeId && variant.color_id && variant.color_name) {
        if (!colorMap.has(variant.color_id)) {
          colorMap.set(variant.color_id, {
            id: variant.color_id,
            name: variant.color_name,
            hex_code: variant.color_hex,
            image_url: variant.color_image,
            stock: variant.display_stock,
            variant_image: variant.variant_image_url
          });
        }
      }
    });
    
    const colors = Array.from(colorMap.values());
    colors.sort((a, b) => a.name.localeCompare(b.name));
    
    callback(colors);
  });
}

/**
 * Find variant by product, size, and color
 */
function findVariant(productId, sizeId, colorId, callback) {
  fetchProductVariants(productId, function(variants) {
    const variant = variants.find(v => {
      const vSizeId = v.size_id || null;
      const vColorId = v.color_id || null;
      return vSizeId === sizeId && vColorId === colorId;
    });
    
    callback(variant || null);
  });
}

/**
 * Get default variant for a product
 */
function getDefaultVariant(productId, callback) {
  fetchProductVariants(productId, function(variants) {
    // First try to find variant marked as default
    let variant = variants.find(v => v.is_default === true);
    
    // If no default, use first variant
    if (!variant && variants.length > 0) {
      variant = variants[0];
    }
    
    callback(variant || null);
  });
}

// Export functions to window for global access
window.productVariants = {
  fetchBrands,
  getBrandName,
  fetchSizes,
  getSizeName,
  fetchColors,
  getColorName,
  fetchProductVariants,
  getAvailableSizesForProduct,
  getAvailableColorsForProduct,
  getAvailableColorsForProductSize,
  findVariant,
  getDefaultVariant
};

