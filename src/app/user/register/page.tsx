'use client'

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
// 引入useForm从react-hook-form库
import { useForm } from "react-hook-form"; 
import {UserRegisterSchemaType,UserRegisterType} from "@/src/typings/userType"
import { zodResolver } from "@hookform/resolvers/zod"

export default function RegisterPage() {
    const formData = useForm<UserRegisterType>({
        resolver: zodResolver(UserRegisterSchemaType),
        defaultValues: {
            username: "",
            password: "",
            confirmPassword: "",
        },
    });

    // 注册功能
    const onRegisterHandle = (data: UserRegisterType) => {
        console.log("提交用户注册信息:", data);
        // TODO 在这里处理注册逻辑
    }
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <Card>
                    <CardHeader>
                        <CardTitle>注册新账号</CardTitle>
                        <CardDescription>
                            创建一个新的账号来使用管理系统
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={formData.handleSubmit(onRegisterHandle)}>
                            <div className="flex flex-col gap-6">
                                <div className="grid gap-3">
                                    <Label htmlFor="username">用户名</Label>
                                    <Input
                                        id="username"
                                        type="text"
                                        placeholder="请输入用户名"
                                        {...formData.register("username")}
                                        required
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="password">密码</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="请输入密码"
                                        {...formData.register("password")}
                                        required
                                    />
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
                                    <Button type="submit" className="w-full">
                                        注册
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
