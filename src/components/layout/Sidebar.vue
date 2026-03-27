<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { asyncRoutes } from '@/router/routes'
import MenuItem from './MenuItem.vue'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()

// 过滤需要显示的路由
const menuRoutes = computed(() => {
  return asyncRoutes.filter((r) => !r.meta?.hidden)
})

// 当前激活的菜单
const activeMenu = computed(() => {
  const { path } = route
  return path
})

// 是否折叠
const isCollapse = computed(() => appStore.isSidebarCollapsed)

// 点击菜单
const handleSelect = (path: string) => {
  router.push(path)
}
</script>

<template>
  <div class="sidebar-container">
    <!-- Logo -->
    <div class="sidebar-logo">
      <h1 v-show="!isCollapse">Admin</h1>
      <h1 v-show="isCollapse">A</h1>
    </div>

    <!-- 菜单 -->
    <el-menu
      :default-active="activeMenu"
      :collapse="isCollapse"
      :unique-opened="true"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409eff"
      @select="handleSelect"
    >
      <!-- 使用递归组件渲染菜单 -->
      <template v-for="item in menuRoutes" :key="item.path">
        <MenuItem :item="item" base-path="" />
      </template>
    </el-menu>
  </div>
</template>

<style scoped lang="scss">
.sidebar-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.sidebar-logo {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #304156;
  border-bottom: 1px solid rgba(255, 255, 255, 0.02);

  h1 {
    color: #fff;
    font-size: 18px;
    font-weight: 600;
    margin: 0;
  }
}

.el-menu {
  border-right: none;
  flex: 1;
  overflow-y: auto;
}

/* 菜单折叠时隐藏标题 */
.el-menu--collapse {
  :deep(.el-sub-menu__title) {
    span {
      display: none;
    }
  }
}
</style>
