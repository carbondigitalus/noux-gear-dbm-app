// Core Modules
const path = require('path');
const glob = require('glob');

// NPM Modules
const { app, BrowserWindow } = require('electron');
const devtron = require('devtron');
const logger = require('electron-log');
const updateApp = require('update-electron-app')({ logger: logger });

// Variables
const debug = /--debug/.test(process.argv[2]);
let mainWindow = null;

if (process.mas) {
  app.setName('Noux Gear Databse Manager');
}

// Make this app a single instance app.
// The main window will be restored and focused instead of a second window
// opened when a person attempts to launch a second instance.
// Returns true if the current version of the app should quit instead of
// launching.
if (process.mas) return;

app.requestSingleInstanceLock();

app.on('second-instance', () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});
// Require each JS file in the main-process dir
const files = glob.sync(path.join(`${__dirname}/main-process/**/*.js`));
files.forEach((file) => {
  return file;
});

app.on('ready', () => {
  const windowOptions = {
    width: 1080,
    minWidth: 680,
    height: 840,
    title: app.getName(),
    webPreferences: {
      nodeIntegration: true
    }
  };

  if (process.platform === 'linux') {
    windowOptions.icon = path.join(`${__dirname}/assets/app-icon/png/512.png`);
  }

  mainWindow = new BrowserWindow(windowOptions);
  mainWindow.loadURL(path.join(`file://${__dirname}/index.html`));

  // Launch fullscreen with DevTools open, usage: npm run debug
  if (debug) {
    mainWindow.webContents.openDevTools();
    mainWindow.maximize();
    devtron.install();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  return updateApp;
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    return mainWindow;
  }
});
