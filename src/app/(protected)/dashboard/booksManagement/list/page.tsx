"use client"
import { useState, useEffect } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { addBookQueryOptions,deleteBookQueryOptions,listBooksQueryOptions,updateBookQueryOptions } from "@/app/api/book/query"
import { toast } from "sonner"
import {
    GetBookListRequest,
    BookItemSchema,
    AddBookResponse,
    DeleteBookResponse,
    UpdateBookResponse,
} from "@/app/api/book/type"
import { BookTable } from "@/components/book-table"
import { AddBookDialog } from "@/components/add-book-dialog"
import { EditBookDialog } from "@/components/edit-book-dialog"
import { DeleteBookDialog } from "@/components/delete-book-dialog"
import { Pagination } from "@/components/pagination"
import { BookSearchBar } from "@/components/book-search-bar"

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
    const { data: bookListData, isLoading: isLoadingBooks, error: bookListError, refetch: refetchBooks } = useQuery(listBooksQueryOptions(searchParams))

    // 当搜索参数改变时重新获取数据
    useEffect(() => {
        refetchBooks()
    }, [searchParams, refetchBooks])

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
            toast.error(`编辑书籍失败: ${error.message}`)
        }
    })
    // 删除书籍
    const deleteBook = useMutation({
        ...deleteBookQueryOptions,
        onSuccess: (data: DeleteBookResponse) => {
            toast.success(data.message)
            setIsDeleteDialogOpen(false)
            refetchBooks()
        },
        onError: (error) => {
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
        setBookForm(resetForm())
    }


    // 取消编辑
    const handleCancelEdit = () => {
        setIsEditDialogOpen(false)
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



    // 删除书籍
    const handleDeleteBook = (book: BookItem) => {
        setIsDeleteDialogOpen(true)
        setDeleteBookId(book.id)
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-wrap justify-between items-center gap-4">
                <BookSearchBar
                    titleSearch={titleSearch}
                    authorSearch={authorSearch}
                    onTitleSearchChange={setTitleSearch}
                    onAuthorSearchChange={setAuthorSearch}
                    onSearch={handleSearch}
                    onReset={handleResetSearch}
                />

                <AddBookDialog
                    open={isAddDialogOpen}
                    onOpenChange={setIsAddDialogOpen}
                    bookForm={bookForm}
                    onFormChange={handleInputChange}
                    onSubmit={handleAddBook}
                    onCancel={handleCancelAdd}
                    isSubmitting={addBook.isPending}
                />
            </div>

            <EditBookDialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                bookForm={editBookForm}
                onFormChange={handleEditInputChange}
                onSubmit={handleEditBook}
                onCancel={handleCancelEdit}
                isSubmitting={updateBook.isPending}
            />
            <DeleteBookDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                onConfirm={() => {
                    deleteBook.mutate({ id: deleteBookId })
                }}
                isDeleting={deleteBook.isPending}
            />
            <BookTable
                books={bookListData?.data}
                isLoading={isLoadingBooks}
                onEdit={handleOpenEditDialog}
                onDelete={handleDeleteBook}
                titleSearch={titleSearch}
                authorSearch={authorSearch}
            />
            {bookListData?.pagination && (
                <Pagination
                    pagination={bookListData.pagination}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    )
}


function BookTables() {
    
}
