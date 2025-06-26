import { createClient } from "@/lib/supabase/server";
import { RegisterRequestSchema, RegisterResponseSchema } from "./type";
import { NextResponse } from "next/server";

/**
 * 
 * @param request 注册请求
 * @returns 注册响应
 */
export async function POST(request: Request) {
    const supabase = await createClient()
    const body = await request.json().catch(() => null)

    // Zod 验证请求数据
    const validatedRequestData = RegisterRequestSchema.safeParse(body)

    if (!validatedRequestData.success) {
        return new Response(JSON.stringify(validatedRequestData.error), { 
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        })
    }

    // Supabase 注册
    const { data, error } = await supabase.auth.signUp(validatedRequestData.data)
    console.log("注册数据",data, error)
    if (error) {
        return new Response(JSON.stringify({ error: error.message }), { 
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        })
    }

    const validatedUserData = RegisterResponseSchema.parse(data.user)

    return NextResponse.json(validatedUserData, { status: 200 })

}