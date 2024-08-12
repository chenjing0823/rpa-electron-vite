import { app, shell, BrowserWindow, ipcMain, globalShortcut } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

import { handleStart } from './tool-package/entry.js'
import { checkColor } from './tool-package/check-color.js'
import checkhotarea from './tool-package/check-hot-area.js'

import {
  setRunningStatus,
  setCheckhotareaStatus,
  get_app_config,
  set_app_config,
  setEnv,
  setLogin
} from './globals.js'

let mainWindow
function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 600,
    height: 450,
    show: false,
    icon: icon, // 设置任务栏图标
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // 注册 Ctrl+Q 快捷键
  const ret = globalShortcut.register('CommandOrControl+Q', () => {
    // 在这里执行你想要的操作，比如关闭应用程序等
    console.log('Ctrl+Q is pressed')
    const callback = () => {
      mainWindow.webContents.send('update-start', false)
    }
    setRunningStatus(false, callback)
  })

  if (!ret) {
    console.log('注册快捷键失败')
  }

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))
  ipcMain.on('api-login', (event, value) => {
    console.log('login', value)
    setLogin(value)
    // mainWindow.setSize(800, 600, true)
  })
  ipcMain.on('api-start', (event, value) => {
    const { val, env } = value
    setEnv(env)
    const callback = () => {
      mainWindow.webContents.send('update-start', !val)
      if (!val) {
        // startFlag
        handleStart({ mainWindow })
      }
    }
    setRunningStatus(!val, callback)

  })
  ipcMain.on('api-checkcolor', (event, val) => {
    setTimeout(async () => {
      const color = await checkColor()
      console.log('index color', color)
    }, 3000)
  })
  ipcMain.on('api-checkhotarea', (event, { type, val }) => {
    if (type === 'flag') {
      setCheckhotareaStatus(!val)
      if (!val) {
        checkhotarea()
      }
      const { a, b, t } = get_app_config()
      mainWindow.webContents.send('update-checkhotarea', { flag: !val, a, b, t })
    } else if (type === 'a') {
      set_app_config({ key: 'a', value: val })
    } else if (type === 'b') {
      set_app_config({ key: 'b', value: val })
    } else if (type === 't') {
      set_app_config({ key: 't', value: val })
    }
  })
  ipcMain.on('api-triggel-axios', (event, val) => {
    console.log('val', val)
  })
  ipcMain.on('api-other', (event, val) => {
    console.log('val', val)
    console.log('event', event)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
  // 当应用程序退出时，取消注册快捷键
  app.on('will-quit', () => {
    // 解除注册快捷键
    globalShortcut.unregister('CommandOrControl+Q')

    // 如果是 macOS，需要手动退出，因为全局快捷键不会自动注销
    globalShortcut.unregisterAll()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
