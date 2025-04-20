// content.js - Amazon Prime Video Playback Speed Controller

// Function to set the playback speed of video elements
function setVideoSpeed(speed) {
  const videoElements = document.querySelectorAll("video");
  if (videoElements.length > 0) {
    // Prime Video sometimes has multiple video elements, try to find the main one
    // Usually the main video is either the only one or the second one (index 1)
    const mainVideo = videoElements.length > 1 ? videoElements[1] : videoElements[0];
    
    // Set the playback rate
    mainVideo.playbackRate = speed;
    console.log("再生速度を", speed, "に設定しました");
    return { status: 'success', newSpeed: speed };
  } else {
    console.error("動画要素が見つかりません。");
    return { status: 'error', message: '動画要素が見つからない' };
  }
}

// Function to get the current playback speed
function getCurrentPlaybackSpeed() {
  const videoElements = document.querySelectorAll("video");
  if (videoElements.length > 0) {
    const mainVideo = videoElements.length > 1 ? videoElements[1] : videoElements[0];
    return mainVideo.playbackRate;
  }
  return 1.0; // Default speed if no video is found
}

// Listen for messages from the popup or background script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  // Handle setSpeed action
  if (request.action === "setSpeed") {
    // Use MutationObserver to wait for video elements if they don't exist yet
    if (document.querySelectorAll("video").length === 0) {
      const observer = new MutationObserver(() => {
        const videoElements = document.querySelectorAll("video");
        if (videoElements.length > 0) {
          const result = setVideoSpeed(request.speed);
          sendResponse(result);
          observer.disconnect(); // Stop observing once we've found video elements
        }
      });
      
      // Observe the DOM for changes
      observer.observe(document.body, { childList: true, subtree: true });
      
      // Return true to indicate we'll respond asynchronously
      return true;
    } else {
      // Video elements already exist, set speed immediately
      const result = setVideoSpeed(request.speed);
      sendResponse(result);
    }
  }
  
  // Handle getSpeed action
  else if (request.action === "getSpeed") {
    const currentSpeed = getCurrentPlaybackSpeed();
    sendResponse({ status: 'success', speed: currentSpeed });
  }
  
  // Return true for async response
  return true;
});
