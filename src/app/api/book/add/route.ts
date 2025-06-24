import { createClient } from "@/utils/supabase/server";
import { AddBookRequestSchema, AddBookResponseSchema } from "./type";

/**
 * 
 * @param request 添加书籍请求
 * @returns 添加书籍响应
 */
export async function POST(request: Request) {
    const supabase = await createClient()

    const body = await request.json().catch(() => null)


    const validatedRequestData = AddBookRequestSchema.safeParse(body)

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
    // 检查书籍是否已存在 如果ISBN存在，则提示该书籍已存在
    if (validatedRequestData.data.isbn) {
        const { data: existingBook, error: existingBookError } = await supabase
            .from('books')
            .select('*')
            .eq('isbn', validatedRequestData.data.isbn)
            .maybeSingle()
        if (existingBook) {
            return new Response(JSON.stringify({ message: "该书籍已存在" }), { 
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            })
        }
    }


    // 插入书籍数据到 Supabase
    const { data, error } = await supabase
        .from('books')
        .insert([{
            title: validatedRequestData.data.title,
            author: validatedRequestData.data.author,
            isbn: validatedRequestData.data.isbn,
            category: validatedRequestData.data.category,
            quantity: validatedRequestData.data.quantity,
            status: validatedRequestData.data.status,
        }])
        .select()
        .single()

    if (error) {
        console.error("添加书籍错误:", error);
        return new Response(JSON.stringify({ error: error.message }), { 
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        })
    }

    try {
        const validatedResponseData = AddBookResponseSchema.parse({ message: "书籍添加成功" })
        return new Response(JSON.stringify(validatedResponseData), { 
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        })
    } catch (validationError) {
        return new Response(JSON.stringify({ error: validationError instanceof Error ? validationError.message : "服务器内部错误" }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        })
    }
}