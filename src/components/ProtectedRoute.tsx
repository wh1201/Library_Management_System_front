'use client'

import { useAuth } from '@/hooks/useAuth'
import { useEffect } from 'react'

interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default function ProtectedRoute({ 
  children, 
  fallback 
}: ProtectedRouteProps) {
  const { user, loading, redirectToLogin, isAuthenticated } = useAuth()

  useEffect(() => {
    // 如果加载完成且用户未认证，重定向到登录页
    if (!loading && !isAuthenticated) {
      redirectToLogin()
    }
  }, [loading, isAuthenticated, redirectToLogin])

  // 显示加载状态
  if (loading) {
    return (
      fallback || (
        <div className="flex h-screen items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      )
    )
  }

  // 如果没有用户，不渲染任何内容（useEffect会处理重定向）
  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
} 