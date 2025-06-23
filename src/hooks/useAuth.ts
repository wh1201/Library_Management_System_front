'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js' // 导入 Supabase 用户类型定义
/**
 * 自定义 Hook，用于处理用户认证
 */
export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // 获取当前用户
    const getUser = async () => {
      try {
        // 调用 Supabase 获取当前用户
        const { data: { user }, error } = await supabase.auth.getUser()

        if (error) {
          console.log('获取用户失败:', error)
          setUser(null)
        } else {
          setUser(user)
        }
      } catch (error) {
        console.log('认证检查失败:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    getUser()

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      // 如果用户登录，更新用户状态
      async (event, session) => {
        if (event === 'SIGNED_IN') {
          setUser(session?.user ?? null)
        } else if (event === 'SIGNED_OUT') {
          // 如果用户登出，设置用户为 null
          setUser(null)
        }
        setLoading(false)
      }
    )
    // 清理函数，组件卸载时取消订阅
    return () => subscription.unsubscribe()
  }, [supabase])

  // 登出功能
  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/user/login')
    } catch (error) {
      console.log('登出失败:', error)
    }
  }

  // 重定向到登录页
  const redirectToLogin = () => {
    router.push('/user/login')
  }

  // 重定向到首页
  const redirectToDashboard = () => {
    router.push('/dashboard')
  }

  return {
    user,
    loading,
    signOut,
    redirectToLogin,
    redirectToDashboard,
    isAuthenticated: !!user,
  }
} 