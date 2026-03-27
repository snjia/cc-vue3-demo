<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { createUser, updateUser } from '@/api/user'
import type { UserInfo, UserFormData, RoleInfo } from '@/types/user'

const props = defineProps<{
  visible: boolean
  user: UserInfo | null
  roleList: RoleInfo[]
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  success: []
}>()

const formRef = ref<FormInstance>()
const loading = ref(false)

// 是否是编辑模式
const isEdit = computed(() => !!props.user)

// 表单数据
const formData = ref<UserFormData>({
  username: '',
  nickname: '',
  email: '',
  phone: '',
  password: '',
  status: 1,
  roleId: undefined as unknown as number,
})

// 表单验证规则
const rules = computed<FormRules>(() => ({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线', trigger: 'blur' },
  ],
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '昵称长度在 2 到 20 个字符', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
  ],
  password: [
    { required: !isEdit.value, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' },
  ],
  roleId: [{ required: true, message: '请选择角色', trigger: 'change' }],
}))

// 弹窗标题
const title = computed(() => (isEdit.value ? '编辑用户' : '新增用户'))

// 监听 visible 变化，初始化表单数据
watch(
  () => props.visible,
  (val) => {
    if (val) {
      if (props.user) {
        // 编辑模式，填充数据
        formData.value = {
          id: props.user.id,
          username: props.user.username,
          nickname: props.user.nickname,
          email: props.user.email,
          phone: props.user.phone,
          password: '',
          status: props.user.status,
          roleId: props.user.roleId,
          departmentId: props.user.departmentId,
        }
      } else {
        // 新增模式，重置表单
        resetForm()
      }
    }
  },
)

// 重置表单
const resetForm = () => {
  formData.value = {
    username: '',
    nickname: '',
    email: '',
    phone: '',
    password: '',
    status: 1,
    roleId: undefined as unknown as number,
  }
  formRef.value?.clearValidate()
}

// 关闭弹窗
const handleClose = () => {
  emit('update:visible', false)
  resetForm()
}

// 提交表单
const handleSubmit = async () => {
  try {
    const valid = await formRef.value?.validate()
    if (!valid) return

    loading.value = true

    if (isEdit.value && formData.value.id) {
      // 编辑
      const { id, ...data } = formData.value
      // 密码为空时不提交
      if (!data.password) {
        delete data.password
      }
      await updateUser(id, data)
      ElMessage.success('更新成功')
    } else {
      // 新增
      await createUser(formData.value)
      ElMessage.success('创建成功')
    }

    emit('success')
    handleClose()
  } catch {
    console.error('提交失败')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <el-dialog
    :model-value="visible"
    :title="title"
    width="600px"
    @update:model-value="$emit('update:visible', $event)"
    @close="handleClose"
  >
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="formData.username" placeholder="请输入用户名" :disabled="isEdit" />
      </el-form-item>

      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="formData.nickname" placeholder="请输入昵称" />
      </el-form-item>

      <el-form-item label="邮箱" prop="email">
        <el-input v-model="formData.email" placeholder="请输入邮箱" />
      </el-form-item>

      <el-form-item label="手机号" prop="phone">
        <el-input v-model="formData.phone" placeholder="请输入手机号" />
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-input v-model="formData.password" type="password" placeholder="请输入密码" show-password />
        <template #extra v-if="isEdit">
          <span class="form-tip">留空则不修改密码</span>
        </template>
      </el-form-item>

      <el-form-item label="角色" prop="roleId">
        <el-select v-model="formData.roleId" placeholder="请选择角色">
          <el-option v-for="role in roleList" :key="role.id" :label="role.name" :value="role.id" />
        </el-select>
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio :value="1">启用</el-radio>
          <el-radio :value="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" :loading="loading" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.form-tip {
  color: #909399;
  font-size: 12px;
}
</style>
