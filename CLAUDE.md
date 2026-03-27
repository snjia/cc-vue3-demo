# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 语言规范

所有对话和文档都使用中文。

## 常用命令

- `npm run dev` — 启动开发服务器（Vite，带热更新）
- `npm run build` — 类型检查 + 生产构建（并行执行 `type-check` 和 `build-only`）
- `npm run build-only` — 仅构建，不检查类型
- `npm run type-check` — 运行 `vue-tsc --build` 类型检查
- `npm run lint` — 先运行 oxlint，再运行 ESLint（均自动修复）
- `npm run format` — 使用 Prettier 格式化 `src/` 目录

## 技术栈

Vue 3（Composition API + `<script setup>`）+ TypeScript 5.9 + Vite 7 + Pinia 3 + Vue Router 5

## 架构

- `src/main.ts` — 应用入口，注册 Pinia 和 Vue Router
- `src/router/index.ts` — 路由配置（createWebHistory）
- `src/stores/` — Pinia store，使用 Setup Store 风格（组合式函数而非 options 对象）
- `src/App.vue` — 根组件
- 路径别名：`@` 映射到 `src/`

## 代码规范

- Lint 工具链：oxlint（快速检查）→ ESLint（深度检查），配置在 `eslint.config.ts` 和 `.oxlintrc.json`
- 格式化：Prettier，配置在 `.prettierrc.json`
- oxlint 启用了 eslint、typescript、unicorn、oxc、vue 插件，correctness 类别为 error
- Node.js 版本要求：`^20.19.0 || >=22.12.0`
