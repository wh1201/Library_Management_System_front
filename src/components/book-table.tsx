"use client"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { BookItemSchema } from "@/app/api/book/type"

type BookItem = typeof BookItemSchema._type

interface BookTableProps {
    books?: BookItem[]
    isLoading: boolean
    onEdit: (book: BookItem) => void
    onDelete: (book: BookItem) => void
    titleSearch?: string
    authorSearch?: string
}

export function BookTable({ 
    books, 
    isLoading, 
    onEdit, 
    onDelete, 
    titleSearch, 
    authorSearch 
}: BookTableProps) {
    // 状态显示文本
    const getStatusText = (status: number) => {
        return status === 0 ? '可借阅' : '已借出'
    }

    // 格式化日期
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('zh-CN')
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[20%]">标题</TableHead>
                    <TableHead className="w-[15%]">作者</TableHead>
                    <TableHead className="w-[15%]">ISBN 编号</TableHead>
                    <TableHead className="w-[12%]">分类</TableHead>
                    <TableHead className="w-[8%]">数量</TableHead>
                    <TableHead className="w-[8%]">状态</TableHead>
                    <TableHead className="w-[12%]">创建时间</TableHead>
                    <TableHead className="w-[10%]">操作</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {isLoading ? (
                    // 加载状态
                    Array.from({ length: 5 }).map((_, index) => (
                        <TableRow key={index}>
                            <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                        </TableRow>
                    ))
                ) : books && books.length > 0 ? (
                    // 实际数据
                    books.map((book) => (
                        <TableRow key={book.id}>
                            <TableCell className="font-medium">{book.title}</TableCell>
                            <TableCell>{book.author}</TableCell>
                            <TableCell>{book.isbn}</TableCell>
                            <TableCell>{book.category}</TableCell>
                            <TableCell>{book.quantity}</TableCell>
                            <TableCell>
                                <span className={`px-2 py-1 rounded-full text-xs ${book.status === 0
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {getStatusText(book.status)}
                                </span>
                            </TableCell>
                            <TableCell className="text-sm text-gray-600">
                                {formatDate(book.create_time)}
                            </TableCell>
                            <TableCell>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onEdit(book)}
                                    >
                                        编辑
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => onDelete(book)}
                                    >
                                        删除
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))
                ) : (
                    // 空状态
                    <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                            {titleSearch || authorSearch ? '没有找到匹配的书籍' : '暂无书籍数据'}
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    )
} 