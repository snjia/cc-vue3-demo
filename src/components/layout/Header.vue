<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'

const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()

// 切换侧边栏
const toggleSidebar = () => {
  appStore.toggleSidebar()
}

// 退出登录
const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      type: 'warning',
    })
    userStore.logout()
    router.push('/login')
  } catch {
    // 取消操作
  }
}
</script>

<template>
  <div class="header-container">
    <!-- 左侧 -->
    <div class="header-left">
      <!-- 折叠按钮 -->
      <div class="collapse-btn" @click="toggleSidebar">
        <el-icon :size="20">
          <Fold v-if="!appStore.isSidebarCollapsed" />
          <Expand v-else />
        </el-icon>
      </div>

      <!-- 面包屑 -->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item v-for="(item, index) in $route.matched" :key="index">
          {{ item.meta?.title }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 右侧 -->
    <div class="header-right">
      <!-- 用户信息下拉菜单 -->
      <el-dropdown trigger="click">
        <div class="user-info">
          <el-avatar :size="32" icon="User" />
          <span class="username">{{ userStore.userInfo?.nickname || '用户' }}</span>
          <el-icon><ArrowDown /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>个人中心</el-dropdown-item>
            <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style scoped lang="scss">
.header-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.collapse-btn {
  cursor: pointer;
  display: flex;
  align-items: center;
  color: #606266;

  &:hover {
    color: #409eff;
  }
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 0 8px;
  height: 50px;

  &:hover {
    background-color: #f5f7fa;
  }

  .username {
    font-size: 14px;
    color: #606266;
  }
}
</style>
