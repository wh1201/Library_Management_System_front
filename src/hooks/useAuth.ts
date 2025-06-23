'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // 获取当前用户
    const getUser = async () => {
      try {
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
      async (event, session) => {
        if (event === 'SIGNED_IN') {
          setUser(session?.user ?? null)
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
        }
        setLoading(false)
      }
    )

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

  // 重定向到仪表板
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