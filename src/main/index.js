// =============================================================================
// Imports and initialisation.
// =============================================================================
'use strict'

import { app, Menu, ipcMain } from 'electron'

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

// The starting URL.
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

// =============================================================================
// Function - Create BrowserWindow.
// =============================================================================
function appReady () {
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

  // Provide context menu on right click to quit application.
  const contextMenu = Menu.buildFromTemplate([
    {label: 'Quit', click () { app.quit() }}
  ])

  // Fix for making API calls to Jira REST Server API.
  mainWindow.window.webContents.setUserAgent('xxx')

  // Disable/enable devTools.
  mainWindow.window.webContents.openDevTools()
  // mainWindow.window.webContents.closeDevTools()

  // Prevent people from opening devTools.
  mainWindow.window.webContents.on('devtools-opened', () => {
    // mainWindow.window.webContents.closeDevTools()
  })

  mainWindow.tray.on('click', () => {
    mainWindow.window.focus()
  })
  mainWindow.tray.on('right-click', () => {
    mainWindow.tray.popUpContextMenu(contextMenu)
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// =============================================================================
// App main.
// =============================================================================
app.on('ready', appReady)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    appReady()
  }
})

// =============================================================================
// ipcMain.
// =============================================================================
// Get toggl time entries data.
ipcMain.on('refreshToggl', (event, data) => {
  event.sender.send('refreshTogglTimeEntries', data)
})

// Clear the account data.
ipcMain.on('clearCredentials', (event) => {
  event.sender.send('clearCredentials')
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
