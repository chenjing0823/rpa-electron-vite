<script setup>
import versions from './components/Versions.vue'
import { ref, computed } from 'vue'

const checkhotarea = ref(false)
const path = ref('')
// const clip = ref('')
const showText = computed(() => {
  return checkhotarea.value ? '关闭热区检查' : '开启热区检查'
})

window.electronAPI.onUpdateCheckhotarea((value) => {
  checkhotarea.value = value
})
window.electronAPI.onUpdatePath((value) => {
  path.value = value
})
window.electronAPI.getClipboardy(async (value) => {
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
  console.log(result)
  window.api.apiGetclipboardy(result)
})

const ipcHandleSend = () => window.api.apiStart()
const ipcHandleStop = () => window.api.apiStop()
const ipcHandleCheckhotarea = (val) => window.api.apiCheckhotarea(val)
</script>

<template>
  <img alt="logo" class="logo" src="./assets/xbb-logo.png" />
  <div class="creator">销帮帮 RPA</div>
  <div class="actions">
    <div class="action">
      <a target="_blank" rel="noreferrer" @click="ipcHandleSend">开始</a>
    </div>
    <div class="action">
      <a target="_blank" rel="noreferrer" @click="ipcHandleStop">停止</a>
    </div>
    <div class="action">
      <a target="_blank" rel="noreferrer" @click="ipcHandleCheckhotarea(checkhotarea)">{{
        showText
      }}</a>
    </div>
  </div>
  <div style="color: black">截图路径: {{ path }}</div>
  <versions />
</template>
