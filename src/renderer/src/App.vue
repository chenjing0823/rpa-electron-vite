<script setup>
import AppVersion from './components/app-version.vue'
import HotAreaCheck from './components/hot-area-check.vue'
import { debounce } from './utils/index.js'
import { ref, computed } from 'vue'

const checkhotarea = ref(false)
const startFlag = ref(false)
// const path = ref('')
const a_width = ref(0)
const b_width = ref(0)
const t_height = ref(0)
// const clip = ref('')
const textSartchat = computed(() => {
  return startFlag.value ? '停止' : '开始'
})

const textHotarea = computed(() => {
  return checkhotarea.value ? '关闭热区检查' : '列表热区检查'
})

window.electronAPI.onUpdateStart((value) => {
  startFlag.value = value
})

window.electronAPI.onTriggelAxios(async () => {})

window.electronAPI.onUpdateCheckhotarea((value) => {
  checkhotarea.value = value.flag
  a_width.value = value.a
  b_width.value = value.b
  t_height.value = value.t
})

const ipcHandleSend = debounce((val) => {
  if (checkhotarea.value) {
    ipcHandleCheckhotarea(checkhotarea.value)
  }
  window.api.apiStart(val)
}, 1000)

// const ipcHandlePullGroup = () => window.api.apiPullGroup()

const ipcHandleCheckhotarea = debounce(
  (val) => window.api.apiCheckhotarea({ type: 'flag', val: val }),
  1000
)
</script>

<template>
  <img alt="logo" class="logo" src="./assets/xbb-logo.png" />
  <div class="creator">销帮帮 RPA</div>
  <div class="actions">
    <div class="action">
      <a target="_blank" rel="noreferrer" @click="ipcHandleSend(startFlag)">{{ textSartchat }}</a>
    </div>
    <div class="action">
      <a target="_blank" rel="noreferrer" @click="ipcHandleCheckhotarea(checkhotarea)">{{
        textHotarea
      }}</a>
    </div>
  </div>
  <div class="adjust-block">
    <HotAreaCheck
      v-if="checkhotarea"
      :a-width="a_width"
      :b-width="b_width"
      :t-height="t_height"
    ></HotAreaCheck>
  </div>
  <AppVersion />
</template>
