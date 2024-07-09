import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  apiStart: () => ipcRenderer.send('api-start'),
  apiStop: () => ipcRenderer.send('api-stop'),
  apiCheckhotarea: (val) => ipcRenderer.send('api-checkhotarea', val),
  apiGetclipboardy: (val) => ipcRenderer.send('api-getclipboardy', val)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('electronAPI', {
      getClipboardy: (callback) =>
        ipcRenderer.on('get-clipboardy', (_event, value) => callback(value)),
      onUpdateCounter: (callback) =>
        ipcRenderer.on('update-counter', (_event, value) => callback(value)),
      onUpdatePath: (callback) => ipcRenderer.on('update-path', (_event, value) => callback(value)),
      onUpdateCheckhotarea: (callback) =>
        ipcRenderer.on('update-checkhotarea', (_event, value) => callback(value))
    })
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
