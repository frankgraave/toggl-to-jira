// =============================================================================
// Imports and initialisation.
// =============================================================================
'use strict'

import { app, Menu, ipcMain, BrowserWindow } from 'electron'

const Path = require('path')
const MenuBar = require('menubar')

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

// =============================================================================
// Declare vars and constants.
// =============================================================================
let mainWindow
let prefWindow

// The starting URL.
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

const prefWindowURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

// =============================================================================
// Function - Create the app windows.
// =============================================================================
function openPrefWindow () {
  prefWindow = new BrowserWindow({
    height: 575,
    width: 875
  })

  prefWindow.loadURL(prefWindowURL)

  prefWindow.on('closed', () => {
    prefWindow = null
  })
}

function openMainWindow () {
  // Initial window options.
  mainWindow = new MenuBar({
    height: 575,
    width: 875,
    show: false,
    focus: false,
    preloadWindow: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false
    },
    tooltip: 'Toggl to Jira Logger',
    index: winURL,
    icon: Path.join(__static, 'icons/iconTemplate.png')
  })

  const appPreferences = {
    label: 'Preferences',
    accelerator: 'Command+,',
    click: () => {
      openPrefWindow()
    }
  }

  const appQuit = {
    label: 'Quit',
    accelerator: 'Command+Q',
    click: () => {
      app.quit()
    }
  }

  const edit = {
    label: 'Edit',
    submenu: [
      {
        label: 'Cut',
        accelerator: 'CmdOrCtrl+X',
        selector: 'cut:'
      },
      {
        label: 'Copy',
        accelerator: 'CmdOrCtrl+C',
        selector: 'copy:'
      },
      {
        label: 'Paste',
        accelerator: 'CmdOrCtrl+V',
        selector: 'paste:'
      },
      {
        label: 'Select All',
        accelerator: 'CmdOrCtrl+A',
        selector: 'selectAll:'
      }
    ]
  }

  const primaryContextMenu = [
    appPreferences,
    appQuit
  ]
  const secundaryContextMenu = [
    appPreferences,
    appQuit,
    edit
  ]

  Menu.setApplicationMenu(Menu.buildFromTemplate(secundaryContextMenu))

  // Fix for making API calls to Jira REST Server API.
  mainWindow.window.webContents.setUserAgent('xxx')

  // Disable/enable devTools.
  // mainWindow.window.webContents.openDevTools()
  // mainWindow.window.webContents.closeDevTools()

  // Prevent people from opening devTools.
  mainWindow.window.webContents.on('devtools-opened', () => {
    mainWindow.window.webContents.closeDevTools()
  })

  mainWindow.tray.on('click', () => {
    mainWindow.window.focus()
  })
  mainWindow.tray.on('right-click', () => {
    mainWindow.tray.popUpContextMenu(Menu.buildFromTemplate(primaryContextMenu))
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// =============================================================================
// App main.
// =============================================================================
// app.on('ready', mainWindow)

app.on('ready', () => {
  openMainWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    openMainWindow()
  }
})

// =============================================================================
// ipcMain.
// =============================================================================
// EVENT: getTogglTimeEntries - Gets toggl time entries data.
ipcMain.on('getTogglData', (event) => {
  event.sender.send('getTogglTimeEntries')
})
// EVENT: clearAllCredentials - Clears the account data.
ipcMain.on('clearCredentials', (event) => {
  event.sender.send('clearAllCredentials')
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
