# 认证系统使用说明

## 概述

该项目实现了一个完整的Next.js受保护路由（Protected Route）系统，基于Supabase认证服务。系统包含以下核心功能：

- 自动登录状态检查
- 受保护路由的访问控制
- 已登录用户自动重定向
- 统一的认证状态管理

## 核心组件

### 1. Middleware (`middleware.ts`)

中间件负责在服务器端进行路由保护：

- **功能**：检查用户认证状态，控制对受保护路由的访问
- **保护路径**：`/dashboard` 及其子路径
- **重定向逻辑**：
  - 未登录用户访问受保护路径 → 重定向到 `/user/login`
  - 已登录用户访问登录/注册页 → 重定向到 `/dashboard`

### 2. useAuth Hook (`src/hooks/useAuth.ts`)

自定义Hook提供统一的认证状态管理：

```typescript
const { user, loading, signOut, redirectToLogin, redirectToDashboard, isAuthenticated } = useAuth()
```

**返回值**：
- `user`: 当前用户对象
- `loading`: 认证状态加载中
- `signOut`: 登出函数
- `redirectToLogin`: 重定向到登录页
- `redirectToDashboard`: 重定向到仪表板
- `isAuthenticated`: 是否已认证

### 3. ProtectedRoute 组件 (`src/components/ProtectedRoute.tsx`)

可重用的路由保护组件：

```jsx
<ProtectedRoute fallback={<LoadingSpinner />}>
  <YourProtectedContent />
</ProtectedRoute>
```

### 4. Protected Layout (`src/app/(protected)/layout.tsx`)

受保护页面的布局组件，包含：
- 自动认证检查
- 用户信息显示
- 登出功能
- 加载状态处理

## 使用方法

### 1. 保护单个页面

```jsx
import ProtectedRoute from '@/components/ProtectedRoute'

export default function MyPage() {
  return (
    <ProtectedRoute>
      <div>这是受保护的内容</div>
    </ProtectedRoute>
  )
}
```

### 2. 在组件中使用认证状态

```jsx
import { useAuth } from '@/hooks/useAuth'

export default function MyComponent() {
  const { user, isAuthenticated, signOut } = useAuth()

  if (!isAuthenticated) {
    return <div>请先登录</div>
  }

  return (
    <div>
      <p>欢迎，{user.email}</p>
      <button onClick={signOut}>退出登录</button>
    </div>
  )
}
```

### 3. 添加新的受保护路径

在 `middleware.ts` 中修改 `protectedPaths` 数组：

```typescript
const protectedPaths = ['/dashboard', '/admin', '/profile']
```

## 路由流程

### 访问受保护路由
1. 用户访问 `/dashboard`
2. Middleware 检查认证状态
3. 如果未登录 → 重定向到 `/user/login`
4. 如果已登录 → 继续访问

### 访问登录页面
1. 用户访问 `/user/login`
2. Middleware 检查认证状态
3. 如果已登录 → 重定向到 `/dashboard`
4. 如果未登录 → 显示登录表单

### 登录成功后
1. 用户提交登录表单
2. Supabase 认证成功
3. useAuth Hook 更新状态
4. 自动重定向到 `/dashboard`

## 安全特性

- **双重保护**：Middleware + 客户端组件检查
- **自动状态同步**：实时监听认证状态变化
- **防止绕过**：服务器端中间件确保安全性
- **无缝体验**：加载状态和重定向处理

## 配置选项

### Supabase 配置 (`src/config/supabase.ts`)

```typescript
export const supabaseConfig = {
  auth: {
    emailConfirmation: false,
    autoSignIn: true,
    allowedEmailDomains: []
  },
  redirectUrls: {
    afterSignIn: '/dashboard',
    afterSignUp: '/dashboard',
    afterSignOut: '/user/login'
  }
}
```

## 故障排除

### 1. 用户登录后仍然被重定向到登录页
- 检查 Supabase 环境变量
- 确认 cookie 设置正确
- 查看浏览器控制台错误

### 2. 受保护路由无法访问
- 检查 `middleware.ts` 中的路径配置
- 确认用户认证状态
- 检查网络请求是否成功

### 3. 登录状态不同步
- 确认 useAuth Hook 正确使用
- 检查 Supabase 客户端配置
- 查看认证状态监听器

## 最佳实践

1. **使用 useAuth Hook**：统一管理认证状态
2. **适当的加载状态**：提供良好的用户体验
3. **错误处理**：处理认证失败情况
4. **安全重定向**：防止恶意重定向攻击
5. **清理资源**：正确清理认证监听器

## 扩展功能

可以基于此系统添加：
- 角色权限控制
- 会话超时处理
- 多因素认证
- 社交登录集成
- 记住我功能 