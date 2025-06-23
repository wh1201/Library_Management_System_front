import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 获取当前用户
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 定义受保护的路径
  const protectedPaths = ['/dashboard']
  
  // 定义认证相关的路径
  const authPaths = ['/user/login', '/user/register']
  
  const { pathname } = request.nextUrl

  // 检查是否是受保护的路径
  const isProtectedPath = protectedPaths.some(path => 
    pathname.startsWith(path)
  )
  
  // 检查是否是认证页面
  const isAuthPath = authPaths.some(path => 
    pathname.startsWith(path)
  )

  // 如果用户未登录且访问受保护路径，重定向到登录页
  if (isProtectedPath && !user) {
    const loginUrl = new URL('/user/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // 如果用户已登录且访问认证页面，重定向到仪表板
  if (isAuthPath && user) {
    const dashboardUrl = new URL('/dashboard', request.url)
    return NextResponse.redirect(dashboardUrl)
  }

  return response
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