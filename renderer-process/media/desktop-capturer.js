const { desktopCapturer, screen, shell } = require('electron');

const fs = require('fs');
const os = require('os');
const path = require('path');

const screenshot = document.getElementById('screen-shot');
const screenshotMsg = document.getElementById('screenshot-path');

function determineScreenShotSize() {
  const screenSize = screen.getPrimaryDisplay().workAreaSize;
  const maxDimension = Math.max(screenSize.width, screenSize.height);
  return {
    width: maxDimension * window.devicePixelRatio,
    height: maxDimension * window.devicePixelRatio
  };
}

screenshot.addEventListener('click', (event) => {
  screenshotMsg.textContent = 'Gathering screens...';
  const thumbSize = determineScreenShotSize();
  const options = { types: ['screen'], thumbnailSize: thumbSize };

  desktopCapturer.getSources(options, (error, sources) => {
    if (error) return console.log(error);

    sources.forEach((source) => {
      if (source.name === 'Entire Screen' || source.name === 'Screen 1') {
        const screenshotPath = path.join(os.tmpdir(), 'screenshot.png');

        fs.writeFile(screenshotPath, source.thumbnail.toPNG(), () => {
          if (error) return console.log(error);
          shell.openExternal(`file://${screenshotPath}`);

          const message = `Saved screenshot to: ${screenshotPath}`;
          screenshotMsg.textContent = message;
        });
      }
    });
  });
});
