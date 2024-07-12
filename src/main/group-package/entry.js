import { getRunningStatus, get_app_config } from '../globals.js'
const {
  screen,
  mouse,
  straightTo,
  centerOf,
  Region,
  Point,
  sleep,
  keyboard,
  Key,
  Button,
  right,
  down,
  clipboard,
  up,
  pixelWithColor,
  RGBA
} = require('@nut-tree-fork/nut-js')

const fs = require('fs')
let groupName = ''

/**
 * @description: 鼠标起点位置
 */
async function moveToRoot() {
  const { a, b, t } = get_app_config()
  await mouse.move(straightTo(centerOf(new Region(a, t, b, 64))))
}

async function scrollUpTimes() {
  for (let i = 0; i < 100; i++) {
    await mouse.scrollUp(5)
  }
}
async function scrollDwonTimes() {
  for (let i = 0; i < 100; i++) {
    await mouse.scrollDown(5)
  }
}

async function findMaxY(points) {

    let max_y = -Infinity;
    let max_point = null;
    
    points.forEach(point => {
        if (point.y > max_y) {
            max_y = point.y;
            max_point = point;
        } else if (point.y === max_y) {
            if (point.x > max_point.x) {
                max_point = point;
            }
        }
    });
    
    console.log("Point with maximum y and maximum x if tie:", max_point);
    
    // return new Point(maxXInMaxY, maxY);
}

async function getAllMessage() {
  await mouse.leftClick()
  await sleep(1000)
  const { a, b, t } = get_app_config()
  const x = a + b + 12
  const y = t + 5
  const height = await screen.height()

  await mouse.move(straightTo(new Point(x, y)))
  await scrollUpTimes()
  await mouse.pressButton(Button.LEFT)
  await mouse.move(straightTo(new Point(x, 200)))
  await scrollDwonTimes()
  await mouse.move(straightTo(new Point(x, 790)))
  // 选中文字的颜色
  const colorLocation = await screen.findAll(pixelWithColor(new RGBA(51, 153, 255, 255)))
  const maxPoint = await findMaxY(colorLocation)
//   await mouse.releaseButton(Button.LEFT)
//   // 右击复制 start
//   await sleep(500)
//   await mouse.move(straightTo(maxPoint))
//   await mouse.rightClick()
//   await sleep(500)
//   await mouse.move(right(60))
//   await mouse.move(down(15))
//   await sleep(500)
//   await mouse.leftClick()
//   const message = await clipboard.getContent()
//   console.log('message', message)
//   try {
//     // 文件路径
//     const filePath = `${groupName}.txt`
//     fs.writeFileSync(filePath, message)
//     console.log(`Data has been written to ${filePath}`)
//   } catch (err) {
//     console.error('Error writing file:', err)
//   }
  // 右击复制 end
//   await moveToRoot()

//   // 清除当前群 start
//   await mouse.rightClick()
//   await sleep(500)
//   await mouse.move(right(100))
//   await mouse.move(down(150))
//   await sleep(500)
//   await mouse.move(right(150))
//   await mouse.move(down(30))
//   await sleep(500)
//   await mouse.leftClick()
//   // 清除当前群 end

//   // restart
//   pullGroupMessage()
}
async function getGroupName() {
  const { a, b, t } = get_app_config()
  const x = a + b + 30
  await mouse.move(straightTo(new Point(x, t - 25)))
  // 右击复制 start
  await sleep(500)
  await mouse.rightClick()
  await sleep(500)
  await mouse.move(right(40))
  await mouse.move(down(20))
  await sleep(500)
  await mouse.leftClick()
  groupName = await clipboard.getContent()
  // 右击复制 end
}

async function pullGroupMessage() {
  if (getRunningStatus()) {
    await moveToRoot()
    await mouse.leftClick()
    await getGroupName()
    await getAllMessage()
  } else {
    console.log('停止运行')
    return false
  }
}

export { pullGroupMessage }
