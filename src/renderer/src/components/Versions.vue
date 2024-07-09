<script setup>
import { ref, computed } from 'vue'
const status = ref(false)
window.electronAPI.onUpdateCounter((value) => {
  status.value = value
})

const showStatus = computed(() => {
  return status.value ? '运行中' : '未运行'
})

</script>

<template>
  <div class="running-status">
    运行状态：{{ showStatus }}
  </div>
</template>
