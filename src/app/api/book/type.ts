import { z } from "zod"
import { BaseBookFieldsSchema,AddBookResponseSchema } from "@/types/book"
import { BasePaginationSchema,PaginationInfoSchema } from "@/types/common"

// 书籍数据
export const BookItemSchema = BaseBookFieldsSchema.extend({
    id: z.string(),
    create_time: z.string(),
    update_time: z.string(),
})

export type BookItem = z.infer<typeof BookItemSchema>


// 添加书籍
export const AddBookRequestSchema = BaseBookFieldsSchema.extend({
    quantity: z.number().int().min(1, "数量必须大于0").default(1),
})

export type AddBookRequest = z.infer<typeof AddBookRequestSchema>

// 更新书籍
export const UpdateBookRequestSchema = BaseBookFieldsSchema.extend({
    id: z.string().min(1, "书籍ID不能为空"),
})

export type UpdateBookRequest = z.infer<typeof UpdateBookRequestSchema>

export type AddBookResponse = z.infer<typeof AddBookResponseSchema>

// 更新书籍响应
export const UpdateBookResponseSchema = AddBookResponseSchema.extend({
    data: BookItemSchema.optional(),
})
export type UpdateBookResponse = z.infer<typeof UpdateBookResponseSchema>

// ID 请求的通用
const IdRequestSchema = z.object({
    id: z.string().min(1, "ID不能为空"),
})

// 删除书籍请求的
export const DeleteBookRequestSchema = IdRequestSchema

export type DeleteBookRequest = z.infer<typeof IdRequestSchema>

// 删除书籍响应的
export const DeleteBookResponseSchema = z.object({
    message: z.string(),
})

export type DeleteBookResponse = z.infer<typeof DeleteBookResponseSchema>


// 获取书籍列表请求的
export const GetBookListRequestSchema = BasePaginationSchema.extend({
    title: z.string().optional(),
    author: z.string().optional(),
    category: z.string().optional(),
})
export type GetBookListRequest = z.infer<typeof GetBookListRequestSchema>

export const GetBookListResponseSchema = z.object({
    data: z.array(BookItemSchema),
    pagination: PaginationInfoSchema,
})

export type GetBookListResponse = z.infer<typeof GetBookListResponseSchema>