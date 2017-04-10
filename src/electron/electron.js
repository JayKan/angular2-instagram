'use strict';

const { app, BrowserWindow } = require('electron');

// electron-connect is used only in dev mode, node_modules are not
// shipped in the electron package so importing electron-connect
// will throw an error when using "npm run package"
let client;
if (process.env.NODE_ENV === 'development') {
  client = require('electron-connect').client;
}

let win = null;
const DEVELOPMENT = process.env.NODE_ENV === 'development';

app.on('ready', function () {
  // Initialize the window
  win = new BrowserWindow({ width: 1200, height: 900, autoHideMenuBar: true, frame: true });

  if (DEVELOPMENT) {
    // Specify entry point
    win.loadURL('http://localhost:3000');
    // devtools
    win.webContents.openDevTools();
    // in dev mode the electron window is created with electron-connect
    // see /config/webpack.dev.js for further details
    client.create(win);
  } else {
    win.loadURL(`file://${__dirname}/index.html`)
  }

  // Remove window once app is closed
  win.on('closed', function () {
    win = null;
  });
});

app.on('activate', () => {
  if (win === null && !DEVELOPMENT) {
    createWindow()
  }
})

app.on('window-all-closed', function () {
  if (process.platform != 'darwin') {
    app.quit();
  }
});
