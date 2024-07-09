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
  up
} = require('@nut-tree-fork/nut-js')
const { exec } = require('child_process')
const iconv = require('iconv-lite')
const copyPaste = require('copy-paste')

import deRedClick from './red-click.js'
import { getRunningStatus, get_a_b_width } from './globals.js'

screen.config.resourceDirectory = __dirname
screen.config.highlightOpacity = 0.3
mouse.config.mouseSpeed = 2000

let isScrollDown = true
let scrollCount = 0

let _mainWindow

/**
 * @description: 鼠标起点位置
 */
const moveToRoot = async () => {
  const { a, b, t } = get_a_b_width()
  await mouse.move(straightTo(centerOf(new Region(a, t, b, 70))))
  await mouse.leftClick()
}

const moveToMessage = async () => {
  await sleep(5000)
  const { a, b, t } = get_a_b_width()
  const x = a + b + 12
  const y = t + 5
  const height = await screen.height()
  await mouse.move(straightTo(new Point(x, y)))
  await mouse.drag(straightTo(new Point(x, height)))
  await keyboard.pressKey(Key.LeftControl, Key.C)
  await keyboard.releaseKey(Key.LeftControl, Key.C)
  copyPaste.paste(function (error, text) {
    if (error) {
      console.error('err:', error)
    } else {
      const val = text.toString('utf-8')
      _mainWindow.mainWindow.webContents.send('get-clipboardy', val)
    }
  })
}
// const imagePath = path.join(__dirname, 'img/screenshot.png')
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
      // await handleEnter();
      await moveToMessage()
    } else {
      handleStart()
    }
  }
  moveToPos() // 开始遍历数组
}

/**
 * @description: 输入框消息输入
 */
const handleEnter = async (val) => {
  // const text = await screen.capture('screenshot.png');
  // console.log(text)
  // const str = '这个是在代码里的文本 将复制这个文本';
  const lastData = val.map((i) => i.join('\n'))
  // const lastData = val[val.length - 1]
  const send = lastData.join('\n')
  exec('clip').stdin.end(iconv.encode(send, 'gbk'))
  await mouse.move(right(100))
  await mouse.move(up(100))
  await mouse.leftClick()
  await keyboard.pressKey(Key.LeftControl, Key.V)
  await keyboard.releaseKey(Key.LeftControl, Key.V)

  await keyboard.pressKey(Key.Enter)
  await keyboard.releaseKey(Key.Enter)
  // await moveToRoot();
  handleStart()
}

/**
 * @description: 开始执行脚本
 * @param {*} isFirst
 * @returns
 */
const handleStart = async (target) => {
  if (target) {
      _mainWindow = target
  }
  if (target && target.val && target.val.length) {
    await handleEnter(target.val)
  } else {
    // try {
    //   const text = await screen.capture('screenshot.png');
    //   _mainWindow.mainWindow.webContents.send('update-path', text);
    // } catch (err) {
    //   console.log(err)
    // }
    if (getRunningStatus()) {
      await moveToRoot()
      await sleep(1000)
      // await handleEnter()
      const { allRedPoint, scroll } = await deRedClick()
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
    } else {
      console.log('停止运行')
      return false
    }
  }
}

export default handleStart
