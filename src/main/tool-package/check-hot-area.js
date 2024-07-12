const { screen, Region } = require('@nut-tree-fork/nut-js')
import { getCheckhotareaStatus, get_app_config } from '../globals.js'
screen.config.highlightDurationMs = 1000
const checkHotArea = async () => {
  if (getCheckhotareaStatus()) {
    const height = await screen.height()
    const { a, b, t } = get_app_config()
    await screen.highlight(new Region(a, t, b, height - 160))
    setTimeout(() => {
      checkHotArea()
    }, 500)
  }
}
// checkHotArea()
export default checkHotArea
