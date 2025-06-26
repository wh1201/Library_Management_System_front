import { z } from "zod"
import { BaseUserFieldsSchema, BaseUserResponseFieldsSchema } from "@/types/user"

// 登录请求的 schema
export const LoginRequestSchema = BaseUserFieldsSchema
export type LoginRequest = z.infer<typeof LoginRequestSchema>


// 登录响应的 schema
export const LoginResponseSchema = BaseUserResponseFieldsSchema
export type LoginResponse = z.infer<typeof LoginResponseSchema>
