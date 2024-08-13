const { RGBA } = require('@nut-tree-fork/nut-js')
const fs = require('fs')
const axios = require('axios')
const { clipboard, nativeImage } = require('electron')

import { config, API_PREFIX } from './config/index.js'
let isRunning = false
let isCheckhotarea = false
let env = 'development'
let token = {}
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
// let m_color = new RGBA(250, 81,81, 255)

// let type = 'mac-wx'
// let a_width = 60
// let b_width = 260
// let t_height = 60
// let m_color = new RGBA(222, 87, 71, 255)

export const getLogin = () => {
  return token
}

export const setLogin = (val) => {
  token = val
}

export const getEnv = () => {
  return env
}

export const setEnv = (val) => {
  env = val
}

export const getType = () => {
  return type
}

function throttle(func, delay) {
  let lastCalledTime = 0

  return function (...args) {
    const now = Date.now()

    if (now - lastCalledTime >= delay) {
      func(...args)
      lastCalledTime = now
    }
  }
}

function cacheData(data) {
  fs.writeFileSync('cache.txt', JSON.stringify(data))
}

function readCachedData() {
  try {
    const data = fs.readFileSync('cache.txt', 'utf-8')
    return JSON.parse(data)
  } catch (err) {
    // 处理文件不存在或读取错误的情况
    return null
  }
}

export const get_app_config = () => {
  const { a, b, t } = readCachedData() || {}
  return {
    a: a || a_width,
    b: b || b_width,
    t: t || t_height,
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
  throttle(
    cacheData({
      a: a_width,
      b: b_width,
      t: t_height,
      m: m_color
    }),
    500
  )
}

export const getRunningStatus = () => {
  return isRunning
}

export const setRunningStatus = async (val, callback) => {
  const env = getEnv()
  const token = getLogin()
  const apiUrl = config[env].apiUrl
  const params = {
    corpid: token.corpid,
    userId: token.userId,
    status: val ? 1 : 0
  }
  try {
    const response = await axios.post(`${apiUrl}${API_PREFIX}/im/msg/reply/status`, params)
    const { data } = response
    console.log('setRunningStatus', data)
  } catch (error) {
    console.error('setRunningStatus', error)
  }
  isRunning = val
  callback && callback()
}

export const getCheckhotareaStatus = () => {
  return isCheckhotarea
}

export const setCheckhotareaStatus = (val) => {
  isCheckhotarea = val
}

export const getClipboardContent = () => {
  return new Promise((resolve) => {
    resolve(clipboard.readText())
  })
}

export const writeToClipboard = (text) => {
  return new Promise((resolve) => {
    clipboard.writeText(text)
    resolve()
  })
}

export const writeImgToClipboard = (imageUrl) => {
  return new Promise((resolve) => {
    axios({
      method: 'get',
      url: imageUrl,
      responseType: 'stream'
    })
      .then((response) => {
        const writer = fs.createWriteStream('image.jpg')
        response.data.pipe(writer)
        // 处理完成的事件
        writer.on('finish', () => {
          console.log('dowmload img success')
          // 创建一个NativeImage实例
          const image = nativeImage.createFromPath('image.jpg')
          // 将图片写入剪切板
          clipboard.writeImage(image)
          resolve(true)
        })

        // 处理错误的事件
        writer.on('error', (err) => {
          console.error('dowmload img false', err)
          resolve(false)
        })
      })
      .catch((error) => {
        console.error('get img err:', error)
        resolve(false)
      })
  })
}

export const restartTime = 3000 // 重启时间
export const intervalFlagTime = 3000 // 识别红点再次识别需等待时间
export const intoMessageWaitTime = 7000 // 进入消息页等待时间
