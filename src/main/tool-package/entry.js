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
  up,
  clipboard
} = require('@nut-tree-fork/nut-js')

import doRedClick from './red-click.js'
import iconv from 'iconv-lite'
import { getRunningStatus, get_app_config } from '../globals.js'

screen.config.resourceDirectory = __dirname
screen.config.highlightOpacity = 0.3
mouse.config.mouseSpeed = 2000

let isScrollDown = true
let scrollCount = 0

/**
 * @description: 鼠标起点位置
 */
const moveToRoot = async () => {
  const { a, b, t } = get_app_config()
  await mouse.move(straightTo(centerOf(new Region(a, t, b, 70))))
  await mouse.leftClick()
}

const moveToMessage = async () => {
  await sleep(5000)
  const { a, b, t } = get_app_config()
  const x = a + b + 12
  const y = t + 5
  const height = await screen.height()
  await mouse.move(straightTo(new Point(x, y)))
  await mouse.drag(straightTo(new Point(x, height)))
  await keyboard.pressKey(Key.LeftControl, Key.C)
  await keyboard.releaseKey(Key.LeftControl, Key.C)
  await clipboardDataFormat()

  await handleInput()
}

async function handleInput() {
  const test = iconv.encode('你好', 'gbk')
  console.log(test)
  const test2 = iconv.decode(test, 'gbk')
  console.log(test2)
  // 激活输入框 输入内容并发送
  await mouse.move(right(100))
  await mouse.move(up(100))
  await mouse.leftClick()
  await keyboard.pressKey(Key.LeftControl, Key.V)
  await keyboard.releaseKey(Key.LeftControl, Key.V)

  await keyboard.pressKey(Key.Enter)
  await keyboard.releaseKey(Key.Enter)
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
async function clipboardDataFormat() {
  const value = await clipboard.getContent()
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
  const send = result.map((i) => i.join('\n')).join('\n')
  await clipboard.setContent(send)
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
    setTimeout(() => {
      handleStart()
    }, 5000)
  } else if (scroll && !isScrollDown) {
    for (let index = 0; index < 12; index++) {
      await mouse.scrollUp(5)
    }
    scrollCount = 0
    isScrollDown = true
    handleStart()
  } else {
    handerClickRedPoint(allRedPoint)
  }
}

/**
 * @description: 开始执行脚本
 * @param {*} isFirst
 * @returns
 */
const handleStart = async () => {
  if (getRunningStatus()) {
    await moveToRoot()
    await sleep(1000)
    await handleScrollOrClick()
  } else {
    console.log('停止运行')
    return false
  }
}

export { handleStart }
