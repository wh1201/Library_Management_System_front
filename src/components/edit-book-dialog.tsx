"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface EditBookForm {
    id: string
    title: string
    author: string
    isbn: string
    category: string
    quantity: number
    status: number
}

interface EditBookDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    bookForm: EditBookForm
    onFormChange: (field: string, value: string | number) => void
    onSubmit: () => void
    onCancel: () => void
    isSubmitting?: boolean
}

export function EditBookDialog({
    open,
    onOpenChange,
    bookForm,
    onFormChange,
    onSubmit,
    onCancel,
    isSubmitting = false
}: EditBookDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>编辑书籍</DialogTitle>
                    <DialogDescription>
                        修改书籍的详细信息，点击保存后将更新到图书馆系统中。
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit-title" className="text-right">
                            标题 *
                        </Label>
                        <Input
                            id="edit-title"
                            placeholder="请输入书籍标题"
                            value={bookForm.title}
                            onChange={(e) => onFormChange('title', e.target.value)}
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
                            value={bookForm.author}
                            onChange={(e) => onFormChange('author', e.target.value)}
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
                            value={bookForm.isbn}
                            onChange={(e) => onFormChange('isbn', e.target.value)}
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
                            value={bookForm.category}
                            onChange={(e) => onFormChange('category', e.target.value)}
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
                            value={bookForm.quantity}
                            onChange={(e) => onFormChange('quantity', parseInt(e.target.value) || 1)}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit-status" className="text-right">
                            状态
                        </Label>
                        <Select
                            value={bookForm.status.toString()}
                            onValueChange={(value) => onFormChange('status', parseInt(value))}
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
                        onClick={onCancel}
                    >
                        取消
                    </Button>
                    <Button
                        type="submit"
                        onClick={onSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? '保存中...' : '保存'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
} 