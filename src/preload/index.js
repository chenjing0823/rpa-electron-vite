import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  apiStart: (val) => ipcRenderer.send('api-start', val),
  apiLogin: (val) => ipcRenderer.send('api-login', val),
  apiTriggelAxios: (val) => ipcRenderer.send('api-triggel-axios', val),
  apiCheckhotarea: (val) => ipcRenderer.send('api-checkhotarea', val),
  apiOther: (val) => ipcRenderer.send('api-other', val)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('electronAPI', {
      getOther: (callback) => ipcRenderer.on('get-other', (_event, value) => callback(value)),
      onUpdateStart: (callback) =>
        ipcRenderer.on('update-start', (_event, value) => callback(value)),
      onTriggelAxios: (callback) =>
        ipcRenderer.on('triggel-axios', (_event, value) => callback(value)),
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
