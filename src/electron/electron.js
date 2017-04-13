'use strict';

const { app, BrowserWindow, globalShortcut } = require('electron');
const fs = require('fs');

// electron-connect is used only in dev mode, node_modules are not
// shipped in the electron package so importing electron-connect
// will throw an error when using "npm run package"
let client;
if (process.env.NODE_ENV === 'development') {
  client = require('electron-connect').client;
}

let win = null;
const DEVELOPMENT = process.env.NODE_ENV === 'development';
const PRODUCTION = process.env.NODE_ENV === 'production';

const loadUrl = () => {
  // since electron-builder and electron-packager packs the /public folder in different ways
  // we first check if the folder exists and point to the index.html file accordingly
  const publicFolder = fs.existsSync(`${__dirname}/../../public`) ? 'public/' : '';
  const target = `file://${__dirname}/../../${publicFolder}index.html`;
  win.loadURL(target);
};

app.on('ready', () => {
  // Initialize the window
  win = new BrowserWindow({
    width: 1200,
    height: 900,
    autoHideMenuBar: true,
    frame: true,
  });

  if (DEVELOPMENT) {
    // During development there's a webserver running (webpack-devserver)
    win.loadURL('http://localhost:3000');
    // enable devtools
    win.webContents.openDevTools();
    // in dev mode the electron window is created with electron-connect
    // see /config/webpack.dev.js for further details
    client.create(win);
  } else {
    loadUrl();
  }

  if (PRODUCTION) {
    // replace standard reload that would show a blank screen with the win.loadUrl method
    globalShortcut.register('CommandOrControl+R', loadUrl);
    globalShortcut.register('Shift+CommandOrControl+R', loadUrl);
  }

  // Remove window once app is closed
  win.on('closed', () => {
    win = null;
  });
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
