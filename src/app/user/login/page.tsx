'use client'

import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/src/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { UserLoginType, UserLoginSchemaType } from "@/src/typings/userType"

export default function LoginPage() {

  const formData = useForm<UserLoginType>({
    resolver: zodResolver(UserLoginSchemaType),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: UserLoginType) => {
    console.log("提交用户登录信息:", data);
    // TODO 在这里处理登录逻辑
  };


  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle>登录你的账号</CardTitle>
            <CardDescription>
              在下面输入您的帐户信息以登录到您的管理系统
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={formData.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">用户名</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="请输入您的账户"
                  // formData.register() 是 React Hook Form 提供的一个方法，用于注册表单输入字段
                  {...formData.register("username")}
                  required
                />
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
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  登录
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
