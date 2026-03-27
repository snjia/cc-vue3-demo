import Mock from 'mockjs'

// 设置延迟响应
Mock.setup({
  timeout: '200-600',
})

// 导入各模块 Mock
import './user'

export default Mock
