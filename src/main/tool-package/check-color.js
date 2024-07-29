const { mouse, screen } = require('@nut-tree-fork/nut-js')
async function checkColor() {
  const point = await mouse.getPosition()
  const color = await screen.colorAt(point)
  console.log('color', color)
  return color
}

export { checkColor }
