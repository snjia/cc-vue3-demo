import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getToken, setToken, removeToken, getUserInfo, setUserInfo, removeUserInfo } from '@/utils/auth'
import type { UserInfo } from '@/types/user'

export const useUserStore = defineStore('user', () => {
  // Token
  const token = ref<string | null>(getToken())

  // 用户信息
  const userInfo = ref<UserInfo | null>(getUserInfo())

  // 是否已登录
  const isLoggedIn = computed(() => !!token.value && !!userInfo.value)

  // 用户角色
  const userRole = computed(() => userInfo.value?.roleName || '')

  // 设置 Token
  const setTokenAction = (newToken: string) => {
    token.value = newToken
    setToken(newToken)
  }

  // 设置用户信息
  const setUserInfoAction = (info: UserInfo) => {
    userInfo.value = info
    setUserInfo(info)
  }

  // 登出
  const logout = () => {
    token.value = null
    userInfo.value = null
    removeToken()
    removeUserInfo()
  }

  return {
    token,
    userInfo,
    isLoggedIn,
    userRole,
    setTokenAction,
    setUserInfoAction,
    logout,
  }
})
