import { getStorage, setStorage, removeStorage } from './storage'
import type { UserInfo } from '@/types/user'

const TOKEN_KEY = 'token'
const USER_INFO_KEY = 'user_info'

/**
 * 获取 Token
 */
export function getToken(): string | null {
  return getStorage<string>(TOKEN_KEY)
}

/**
 * 设置 Token
 */
export function setToken(token: string): void {
  setStorage(TOKEN_KEY, token)
}

/**
 * 移除 Token
 */
export function removeToken(): void {
  removeStorage(TOKEN_KEY)
}

/**
 * 获取用户信息
 */
export function getUserInfo(): UserInfo | null {
  return getStorage<UserInfo>(USER_INFO_KEY)
}

/**
 * 设置用户信息
 */
export function setUserInfo(userInfo: UserInfo): void {
  setStorage(USER_INFO_KEY, userInfo)
}

/**
 * 移除用户信息
 */
export function removeUserInfo(): void {
  removeStorage(USER_INFO_KEY)
}

/**
 * 清除所有认证信息
 */
export function clearAuth(): void {
  removeToken()
  removeUserInfo()
}
