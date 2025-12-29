# Vote - 投票评分网站

<div align="center">
  <a href="https://github.com/xJasonShane/Vote">
    <img src="https://img.shields.io/badge/Astro-FF5D01?style=for-the-badge&logo=astro&logoColor=white" alt="Astro" />
  </a>
  <a href="https://github.com/xJasonShane/Vote">
    <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  </a>
  <a href="https://github.com/xJasonShane/Vote">
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  </a>
  <a href="https://github.com/xJasonShane/Vote">
    <img src="https://img.shields.io/badge/Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  </a>
  <a href="https://github.com/xJasonShane/Vote/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="MIT License" />
  </a>
  <a href="https://github.com/xJasonShane/Vote/actions">
    <img src="https://img.shields.io/github/actions/workflow/status/xJasonShane/Vote/deploy.yml?style=for-the-badge&label=Build" alt="Build Status" />
  </a>
</div>

一个基于Astro + React + Tailwind CSS构建的投票评分网站，支持GitHub Pages和Vercel一键部署。

## 功能特性

- 🔧 **话题管理** - 创建、编辑、删除话题
- 📝 **内容管理** - 在话题中添加角色/项目等自定义内容
- ⭐ **评分系统** - 多维度评分与统计
- 💬 **点评功能** - 文字点评与互动
- 👤 **用户系统** - 匿名访问与可选登录
- 📱 **响应式设计** - 适配移动端
- 🚀 **一键部署** - 支持GitHub Pages和Vercel

## 技术栈

- **前端框架**: Astro + React
- **样式框架**: Tailwind CSS
- **语言**: TypeScript
- **构建工具**: Vite

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 <http://localhost:4321> 查看网站。

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 项目结构

```
├── src/
│   ├── components/          # React组件
│   ├── layouts/             # 页面布局
│   ├── pages/               # 页面组件
│   ├── styles/              # 样式文件
│   ├── utils/               # 工具函数
│   └── types/               # TypeScript类型定义
├── public/                  # 静态资源
├── astro.config.mjs         # Astro配置
├── tailwind.config.js       # Tailwind配置
├── tsconfig.json            # TypeScript配置
└── package.json             # 依赖管理
```

## 部署指南

### GitHub Pages

1. 在 `astro.config.mjs` 中配置 `site` 和 `base`：

```javascript
export default defineConfig({
  site: 'https://your-username.github.io',
  base: '/your-repo-name',
  // ...其他配置
});
```

1. 创建 `.github/workflows/deploy.yml` 文件：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

1. 推送代码到GitHub，GitHub Actions将自动部署。

### Vercel

1. 登录Vercel官网：<https://vercel.com>
2. 点击 "New Project"，选择你的GitHub仓库
3. 配置构建命令：`npm run build`
4. 配置输出目录：`dist`
5. 点击 "Deploy" 完成部署

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request！

## 联系方式

如有问题，欢迎通过GitHub Issues反馈。
