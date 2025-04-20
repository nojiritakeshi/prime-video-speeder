// index.js - Amazon Prime Video Playback Speed Controller

// Function to create the speeder button
function createSpeederButton() {
  const speederButton = document.createElement('div');
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
    background-color: transparent;
    transition: background-color 0.2s;
  `;
  
  // Add hover effect
  speederButton.addEventListener('mouseover', () => {
    speederButton.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
  });
  
  speederButton.addEventListener('mouseout', () => {
    speederButton.style.backgroundColor = 'transparent';
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
  
  // Add click event to open popup
  speederButton.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'openPopup' });
  });
  
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

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'checkPlayer') {
    checkAndAddSpeederButton();
    sendResponse({ status: 'checked' });
  }
});
