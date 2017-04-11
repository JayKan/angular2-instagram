'use strict';

const { app, BrowserWindow, globalShortcut } = require('electron');

// electron-connect is used only in dev mode, node_modules are not
// shipped in the electron package so importing electron-connect
// will throw an error when using "npm run package"
let client;
if (process.env.NODE_ENV === 'development') {
  client = require('electron-connect').client;
}

let win = null;
const DEVELOPMENT = process.env.NODE_ENV === 'development';

const loadUrl = () => {
  win.loadURL(`file://${__dirname}/index.html`);
}

app.on('ready', () => {
  // Initialize the window
  win = new BrowserWindow({
    width: 1200,
    height: 900,
    autoHideMenuBar: true,
    frame: true,
  });

  if (DEVELOPMENT) {
    // Specify entry point
    win.loadURL('http://localhost:3000');
    // devtools
    win.webContents.openDevTools();
    // in dev mode the electron window is created with electron-connect
    // see /config/webpack.dev.js for further details
    client.create(win);
  } else {
    loadUrl();
  }

  // Remove window once app is closed
  win.on('closed', () => {
    win = null;
  });

  // replace standard reload that would show a blank screen with the win.loadUrl method
  globalShortcut.register('CommandOrControl+R', loadUrl);
  globalShortcut.register('Shift+CommandOrControl+R', loadUrl);
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('activate', () => {
  if (win === null && !DEVELOPMENT) {
    createWindow()
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
