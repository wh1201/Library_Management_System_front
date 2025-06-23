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

    // Zod 验证请求数据
    // parse() 与 safeParse() 方法
    // parse()：这是 Zod 的核心验证方法，调用后会立即验证数据是否符合定义的 Schema。如果数据不符合 Schema，Zod 会抛出一个详细的错误信息。
    // safeParse()：如果你不希望验证失败时抛出异常，可以使用 safeParse()。
    // 它返回一个包含验证结果的对象，并不会直接抛出错误。你可以通过 success 来判断验证是否成功，错误信息则通过 error 获取。
    // 如果你发现请求空的，多半是这个原因

    const validatedRequestData = AddBookRequestSchema.safeParse(body)

    if (!validatedRequestData.success) {
        return new Response(JSON.stringify(validatedRequestData.error), { status: 400 })
    }

    // 检查用户是否已认证
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
        return new Response("未授权访问", { status: 401 })
    }

    // 插入书籍数据到 Supabase
    const { data, error } = await supabase
        .from('books')
        .insert([{
            title: validatedRequestData.data.title,
            author: validatedRequestData.data.author,
            isbn: validatedRequestData.data.isbn,
            category: validatedRequestData.data.category,
            status: 1,
        }])
        .select()
        .single()

    if (error) {
        console.error("添加书籍错误:", error);
        return new Response(error.message, { status: 400 })
    }

    const validatedBookData = AddBookResponseSchema.parse(data)

    return new Response(JSON.stringify(validatedBookData), { status: 200 })
}