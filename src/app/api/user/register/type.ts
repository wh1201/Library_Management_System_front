import { z } from "zod";

// 注册请求
export const RegisterRequestSchema = z.object({
    email: z.string().email(),
    password: z.string(),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "密码不一致",
    path: ["confirmPassword"], // 错误信息将显示在confirmPassword字段
})

export type RegisterRequest = z.infer<typeof RegisterRequestSchema>

// 注册响应
export const RegisterResponseSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    created_at: z.string(),
    last_login_at: z.string().optional(),
})
export type RegisterResponse = z.infer<typeof RegisterResponseSchema>