"use client"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface DeleteBookDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: () => void
    isDeleting?: boolean
}

export function DeleteBookDialog({
    open,
    onOpenChange,
    onConfirm,
    isDeleting = false
}: DeleteBookDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>删除确认</AlertDialogTitle>
                    <AlertDialogDescription>
                        确定要删除该书籍吗？此操作无法撤销。
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>取消</AlertDialogCancel>
                    <AlertDialogAction 
                        onClick={onConfirm}
                        disabled={isDeleting}
                    >
                        {isDeleting ? '删除中...' : '确定'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
} 