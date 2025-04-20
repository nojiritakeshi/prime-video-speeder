# Playback Speed Controller Chrome Extension

A Chrome extension that allows you to control the playback speed of HTML5 video elements on any webpage through a sleek, modern popup UI. This extension supports speeds from 1× to 4× (in 0.25× increments) and automatically initializes the slider to reflect the current playback speed of the first video element found on the page.

## Features

- **Modern UI:** A responsive and attractive popup with a slider and real-time speed display.
- **Flexible Speed Control:** Adjust video playback speed from 1× to 4× in increments of 0.25×.
- **Automatic Detection:** On popup load, the extension automatically reads the current playback speed from the webpage.
- **Easy to Use:** Simply adjust the slider to your desired speed and click the "Set" button to apply the changes to all video elements on the page.

<img width="194" alt="image" src="https://github.com/user-attachments/assets/3df7d36a-c54e-4518-9e39-2dea4441f1e6" />


## Files

- **manifest.json**  
  The manifest file for the Chrome extension (Manifest V3), which specifies permissions and the popup details.

- **popup.html**  
  The HTML file that defines the popup UI.

- **popup.js**  
  The JavaScript file that handles UI interactions and communicates with the current active tab to read and set video playback speeds.

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/playback-speed-controller.git
   cd playback-speed-controller

## Licence
Free Licence. 
Use it as you like.
