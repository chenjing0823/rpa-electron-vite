const {
  mouse,
  screen,
  straightTo,
  Point,
  keyboard,
  Key,
  centerOf,
  Region,
  sleep,
  right,
  down
} = require('@nut-tree-fork/nut-js')
const axios = require('axios')
import doRedClick from './red-click.js'
import {
  getRunningStatus,
  get_app_config,
  getEnv,
  getLogin,
  restartTime,
  intervalFlagTime,
  intoMessageWaitTime,
  getClipboardContent,
  writeToClipboard
} from '../globals.js'
import { config, API_PREFIX } from '../config/index.js'

screen.config.resourceDirectory = __dirname
screen.config.highlightOpacity = 0.3
mouse.config.mouseSpeed = 2000

let isScrollDown = true
let scrollCount = 0
let sessionName = ''

let intervalFlag = true
// 间隔标识。识别到红点后，若该标识为true，将值设置成false,
// 等待x秒再次识别，若红点还在，进入聊天。这样等待为了避免手机回复了消息，电脑重复回复

/**
 * @description: 鼠标起点位置
 */
const moveToRoot = async () => {
  const { a, b, t } = get_app_config()
  await mouse.move(straightTo(centerOf(new Region(a, t, b, 70))))
  await mouse.leftClick()
}

/**
 * 获取对话名称
 */
async function getSessionName() {
  const { a, b, t } = get_app_config()
  const x = a + b + 40
  const y = t - 25
  await mouse.move(straightTo(new Point(x, y)))
  await mouse.rightClick()
  await keyboard.pressKey(Key.LeftControl, Key.C)
  await keyboard.releaseKey(Key.LeftControl, Key.C)
  await sleep(1000)
  await mouse.move(right(20))
  await mouse.move(down(15))
  await mouse.leftClick()

  sessionName = await getClipboardContent()
}

/**
 * 鼠标移向聊天窗口
 */
const moveToMessage = async () => {
  await getSessionName()
  await sleep(intoMessageWaitTime)
  const { a, b, t } = get_app_config()
  const x = a + b + 12
  const x2 = a + b + 200
  const y = t + 5
  const height = await screen.height()
  await mouse.move(straightTo(new Point(x2, y)))
  await mouse.move(straightTo(new Point(x, y)))
  await mouse.drag(straightTo(new Point(x2, height - t - 50)))
  await keyboard.pressKey(Key.LeftControl, Key.C)
  await keyboard.releaseKey(Key.LeftControl, Key.C)
  const chatHistory = await getClipboardData()
  const dataFormat = await chatDataFormat(chatHistory)
  await getMsgReply(dataFormat)
}

async function handleInput() {
  // 激活输入框 输入内容并发送
  await mouse.leftClick()
  await keyboard.pressKey(Key.LeftControl, Key.V)
  await keyboard.releaseKey(Key.LeftControl, Key.V)

  await keyboard.pressKey(Key.Enter)
  await keyboard.releaseKey(Key.Enter)
  // await clipboard.setContent('')
  handleStart()
}

/**
 * @description: 执行未读消息红点点击
 * @param {Array} allRedPoint 未读消息红点数组
 */
const handerClickRedPoint = async (allRedPoint) => {
  const moveToPos = async () => {
    if (allRedPoint.length) {
      const point = allRedPoint[0] // 拿第一个点，发完消息都重新拿点
      const p = new Point(point.x, point.y)
      await mouse.move(straightTo(p))
      await sleep(1000)
      await mouse.leftClick()
      await moveToMessage()
    } else {
      handleStart()
    }
  }
  moveToPos() // 开始遍历数组
}

/**
 * 格式化剪贴板数据
 * @returns {Promise<void>} 在剪贴板内容更新完成后解析的 Promise
 */
async function getClipboardData() {
  const value = await getClipboardContent()
  // 使用换行符分割文本成数组
  const arr = value.trim().split('\n')
  let result = []
  let temp = []

  for (let item of arr) {
    if (item === '\r') {
      if (temp.length > 0) {
        result.push(temp)
        temp = []
      }
    } else {
      temp.push(item)
    }
  }

  if (temp.length > 0) {
    result.push(temp)
  }
  return result
}

function splitString(str) {
  const _str = str.trim()
  const regex = /(\d{1,2}-\d{1,2} \d{2}:\d{2}:\d{2})$/
  const match = _str.match(regex)
  if (match) {
    const timeStr = match[1]
    const name = _str.slice(0, _str.length - timeStr.length)
    return { name, time: timeStr }
  }
  return { name: '', time: '' }
}

function getRootTime() {
  // 获取当前年份
  const currentYear = new Date().getFullYear()
  // 构造当年的1月1日的 Date 对象
  const januaryFirst = new Date(currentYear, 0, 1, 0, 0, 0)
  // 获取对应的时间戳（单位：毫秒）
  const timestamp = januaryFirst.getTime()
  return timestamp
}

/**
 * 格式化聊天数据
 * 这个函数接受一个数组作为参数，并返回一个格式化后的数组
 * 每个元素包含 msgType、content、userName 和 sendTime 属性
 * @param {Array} arr - 要格式化的聊天数据数组
 * @returns {Array} - 格式化后的聊天数据数组
 */
async function chatDataFormat(arr) {
  const result = []
  arr.forEach((item) => {
    const nameAndTime = item.shift()
    // 分割字符串获取名字和时间部分
    // const parts = nameAndTime.split(' ')
    // const name = parts[0] // 名字部分
    // const time = parts.slice(1).join(' ') // 时间部分
    const { name, time } = splitString(nameAndTime)
    // 将时间转换为当前年份的时间戳
    const currentYear = new Date().getFullYear() // 获取当前年份
    const datetimeString = `${currentYear} ${time}` // 拼接当前年份和时间
    const timestamp = new Date(datetimeString).getTime() // 转换为时间戳
    result.push({
      msgType: 'text',
      content: item,
      userName: name,
      sendTime: timestamp
    })
  })
  if (result.length === 1 && !result[0].name && result[0].sendTime === getRootTime()) {
    const value = await getClipboardContent()
    result[0].content = [value]
  }
  await writeToClipboard(JSON.stringify(result))
  return result
}

async function getMsgReply(dataFormat) {
  const env = getEnv()
  const token = getLogin()
  const apiUrl = config[env].apiUrl
  axios
    .post(`${apiUrl}${API_PREFIX}/im/msg/reply`, {
      msgList: dataFormat,
      corpid: token.corpid,
      userId: token.userId,
      sessionName: sessionName
    })
    .then(async (res) => {
      await writeToClipboard(res.data.result.answer)
      await handleInput()
    })
    .catch((error) => {
      console.log(error)
      handleStart()
    })
    .finally(() => {
      sessionName = ''
    })
}

/**
 * 处理滚动或者点击事件
 *
 * 这个函数用于根据当前滚动状态和是否有红色点来执行不同的操作。
 * 如果是向下滚动且滚动次数未达到一定值，则继续向下滚动，并在滚动次数满足条件后设置一个定时器，等待一段时间后重启。
 * 如果是向上滚动，则向上滚动指定次数，重置滚动计数，并重新开始。
 * 如果没有滚动，则直接处理红色点。
 *
 * @async
 * @returns {Promise<void>} 一个 Promise，当初始操作完成时解析
 */
async function handleScrollOrClick() {
  const { allRedPoint, scroll } = await doRedClick()
  if (scroll && isScrollDown) {
    for (let index = 0; index < 6; index++) {
      scrollCount++
      await mouse.scrollDown(5)
    }
    if (scrollCount >= 12) {
      isScrollDown = false
    }
    await sleep(restartTime)
    handleStart()
  } else if (scroll && !isScrollDown) {
    for (let index = 0; index < 12; index++) {
      await mouse.scrollUp(5)
    }
    scrollCount = 0
    isScrollDown = true
    handleStart()
  } else if (intervalFlag) {
    await sleep(intervalFlagTime)
    intervalFlag = false
    handleStart()
  } else {
    intervalFlag = true
    handerClickRedPoint(allRedPoint)
  }
}

/**
 * @description: 开始执行脚本
 * @param {*} isFirst
 * @returns
 */
const handleStart = async () => {
  // await moveToMessage()
  if (getRunningStatus()) {
    await moveToRoot()
    await handleScrollOrClick()
  } else {
    console.log('停止运行')
    return false
  }
}

export { handleStart }
