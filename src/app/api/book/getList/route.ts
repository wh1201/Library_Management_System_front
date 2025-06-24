import { createClient } from "@/utils/supabase/server";
import { GetBookListRequestSchema, GetBookListResponseSchema, GetBookListRequest } from "./type";

/**
 * 获取书籍列表查询
 * @param {any} supabase - Supabase 客户端实例，用于与数据库交互
 * @param {GetBookListRequest} params - 查询参数，包括分页、标题和作者
 * @returns {Promise<any>} - 返回包含书籍列表的查询结果
 */
async function getBookListQuery(
    supabase: any,
    params: GetBookListRequest
) {
    const { page, pageSize, title, author } = params

    // 构建查询条件
    let query = supabase
        .from('books')
        .select('*', { count: 'exact' }) 

    // 添加搜索过滤条件
    if (title) {
        query = query.ilike('title', `%${title}%`)  // 使用 ilike 进行不区分大小写的模糊匹配
    }
    
    if (author) {
        query = query.ilike('author', `%${author}%`) // 使用 ilike 进行不区分大小写的模糊匹配
    }

    // 添加排序和分页
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    query = query
        .order('create_time', { ascending: false }) // 按照创建时间降序排序
        .range(from, to)

    return await query
}

/**
 * 
 * @param request 获取书籍列表请求
 * @returns 获取书籍列表响应
 */
export async function POST(request: Request) {
    const supabase = await createClient()

    const body = await request.json().catch(() => null)

    const validatedRequestData = GetBookListRequestSchema.safeParse(body)

    if (!validatedRequestData.success) {
        return new Response(JSON.stringify({ error: validatedRequestData.error }), { 
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        })
    }
     // 检查用户是否已认证
     const { data: { user }, error: authError } = await supabase.auth.getUser()
    
     if (authError || !user) {
         return new Response(JSON.stringify({ error: "未授权访问" }), {
             status: 401,
             headers: { 'Content-Type': 'application/json' }
         })
     }

    try {
        // 执行查询
        const { data: books, error: queryError, count } = await getBookListQuery(
            supabase, 
            validatedRequestData.data
        )

        if (queryError) {
            console.error("查询书籍列表错误:", queryError);
            return new Response(JSON.stringify({ error: queryError.message }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            })
        }

        // 计算分页信息
        const { page, pageSize } = validatedRequestData.data
        const total = count || 0
        const totalPages = Math.ceil(total / pageSize)

        // 构建响应数据
        const responseData = {
            data: books || [],
            pagination: {
                page,
                pageSize,
                total,
                totalPages,
            }
        }

        const validatedResponseData = GetBookListResponseSchema.parse(responseData)
        return new Response(JSON.stringify(validatedResponseData), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        })
        
    } catch (validationError) {
        console.error("处理请求错误:", validationError);
        return new Response(JSON.stringify({ 
            error: validationError instanceof Error ? validationError.message : "服务器内部错误" 
        }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        })
    }
}