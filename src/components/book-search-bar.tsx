"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface BookSearchBarProps {
    titleSearch: string
    authorSearch: string
    onTitleSearchChange: (value: string) => void
    onAuthorSearchChange: (value: string) => void
    onSearch: () => void
    onReset: () => void
}

export function BookSearchBar({
    titleSearch,
    authorSearch,
    onTitleSearchChange,
    onAuthorSearchChange,
    onSearch,
    onReset
}: BookSearchBarProps) {
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            onSearch()
        }
    }

    return (
        <div className="flex gap-4">
            <Input
                placeholder="按标题搜索..."
                value={titleSearch}
                onChange={(e) => onTitleSearchChange(e.target.value)}
                className="w-64"
                onKeyDown={handleKeyDown}
            />
            <Input
                placeholder="按作者搜索..."
                value={authorSearch}
                onChange={(e) => onAuthorSearchChange(e.target.value)}
                className="w-64"
                onKeyDown={handleKeyDown}
            />
            <Button onClick={onSearch}>搜索</Button>
            <Button variant="outline" onClick={onReset}>重置</Button>
        </div>
    )
} 