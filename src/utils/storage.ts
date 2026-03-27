/**
 * 本地存储封装
 */

const PREFIX = 'admin_'

/**
 * 设置 localStorage
 */
export function setStorage<T>(key: string, value: T): void {
  const data = JSON.stringify(value)
  localStorage.setItem(PREFIX + key, data)
}

/**
 * 获取 localStorage
 */
export function getStorage<T>(key: string): T | null {
  const data = localStorage.getItem(PREFIX + key)
  if (data) {
    try {
      return JSON.parse(data) as T
    } catch {
      return null
    }
  }
  return null
}

/**
 * 移除 localStorage
 */
export function removeStorage(key: string): void {
  localStorage.removeItem(PREFIX + key)
}

/**
 * 清空 localStorage
 */
export function clearStorage(): void {
  const keys = Object.keys(localStorage)
  keys.forEach((key) => {
    if (key.startsWith(PREFIX)) {
      localStorage.removeItem(key)
    }
  })
}

/**
 * 设置 sessionStorage
 */
export function setSession<T>(key: string, value: T): void {
  const data = JSON.stringify(value)
  sessionStorage.setItem(PREFIX + key, data)
}

/**
 * 获取 sessionStorage
 */
export function getSession<T>(key: string): T | null {
  const data = sessionStorage.getItem(PREFIX + key)
  if (data) {
    try {
      return JSON.parse(data) as T
    } catch {
      return null
    }
  }
  return null
}

/**
 * 移除 sessionStorage
 */
export function removeSession(key: string): void {
  sessionStorage.removeItem(PREFIX + key)
}
