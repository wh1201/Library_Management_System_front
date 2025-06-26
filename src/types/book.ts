import { z } from "zod"

// 书籍状态枚举
export const BookStatus = {
    AVAILABLE: 1,  // 在馆可借
    BORROWED: 0,   // 已借出
} as const

// 基础共用书籍字段
export const BaseBookFieldsSchema = z.object({
    title: z.string().min(1, "书籍标题不能为空"),
    author: z.string().min(1, "作者不能为空"),
    isbn: z.string().min(1, "ISBN不能为空"),
    category: z.string().min(1, "分类不能为空"),
    quantity: z.number().int().min(1, "数量必须大于0"),
    status: z.number().default(1), // 0表示已借出，1表示在馆可借
})



// 添加书籍响应的
export const AddBookResponseSchema = z.object({
    message: z.string(),
})