import { updateSession } from '@/utils/supabase/middleware'
import type { NextRequest } from 'next/server'

/**
 * 中间件函数，用于处理请求和用户认证
 * 统一的认证逻辑都在 updateSession 中处理
 */
export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}