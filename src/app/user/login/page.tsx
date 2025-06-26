'use client'

import React, { useState } from "react"
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { toast } from "sonner"
import { LoginRequestSchema, LoginRequest } from "@/types/user"
import { useMutation } from "@tanstack/react-query"
import { loginQueryOptions } from "@/app/api/user/login/query"


export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  
  const form = useForm<LoginRequest>({
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
      
      // 将用户邮箱存储到localStorage
      if (data.email) {
        localStorage.setItem('userEmail', data.email);
      }
      
      toast.success("登录成功")
      router.push('/dashboard')
    },
    onError: (error) => {
      console.error("登录失败:", error);
      
      let errorMessage = "登录失败，请稍后重试";
      
      try {
        // 尝试解析错误信息
        const errorText = error.message;
        
        if (errorText.includes("Invalid login credentials")) {
          errorMessage = "邮箱或密码错误，请检查后重试";
        } else if (errorText.includes("Email not confirmed")) {
          errorMessage = "邮箱未验证，请先验证邮箱";
        } else if (errorText.includes("用户数据获取失败")) {
          errorMessage = "登录异常，请重试";
        } else if (errorText.includes("用户数据格式错误")) {
          errorMessage = "系统配置错误，请联系管理员";
        } else {
          // 尝试解析 JSON 错误信息
          try {
            const errorJson = JSON.parse(errorText);
            errorMessage = errorJson.error || errorMessage;
          } catch {
            errorMessage = errorText || errorMessage;
          }
        }
      } catch {
        // 如果解析失败，使用默认错误信息
      }
      
      toast.error(errorMessage);
    },
    onSettled: () => {
      setIsLoading(false)
    }
  })

  const onSubmit = async (data: LoginRequest) => {
    setIsLoading(true)
    console.log("提交用户登录信息:", data);
    login.mutate(data)
  };

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
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>邮箱</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="请输入您的邮箱"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center">
                        <FormLabel>密码</FormLabel>
                        <a
                          href="#"
                          className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                        >
                          忘记密码？
                        </a>
                      </div>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="请输入您的密码"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
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
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
