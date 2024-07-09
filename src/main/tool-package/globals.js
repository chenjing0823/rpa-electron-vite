let isRunning = false
let isCheckhotarea = false
// let type = 'win-ding'
// let a_width = 140
// let b_width = 280
// let t_height = 80

let type = 'win-wx'
let a_width = 58
let b_width = 268
let t_height = 62

export const getType = () => {
  return type
}

export const get_a_b_width = () => {
  return {
    a: a_width,
    b: b_width,
    t: t_height
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
