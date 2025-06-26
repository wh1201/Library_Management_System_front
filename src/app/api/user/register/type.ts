import { z } from "zod"
import { BaseUserFieldsSchema, BaseUserResponseFieldsSchema } from "@/types/user"

// 注册请求的 schema
export const RegisterRequestSchema = BaseUserFieldsSchema.extend({
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "密码不一致",
    path: ["confirmPassword"], // 错误信息将显示在confirmPassword字段
})
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>

// 注册响应的 schema
export const RegisterResponseSchema = BaseUserResponseFieldsSchema
export type RegisterResponse = z.infer<typeof RegisterResponseSchema>