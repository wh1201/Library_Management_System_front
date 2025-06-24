import { UpdateBookRequest, UpdateBookResponse } from "@/types/book";

/**
 * React Query配置选项
 * @param {UpdateBookRequest} bookData - 包含书籍 ID 和更新数据的对象
 * @returns {Promise<UpdateBookResponse>} - 返回更新结果，包括数据和错误信息
 */
export const updateBookQueryOptions = {
    mutationKey: ['updateBook'],
    mutationFn: async (bookData: UpdateBookRequest): Promise<UpdateBookResponse> => {
        const response = await fetch('/api/book/update', {
            method: 'POST',
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