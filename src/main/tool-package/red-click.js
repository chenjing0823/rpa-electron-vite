const { screen, pixelWithColor } = require('@nut-tree-fork/nut-js')

import { get_app_config } from '../globals.js'

const findContinuousRegions = (points) => {
  let visited = {}
  points.forEach((point) => {
    visited[`${point.x},${point.y}`] = false
  })

  function exploreRegion(x, y, currentRegion) {
    visited[`${x},${y}`] = true
    currentRegion.push({ x, y })

    let neighbors = [
      { x: x - 1, y: y },
      { x: x + 1, y: y },
      { x: x, y: y - 1 },
      { x: x, y: y + 1 }
    ]

    neighbors.forEach((neighbor) => {
      let key = `${neighbor.x},${neighbor.y}`
      if (
        visited[key] === false &&
        points.find((point) => point.x === neighbor.x && point.y === neighbor.y)
      ) {
        exploreRegion(neighbor.x, neighbor.y, currentRegion)
      }
    })
  }

  let regions = []
  points.forEach((point) => {
    if (visited[`${point.x},${point.y}`] === false) {
      let currentRegion = []
      exploreRegion(point.x, point.y, currentRegion)
      regions.push(currentRegion)
    }
  })

  return regions
}

const doRedClick = async () => {
  const { a, b, m } = get_app_config()
  const colorToSearch = m
  let colorLocationAll = null
  try {
    // colorLocation = await screen.find(pixelWithColor(colorToSearch));
    colorLocationAll = await screen.findAll(pixelWithColor(colorToSearch))
  } catch (error) {
    console.log('获取错误')
    return {
      scroll: true
    }
  }
  if (colorLocationAll) {
    const result = findContinuousRegions(colorLocationAll)
    const allRedPoint = []
    result.forEach(async (point) => {
      const length = point.length
      const posX = point[0].x
      // const posDesc = posX > 130 ? '消息列表' : '功能列表'
      // console.log(`第${index + 1}个红点，位置在${posDesc}, 红点大小为：${length}`)
      // console.log(posX > 130 ? '是消息列表' : '不是消息列表')
      // 免打扰的小点 length = 27
      if (posX > a && posX < a + b && length > 60) {
        // 位置大于功能列宽，小于功能列宽+消息列宽，并且长度大于30
        allRedPoint.push(point[0])
      }
    })
    return {
      allRedPoint: allRedPoint,
      scroll: !allRedPoint.length
    }
  } else {
    console.log('未获得消息标志')
    return {
      allRedPoint: [],
      scroll: false
    }
  }
}

// doRedClick()

export default doRedClick
