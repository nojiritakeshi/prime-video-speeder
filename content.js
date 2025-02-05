chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "setSpeed") {
    const setVideoSpeed = (speed) => {
      const videoElements = document.querySelectorAll("video");
      if (videoElements.length > 1) {
        const videoElement = videoElements[1];
        videoElement.playbackRate = speed;
        console.log("再生速度を", speed, "に設定しました");
        sendResponse({ status: 'success', newSpeed: speed });
      } else {
        console.error("動画要素が見つかりません。");
        sendResponse({ status: 'error', message: '動画要素が見つからない' });
      }
    };

    // MutationObserverを使用して動画要素の追加を監視
    const observer = new MutationObserver(() => {
      const videoElements = document.querySelectorAll("video");
      if (videoElements.length > 1) {
        setVideoSpeed(request.speed);
        observer.disconnect(); // 監視を停止
      }
    });

    // DOMの変化を監視
    observer.observe(document.body, { childList: true, subtree: true });

    // 初回チェック
    setVideoSpeed(request.speed);
    
    // 非同期でsendResponseを利用するため、trueを返して通信チャネルを維持
    return true;
  }
}); 