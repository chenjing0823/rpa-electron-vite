<script setup>
import { ref, computed } from 'vue'

const status = ref(false)
window.electronAPI.onUpdateStart((value) => {
  status.value = value
})

const nowenv = computed(() => {
  return process.env.NODE_ENV
})

const showStatus = computed(() => {
  return status.value ? '运行中' : '未运行'
})
</script>

<template>
  <div class="running-status">
    <span>运行状态：{{ showStatus }}, 当前环境：{{ nowenv }}</span>
    <span>版本：1.0.3</span>
  </div>
</template>
