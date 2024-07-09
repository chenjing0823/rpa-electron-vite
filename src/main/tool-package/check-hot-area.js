const { screen, Region } = require('@nut-tree-fork/nut-js')
import { getCheckhotareaStatus } from './globals.js'

const checkHotArea = async () => {
  if (getCheckhotareaStatus()) {
    const height = await screen.height()
    await screen.highlight(new Region(140, 80, 280, height - 160))
    setTimeout(() => {
      checkHotArea()
    }, 500)
  }
}
// checkHotArea()
export default checkHotArea
