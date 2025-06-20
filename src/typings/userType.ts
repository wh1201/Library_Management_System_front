import { z } from 'zod'; // 引入zod库 z 用于定义数据模型

// 定义用户登录的类型
export const UserLoginSchemaType = z.object({
    username: z.string(),
    password: z.string(),
})

// 推断 UserLoginType 类型，基于 UserLoginSchemaType
export type UserLoginType = z.infer<typeof UserLoginSchemaType>;

// 定义用户注册的类型
export const UserRegisterSchemaType = z.object({
    username: z.string(),
    password: z.string(),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "密码不一致",
    path: ["confirmPassword"], // 错误信息将显示在confirmPassword字段
})

// 推断 UserRegisterType 类型，基于 UserRegisterSchemaType
export type UserRegisterType = z.infer<typeof UserRegisterSchemaType>;

