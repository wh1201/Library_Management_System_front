import { ProtectedSidebar } from "@/components/protected-sidebar"
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { logoutAction } from './actions'

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  // 如果没有用户或获取用户失败，重定向到登录页
  if (!user || error) {
    redirect('/user/login')
  }

  return (
    <ProtectedSidebar userEmail={user.email || ''} logoutAction={logoutAction}>
      {children}
    </ProtectedSidebar>
  )
} 