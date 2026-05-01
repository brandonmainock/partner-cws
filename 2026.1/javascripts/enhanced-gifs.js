/* Enhanced GIF Lightbox JavaScript */
/* ================================= */

/**
 * Opens a lightbox for the given image element
 * @param {HTMLImageElement} img - The image element to display in lightbox
 */
function openLightbox(img) {
  let lightbox = document.getElementById('gif-lightbox');
  
  // Create lightbox if it doesn't exist
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.id = 'gif-lightbox';
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
      <div class="lightbox-content">
        <span class="lightbox-close" onclick="closeLightbox()">&times;</span>
        <img id="lightbox-img" src="" alt="">
        <div class="lightbox-info">
          <span id="lightbox-alt"></span><br>
          <small>Press ESC to close • Click outside to close</small>
        </div>
      </div>
    `;
    document.body.appendChild(lightbox);
    
    // Add click outside to close functionality
    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox || e.target.className === 'lightbox-content') {
        closeLightbox();
      }
    });
    
    // Add ESC key to close functionality
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && lightbox.style.display === 'block') {
        closeLightbox();
      }
    });
  }
  
  // Set image source and alt text
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxAlt = document.getElementById('lightbox-alt');
  
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  lightboxAlt.textContent = img.alt;
  
  // Show lightbox and prevent body scrolling
  lightbox.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

/**
 * Closes the lightbox and restores body scrolling
 */
function closeLightbox() {
  const lightbox = document.getElementById('gif-lightbox');
  if (lightbox) {
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
}

/**
 * Initialize enhanced GIF functionality when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
  // Add click handlers to all enhanced GIFs
  const enhancedGifs = document.querySelectorAll('.enhanced-gif.clickable-gif');
  
  enhancedGifs.forEach(function(gif) {
    // Ensure the onclick attribute is set if not already present
    if (!gif.hasAttribute('onclick')) {
      gif.setAttribute('onclick', 'openLightbox(this)');
    }
    
    // Add title attribute if not present
    if (!gif.hasAttribute('title')) {
      gif.setAttribute('title', 'Click to view full-screen');
    }
    
    // Ensure cursor style is set
    gif.style.cursor = 'zoom-in';
  });
  
  // Add zoom hint overlays if they don't exist
  const gifContainers = document.querySelectorAll('.gif-container');
  
  gifContainers.forEach(function(container) {
    const existingOverlay = container.querySelector('.gif-overlay');
    if (!existingOverlay) {
      const overlay = document.createElement('div');
      overlay.className = 'gif-overlay';
      overlay.innerHTML = '<span class="zoom-hint">🔍 Click to zoom</span>';
      container.appendChild(overlay);
    }
  });
});

/**
 * Utility function to create enhanced GIF containers programmatically
 * @param {string} src - Image source URL
 * @param {string} alt - Alt text for the image
 * @param {string} borderColor - Border color class (blue, green, orange, purple)
 * @returns {HTMLElement} - The created GIF container element
 */
function createEnhancedGif(src, alt, borderColor = 'blue') {
  const container = document.createElement('div');
  container.className = 'gif-container';
  
  const img = document.createElement('img');
  img.src = src;
  img.alt = alt;
  img.className = `enhanced-gif clickable-gif gif-${borderColor}-border`;
  img.onclick = function() { openLightbox(this); };
  img.title = 'Click to view full-screen';
  img.style.cssText = 'width: 100%; height: auto; border-radius: 12px; cursor: zoom-in; transition: all 0.3s ease;';
  
  const overlay = document.createElement('div');
  overlay.className = 'gif-overlay';
  overlay.innerHTML = '<span class="zoom-hint">🔍 Click to zoom</span>';
  
  container.appendChild(img);
  container.appendChild(overlay);
  
  return container;
}

/**
 * Global error handler for missing images
 */
document.addEventListener('DOMContentLoaded', function() {
  const images = document.querySelectorAll('.enhanced-gif');
  
  images.forEach(function(img) {
    img.addEventListener('error', function() {
      console.warn('Enhanced GIF failed to load:', img.src);
      
      // Create a placeholder or error message
      const container = img.closest('.gif-container');
      if (container) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = 'padding: 20px; text-align: center; background: #f5f5f5; border: 2px dashed #ccc; border-radius: 12px; color: #666;';
        errorDiv.innerHTML = `
          <p><strong>GIF not available</strong></p>
          <p><small>${img.alt || 'Demo content'}</small></p>
        `;
        container.replaceChild(errorDiv, img);
      }
    });
  });
});
