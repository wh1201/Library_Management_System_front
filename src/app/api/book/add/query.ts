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
          const msg = await res.text();
          console.error('API Error Status:', res.status);
          console.error('API Error Message:', msg);
          throw new Error(`API Error (${res.status}): ${msg}`);
        }
        return res.json() as Promise<AddBookResponse>;
      }
};