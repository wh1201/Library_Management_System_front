import { z } from "zod"

export const GetBookListRequestSchema = z.object({
    page: z.number().min(1, "页码不能小于1").default(1),
    pageSize: z.number().min(1, "每页条数不能小于1").default(10),
    title: z.string().optional(),
    author: z.string().optional(),
})

export type GetBookListRequest = z.infer<typeof GetBookListRequestSchema>

// 单个书籍数据的 schema
export const BookItemSchema = z.object({
    id: z.string(),
    title: z.string(),
    author: z.string(),
    isbn: z.string(),
    category: z.string(),
    quantity: z.number(),
    status: z.number(), // 0表示借出，1表示在馆
    create_time: z.string(),
    update_time: z.string(),
})
// 获取书籍列表响应的 schema
export const GetBookListResponseSchema = z.object({
    data: z.array(BookItemSchema),
    pagination: z.object({
        page: z.number(),
        pageSize: z.number(),
        total: z.number(),
        totalPages: z.number(),
    }),
})

export type GetBookListResponse = z.infer<typeof GetBookListResponseSchema>