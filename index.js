// index.js - Amazon Prime Video Playback Speed Controller

// Function to create the speeder button
function createSpeederButton() {
  const speederButton = document.createElement('button');
  speederButton.id = 'amapura-speeder';
  speederButton.title = '再生速度を調整';
  speederButton.style.cssText = `
    width: 40px;
    height: 40px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.2);
    transition: background-color 0.2s;
    z-index: 9000;
    position: relative;
    border: none;
    outline: none;
    padding: 0;
  `;
  
  // Add hover effect
  speederButton.addEventListener('mouseover', () => {
    speederButton.style.backgroundColor = 'rgba(255, 255, 255, 0.4)';
  });
  
  speederButton.addEventListener('mouseout', () => {
    speederButton.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
  });

  // Create SVG icon for speed
  const svgIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svgIcon.setAttribute('width', '24');
  svgIcon.setAttribute('height', '24');
  svgIcon.setAttribute('viewBox', '0 0 24 24');
  svgIcon.setAttribute('fill', 'white');
  
  // Path for a speedometer-like icon
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z');
  
  svgIcon.appendChild(path);
  speederButton.appendChild(svgIcon);
  
  // Add click event to create and show custom popup
  speederButton.onclick = function(e) {
    console.log('Speeder button clicked! (onclick handler)');
    e.stopPropagation(); // Prevent event from bubbling up
    e.preventDefault(); // Prevent default button behavior
    
    // Check if popup already exists and remove it if it does
    const existingPopup = document.getElementById('amapura-speeder-popup');
    if (existingPopup) {
      existingPopup.remove();
      return; // Toggle behavior - if popup exists, just remove it and exit
    }
    
    // Create custom popup
    createCustomPopup(speederButton);
    
    // Return false to prevent default behavior
    return false;
  };
  
  return speederButton;
}

// Function to check and add the speeder button
function checkAndAddSpeederButton() {
  const container = document.querySelector('.atvwebplayersdk-hideabletopbuttons-container');
  if (container) {
    const existingSpeeder = document.getElementById('amapura-speeder');
    if (!existingSpeeder) {
      console.log('Adding speeder button to Prime Video player');
      const speederButton = createSpeederButton();
      container.appendChild(speederButton);
    }
  }
}

// Function to initialize the MutationObserver
function initMutationObserver() {
  // Create an observer instance
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(() => {
      checkAndAddSpeederButton();
    });
  });
  
  // Start observing the document body for DOM changes
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // Also check immediately in case the element already exists
  checkAndAddSpeederButton();
}

// Initialize when the DOM is fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMutationObserver);
} else {
  initMutationObserver();
}

// Function to create a custom popup that is always visible
function createCustomPopup(speederButton) {
  console.log('Creating custom popup');
  
  // Create popup container
  const popup = document.createElement('div');
  popup.id = 'amapura-speeder-popup';
  
  // Position the popup in the center of the screen to ensure visibility
  // Set popup styles - use fixed positioning for fullscreen compatibility
  popup.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 220px;
    background: #1a1a1a;
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
    z-index: 9999;
    font-family: Arial, sans-serif;
    color: white;
  `;
  
  // Create popup content
  popup.innerHTML = `
    <div style="text-align: center; margin-bottom: 15px; font-size: 16px; font-weight: bold;">
      再生速度コントローラー
    </div>
    <div style="margin: 15px 0;">
      <div style="text-align: center; margin-bottom: 5px; font-size: 14px;">
        再生速度: <span id="amapura-current-speed">1.00</span> 倍速
      </div>
      <input type="range" id="amapura-speed-slider" min="1" max="4" step="0.25" value="1" style="
        width: 100%;
        -webkit-appearance: none;
        height: 6px;
        border-radius: 3px;
        background: #555;
        outline: none;
      ">
    </div>
    <button id="amapura-set-speed" style="
      display: block;
      width: 100%;
      padding: 8px;
      margin-top: 15px;
      background: #007acc;
      color: #fff;
      border: none;
      border-radius: 4px;
      font-size: 14px;
      cursor: pointer;
    ">設定</button>
  `;
  
  // Determine where to add the popup
  let popupContainer = document.body;
  
  // Check for fullscreen player container
  const fullscreenElement = document.querySelector('.dv-player-fullscreen');
  if (fullscreenElement) {
    const playerContainer = fullscreenElement.querySelector('.webPlayerSDKContainer');
    if (playerContainer) {
      console.log('Found fullscreen player container, adding popup there');
      popupContainer = playerContainer;
    }
  }
  
  // Add popup to the appropriate container
  popupContainer.appendChild(popup);
  
  // Get current video speed
  getCurrentVideoSpeed().then(speed => {
    const slider = document.getElementById('amapura-speed-slider');
    const speedDisplay = document.getElementById('amapura-current-speed');
    
    if (slider && speedDisplay) {
      slider.value = speed;
      speedDisplay.textContent = parseFloat(speed).toFixed(2);
      
      // Update display when slider is moved
      slider.addEventListener('input', () => {
        speedDisplay.textContent = parseFloat(slider.value).toFixed(2);
      });
      
      // Set speed when button is clicked
      document.getElementById('amapura-set-speed').addEventListener('click', () => {
        const newSpeed = parseFloat(slider.value);
        setVideoSpeed(newSpeed).then(success => {
          if (success) {
            // Provide visual feedback
            const button = document.getElementById('amapura-set-speed');
            const originalText = button.textContent;
            button.textContent = '✓ 設定完了';
            button.style.backgroundColor = '#28a745';
            
            // Remove popup after a short delay
            setTimeout(() => {
              const popup = document.getElementById('amapura-speeder-popup');
              if (popup) popup.remove();
            }, 1000);
          }
        });
      });
    }
  });
  
  // Close popup when clicking outside
  document.addEventListener('click', function closePopup(e) {
    const popup = document.getElementById('amapura-speeder-popup');
    if (popup && !popup.contains(e.target) && e.target.id !== 'amapura-speeder') {
      popup.remove();
      document.removeEventListener('click', closePopup);
    }
  });
}

// Function to get the current video speed
async function getCurrentVideoSpeed() {
  const videoElements = document.querySelectorAll('video');
  if (videoElements.length > 0) {
    // Prime Video sometimes has multiple video elements
    const mainVideo = videoElements.length > 1 ? videoElements[1] : videoElements[0];
    return mainVideo.playbackRate;
  }
  return 1.0; // Default speed
}

// Function to set the video speed
async function setVideoSpeed(speed) {
  const videoElements = document.querySelectorAll('video');
  if (videoElements.length > 0) {
    // Set speed for all video elements (usually there's just one main video)
    for (const video of videoElements) {
      video.playbackRate = speed;
    }
    console.log(`再生速度を ${speed} 倍に設定しました。`);
    return true;
  }
  return false;
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'checkPlayer') {
    checkAndAddSpeederButton();
    sendResponse({ status: 'checked' });
  }
});

// Add a global function for debugging that can be called from the console
window.showAmazonPrimeSpeedPopup = function() {
  console.log('Manual popup trigger');
  const speederButton = document.getElementById('amapura-speeder');
  if (speederButton) {
    createCustomPopup(speederButton);
    return 'Popup created';
  } else {
    return 'Speeder button not found';
  }
};

// Add a direct click handler to the document for debugging and as a fallback
document.addEventListener('click', (e) => {
  const speederButton = e.target.closest('#amapura-speeder');
  if (speederButton) {
    console.log('Speeder button clicked through document event!');
    
    // As a fallback, create the popup directly
    const existingPopup = document.getElementById('amapura-speeder-popup');
    if (existingPopup) {
      existingPopup.remove();
    } else {
      createCustomPopup(speederButton);
    }
    
    // Prevent event propagation
    e.stopPropagation();
    e.preventDefault();
  }
});

// Keep the debugging function but don't auto-create popup
// window.showAmazonPrimeSpeedPopup can be called from console if needed
