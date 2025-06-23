export const supabaseConfig = {
  // 认证配置
  auth: {
    // 禁用邮箱验证
    emailConfirmation: false,
    // 注册后自动登录
    autoSignIn: true,
    // 允许的邮箱域名（可选，留空表示允许所有）
    allowedEmailDomains: [] as string[],
  },
  
  // 重定向配置
  redirectUrls: {
    afterSignIn: '/dashboard',
    afterSignUp: '/dashboard',
    afterSignOut: '/user/login',
  }
}

// 获取 signUp 的配置选项
export function getSignUpOptions() {
  return {
    emailRedirectTo: supabaseConfig.auth.emailConfirmation 
      ? `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/confirm`
      : undefined,
  }
}

// 验证邮箱域名（如果配置了限制）
export function validateEmailDomain(email: string): boolean {
  if (supabaseConfig.auth.allowedEmailDomains.length === 0) {
    return true // 允许所有域名
  }
  
  const domain = email.split('@')[1]
  return supabaseConfig.auth.allowedEmailDomains.includes(domain)
} 