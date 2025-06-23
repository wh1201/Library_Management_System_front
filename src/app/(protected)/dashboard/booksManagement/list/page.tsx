"use client"
import { useState } from "react"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useMutation } from "@tanstack/react-query"
import { addBookQueryOptions } from "@/app/api/book/add/query"
import { AddBookRequest, AddBookRequestSchema } from "@/app/api/book/add/type"

export default function BookListPage() {
    const [titleSearch, setTitleSearch] = useState("")
    const [authorSearch, setAuthorSearch] = useState("")
    const addBook = useMutation({
        ...addBookQueryOptions,
        onSuccess: (data) => {
           console.log('添加书籍成功', data)
        },
        onError: (error) => {
            console.log('添加书籍失败', error)
        }
    })

    const handleAddBook = (data: AddBookRequest) => {
        addBook.mutate(data)
    }

    return (
        <div className="flex flex-col gap-4">
            {/* 搜索和操作区域 */}
            <div className="flex justify-between items-center gap-4">
                <div className="flex gap-4">
                    <Input
                        placeholder="按标题搜索..."
                        value={titleSearch}
                        onChange={(e) => setTitleSearch(e.target.value)}
                        className="w-64"
                    />
                    <Input
                        placeholder="按作者搜索..."
                        value={authorSearch}
                        onChange={(e) => setAuthorSearch(e.target.value)}
                        className="w-64"
                    />
                </div>
                <Button onClick={() => {
                    
                    
                }}>
                    添加书籍
                </Button>
            </div>
            
            {/* 书籍列表表格 */}
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[25%]">标题</TableHead>
                        <TableHead className="w-[20%]">作者</TableHead>
                        <TableHead className="w-[15%]">ISBN 编号</TableHead>
                        <TableHead className="w-[15%]">分类</TableHead>
                        <TableHead className="w-[10%]">状态</TableHead>
                        <TableHead className="w-[10%]">操作</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell className="font-medium">INV001</TableCell>
                        <TableCell>Paid</TableCell>
                        <TableCell>Credit Card</TableCell>
                        <TableCell>$250.00</TableCell>
                        <TableCell>可借阅</TableCell>
                        <TableCell>
                            <div className="flex gap-2">
                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => {
                                        // 编辑逻辑
                                        console.log('编辑书籍')
                                    }}
                                >
                                    编辑
                                </Button>
                                <Button 
                                    variant="destructive" 
                                    size="sm"
                                    onClick={() => {
                                        // 删除逻辑
                                        console.log('删除书籍')
                                    }}
                                >
                                    删除
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    )
}
