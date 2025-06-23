# 图书管理系统

一个基于 Next.js 和 Supabase 构建的现代化图书管理系统，提供完整的身份验证和图书管理功能。

## 主要功能

- 🔐 **用户身份验证** - 基于 Supabase Auth 的安全登录/注册系统
- 📚 **图书管理** - 添加、编辑、删除和搜索图书
- 📖 **借阅管理** - 管理图书借阅和归还流程
- 👥 **用户管理** - 完善的用户权限系统
- 📱 **响应式设计** - 支持桌面和移动设备访问

## 技术栈

- **前端框架**: Next.js 14 (App Router)
- **身份验证**: Supabase Auth
- **数据库**: Supabase (PostgreSQL)
- **样式**: Tailwind CSS + shadcn/ui
- **表单管理**: React Hook Form + Zod
- **状态管理**: TanStack Query
- **通知系统**: Sonner

## 身份验证系统

本系统已从自定义身份验证迁移到 Supabase Auth，提供以下优势：

### 主要特性
- ✅ 邮箱/密码登录
- ✅ 安全的会话管理
- ✅ 自动 token 刷新
- ✅ 邮箱验证支持
- ✅ 密码重置功能
- ✅ 路由保护中间件

### 登录流程
1. 用户在 `/user/login` 页面输入邮箱和密码
2. 系统调用 `supabase.auth.signInWithPassword()` 进行验证
3. 登录成功后自动跳转到 `/dashboard`
4. 中间件自动保护受保护的路由

### 注册流程
1. 用户在 `/user/register` 页面输入邮箱和密码
2. 系统调用 `supabase.auth.signUp()` 创建账户
3. 根据配置，用户需要验证邮箱或可直接登录

## 项目结构

```
src/
├── app/
│   ├── (protected)/          # 受保护的路由
│   │   └── dashboard/        # 仪表板页面
│   ├── api/                  # API 路由（旧的自定义验证，已废弃）
│   ├── user/                 # 用户相关页面
│   │   ├── login/           # 登录页面
│   │   └── register/        # 注册页面
│   ├── layout.tsx           # 全局布局
│   └── page.tsx             # 主页
├── components/
│   └── ui/                  # UI 组件库
├── utils/
│   └── supabase/            # Supabase 配置
│       ├── client.ts        # 客户端配置
│       ├── server.ts        # 服务端配置
│       └── middleware.ts    # 中间件配置
└── middleware.ts            # 路由保护中间件
```

## 开始使用

### 环境配置

1. 复制环境变量文件：
```bash
cp .env.example .env.local
```

2. 配置 Supabase 环境变量：
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 安装依赖

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

### 运行开发服务器

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看结果。

## 部署说明

### Supabase 配置

1. 在 Supabase 项目中启用身份验证
2. 配置邮箱验证（可选）
3. 设置适当的 RLS 策略
4. 更新环境变量

### 路由保护

中间件 (`middleware.ts`) 自动保护以下路由：
- `/dashboard` - 需要登录访问
- 公开路由：`/`, `/user/login`, `/user/register`

## 迁移说明

本项目已从自定义身份验证系统迁移到 Supabase Auth：

### 已移除的文件/功能
- 自定义 JWT token 生成
- `/api/user/login` 和 `/api/user/register` 路由
- 自定义用户表验证
- Cookie 手动管理

### 新增的功能
- Supabase Auth 集成
- 自动会话管理
- 邮箱验证支持
- 更安全的身份验证流程

## 贡献

欢迎提交 Issue 和 Pull Request 来改进本项目。

## 许可证

本项目采用 MIT 许可证。
