import { createClient } from "@/utils/supabase/server";
import { RegisterRequestSchema, RegisterResponseSchema } from "./type";
import { NextResponse } from "next/server";
import { error } from "console";

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
        // return NextResponse.json({ error: validatedRequestData.error }, { status: 400 })
        return new Response(JSON.stringify(validatedRequestData.error), { status: 400 })
    }

   // Supabase 注册
   const { data, error } = await supabase.auth.signUp(validatedRequestData.data)

    if (error) {
        return new Response(error.message, { status: 400 })
    }

    const validatedUserData = RegisterResponseSchema.parse(data.user)

    return NextResponse.json(validatedUserData, { status: 200 })

}