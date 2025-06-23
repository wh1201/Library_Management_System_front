import { z } from "zod";

// 修改为邮箱登录的 schema
export const LoginRequestSchema = z.object({
    email: z.string().email(),
    password: z.string(),
  })

export type LoginRequest = z.infer<typeof LoginRequestSchema>

export const LoginResponseSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    created_at: z.string(),
    last_sign_in_at: z.string().optional(),
})
    
export type LoginResponse = z.infer<typeof LoginResponseSchema>
