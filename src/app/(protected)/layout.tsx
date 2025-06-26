import { ProtectedSidebar } from "@/components/protected-sidebar"
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { logoutAction } from './actions'

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (!user) {
    redirect('/user/login')
  }


  return (
    <ProtectedSidebar userEmail={user.email || ''} logoutAction={logoutAction}>
      {children}
    </ProtectedSidebar>
  )
} 