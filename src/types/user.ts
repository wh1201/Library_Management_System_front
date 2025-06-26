import { z } from "zod"

// 公共用户字段
export const BaseUserFieldsSchema = z.object({
    email: z.string().email(),
    password: z.string(),
})
// 公共响应字段
export const BaseUserResponseFieldsSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    created_at: z.string(),
    last_sign_in_at: z.string().optional(),
})