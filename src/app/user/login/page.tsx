'use client'

import React, { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { LoginRequestSchema, LoginRequest } from "@/app/api/user/login/type"
import { useMutation } from "@tanstack/react-query"
import { loginQueryOptions } from "@/app/api/user/login/query"
import { useAuth } from "@/hooks/useAuth"


export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { user, loading, isAuthenticated, redirectToDashboard } = useAuth()
  
  // 如果用户已经登录，重定向到仪表板
  useEffect(() => {
    if (!loading && isAuthenticated) {
      redirectToDashboard()
    }
  }, [loading, isAuthenticated, redirectToDashboard])
  
  const formData = useForm<LoginRequest>({
    resolver: zodResolver(LoginRequestSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  const login = useMutation({
    ...loginQueryOptions,
    onSuccess: (data) => {
      console.log("登录成功:", data);
      toast.success("登录成功")
      router.push('/dashboard')
    },
    onError: (error) => {
      console.log("登录失败:", error);
      if (error.message.includes("Invalid login credentials")) {
        toast.error("邮箱或密码错误，请检查后重试")
      } else if (error.message.includes("Email not confirmed")) {
        toast.error("邮箱未验证，请先验证邮箱")
      } else {
        toast.error(error.message || "登录失败，请稍后重试")
      }
    },
    onSettled: () => {
      setIsLoading(false)
    }
  })

  const onSubmit = async (data:LoginRequest ) => {
    setIsLoading(true)
    console.log("提交用户登录信息:", data);
    login.mutate(data)
  };

  // 显示加载状态
  if (loading) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  // 如果用户已登录，不显示登录表单（useEffect会处理重定向）
  if (isAuthenticated) {
    return null
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle>登录你的账号</CardTitle>
            <CardDescription>
              输入您的邮箱和密码以登录到图书管理系统
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={formData.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">邮箱</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="请输入您的邮箱"
                  {...formData.register("email")}
                  required
                />
                {formData.formState.errors.email && (
                  <p className="text-sm text-red-600">
                    {formData.formState.errors.email.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Label htmlFor="password">密码</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    忘记密码？
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  {...formData.register("password")}
                  required
                />
                {formData.formState.errors.password && (
                  <p className="text-sm text-red-600">
                    {formData.formState.errors.password.message}
                  </p>
                )}
              </div>
              
              <div className="flex flex-col gap-3">
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "登录中..." : "登录"}
                </Button>
              </div>
              <div className="text-center text-sm text-muted-foreground">
                没有账号？{" "}
                <a
                  href="/user/register"
                  className="underline-offset-4 hover:underline"
                >
                  立即注册
                </a>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
