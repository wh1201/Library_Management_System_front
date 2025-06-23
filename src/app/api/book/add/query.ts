import { AddBookRequest, AddBookResponse } from "./type";

export const addBookQueryOptions = {
    mutationKey: ['addBook'],
    mutationFn: async (addBookRequest: AddBookRequest) => {
        const res = await fetch('/api/book/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(addBookRequest),
        });
        if (!res.ok) {
          const msg = await res.text();
          throw new Error(msg);
        }
        return res.json() as Promise<AddBookResponse>;
      }
};