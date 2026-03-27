<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { login } from '@/api/user'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const formRef = ref<FormInstance>()
const loading = ref(false)

const formData = reactive({
  username: 'admin',
  password: '123456',
})

const rules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

const handleSubmit = async () => {
  try {
    const valid = await formRef.value?.validate()
    if (!valid) return

    loading.value = true
    const res = await login(formData)

    // 保存登录信息
    userStore.setTokenAction(res.token)
    userStore.setUserInfoAction(res.userInfo)

    ElMessage.success('登录成功')

    // 跳转到目标页面或首页
    const redirect = (route.query.redirect as string) || '/'
    router.push(redirect)
  } catch {
    console.error('登录失败')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <h1>Admin</h1>
        <p>后台管理系统</p>
      </div>

      <el-form ref="formRef" :model="formData" :rules="rules" class="login-form">
        <el-form-item prop="username">
          <el-input v-model="formData.username" placeholder="用户名" prefix-icon="User" size="large" />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="formData.password"
            type="password"
            placeholder="密码"
            prefix-icon="Lock"
            size="large"
            show-password
            @keyup.enter="handleSubmit"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="large" :loading="loading" class="login-btn" @click="handleSubmit">
            登 录
          </el-button>
        </el-form-item>
      </el-form>

      <div class="login-tip">
        <p>提示：用户名 admin，密码 123456</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-box {
  width: 400px;
  padding: 40px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;

  h1 {
    margin: 0;
    font-size: 32px;
    color: #409eff;
  }

  p {
    margin: 8px 0 0;
    color: #909399;
    font-size: 14px;
  }
}

.login-form {
  .el-form-item {
    margin-bottom: 24px;
  }

  .login-btn {
    width: 100%;
  }
}

.login-tip {
  text-align: center;
  margin-top: 16px;

  p {
    margin: 0;
    color: #909399;
    font-size: 12px;
  }
}
</style>
