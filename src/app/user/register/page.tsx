'use client'

import { useState } from "react"
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
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { RegisterRequestSchema, RegisterRequest } from "@/app/api/user/register/type"
import { useMutation } from "@tanstack/react-query"
import { registerQueryOptions } from "@/app/api/user/register/query"
import { supabaseConfig } from "@/config/supabase"


export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const form = useForm<RegisterRequest>({
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
            
            // 将用户邮箱存储到localStorage
            if (data.email) {
                localStorage.setItem('userEmail', data.email);
            }
            
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

    const onSubmit = async (data: RegisterRequest) => {
        console.log("提交用户注册信息:", data);
        setIsLoading(true)
        register.mutate(data)
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
                                            <FormLabel>密码</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="password"
                                                    placeholder="请输入密码（至少6个字符）"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>确认密码</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="password"
                                                    placeholder="请再次输入密码"
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
                                        {isLoading ? "注册中..." : "注册"}
                                    </Button>
                                </div>

                                <div className="text-center text-sm text-muted-foreground">
                                    已有账号？{" "}
                                    <a href="/user/login" className="underline underline-offset-4">
                                        登录
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
