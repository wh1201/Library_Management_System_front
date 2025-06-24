import { z } from "zod"

// 书籍状态枚举
export const BookStatus = {
    AVAILABLE: 1,  // 在馆可借
    BORROWED: 0,   // 已借出
} as const

// 基础共用书籍字段
const BaseBookFieldsSchema = z.object({
    title: z.string().min(1, "书籍标题不能为空"),
    author: z.string().min(1, "作者不能为空"),
    isbn: z.string().min(1, "ISBN不能为空"),
    category: z.string().min(1, "分类不能为空"),
    quantity: z.number().int().min(1, "数量必须大于0"),
    status: z.number().default(1), // 0表示已借出，1表示在馆可借
})

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



// 添加书籍响应的
export const AddBookResponseSchema = z.object({
    message: z.string(),
})

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

// 分页请求基础
const BasePaginationSchema = z.object({
    page: z.number().min(1, "页码不能小于1").default(1),
    pageSize: z.number().min(1, "每页条数不能小于1").default(10),
})

// 获取书籍列表请求的
export const GetBookListRequestSchema = BasePaginationSchema.extend({
    title: z.string().optional(),
    author: z.string().optional(),
    category: z.string().optional(),
})

export type GetBookListRequest = z.infer<typeof GetBookListRequestSchema>

// 分页信息
const PaginationInfoSchema = z.object({
    page: z.number(),
    pageSize: z.number(),
    total: z.number(),
    totalPages: z.number(),
})

// 获取书籍列表响应的
export const GetBookListResponseSchema = z.object({
    data: z.array(BookItemSchema),
    pagination: PaginationInfoSchema,
})

export type GetBookListResponse = z.infer<typeof GetBookListResponseSchema>