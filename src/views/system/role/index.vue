<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

interface RoleInfo {
  id: number
  name: string
  code: string
  description: string
  status: 0 | 1
  createdAt: string
}

// 表格数据
const tableData = ref<RoleInfo[]>([])
const loading = ref(false)

// 查询参数
const queryParams = reactive({
  name: '',
  code: '',
  status: undefined as 0 | 1 | undefined,
})

// 弹窗控制
const dialogVisible = ref(false)
const dialogTitle = ref('新增角色')
const formData = reactive({
  id: 0,
  name: '',
  code: '',
  description: '',
  status: 1 as 0 | 1,
})

// 获取角色列表
const fetchData = () => {
  loading.value = true
  // 模拟数据
  setTimeout(() => {
    tableData.value = [
      { id: 1, name: '超级管理员', code: 'admin', description: '拥有所有权限', status: 1, createdAt: '2024-01-01 10:00:00' },
      { id: 2, name: '普通管理员', code: 'manager', description: '管理用户和内容', status: 1, createdAt: '2024-01-02 10:00:00' },
      { id: 3, name: '普通用户', code: 'user', description: '基础访问权限', status: 1, createdAt: '2024-01-03 10:00:00' },
    ]
    loading.value = false
  }, 300)
}

// 搜索
const handleSearch = () => {
  fetchData()
}

// 重置
const handleReset = () => {
  queryParams.name = ''
  queryParams.code = ''
  queryParams.status = undefined
  fetchData()
}

// 新增
const handleAdd = () => {
  dialogTitle.value = '新增角色'
  formData.id = 0
  formData.name = ''
  formData.code = ''
  formData.description = ''
  formData.status = 1
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: RoleInfo) => {
  dialogTitle.value = '编辑角色'
  formData.id = row.id
  formData.name = row.name
  formData.code = row.code
  formData.description = row.description
  formData.status = row.status
  dialogVisible.value = true
}

// 删除
const handleDelete = async (row: RoleInfo) => {
  try {
    await ElMessageBox.confirm(`确定要删除角色 "${row.name}" 吗？`, '提示', { type: 'warning' })
    ElMessage.success('删除成功')
    fetchData()
  } catch {
    // 取消删除
  }
}

// 提交表单
const handleSubmit = () => {
  if (!formData.name || !formData.code) {
    ElMessage.warning('请填写完整信息')
    return
  }
  ElMessage.success(formData.id ? '更新成功' : '创建成功')
  dialogVisible.value = false
  fetchData()
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="role-manage">
    <!-- 搜索表单 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="queryParams" inline>
        <el-form-item label="角色名称">
          <el-input v-model="queryParams.name" placeholder="请输入角色名称" clearable class="search-input" />
        </el-form-item>
        <el-form-item label="角色编码">
          <el-input v-model="queryParams.code" placeholder="请输入角色编码" clearable class="search-input" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.status" placeholder="请选择状态" clearable class="search-input">
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
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
      <div class="table-toolbar">
        <el-button type="primary" @click="handleAdd">新增角色</el-button>
      </div>

      <el-table v-loading="loading" :data="tableData">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="角色名称" />
        <el-table-column prop="code" label="角色编码" />
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form :model="formData" label-width="80px">
        <el-form-item label="角色名称" required>
          <el-input v-model="formData.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色编码" required>
          <el-input v-model="formData.code" placeholder="请输入角色编码" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="formData.description" type="textarea" placeholder="请输入描述" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="formData.status">
            <el-radio :value="1">启用</el-radio>
            <el-radio :value="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.role-manage {
  .search-card {
    margin-bottom: 16px;
  }

  .search-input {
    width: 200px;
  }

  .table-toolbar {
    margin-bottom: 16px;
  }
}
</style>
