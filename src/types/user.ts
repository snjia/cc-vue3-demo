// 用户信息
export interface UserInfo {
  id: number
  username: string
  nickname: string
  email: string
  phone: string
  avatar?: string
  status: 0 | 1 // 0: 禁用, 1: 启用
  roleId: number
  roleName: string
  departmentId?: number
  departmentName?: string
  createdAt: string
  updatedAt: string
}

// 用户列表查询参数
export interface UserQueryParams {
  page: number
  pageSize: number
  username?: string
  nickname?: string
  status?: 0 | 1
  roleId?: number
}

// 用户表单数据（新增/编辑）
export interface UserFormData {
  id?: number
  username: string
  nickname: string
  email: string
  phone: string
  password?: string
  status: 0 | 1
  roleId: number
  departmentId?: number
}

// 角色信息
export interface RoleInfo {
  id: number
  name: string
  code: string
  description?: string
}
