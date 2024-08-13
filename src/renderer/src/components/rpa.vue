<script setup>
import HotAreaCheck from './hot-area-check.vue'
import { debounce } from '../utils/index.js'
import { ref, computed } from 'vue'
import { ElButton } from 'element-plus'

const checkhotarea = ref(false)
const startFlag = ref(false)
const a_width = ref(0)
const b_width = ref(0)
const t_height = ref(0)
const loading = ref(false)

window.electronAPI.onUpdateStart((value) => {
  setTimeout(() => {
    startFlag.value = value
    loading.value = false
  }, 500)
})

window.electronAPI.onTriggelAxios(async () => {})

window.electronAPI.onUpdateCheckhotarea((value) => {
  checkhotarea.value = value.flag
  a_width.value = value.a
  b_width.value = value.b
  t_height.value = value.t
})
const textSartchat = computed(() => {
  return startFlag.value ? '停止' : '开始'
})

const textHotarea = computed(() => {
  return checkhotarea.value ? '关闭热区检查' : '列表热区检查'
})

const ipcHandleSend = (val) => {
  loading.value = true
  if (checkhotarea.value) {
    window.api.apiCheckhotarea({ type: 'flag', val: checkhotarea.value })
  }
  window.api.apiStart({ val: val, env: process.env.NODE_ENV })
}

const ipcHandleCheckhotarea = debounce(
  (val) => window.api.apiCheckhotarea({ type: 'flag', val: val }),
  1000
)
</script>
<template>
  <img alt="logo" class="logo" src="../assets/xbb-logo.png" />
  <div class="creator">销帮帮 RPA</div>
  <div>
    <el-button type="primary" :loading="loading" @click="ipcHandleSend(startFlag)">{{
      textSartchat
    }}</el-button>
    <el-button type="primary" @click="ipcHandleCheckhotarea(checkhotarea)">{{
      textHotarea
    }}</el-button>
  </div>
  <div class="adjust-block">
    <HotAreaCheck
      v-if="checkhotarea"
      :a-width="a_width"
      :b-width="b_width"
      :t-height="t_height"
    ></HotAreaCheck>
  </div>
</template>
