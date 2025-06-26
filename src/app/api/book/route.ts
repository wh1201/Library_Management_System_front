// 封装GET POST PUT DELETE请求
import { createClient } from "@/lib/supabase/server"
import { GetBookListRequestSchema, AddBookRequestSchema,DeleteBookRequestSchema,UpdateBookRequestSchema } from "./type"
import { NextResponse } from "next/server"

// GET请求 - 获取书籍列表
export async function GET(request: Request) {
    try {
        const supabase = await createClient()
        const { searchParams } = new URL(request.url)
        
        // 从查询参数中获取数据
        const params = {
            page: parseInt(searchParams.get('page') || '1'),
            pageSize: parseInt(searchParams.get('pageSize') || '10'),
            title: searchParams.get('title') || undefined,
            author: searchParams.get('author') || undefined,
        }
        
        // 验证参数
        const validatedParams = GetBookListRequestSchema.parse(params)
        
        let query = supabase
            .from('books')
            .select('*', { count: 'exact' })
        
        // 添加搜索条件
        if (validatedParams.title) {
            query = query.ilike('title', `%${validatedParams.title}%`)
        }
        if (validatedParams.author) {
            query = query.ilike('author', `%${validatedParams.author}%`)
        }
        if (validatedParams.category) {
            query = query.ilike('category', `%${validatedParams.category}%`)
        }
        
        // 计算偏移量
        const offset = (validatedParams.page - 1) * validatedParams.pageSize
        
        // 执行查询
        const { data, error, count } = await query
            .range(offset, offset + validatedParams.pageSize - 1)
            .order('create_time', { ascending: false })
        
        if (error) {
            console.error('获取书籍列表失败:', error)
            return NextResponse.json(
                { message: '获取书籍列表失败', error: error.message },
                { status: 500 }
            )
        }
        
        const totalPages = Math.ceil((count || 0) / validatedParams.pageSize)
        
        return NextResponse.json({
            data: data || [],
            pagination: {
                page: validatedParams.page,
                pageSize: validatedParams.pageSize,
                total: count || 0,
                totalPages,
            }
        })
        
    } catch (error) {
        console.error('GET请求处理失败:', error)
        return NextResponse.json(
            { message: '请求参数无效或服务器错误' },
            { status: 400 }
        )
    }
}

// POST请求 - 添加书籍
export async function POST(request: Request) {
    try {
        const supabase = await createClient()
        const body = await request.json().catch(() => null)
        
        if (!body) {
            return NextResponse.json(
                { message: '请求体不能为空' },
                { status: 400 }
            )
        }
        
        const validatedRequestData = AddBookRequestSchema.safeParse(body)
        
        if (!validatedRequestData.success) {
            return NextResponse.json(
                { message: '请求参数无效', errors: validatedRequestData.error.errors },
                { status: 400 }
            )
        }
        
        // 添加前需要查询是否存在该书籍的isbn
        const { data: book, error: bookError } = await supabase
            .from('books')
            .select('*')
            .eq('isbn', validatedRequestData.data.isbn)
            
        if (bookError) {
            console.error('查询书籍失败:', bookError)
            return NextResponse.json(
                { message: '查询书籍失败', error: bookError.message },
                { status: 500 }
            )
        }
        
        if (book && book.length > 0) {
            return NextResponse.json(
                { message: '该书籍已存在' },
                { status: 400 }
            )
        }
        
        // 添加书籍
        const { data, error } = await supabase
            .from('books')
            .insert(validatedRequestData.data)
            
        if (error) {
            console.error('添加书籍失败:', error)
            return NextResponse.json(
                { message: '添加书籍失败', error: error.message },
                { status: 500 }
            )
        }
        
        return NextResponse.json({ message: '书籍添加成功' })
    } catch (error) {
        console.error('POST请求处理失败:', error)
        return NextResponse.json(
            { message: '服务器内部错误' },
            { status: 500 }
        )
    }
}

// DELETE请求 - 删除书籍
export async function DELETE(request: Request) {
    try {
        const supabase = await createClient()
        const body = await request.json().catch(() => null)
        
        if (!body) {
            return NextResponse.json(
                { message: '请求体不能为空' },
                { status: 400 }
            )
        }
        
        const validatedRequestData = DeleteBookRequestSchema.safeParse(body)
        
        if (!validatedRequestData.success) {
            return NextResponse.json(
                { message: '请求参数无效', errors: validatedRequestData.error.errors },
                { status: 400 }
            )
        }
        
        const { id } = validatedRequestData.data
        
        // 首先查找书籍是否存在
        const { data: existingBook, error: findError } = await supabase
            .from('books')
            .select('id, title')
            .eq('id', id)
            .single()
            
        if (findError) {
            // 如果是PGRST116错误，表示没有找到记录
            if (findError.code === 'PGRST116') {
                return NextResponse.json(
                    { message: '书籍不存在，无法删除' },
                    { status: 404 }
                )
            }
            
            console.error('查找书籍失败:', findError)
            return NextResponse.json(
                { message: '查找书籍失败', error: findError.message },
                { status: 500 }
            )
        }
        
        // 书籍存在，执行删除操作
        const { error: deleteError } = await supabase
            .from('books')
            .delete()
            .eq('id', id)
            
        if (deleteError) {
            console.error('删除书籍失败:', deleteError)
            return NextResponse.json(
                { message: '删除书籍失败', error: deleteError.message },
                { status: 500 }
            )
        }
        
        return NextResponse.json({ 
            message: `书籍 "${existingBook.title}" 删除成功` 
        })
        
    } catch (error) {
        console.error('DELETE请求处理失败:', error)
        return NextResponse.json(
            { message: '服务器内部错误' },
            { status: 500 }
        )
    }
}

// PUT请求 - 更新书籍
export async function PUT(request: Request) {
    try {
        const supabase = await createClient()
        const body = await request.json().catch(() => null)
        
        if (!body) {
            return NextResponse.json(
                { message: '请求体不能为空' },
                { status: 400 }
            )
        }
        
        const validatedRequestData = UpdateBookRequestSchema.safeParse(body)
        
        if (!validatedRequestData.success) {
            return NextResponse.json(
                { message: '请求参数无效', errors: validatedRequestData.error.errors }, 
                { status: 400 }
            )
        }
        
        const { id, ...updateData } = validatedRequestData.data
        
        // 首先查找书籍是否存在
        const { data: existingBook, error: findError } = await supabase
            .from('books')
            .select('*')
            .eq('id', id)
            .single()
            
        if (findError) {
            console.error('查找书籍失败:', findError)
            return NextResponse.json(
                { message: '查找书籍失败', error: findError.message },
                { status: 500 }
            )
        }
        
        return NextResponse.json({ 
            message: `书籍 "${existingBook.title}" 更新成功` 
        })
        
    } catch (error) {
        console.error('PUT请求处理失败:', error)
        return NextResponse.json(
            { message: '服务器内部错误' },
            { status: 500 }
        )
    }
}