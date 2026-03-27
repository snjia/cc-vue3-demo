<script setup lang="ts"></script>

<template>
  <el-card shadow="never">
    <template #header>
      <span>三级菜单 - 1</span>
    </template>
    <p>这是多级菜单示例 - 三级菜单页面 1</p>
    <p>路径：/multi-level/level1/level2-2/level3-1</p>
    <el-alert type="success" title="恭喜！三级菜单功能正常工作" :closable="false" show-icon style="margin-top: 16px" />
  </el-card>
</template>

<style scoped></style>
