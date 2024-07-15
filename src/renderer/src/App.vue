<script setup>
import versions from './components/Versions.vue'
import HotAreaCheck from './components/hot-area-check.vue'
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
  return checkhotarea.value ? '关闭热区检查' : '开启热区检查'
})

window.electronAPI.onUpdateStart((value) => {
  startFlag.value = value
})

window.electronAPI.onPullGroup(() => {
  // path.value = value
  // console.log(value)
})

window.electronAPI.onUpdateCheckhotarea((value) => {
  checkhotarea.value = value.flag
  a_width.value = value.a
  b_width.value = value.b
  t_height.value = value.t
})

const ipcHandleSend = (val) => window.api.apiStart(val)

// const ipcHandlePullGroup = () => window.api.apiPullGroup()

const ipcHandleCheckhotarea = (val) => window.api.apiCheckhotarea({ type: 'flag', val: val })
</script>

<template>
  <img alt="logo" class="logo" src="./assets/xbb-logo.png" />
  <div class="creator">销帮帮 RPA</div>
  <div class="actions">
    <div class="action">
      <a target="_blank" rel="noreferrer" @click="ipcHandleSend(startFlag)">{{ textSartchat }}</a>
    </div>
    <!-- <div class="action">
      <a target="_blank" rel="noreferrer" @click="ipcHandlePullGroup">拉取群消息</a>
    </div> -->
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
  <versions />
</template>
