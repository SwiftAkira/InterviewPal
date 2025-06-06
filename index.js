const { app, BrowserWindow, globalShortcut } = require('electron');
const path = require('path');

let mainWindow;
let overlayWindow;

function createMainWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile('index.html');
  mainWindow.webContents.openDevTools();
}

function createOverlayWindow() {
  overlayWindow = new BrowserWindow({
    width: 300,
    height: 100,
    frame: false,
    alwaysOnTop: true,
    transparent: true,
    webPreferences: {
      nodeIntegration: true
    }
  });

  overlayWindow.loadFile('overlay.html');
  overlayWindow.setContentProtection(true);
  overlayWindow.hide();
}

app.whenReady().then(() => {
  createMainWindow();
  createOverlayWindow();

  globalShortcut.register('CommandOrControl+Shift+X', () => {
    if (overlayWindow.isVisible()) {
      overlayWindow.hide();
    } else {
      overlayWindow.show();
    }
  });
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
}); 