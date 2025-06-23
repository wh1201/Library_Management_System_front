'use client'

import { useState, useEffect } from "react"
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
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { createClient } from "@/utils/supabase/client"
import { z } from "zod"
import { useRouter } from "next/navigation"
import {RegisterRequestSchema, RegisterRequest} from "@/app/api/user/register/type"
import { useMutation } from "@tanstack/react-query"
import { registerQueryOptions } from "@/app/api/user/register/query"
import { supabaseConfig } from "@/config/supabase"
import { useAuth } from "@/hooks/useAuth"


export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const { user, loading, isAuthenticated, redirectToDashboard } = useAuth()

    // 如果用户已经登录，重定向到仪表板
    useEffect(() => {
        if (!loading && isAuthenticated) {
            redirectToDashboard()
        }
    }, [loading, isAuthenticated, redirectToDashboard])

    const formData = useForm<RegisterRequest>({
        resolver: zodResolver(RegisterRequestSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
        },
    });
    
    const register = useMutation({
        ...registerQueryOptions,
        onSuccess: (data) => {
            console.log("注册成功:", data);
            toast.success("注册成功")
            router.push('/dashboard')
        },
        onError: (error) => {
            console.log("注册失败:", error);
            if (error.message.includes("User already registered")) {
                toast.error("该邮箱已被注册，请使用其他邮箱或直接登录")
            } else if (error.message.includes("Password should be at least")) {
                toast.error("密码强度不够，请使用更强的密码")
            } else if (error.message.includes("Email address") && error.message.includes("invalid")) {
                toast.error("邮箱格式无效，请使用有效的邮箱地址")
            } else {
                toast.error(error.message || "注册失败，请稍后重试")
            }
        },
        onSettled: () => {
            setIsLoading(false)
        }
    })

    const onRegisterHandle = async (data: RegisterRequest) => {
        console.log("提交用户注册信息:", data);
        setIsLoading(true)
        register.mutate(data)
    }

    // 显示加载状态
    if (loading) {
        return (
            <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        )
    }

    // 如果用户已登录，不显示注册表单（useEffect会处理重定向）
    if (isAuthenticated) {
        return null
    }

    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <Card>
                    <CardHeader>
                        <CardTitle>注册新账号</CardTitle>
                        <CardDescription>
                            创建一个新的账号来使用图书管理系统
                            {!supabaseConfig.auth.emailConfirmation && (
                                <>
                                    <br />
                                    <span className="text-green-600 text-sm">无需邮箱验证，注册后可直接使用</span>
                                </>
                            )}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={formData.handleSubmit(onRegisterHandle)}>
                            <div className="flex flex-col gap-6">
                                <div className="grid gap-3">
                                    <Label htmlFor="email">邮箱</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="请输入您的邮箱"
                                        {...formData.register("email")}
                                        required
                                    />
                                    {formData.formState.errors.email && (
                                        <p className="text-sm text-red-500 mt-1">
                                            {formData.formState.errors.email.message}
                                        </p>
                                    )}
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="password">密码</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="请输入密码（至少6个字符）"
                                        {...formData.register("password")}
                                        required
                                    />
                                    {formData.formState.errors.password && (
                                        <p className="text-sm text-red-500 mt-1">
                                            {formData.formState.errors.password.message}
                                        </p>
                                    )}
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="confirmPassword">确认密码</Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="请再次输入密码"
                                        {...formData.register("confirmPassword")}
                                        required
                                    />
                                    {formData.formState.errors.confirmPassword && (
                                        <p className="text-sm text-red-500 mt-1">
                                            {formData.formState.errors.confirmPassword.message}
                                        </p>
                                    )}
                                </div>
                                <div className="flex flex-col gap-3">
                                    <Button 
                                        type="submit" 
                                        className="w-full"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "注册中..." : "注册"}
                                    </Button>
                                </div>
                            </div>
                            <div className="mt-4 text-center text-sm">
                                已有账号？{" "}
                                <a href="/user/login" className="underline underline-offset-4">
                                    登录
                                </a>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
