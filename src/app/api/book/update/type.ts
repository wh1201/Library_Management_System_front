import { z } from "zod"

export const UpdateBookRequestSchema = z.object({
    id: z.string().min(1, "书籍ID不能为空"),
    title: z.string().min(1, "书籍标题不能为空"),
    author: z.string().min(1, "作者姓名不能为空"),
    isbn: z.string().min(1, "ISBN编号不能为空"),
    category: z.string().min(1, "书籍分类不能为空"),
    quantity: z.number().min(1, "数量不能小于1"),
    status: z.number().min(0).max(1, "状态值必须为0或1"), // 0表示可借阅，1表示已借出
})

export type UpdateBookRequest = z.infer<typeof UpdateBookRequestSchema>

export const UpdateBookResponseSchema = z.object({
    message: z.string(),
    data: z.object({
        id: z.string(),
        title: z.string(),
        author: z.string(),
        isbn: z.string(),
        category: z.string(),
        quantity: z.number(),
        status: z.number(),
        create_time: z.string(),
        update_time: z.string(),
    }).optional(),
})

export type UpdateBookResponse = z.infer<typeof UpdateBookResponseSchema> 