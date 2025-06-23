import { DeleteBookRequest, DeleteBookResponse } from "./type"

/**
 * React Query配置选项
 */
export const deleteBookQueryOptions = {
    mutationKey: ['deleteBook'],
    mutationFn: async (deleteBookRequest: DeleteBookRequest): Promise<DeleteBookResponse> => {
        const response = await fetch('/api/book/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(deleteBookRequest),
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
        }

        return response.json()
    },
}