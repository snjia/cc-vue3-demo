<script setup lang="ts">
import { ref, onMounted } from 'vue'

const stats = ref([
  { title: '用户总数', value: 1024, icon: 'User', color: '#409eff' },
  { title: '活跃用户', value: 789, icon: 'UserFilled', color: '#67c23a' },
  { title: '新增用户', value: 56, icon: 'Plus', color: '#e6a23c' },
  { title: '访问量', value: 12345, icon: 'View', color: '#f56c6c' },
])

onMounted(() => {
  // 可以在这里获取统计数据
})
</script>

<template>
  <div class="dashboard">
    <!-- 统计卡片 -->
    <el-row :gutter="16" class="stat-row">
      <el-col v-for="stat in stats" :key="stat.title" :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" :style="{ backgroundColor: stat.color }">
              <el-icon :size="28">
                <component :is="stat.icon" />
              </el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stat.value }}</div>
              <div class="stat-title">{{ stat.title }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 快捷操作 -->
    <el-card shadow="never" class="quick-actions">
      <template #header>
        <span>快捷操作</span>
      </template>
      <el-row :gutter="16">
        <el-col :span="6">
          <router-link to="/system/user">
            <div class="action-item">
              <el-icon :size="32" color="#409eff"><User /></el-icon>
              <span>用户管理</span>
            </div>
          </router-link>
        </el-col>
        <el-col :span="6">
          <div class="action-item">
            <el-icon :size="32" color="#67c23a"><Setting /></el-icon>
            <span>系统设置</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="action-item">
            <el-icon :size="32" color="#e6a23c"><Document /></el-icon>
            <span>日志查看</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="action-item">
            <el-icon :size="32" color="#f56c6c"><DataAnalysis /></el-icon>
            <span>数据统计</span>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 欢迎信息 -->
    <el-card shadow="never" class="welcome-card">
      <div class="welcome-content">
        <h2>欢迎使用后台管理系统</h2>
        <p>这是一个基于 Vue 3 + Element Plus 构建的后台管理系统模板。</p>
        <p>主要功能包括：用户管理、角色分配、权限控制等。</p>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.dashboard {
  .stat-row {
    margin-bottom: 16px;
  }

  .stat-card {
    .stat-content {
      display: flex;
      align-items: center;
      gap: 16px;

      .stat-icon {
        width: 56px;
        height: 56px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
      }

      .stat-info {
        .stat-value {
          font-size: 24px;
          font-weight: 600;
          color: #303133;
        }

        .stat-title {
          font-size: 14px;
          color: #909399;
          margin-top: 4px;
        }
      }
    }
  }

  .quick-actions {
    margin-bottom: 16px;

    .action-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 24px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        background-color: #f5f7fa;
      }

      span {
        color: #606266;
        font-size: 14px;
      }
    }
  }

  .welcome-card {
    .welcome-content {
      text-align: center;
      padding: 32px 0;

      h2 {
        margin: 0 0 16px;
        color: #303133;
      }

      p {
        margin: 8px 0;
        color: #606266;
      }
    }
  }
}
</style>
