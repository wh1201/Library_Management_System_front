"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function Page() {
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        
        if (error) {
          console.log('检查用户状态失败:', error)
          // 如果是会话缺失错误，这是正常的（未登录状态）
          if (error.message.includes('Auth session missing') || error.message.includes('session_not_found')) {
            router.push('/user/login')
            return
          }
        }
        
        if (user) {
          // 用户已登录，重定向到仪表板
          router.push('/dashboard')
        } else {
          // 用户未登录，重定向到登录页面
          router.push('/user/login')
        }
      } catch (error: any) {
        console.error('检查用户状态时发生错误:', error)
        // 如果是 AuthSessionMissingError，这是正常的（未登录状态）
        if (error?.message?.includes('Auth session missing')) {
          router.push('/user/login')
          return
        }
        // 其他错误也当作未登录处理，重定向到登录页面
        router.push('/user/login')
      } finally {
        setLoading(false)
      }
    }

    checkUser()
  }, [router, supabase.auth])

  // 显示加载状态
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">正在验证身份...</p>
      </div>
    </div>
  )
}