import { z } from "zod"

export const DeleteBookRequestSchema = z.object({
    id: z.string(),
})

export type DeleteBookRequest = z.infer<typeof DeleteBookRequestSchema>

export const DeleteBookResponseSchema = z.object({
    message: z.string(),
})

export type DeleteBookResponse = z.infer<typeof DeleteBookResponseSchema>