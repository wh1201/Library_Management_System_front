import { z } from "zod";

// 添加书籍请求的 schema
export const AddBookRequestSchema = z.object({
    title: z.string().min(1, "书籍标题不能为空"),
    author: z.string().min(1, "作者不能为空"),
    isbn: z.string().optional(),
    publisher: z.string().optional(),
    publication_date: z.string().optional(),
    category: z.string().optional(),
    description: z.string().optional(),
    quantity: z.number().int().min(1, "数量必须大于0").default(1),
    location: z.string().optional(),
})

export type AddBookRequest = z.infer<typeof AddBookRequestSchema>

// 添加书籍响应的 schema
export const AddBookResponseSchema = z.object({
    id: z.string(),
    title: z.string(),
    author: z.string(),
    isbn: z.string().optional(),
    publisher: z.string().optional(),
    publication_date: z.string().optional(),
    category: z.string().optional(),
    description: z.string().optional(),
    quantity: z.number(),
    location: z.string().optional(),
    created_at: z.string(),
    updated_at: z.string(),
})
    
export type AddBookResponse = z.infer<typeof AddBookResponseSchema>