import { AddBookRequest, AddBookResponse } from "./type";

export const addBookQueryOptions = {
    mutationKey: ['addBook'],
    mutationFn: async (addBookRequest: AddBookRequest) => {
        const res = await fetch('/api/book/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...addBookRequest,
            status: Number(addBookRequest.status)
          }),
        });
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || errorData.message || `HTTP error! status: ${res.status}`);
        }
        return res.json() as Promise<AddBookResponse>;
      }
};