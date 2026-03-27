// 分页请求参数
export interface PaginationParams {
  page: number
  pageSize: number
}

// 分页响应数据
export interface PaginationResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

// 通用 API 响应
export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

// 表格排序参数
export interface SortParams {
  prop: string
  order: 'ascending' | 'descending' | null
}
