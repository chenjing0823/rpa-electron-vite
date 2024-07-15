const { RGBA } = require('@nut-tree-fork/nut-js')
const { exec } = require('child_process')
import iconv from 'iconv-lite'

let isRunning = false
let isCheckhotarea = false
// let type = 'win-ding'
// let a_width = 140
// let b_width = 280
// let t_height = 80
// let m_color = new RGBA(255, 0, 0, 255)

let type = 'win-wx'
let a_width = 60
let b_width = 268
let t_height = 62
let m_color = new RGBA(240, 74, 62, 255)

// let type = 'mac-wx'
// let a_width = 60
// let b_width = 260
// let t_height = 60
// let m_color = new RGBA(222, 87, 71, 255)

export const getType = () => {
  return type
}

export const get_app_config = () => {
  return {
    a: a_width,
    b: b_width,
    t: t_height,
    m: m_color
  }
}

export const set_app_config = ({ key, value }) => {
  if (key === 'a') {
    a_width = value
  } else if (key === 'b') {
    b_width = value
  } else if (key === 't') {
    t_height = value
  }
}

export const getRunningStatus = () => {
  return isRunning
}

export const setRunningStatus = (val) => {
  isRunning = val
}

export const getCheckhotareaStatus = () => {
  return isCheckhotarea
}

export const setCheckhotareaStatus = (val) => {
  isCheckhotarea = val
}

export const getClipboardContent = () => {
  return new Promise((resolve, reject) => {
    const readClipboardCommand =
      process.platform === 'win32' ? 'powershell.exe Get-Clipboard' : 'pbpaste'

    exec(readClipboardCommand, (err, stdout, stderr) => {
      if (err) {
        reject(err)
        return
      }
      if (stderr) {
        reject(new Error(stderr))
        return
      }
      resolve(stdout.trim())
    })
  })
}

export const writeToClipboard = (text) => {
  return new Promise((resolve, reject) => {
    const encodedText = iconv.encode(text, 'gbk')
    const childProcess = exec('clip')

    childProcess.stdin.end(encodedText, async (err) => {
      if (err) {
        reject(err)
        return
      }
      resolve() // 执行完毕，没有错误
    })
  })
}

export const restartTime = 5000 // 重启时间
export const intervalFlagTime = 5000 // 识别红点再次识别需等待时间
export const intoMessageWaitTime = 5000 // 进入消息页等待时间
