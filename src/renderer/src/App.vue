<script setup>
import AppVersion from './components/app-version.vue'
import Rpa from './components/rpa.vue'
import Login from './components/login.vue'
import { ref } from 'vue'

const isLogin = ref(true)

const handleLogin = (value) => {
  isLogin.value = true
  console.log(value)
}
</script>

<template>
  <div class="app-content">
    <Rpa v-if="isLogin"></Rpa>
    <Login v-else @handle-login="handleLogin"></Login>
  </div>
  <AppVersion />
</template>
