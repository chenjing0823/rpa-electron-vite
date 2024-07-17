<script setup>
import { ref } from 'vue'
import { ElForm, ElFormItem, ElInput, ElButton } from 'element-plus'

const emits = defineEmits(['handleLogin'])

const ruleFormRef = ref(null)
const ruleForm = ref({
  phone: '',
  pwd: ''
})
const rules = ref({
  phone: [
    {
      required: true,
      trigger: 'blur',
      message: '请输入手机号'
    }
  ],
  pwd: [
    {
      required: true,
      trigger: 'blur',
      message: '请输入密码'
    }
  ]
})

const submitForm = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      emits('handleLogin', ruleForm.value)
    } else {
      console.log('error submit!', fields)
    }
  })
}

const resetForm = (formEl) => {
  if (!formEl) return
  formEl.resetFields()
}
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="ruleForm"
    status-icon
    :rules="rules"
    label-width="120px"
    class="demo-ruleForm"
  >
    <el-form-item label="手机号" prop="phone">
      <el-input v-model="ruleForm.phone" autocomplete="off" />
    </el-form-item>
    <el-form-item label="密码" prop="pwd">
      <el-input v-model="ruleForm.pwd" type="password" autocomplete="off" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm(ruleFormRef)">Submit</el-button>
      <el-button @click="resetForm(ruleFormRef)">Reset</el-button>
    </el-form-item>
  </el-form>
</template>

<style>
.el-form {
  width: 400px;
  padding-right: 40px;
}
.el-button--primary {
  color: #ffffff;
  background-color: #ff6a00;
  border-color: #ff6a00;
}
.el-button:hover {
  color: #ff8c2e;
  border-color: #ffe0ba;
  background-color: #ffffff;
}
.el-button--primary:hover {
  border-color: #ff8c2e;
  color: #ffffff;
  background-color: #ff8c2e;
}
</style>
