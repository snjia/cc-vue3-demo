import Mock from 'mockjs'
import type { UserInfo, RoleInfo } from '@/types/user'

const Random = Mock.Random

// 角色数据
const roles: RoleInfo[] = [
  { id: 1, name: '超级管理员', code: 'admin', description: '拥有所有权限' },
  { id: 2, name: '普通管理员', code: 'manager', description: '管理用户和内容' },
  { id: 3, name: '普通用户', code: 'user', description: '基础访问权限' },
]

// 生成用户列表数据
const generateUsers = (count: number): UserInfo[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    username: Random.word(5, 10),
    nickname: Random.cname(),
    email: Random.email(),
    phone: Mock.mock('@string("number", 11)') as string,
    avatar: Random.image('100x100', Random.color(), Random.word(1)),
    status: Random.pick([0, 1]),
    roleId: Random.pick([1, 2, 3]),
    roleName: Random.pick(roles.map((r) => r.name)),
    departmentId: Random.integer(1, 10),
    departmentName: Random.pick(['技术部', '产品部', '运营部', '市场部', '人事部']),
    createdAt: Random.datetime('yyyy-MM-dd HH:mm:ss'),
    updatedAt: Random.datetime('yyyy-MM-dd HH:mm:ss'),
  }))
}

// 用户数据存储
let users = generateUsers(100)

// 获取用户列表
Mock.mock(/\/api\/user\/list/, 'get', (options) => {
  const url = new URL(options.url, 'http://localhost')
  const page = parseInt(url.searchParams.get('page') || '1')
  const pageSize = parseInt(url.searchParams.get('pageSize') || '10')
  const username = url.searchParams.get('username') || ''
  const nickname = url.searchParams.get('nickname') || ''
  const status = url.searchParams.get('status')
  const roleId = url.searchParams.get('roleId')

  // 过滤数据
  const filteredUsers = users.filter((user) => {
    if (username && !user.username.includes(username)) return false
    if (nickname && !user.nickname.includes(nickname)) return false
    if (status !== null && user.status !== parseInt(status)) return false
    if (roleId !== null && user.roleId !== parseInt(roleId)) return false
    return true
  })

  // 分页
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const list = filteredUsers.slice(start, end)

  return {
    code: 200,
    message: 'success',
    data: {
      list,
      total: filteredUsers.length,
      page,
      pageSize,
    },
  }
})

// 获取用户详情
Mock.mock(/\/api\/user\/\d+$/, 'get', (options) => {
  const id = parseInt(options.url.match(/\/api\/user\/(\d+)$/)?.[1] || '0')
  const user = users.find((u) => u.id === id)

  if (user) {
    return { code: 200, message: 'success', data: user }
  }
  return { code: 404, message: '用户不存在', data: null }
})

// 新增用户
Mock.mock('/api/user', 'post', (options) => {
  const body = JSON.parse(options.body)
  const newUser: UserInfo = {
    ...body,
    id: users.length + 1,
    avatar: Random.image('100x100', Random.color()),
    createdAt: Random.datetime('yyyy-MM-dd HH:mm:ss'),
    updatedAt: Random.datetime('yyyy-MM-dd HH:mm:ss'),
  }
  users.unshift(newUser)
  return { code: 200, message: 'success', data: newUser }
})

// 更新用户
Mock.mock(/\/api\/user\/\d+$/, 'put', (options) => {
  const id = parseInt(options.url.match(/\/api\/user\/(\d+)$/)?.[1] || '0')
  const body = JSON.parse(options.body)
  const index = users.findIndex((u) => u.id === id)

  if (index > -1) {
    users[index] = {
      ...users[index],
      ...body,
      updatedAt: Random.datetime('yyyy-MM-dd HH:mm:ss'),
    }
    return { code: 200, message: 'success', data: users[index] }
  }
  return { code: 404, message: '用户不存在', data: null }
})

// 删除用户
Mock.mock(/\/api\/user\/\d+$/, 'delete', (options) => {
  const id = parseInt(options.url.match(/\/api\/user\/(\d+)$/)?.[1] || '0')
  const index = users.findIndex((u) => u.id === id)

  if (index > -1) {
    users.splice(index, 1)
    return { code: 200, message: 'success', data: null }
  }
  return { code: 404, message: '用户不存在', data: null }
})

// 批量删除用户
Mock.mock('/api/user/batch-delete', 'post', (options) => {
  const { ids } = JSON.parse(options.body)
  users = users.filter((u) => !ids.includes(u.id))
  return { code: 200, message: 'success', data: null }
})

// 更新用户状态
Mock.mock(/\/api\/user\/\d+\/status$/, 'put', (options) => {
  const id = parseInt(options.url.match(/\/api\/user\/(\d+)\/status$/)?.[1] || '0')
  const { status } = JSON.parse(options.body)
  const index = users.findIndex((u) => u.id === id)

  if (index > -1 && users[index]) {
    users[index].status = status
    users[index].updatedAt = Random.datetime('yyyy-MM-dd HH:mm:ss')
    return { code: 200, message: 'success', data: null }
  }
  return { code: 404, message: '用户不存在', data: null }
})

// 分配角色
Mock.mock(/\/api\/user\/\d+\/role$/, 'put', (options) => {
  const id = parseInt(options.url.match(/\/api\/user\/(\d+)\/role$/)?.[1] || '0')
  const { roleId } = JSON.parse(options.body)
  const index = users.findIndex((u) => u.id === id)
  const role = roles.find((r) => r.id === roleId)

  if (index > -1 && role) {
    users[index]!.roleId = roleId
    users[index]!.roleName = role.name
    users[index]!.updatedAt = Random.datetime('yyyy-MM-dd HH:mm:ss')
    return { code: 200, message: 'success', data: null }
  }
  return { code: 404, message: '用户或角色不存在', data: null }
})

// 获取角色列表
Mock.mock('/api/role/list', 'get', () => {
  return { code: 200, message: 'success', data: roles }
})

// 登录
Mock.mock('/api/login', 'post', (options) => {
  const { username, password } = JSON.parse(options.body)
  if (username === 'admin' && password === '123456') {
    return {
      code: 200,
      message: 'success',
      data: {
        token: Random.guid(),
        userInfo: {
          id: 1,
          username: 'admin',
          nickname: '超级管理员',
          email: 'admin@example.com',
          phone: '13800138000',
          status: 1,
          roleId: 1,
          roleName: '超级管理员',
          createdAt: Random.datetime('yyyy-MM-dd HH:mm:ss'),
          updatedAt: Random.datetime('yyyy-MM-dd HH:mm:ss'),
        },
      },
    }
  }
  return { code: 401, message: '用户名或密码错误', data: null }
})
