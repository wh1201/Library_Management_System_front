import { z } from "zod"

// 分页请求基础
export const BasePaginationSchema = z.object({
    page: z.number().min(1, "页码不能小于1").default(1),
    pageSize: z.number().min(1, "每页条数不能小于1").default(10),
})

// 分页信息
export const PaginationInfoSchema = z.object({
    page: z.number(),
    pageSize: z.number(),
    total: z.number(),
    totalPages: z.number(),
})