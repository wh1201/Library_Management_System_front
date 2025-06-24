import { createClient } from "@/utils/supabase/server";
import { LoginRequestSchema, LoginResponseSchema } from "./type";
import { redirect } from "next/navigation";


/**
 * 
 * @param request 登录请求
 * @returns 登录响应
 */
export async function POST(request: Request ) {
    const supabase = await createClient()

    const body = await request.json().catch(() => null)

    // Zod 验证请求数据
    // parse() 与 safeParse() 方法
    // parse()：这是 Zod 的核心验证方法，调用后会立即验证数据是否符合定义的 Schema。如果数据不符合 Schema，Zod 会抛出一个详细的错误信息。
    // safeParse()：如果你不希望验证失败时抛出异常，可以使用 safeParse()。
    // 它返回一个包含验证结果的对象，并不会直接抛出错误。你可以通过 success 来判断验证是否成功，错误信息则通过 error 获取。
    // 如果你发现请求空的，多半是这个原因

    const validatedRequestData = LoginRequestSchema.safeParse(body)

    if (!validatedRequestData.success) {
        return new Response(JSON.stringify(validatedRequestData.error), { 
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        })
    }

    // Supabase 登录
    const { data, error } = await supabase.auth.signInWithPassword(validatedRequestData.data)
    // console.log("登录错误:", error);
    if (error) {
        return new Response(JSON.stringify({ error: error.message }), { 
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        })
    }

    const validatedUserData = LoginResponseSchema.parse(data.user)

    return new Response(JSON.stringify(validatedUserData), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    })
}



