import { createClient } from "@/utils/supabase/server"
import { DeleteBookRequestSchema, DeleteBookResponseSchema, DeleteBookRequest } from "./type"



/**
 * 
 * @param request 删除书籍请求
 * @returns 删除书籍响应
 */
export async function POST(request: Request) {
    const supabase = await createClient()

    const body = await request.json().catch(() => null)

    const validatedRequestData = DeleteBookRequestSchema.safeParse(body)

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
            .select('id, title')
            .eq('id', validatedRequestData.data.id)
            .single()

        if (checkError || !existingBook) {
            return new Response(JSON.stringify({ error: "书籍不存在" }), { 
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            })
        }

        // 执行删除
        const { data: deletedBook, error: deleteError } = await deleteBookQuery(
            supabase, 
            validatedRequestData.data
        )

        if (deleteError) {
            console.error("删除书籍错误:", deleteError);
            return new Response(JSON.stringify({ error: deleteError.message }), { 
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            })
        }
        return new Response(JSON.stringify({ message: "书籍删除成功" }), { 
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        })
        
    } catch (validationError) {
        console.error("处理删除请求错误:", validationError);
        return new Response(JSON.stringify({ error: validationError instanceof Error ? validationError.message : "服务器内部错误" }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        })
    }
}

/**
 * 删除书籍查询
 * @param supabase Supabase客户端
 * @param deleteData 删除数据
 * @returns 删除结果
 */
async function deleteBookQuery(
    supabase: any,
    deleteData: DeleteBookRequest
) {
    const { data, error } = await supabase
        .from('books')
        .delete()
        .eq('id', deleteData.id)
        .select()
        .single()

    return { data, error }
}