<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { assignRole } from '@/api/user'
import type { UserInfo, RoleInfo } from '@/types/user'

const props = defineProps<{
  visible: boolean
  user: UserInfo | null
  roleList: RoleInfo[]
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  success: []
}>()

const loading = ref(false)
const selectedRoleId = ref<number>()

// 监听 visible 变化，初始化选中的角色
watch(
  () => props.visible,
  (val) => {
    if (val && props.user) {
      selectedRoleId.value = props.user.roleId
    }
  },
)

// 关闭弹窗
const handleClose = () => {
  emit('update:visible', false)
}

// 提交
const handleSubmit = async () => {
  if (!props.user || !selectedRoleId.value) {
    ElMessage.warning('请选择角色')
    return
  }

  try {
    loading.value = true
    await assignRole(props.user.id, selectedRoleId.value)
    ElMessage.success('角色分配成功')
    emit('success')
    handleClose()
  } catch {
    console.error('角色分配失败')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <el-dialog
    :model-value="visible"
    title="分配角色"
    width="400px"
    @update:model-value="$emit('update:visible', $event)"
    @close="handleClose"
  >
    <div class="role-assign-content">
      <p class="user-info">
        当前用户：<span>{{ user?.nickname }}</span>
      </p>
      <el-radio-group v-model="selectedRoleId" class="role-list">
        <el-radio v-for="role in roleList" :key="role.id" :value="role.id" class="role-item">
          <div class="role-info">
            <span class="role-name">{{ role.name }}</span>
            <span class="role-desc">{{ role.description }}</span>
          </div>
        </el-radio>
      </el-radio-group>
    </div>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" :loading="loading" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.role-assign-content {
  .user-info {
    margin-bottom: 16px;
    color: #606266;

    span {
      font-weight: 500;
      color: #303133;
    }
  }

  .role-list {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .role-item {
      display: flex;
      align-items: flex-start;
      margin-right: 0;
      padding: 12px;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      transition: all 0.3s;

      &:hover {
        border-color: #409eff;
      }

      &.is-checked {
        border-color: #409eff;
        background-color: #ecf5ff;
      }

      .role-info {
        display: flex;
        flex-direction: column;
        gap: 4px;

        .role-name {
          font-size: 14px;
          color: #303133;
        }

        .role-desc {
          font-size: 12px;
          color: #909399;
        }
      }
    }
  }
}
</style>
