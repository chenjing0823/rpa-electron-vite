const { RGBA } = require('@nut-tree-fork/nut-js')

let isRunning = false
let isCheckhotarea = false
// let type = 'win-ding'
// let a_width = 140
// let b_width = 280
// let t_height = 80
// let m_color = new RGBA(255, 0, 0, 255)

let type = 'win-wx'
let a_width = 58
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
