<script setup>
import AppVersion from './components/app-version.vue'
import Rpa from './components/rpa.vue'
import Login from './components/login.vue'
import { ref } from 'vue'

const isLogin = ref(false)

const handleLogin = (value) => {
  isLogin.value = true
  window.api.apiLogin(JSON.parse(JSON.stringify(value)))
}
</script>

<template>
  <div class="app-content">
    <Rpa v-if="isLogin"></Rpa>
    <Login v-else @handle-login="handleLogin"></Login>
  </div>
  <AppVersion />
</template>
