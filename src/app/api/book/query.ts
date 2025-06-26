import { AddBookRequest, AddBookResponse, DeleteBookRequest, DeleteBookResponse,GetBookListRequest, GetBookListResponse,UpdateBookRequest, UpdateBookResponse } from "./type";

// 获取书籍列表
export const listBooksQueryOptions = (params: GetBookListRequest) => ({
    queryKey: ['list-books', params],
    queryFn: async (): Promise<GetBookListResponse> => {
        // 构建查询参数
        const searchParams = new URLSearchParams()
        
        // 添加分页参数
        searchParams.append('page', params.page?.toString() || '1')
        searchParams.append('pageSize', params.pageSize?.toString() || '10')
        
        // 添加可选的筛选参数
        if (params.title) searchParams.append('title', params.title)
        if (params.author) searchParams.append('author', params.author)

        const response = await fetch(`/api/book?${searchParams.toString()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
        }

        return response.json()
    },
})

// 添加书籍
export const addBookQueryOptions = {
    mutationKey: ['add-book'],
    mutationFn: async (addBookRequest: AddBookRequest) => {
        const res = await fetch('/api/book', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...addBookRequest,
            status: Number(addBookRequest.status)
          }),
        });
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || errorData.message || `HTTP error! status: ${res.status}`);
        }
        return res.json() as Promise<AddBookResponse>;
      }
};

// 删除书籍
export const deleteBookQueryOptions = {
    mutationKey: ['delete-book'],
    mutationFn: async (deleteBookRequest: DeleteBookRequest): Promise<DeleteBookResponse> => {
        const response = await fetch('/api/book', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(deleteBookRequest),
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.message || errorData.error || `HTTP error! status: ${response.status}`)
        }

        return response.json()
    },
}

// 更新书籍
export const updateBookQueryOptions = {
    mutationKey: ['update-book'],
    mutationFn: async (bookData: UpdateBookRequest): Promise<UpdateBookResponse> => {
        const response = await fetch('/api/book', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookData),
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
        }

        return response.json()
    },
} 