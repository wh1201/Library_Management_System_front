import { GetBookListRequest, GetBookListResponse } from "@/types/book";

/**
 * React Query配置选项
 */
export const getBookListQueryOptions = {
    mutationKey: ['getBookList'],
    mutationFn: async (params: GetBookListRequest): Promise<GetBookListResponse> => {
        const response = await fetch('/api/book/getList', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params),
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
        }

        return response.json()
    },
}