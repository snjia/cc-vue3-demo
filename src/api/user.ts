import { request } from '@/utils/request'
import type { UserInfo, UserQueryParams, UserFormData, RoleInfo } from '@/types/user'
import type { PaginationResponse } from '@/types/common'

// 登录
export function login(data: { username: string; password: string }) {
  return request.post<{ token: string; userInfo: UserInfo }>('/login', data)
}

// 获取用户列表
export function getUserList(params: UserQueryParams) {
  return request.get<PaginationResponse<UserInfo>>('/user/list', { params })
}

// 获取用户详情
export function getUserDetail(id: number) {
  return request.get<UserInfo>(`/user/${id}`)
}

// 新增用户
export function createUser(data: UserFormData) {
  return request.post<UserInfo>('/user', data)
}

// 更新用户
export function updateUser(id: number, data: Partial<UserFormData>) {
  return request.put<UserInfo>(`/user/${id}`, data)
}

// 删除用户
export function deleteUser(id: number) {
  return request.delete<void>(`/user/${id}`)
}

// 批量删除用户
export function batchDeleteUsers(ids: number[]) {
  return request.post<void>('/user/batch-delete', { ids })
}

// 更新用户状态
export function updateUserStatus(id: number, status: 0 | 1) {
  return request.put<void>(`/user/${id}/status`, { status })
}

// 分配角色
export function assignRole(userId: number, roleId: number) {
  return request.put<void>(`/user/${userId}/role`, { roleId })
}

// 获取角色列表
export function getRoleList() {
  return request.get<RoleInfo[]>('/role/list')
}
