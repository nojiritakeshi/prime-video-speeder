// background.js - Amazon Prime Video Playback Speed Controller

// When the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  console.log('Amazon Prime Video Playback Speed Controller installed/updated');
});

// When the extension icon is clicked in the toolbar
chrome.action.onClicked.addListener((tab) => {
  // Send a message to the content script to check for the player
  chrome.tabs.sendMessage(tab.id, { action: 'checkPlayer' }, (response) => {
    // Handle any errors (e.g., if the content script isn't loaded yet)
    if (chrome.runtime.lastError) {
      console.error('Error:', chrome.runtime.lastError);
    }
  });
});
