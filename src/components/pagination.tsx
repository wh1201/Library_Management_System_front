"use client"
import { Button } from "@/components/ui/button"

interface PaginationData {
    page: number
    pageSize: number
    total: number
    totalPages: number
}

interface PaginationProps {
    pagination: PaginationData
    currentPage: number
    onPageChange: (page: number) => void
}

export function Pagination({ pagination, currentPage, onPageChange }: PaginationProps) {
    if (pagination.totalPages <= 1) {
        return null
    }

    return (
        <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-600">
                共 {pagination.total} 条记录，
                第 {pagination.page} / {pagination.totalPages} 页
            </div>
            <div className="flex gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                >
                    上一页
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= pagination.totalPages}
                >
                    下一页
                </Button>
            </div>
        </div>
    )
} 