<script setup lang="ts">
import type { RouteRecordRaw } from 'vue-router'

defineProps<{
  item: RouteRecordRaw
  basePath: string
}>()

// 解析完整路径
const resolvePath = (basePath: string, routePath: string): string => {
  if (routePath.startsWith('/')) {
    return routePath
  }
  if (basePath.endsWith('/')) {
    return basePath + routePath
  }
  return basePath + '/' + routePath
}

// 判断是否有子菜单
const hasChildren = (item: RouteRecordRaw): boolean => {
  const children = item.children?.filter((c) => !c.meta?.hidden)
  return (children?.length ?? 0) > 0
}

// 获取显示的子菜单
const getVisibleChildren = (item: RouteRecordRaw): RouteRecordRaw[] => {
  return item.children?.filter((c) => !c.meta?.hidden) ?? []
}
</script>

<template>
  <!-- 有子菜单 -->
  <el-sub-menu v-if="hasChildren(item)" :index="resolvePath(basePath, item.path)">
    <template #title>
      <el-icon v-if="item.meta?.icon">
        <component :is="item.meta.icon" />
      </el-icon>
      <span>{{ item.meta?.title }}</span>
    </template>

    <!-- 递归渲染子菜单 -->
    <template v-for="child in getVisibleChildren(item)" :key="child.path">
      <MenuItem :item="child" :base-path="resolvePath(basePath, item.path)" />
    </template>
  </el-sub-menu>

  <!-- 无子菜单，直接渲染菜单项 -->
  <el-menu-item v-else :index="resolvePath(basePath, item.path)">
    <el-icon v-if="item.meta?.icon">
      <component :is="item.meta.icon" />
    </el-icon>
    <span>{{ item.meta?.title }}</span>
  </el-menu-item>
</template>
