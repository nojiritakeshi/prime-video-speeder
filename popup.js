// popup.js - Amazon Prime Video Playback Speed Controller

// Function to get the current active tab
async function getCurrentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

// Function to get the current playback speed from the content script
async function getPlaybackSpeed() {
  try {
    const tab = await getCurrentTab();
    return new Promise((resolve) => {
      chrome.tabs.sendMessage(tab.id, { action: "getSpeed" }, (response) => {
        if (chrome.runtime.lastError) {
          console.error("Error getting speed:", chrome.runtime.lastError);
          resolve(1.0); // Default to 1.0 if there's an error
        } else if (response && response.status === 'success') {
          resolve(response.speed);
        } else {
          resolve(1.0); // Default to 1.0 if response is invalid
        }
      });
    });
  } catch (error) {
    console.error("Failed to get playback speed:", error);
    return 1.0; // Default to 1.0 if there's an error
  }
}

// Function to set the playback speed via the content script
async function setPlaybackSpeed(speed) {
  try {
    const tab = await getCurrentTab();
    return new Promise((resolve) => {
      chrome.tabs.sendMessage(tab.id, { action: "setSpeed", speed: speed }, (response) => {
        if (chrome.runtime.lastError) {
          console.error("Error setting speed:", chrome.runtime.lastError);
          resolve(false);
        } else if (response && response.status === 'success') {
          console.log(`再生速度を ${speed} 倍に設定しました。`);
          resolve(true);
        } else {
          console.error("Failed to set speed:", response?.message || "Unknown error");
          resolve(false);
        }
      });
    });
  } catch (error) {
    console.error("Failed to set playback speed:", error);
    return false;
  }
}

// Initialize the popup when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', async () => {
  const slider = document.getElementById('speedSlider');
  const speedDisplay = document.getElementById('currentSpeed');

  // Update the displayed value when the slider is moved
  slider.addEventListener('input', () => {
    speedDisplay.textContent = parseFloat(slider.value).toFixed(2);
  });

  // Get the current playback speed and update the slider
  try {
    const currentSpeed = await getPlaybackSpeed();
    slider.value = currentSpeed;
    speedDisplay.textContent = parseFloat(currentSpeed).toFixed(2);
  } catch (error) {
    console.error("Failed to initialize speed:", error);
  }

  // Set the playback speed when the button is clicked
  document.getElementById('setSpeed').addEventListener('click', async () => {
    const speed = parseFloat(slider.value);
    const success = await setPlaybackSpeed(speed);
    
    if (success) {
      // Provide visual feedback that the speed was set
      const button = document.getElementById('setSpeed');
      const originalText = button.textContent;
      button.textContent = '✓ 設定完了';
      button.style.backgroundColor = '#28a745';
      
      // Reset the button after a short delay
      setTimeout(() => {
        button.textContent = originalText;
        button.style.backgroundColor = '';
      }, 1500);
    }
  });
});
