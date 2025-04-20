// background.js - Amazon Prime Video Playback Speed Controller

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Handle the openPopup action from the content script
  if (request.action === 'openPopup') {
    // Open the popup programmatically
    chrome.action.openPopup();
    sendResponse({ status: 'success' });
  }
  return true; // Keep the message channel open for async responses
});

// When the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  console.log('Amazon Prime Video Playback Speed Controller installed/updated');
});
