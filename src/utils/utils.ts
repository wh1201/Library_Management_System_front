// 从 clsx 库中导入 clsx 函数和 ClassValue 类型
import { clsx, type ClassValue } from "clsx";
// 从 tailwind-merge 库中导入 twMerge 函数
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}