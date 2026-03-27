<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getUserList, deleteUser, updateUserStatus, batchDeleteUsers, getRoleList } from '@/api/user'
import type { UserInfo, UserQueryParams, RoleInfo } from '@/types/user'
import UserForm from './components/UserForm.vue'
import RoleAssign from './components/RoleAssign.vue'

// 查询参数
const queryParams = reactive<UserQueryParams>({
  page: 1,
  pageSize: 10,
  username: '',
  nickname: '',
  status: undefined,
  roleId: undefined,
})

// 表格数据
const tableData = ref<UserInfo[]>([])
const total = ref(0)
const loading = ref(false)

// 角色列表
const roleList = ref<RoleInfo[]>([])

// 弹窗控制
const formVisible = ref(false)
const roleAssignVisible = ref(false)
const currentUser = ref<UserInfo | null>(null)

// 选中的行
const selectedRows = ref<UserInfo[]>([])

// 获取用户列表
const fetchData = async () => {
  loading.value = true
  try {
    const res = await getUserList(queryParams)
    tableData.value = res.list
    total.value = res.total
  } catch {
    console.error('获取用户列表失败')
  } finally {
    loading.value = false
  }
}

// 获取角色列表
const fetchRoleList = async () => {
  try {
    roleList.value = await getRoleList()
  } catch {
    console.error('获取角色列表失败')
  }
}

// 搜索
const handleSearch = () => {
  queryParams.page = 1
  fetchData()
}

// 重置
const handleReset = () => {
  queryParams.username = ''
  queryParams.nickname = ''
  queryParams.status = undefined
  queryParams.roleId = undefined
  queryParams.page = 1
  fetchData()
}

// 新增
const handleAdd = () => {
  currentUser.value = null
  formVisible.value = true
}

// 编辑
const handleEdit = (row: UserInfo) => {
  currentUser.value = { ...row }
  formVisible.value = true
}

// 删除
const handleDelete = async (row: UserInfo) => {
  try {
    await ElMessageBox.confirm(`确定要删除用户 "${row.nickname}" 吗？`, '提示', {
      type: 'warning',
    })
    await deleteUser(row.id)
    ElMessage.success('删除成功')
    fetchData()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败')
    }
  }
}

// 批量删除
const handleBatchDelete = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要删除的用户')
    return
  }

  try {
    await ElMessageBox.confirm(`确定要删除选中的 ${selectedRows.value.length} 个用户吗？`, '提示', {
      type: 'warning',
    })
    await batchDeleteUsers(selectedRows.value.map((row) => row.id))
    ElMessage.success('批量删除成功')
    fetchData()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('批量删除失败')
    }
  }
}

// 状态切换
const handleStatusChange = async (row: UserInfo) => {
  try {
    await updateUserStatus(row.id, row.status)
    ElMessage.success('状态更新成功')
  } catch {
    // 恢复原状态
    row.status = row.status === 1 ? 0 : 1
    console.error('状态更新失败')
  }
}

// 分配角色
const handleAssignRole = (row: UserInfo) => {
  currentUser.value = { ...row }
  roleAssignVisible.value = true
}

// 分页
const handlePageChange = (page: number) => {
  queryParams.page = page
  fetchData()
}

const handleSizeChange = (size: number) => {
  queryParams.pageSize = size
  queryParams.page = 1
  fetchData()
}

// 表单提交成功
const handleFormSuccess = () => {
  formVisible.value = false
  fetchData()
}

// 角色分配成功
const handleRoleAssignSuccess = () => {
  roleAssignVisible.value = false
  fetchData()
}

onMounted(() => {
  fetchData()
  fetchRoleList()
})
</script>

<template>
  <div class="user-manage">
    <!-- 搜索表单 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="queryParams" inline>
        <el-form-item label="用户名">
          <el-input v-model="queryParams.username" placeholder="请输入用户名" clearable class="search-input" @keyup.enter="handleSearch" />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="queryParams.nickname" placeholder="请输入昵称" clearable class="search-input" @keyup.enter="handleSearch" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.status" placeholder="请选择状态" clearable class="search-input">
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="queryParams.roleId" placeholder="请选择角色" clearable class="search-input">
            <el-option v-for="role in roleList" :key="role.id" :label="role.name" :value="role.id" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格 -->
    <el-card class="table-card" shadow="never">
      <!-- 工具栏 -->
      <div class="table-toolbar">
        <el-button type="primary" @click="handleAdd">新增用户</el-button>
        <el-button type="danger" @click="handleBatchDelete">批量删除</el-button>
      </div>

      <!-- 表格 -->
      <el-table v-loading="loading" :data="tableData" @selection-change="selectedRows = $event">
        <el-table-column type="selection" width="50" />
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="nickname" label="昵称" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="phone" label="手机号" />
        <el-table-column prop="roleName" label="角色" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-switch
              v-model="row.status"
              :active-value="1"
              :inactive-value="0"
              @change="handleStatusChange(row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="240" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="primary" link @click="handleAssignRole(row)">分配角色</el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="queryParams.page"
          v-model:page-size="queryParams.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <!-- 用户表单弹窗 -->
    <UserForm
      v-model:visible="formVisible"
      :user="currentUser"
      :role-list="roleList"
      @success="handleFormSuccess"
    />

    <!-- 角色分配弹窗 -->
    <RoleAssign
      v-model:visible="roleAssignVisible"
      :user="currentUser"
      :role-list="roleList"
      @success="handleRoleAssignSuccess"
    />
  </div>
</template>

<style scoped lang="scss">
.user-manage {
  .search-card {
    margin-bottom: 16px;
  }

  .search-input {
    width: 200px;
  }

  .table-toolbar {
    margin-bottom: 16px;
  }

  .pagination-wrapper {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
