<script setup>
import { ElButton } from 'element-plus'

const handleClick = () => {
  window.api.apiCheckColor()
}
</script>
<template>
  <div>
    <el-button type="primary" @click="handleClick">检查颜色</el-button>
  </div>
</template>
