// popup.js

// DOMの読み込み完了時に初期処理を実施
document.addEventListener('DOMContentLoaded', async () => {
  const slider = document.getElementById('speedSlider');
  const speedDisplay = document.getElementById('currentSpeed');

  // スライダー操作時に表示の数値を更新
  slider.addEventListener('input', () => {
    speedDisplay.textContent = parseFloat(slider.value).toFixed(2);
  });

  // 現在のアクティブタブを取得
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // ページ内の最初の動画要素の再生速度を取得してスライダーに反映
  try {
    const injectionResults = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: getCurrentPlaybackSpeed
    });
    const speed = injectionResults[0].result;
    if (speed !== null && speed !== undefined) {
      slider.value = speed;
      speedDisplay.textContent = parseFloat(speed).toFixed(2);
    }
  } catch (error) {
    console.error("再生速度の取得に失敗しました:", error);
  }

  // 「設定」ボタン押下時の処理
  document.getElementById('setSpeed').addEventListener('click', async () => {
    const speed = parseFloat(slider.value);
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: setPlaybackSpeed,
      args: [speed]
    });
  });
});

/**
 * ページ内で実行される関数
 * ページ内の最初の動画要素の再生速度を返します。
 */
function getCurrentPlaybackSpeed() {
  const video = document.querySelector('video');
  if (video) {
    return video.playbackRate;
  }
  return null;
}

/**
 * ページ内で実行される関数
 * ページ内のすべての動画要素の再生速度を指定された speed に設定します。
 */
function setPlaybackSpeed(speed) {
  const videos = document.getElementsByTagName('video');
  if (videos.length === 0) {
    console.warn("このページには動画要素が見つかりませんでした。");
    return;
  }
  for (const video of videos) {
    video.playbackRate = speed;
  }
  console.log(`動画の再生速度を ${speed} 倍に設定しました。`);
}
