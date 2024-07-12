<script setup>
import { ref } from 'vue'
import { ElInputNumber } from 'element-plus'

// props
const props = defineProps({
  aWidth: {
    type: Number
  },
  bWidth: {
    type: Number
  },
  tHeight: {
    type: Number
  }
})

const a_width = ref(props.aWidth)
const b_width = ref(props.bWidth)
const t_height = ref(props.tHeight)

const handleChangeA = (val) => window.api.apiCheckhotarea({ type: 'a', val: val })
const handleChangeB = (val) => window.api.apiCheckhotarea({ type: 'b', val: val })
const handleChangeT = (val) => window.api.apiCheckhotarea({ type: 't', val: val })

</script>

<template>
  <div class="hot-area-check">
    <div class="adjust-item">
      <span>左右调整</span>
      <el-input-number v-model="a_width" :min="1" :max="1000" :step="1" @change="handleChangeA" />
    </div>
    <div class="adjust-item">
      <span>上下调整</span>
      <el-input-number v-model="t_height" :min="1" :max="1000" :step="1" @change="handleChangeT" />
    </div>
    <div class="adjust-item">
      <span>宽度调整</span>
      <el-input-number v-model="b_width" :min="1" :max="1000" :step="1" @change="handleChangeB" />
    </div>
  </div>
</template>
