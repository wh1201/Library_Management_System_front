"use client"
import { useState, useEffect } from "react"
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
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { useMutation, useQuery } from "@tanstack/react-query"
import { addBookQueryOptions } from "@/app/api/book/add/query"
import { getBookListQueryOptions } from "@/app/api/book/getList/query"
import { updateBookQueryOptions } from "@/app/api/book/update/query"
import { deleteBookQueryOptions } from "@/app/api/book/delete/query"
import { toast } from "sonner"
import { 
    GetBookListRequest, 
    BookItemSchema, 
    AddBookResponse, 
    UpdateBookResponse, 
    DeleteBookResponse 
} from "@/types/book"


type BookItem = typeof BookItemSchema._type

export default function BookListPage() {
    const [titleSearch, setTitleSearch] = useState("") // 标题搜索
    const [authorSearch, setAuthorSearch] = useState("") // 作者搜索
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false) // 添加书籍对话框
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false) // 编辑书籍对话框

    // 分页和搜索状态
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize] = useState(10)
    const [searchParams, setSearchParams] = useState<GetBookListRequest>({
        page: 1,
        pageSize: 10,
    })

    // 获取书籍列表
    const { data: bookListData, isLoading: isLoadingBooks, error: bookListError, refetch: refetchBooks } = useQuery({
        queryKey: ['bookList', searchParams],
        queryFn: () => getBookListQueryOptions.mutationFn(searchParams),
        retry: 2,
    })

    // 添加书籍表单状态
    const [bookForm, setBookForm] = useState({
        title: "",
        author: "",
        isbn: "",
        category: "",
        quantity: 1,
        status: 0
    })

    // 编辑书籍表单状态
    const [editBookForm, setEditBookForm] = useState({
        id: "",
        title: "",
        author: "",
        isbn: "",
        category: "",
        quantity: 1,
        status: 0
    })

    // 删除书籍表单状态
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [deleteBookId, setDeleteBookId] = useState<string>('')


    // 重置表单
    const resetForm = () => {
        return {
            title: "",
            author: "",
            isbn: "",
            category: "",
            quantity: 1,
            status: 0
        }
    }
    // 添加书籍
    const addBook = useMutation({
        ...addBookQueryOptions,
        onSuccess: (data: AddBookResponse) => {
            toast.success(data.message)
            setIsAddDialogOpen(false)
            setBookForm(resetForm())
            refetchBooks()
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })
    // 编辑书籍
    const updateBook = useMutation({
        ...updateBookQueryOptions,
        onSuccess: (data: UpdateBookResponse) => {
            console.log('编辑书籍成功', data)
            toast.success('书籍编辑成功！')
            // 关闭对话框并重置表单
            setIsEditDialogOpen(false)
            setEditBookForm({
                id: "",
                ...resetForm()
            })
            // 刷新书籍列表
            refetchBooks()
        },
        onError: (error) => {
            console.log('编辑书籍失败', error)
            toast.error(`编辑书籍失败: ${error.message}`)
        }
    })
    // 删除书籍
    const deleteBook = useMutation({
        ...deleteBookQueryOptions,
        onSuccess: (data: DeleteBookResponse) => {
            console.log('删除书籍成功', data)
            toast.success(data.message)
            setIsDeleteDialogOpen(false)
            refetchBooks()
        },
        onError: (error) => {
            console.log('删除书籍失败', error.message)
            toast.error(error.message)
        }
    })

    // 搜索功能
    const handleSearch = () => {
        const newSearchParams: GetBookListRequest = {
            page: 1,
            pageSize,
            ...(titleSearch && { title: titleSearch }),
            ...(authorSearch && { author: authorSearch }),
        }
        setSearchParams(newSearchParams)
        setCurrentPage(1)
    }

    // 重置搜索
    const handleResetSearch = () => {
        setTitleSearch("")
        setAuthorSearch("")
        const newSearchParams: GetBookListRequest = {
            page: 1,
            pageSize,
        }
        setSearchParams(newSearchParams)
        setCurrentPage(1)
    }

    // 分页处理
    const handlePageChange = (newPage: number) => {
        const newSearchParams = {
            ...searchParams,
            page: newPage,
        }
        setSearchParams(newSearchParams)
        setCurrentPage(newPage)
    }

    // 添加书籍
    const handleAddBook = () => {
        if (!bookForm.title || !bookForm.author || !bookForm.isbn || !bookForm.category) {
            toast.error('请填写完整的书籍信息')
            return
        }
        addBook.mutate(bookForm)
    }

    // 编辑书籍
    const handleEditBook = () => {
        if (!editBookForm.title || !editBookForm.author || !editBookForm.isbn || !editBookForm.category) {
            toast.error('请填写完整的书籍信息')
            return
        }
        updateBook.mutate(editBookForm)
    }

    // 打开编辑对话框
    const handleOpenEditDialog = (book: BookItem) => {
        setEditBookForm({
            id: book.id,
            title: book.title,
            author: book.author,
            isbn: book.isbn,
            category: book.category,
            quantity: book.quantity,
            status: book.status
        })
        setIsEditDialogOpen(true)
    }

    // 取消添加
    const handleCancelAdd = () => {
        setIsAddDialogOpen(false)
        setBookForm({
            title: "",
            author: "",
            isbn: "",
            category: "",
            quantity: 1,
            status: 0
        })
    }

    // 取消编辑
    const handleCancelEdit = () => {
        setIsEditDialogOpen(false)
        setEditBookForm({
            id: "",
            title: "",
            author: "",
            isbn: "",
            category: "",
            quantity: 1,
            status: 0
        })
    }

    // 添加表单输入框改变
    const handleInputChange = (field: string, value: string | number) => {
        setBookForm(prev => ({
            ...prev,
            [field]: value
        }))
    }

    // 编辑表单输入框改变
    const handleEditInputChange = (field: string, value: string | number) => {
        setEditBookForm(prev => ({
            ...prev,
            [field]: value
        }))
    }

    // 状态显示文本
    const getStatusText = (status: number) => {
        return status === 0 ? '可借阅' : '已借出'
    }

    // 格式化日期
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('zh-CN')
    }

    // 删除书籍
    const handleDeleteBook = (book: BookItem) => {
        setIsDeleteDialogOpen(true)
        setDeleteBookId(book.id)
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center gap-4">
                <div className="flex gap-4">
                    <Input
                        placeholder="按标题搜索..."
                        value={titleSearch}
                        onChange={(e) => setTitleSearch(e.target.value)}
                        className="w-64"
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <Input
                        placeholder="按作者搜索..."
                        value={authorSearch}
                        onChange={(e) => setAuthorSearch(e.target.value)}
                        className="w-64"
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <Button onClick={handleSearch}>搜索</Button>
                    <Button variant="outline" onClick={handleResetSearch}>重置</Button>
                </div>

                {/* 添加书籍对话框 */}
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>添加书籍</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>添加新书籍</DialogTitle>
                            <DialogDescription>
                                请填写书籍的详细信息，点击保存后将添加到图书馆系统中。
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4" >
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="title" className="text-right">
                                    标题 *
                                </Label>
                                <Input
                                    id="title"
                                    placeholder="请输入书籍标题"
                                    value={bookForm.title}
                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="author" className="text-right">
                                    作者 *
                                </Label>
                                <Input
                                    id="author"
                                    placeholder="请输入作者姓名"
                                    value={bookForm.author}
                                    onChange={(e) => handleInputChange('author', e.target.value)}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="isbn" className="text-right">
                                    ISBN *
                                </Label>
                                <Input
                                    id="isbn"
                                    placeholder="请输入ISBN编号"
                                    value={bookForm.isbn}
                                    onChange={(e) => handleInputChange('isbn', e.target.value)}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="category" className="text-right">
                                    分类 *
                                </Label>
                                <Input
                                    id="category"
                                    placeholder="请输入书籍分类"
                                    value={bookForm.category}
                                    onChange={(e) => handleInputChange('category', e.target.value)}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="quantity" className="text-right">
                                    数量 *
                                </Label>
                                <Input
                                    id="quantity"
                                    type="number"
                                    min="1"
                                    placeholder="请输入书籍数量"
                                    value={bookForm.quantity}
                                    onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 1)}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="status" className="text-right">
                                    状态
                                </Label>
                                <Select
                                    value={bookForm.status.toString()}
                                    onValueChange={(value) => handleInputChange('status', parseInt(value))}
                                >
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="请选择状态" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">可借阅</SelectItem>
                                        <SelectItem value="1">已借出</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCancelAdd}
                            >
                                取消
                            </Button>
                            <Button
                                type="submit"
                                onClick={handleAddBook}
                                disabled={addBook.isPending}
                            >
                                {addBook.isPending ? '添加中...' : '保存'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* 编辑书籍对话框 */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>编辑书籍</DialogTitle>
                        <DialogDescription>
                            修改书籍的详细信息，点击保存后将更新到图书馆系统中。
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4" >
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-title" className="text-right">
                                标题 *
                            </Label>
                            <Input
                                id="edit-title"
                                placeholder="请输入书籍标题"
                                value={editBookForm.title}
                                onChange={(e) => handleEditInputChange('title', e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-author" className="text-right">
                                作者 *
                            </Label>
                            <Input
                                id="edit-author"
                                placeholder="请输入作者姓名"
                                value={editBookForm.author}
                                onChange={(e) => handleEditInputChange('author', e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-isbn" className="text-right">
                                ISBN *
                            </Label>
                            <Input
                                id="edit-isbn"
                                placeholder="请输入ISBN编号"
                                value={editBookForm.isbn}
                                onChange={(e) => handleEditInputChange('isbn', e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-category" className="text-right">
                                分类 *
                            </Label>
                            <Input
                                id="edit-category"
                                placeholder="请输入书籍分类"
                                value={editBookForm.category}
                                onChange={(e) => handleEditInputChange('category', e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-quantity" className="text-right">
                                数量 *
                            </Label>
                            <Input
                                id="edit-quantity"
                                type="number"
                                min="1"
                                placeholder="请输入书籍数量"
                                value={editBookForm.quantity}
                                onChange={(e) => handleEditInputChange('quantity', parseInt(e.target.value) || 1)}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-status" className="text-right">
                                状态
                            </Label>
                            <Select
                                value={editBookForm.status.toString()}
                                onValueChange={(value) => handleEditInputChange('status', parseInt(value))}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="请选择状态" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="0">可借阅</SelectItem>
                                    <SelectItem value="1">已借出</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancelEdit}
                        >
                            取消
                        </Button>
                        <Button
                            type="submit"
                            onClick={handleEditBook}
                            disabled={updateBook.isPending}
                        >
                            {updateBook.isPending ? '保存中...' : '保存'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* 错误提示 */}
            {bookListError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    获取书籍列表失败: {bookListError.message}
                    <Button
                        variant="outline"
                        size="sm"
                        className="ml-2"
                        onClick={() => refetchBooks()}
                    >
                        重试
                    </Button>
                </div>
            )}
            {/* 删除书籍对话框 */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>删除确认</AlertDialogTitle>
                        <AlertDialogDescription>
                            确定要删除该书籍吗？
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>取消</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteBook.mutate({ id: deleteBookId })}>确定</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>


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
                    {isLoadingBooks ? (
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
                    ) : bookListData?.data && bookListData.data.length > 0 ? (
                        // 实际数据
                        bookListData.data.map((book) => (
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
                                            onClick={() => handleOpenEditDialog(book)}
                                        >
                                            编辑
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleDeleteBook(book)}
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

            {/* 分页组件 */}
            {bookListData?.pagination && bookListData.pagination.totalPages > 1 && (
                <div className="flex justify-between items-center mt-4">
                    <div className="text-sm text-gray-600">
                        共 {bookListData.pagination.total} 条记录，
                        第 {bookListData.pagination.page} / {bookListData.pagination.totalPages} 页
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage <= 1}
                        >
                            上一页
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage >= bookListData.pagination.totalPages}
                        >
                            下一页
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
