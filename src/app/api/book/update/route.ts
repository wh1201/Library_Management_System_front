import { createClient } from "@/utils/supabase/server";
import { UpdateBookRequestSchema, UpdateBookResponseSchema, UpdateBookRequest } from "./type";

/**
 * 更新书籍查询
 * @param {any} supabase - Supabase 客户端，用于与数据库交互
 * @param {UpdateBookRequest} bookData - 包含书籍 ID 和更新数据的对象
 * @returns {Promise<{ data: any, error: any }>} - 返回更新结果，包括数据和错误信息
 */
async function updateBookQuery(
    supabase: any,
    bookData: UpdateBookRequest
) {
    const { id, ...updateData } = bookData

    const { data, error } = await supabase
        .from('books')
        .update({
            ...updateData,
            update_time: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single()

    return { data, error }
}

/**
  * 处理更新书籍的 POST 请求
  * @param {Request} request - HTTP 请求对象
  * @returns {Promise<Response>} - 返回处理结果的 HTTP 响应
 */
export async function POST(request: Request) {
    const supabase = await createClient()

    const body = await request.json().catch(() => null)

    const validatedRequestData = UpdateBookRequestSchema.safeParse(body)

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
        // 先检查书籍是否存在
        const { data: existingBook, error: checkError } = await supabase
            .from('books')
            .select('id')
            .eq('id', validatedRequestData.data.id)
            .single()

        if (checkError || !existingBook) {
            return new Response(JSON.stringify({ error: "书籍不存在" }), { 
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            })
        }

        // 执行更新
        const { data: updatedBook, error: updateError } = await updateBookQuery(
            supabase,
            validatedRequestData.data
        )

        if (updateError) {
            console.error("更新书籍错误:", updateError);
            return new Response(JSON.stringify({ error: updateError.message }), { 
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            })
        }

        // 构建响应数据
        const responseData = {
            message: "书籍更新成功",
            data: updatedBook
        }

        const validatedResponseData = UpdateBookResponseSchema.parse(responseData)
        return new Response(JSON.stringify(validatedResponseData), { 
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        })

    } catch (validationError) {
        console.error("处理更新请求错误:", validationError);
        return new Response(JSON.stringify({ error: validationError instanceof Error ? validationError.message : "服务器内部错误" }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        })
    }
} 