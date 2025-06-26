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
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { AddBookRequest } from "@/app/api/book/type"

interface AddBookDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    bookForm: AddBookRequest
    onFormChange: (field: string, value: string | number) => void
    onSubmit: () => void
    onCancel: () => void
    isSubmitting?: boolean
}

export function AddBookDialog({
    open,
    onOpenChange,
    bookForm,
    onFormChange,
    onSubmit,
    onCancel,
    isSubmitting = false
}: AddBookDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
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
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">
                            标题 *
                        </Label>
                        <Input
                            id="title"
                            placeholder="请输入书籍标题"
                            value={bookForm.title}
                            onChange={(e) => onFormChange('title', e.target.value)}
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
                            onChange={(e) => onFormChange('author', e.target.value)}
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
                            onChange={(e) => onFormChange('isbn', e.target.value)}
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
                            onChange={(e) => onFormChange('category', e.target.value)}
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
                            onChange={(e) => onFormChange('quantity', parseInt(e.target.value) || 1)}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="status" className="text-right">
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
                        {isSubmitting ? '添加中...' : '添加'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
} 