import { z } from "zod";

// 添加书籍请求的 schema
export const AddBookRequestSchema = z.object({
    title: z.string().min(1, "书籍标题不能为空"),
    author: z.string().min(1, "作者不能为空"),
    isbn: z.string().min(1, "ISBN不能为空"),
    category: z.string().min(1, "分类不能为空"),
    quantity: z.number().int().min(1, "数量必须大于0").default(1),
    status:z.number(),
})

export type AddBookRequest = z.infer<typeof AddBookRequestSchema>

// 添加书籍响应的 schema
export const AddBookResponseSchema = z.object({
    message: z.string(),
})
    
export type AddBookResponse = z.infer<typeof AddBookResponseSchema>