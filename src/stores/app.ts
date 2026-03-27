import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  // 侧边栏折叠状态
  const isSidebarCollapsed = ref(false)

  // 设备类型
  const device = ref<'desktop' | 'mobile'>('desktop')

  // 切换侧边栏
  const toggleSidebar = () => {
    isSidebarCollapsed.value = !isSidebarCollapsed.value
  }

  // 关闭侧边栏（移动端）
  const closeSidebar = () => {
    isSidebarCollapsed.value = true
  }

  // 设置设备类型
  const setDevice = (value: 'desktop' | 'mobile') => {
    device.value = value
    if (value === 'mobile') {
      isSidebarCollapsed.value = true
    }
  }

  return {
    isSidebarCollapsed,
    device,
    toggleSidebar,
    closeSidebar,
    setDevice,
  }
})
